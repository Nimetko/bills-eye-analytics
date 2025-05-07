
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/lib/supabase";
import { Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Bill {
  id?: string;
  title: string;
  policyArea: string;
  isAct: boolean;
}

export function BillStatusTable() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBills() {
      try {
        const { data, error } = await supabase
          .from('all_bills_uk')
          .select('title, policyArea, isAct')
          .limit(10);
        
        if (error) {
          console.error('Error fetching bills:', error);
          return;
        }
        
        setBills(data || []);
      } catch (error) {
        console.error('Error fetching bills:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchBills();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center p-8">Loading bills...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bills Status</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Policy Area</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bills.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">No bills found</TableCell>
              </TableRow>
            ) : (
              bills.map((bill, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{bill.title}</TableCell>
                  <TableCell>{bill.policyArea}</TableCell>
                  <TableCell className="text-center">
                    {bill.isAct ? (
                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Check size={16} className="mr-1" /> Approved
                      </div>
                    ) : (
                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <X size={16} className="mr-1" /> Rejected
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
