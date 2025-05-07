
import { useState, useEffect } from "react";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { supabase } from "@/lib/supabase";
import { Check, X, Clock } from "lucide-react";

interface Bill {
  id: string;
  title: string;
  isAct: boolean;
  isDefeated: boolean;
  policyArea: string;
}

export function BillStatusTable() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchBills() {
      try {
        const { data, error } = await supabase
          .from('all_bills_uk')
          .select('id, title, isAct, isDefeated, policyArea')
          .limit(10); // Limit to 10 bills for better performance
        
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

  const getBillStatus = (bill: Bill) => {
    if (bill.isAct) return { label: "Approved", icon: Check, color: "text-green-500" };
    if (bill.isDefeated) return { label: "Rejected", icon: X, color: "text-red-500" };
    return { label: "In Process", icon: Clock, color: "text-amber-500" };
  };
  
  if (loading) {
    return <div className="text-center py-6">Loading bills...</div>;
  }
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Bill Title</TableHead>
            <TableHead>Policy Area</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bills.length > 0 ? (
            bills.map((bill) => {
              const status = getBillStatus(bill);
              return (
                <TableRow key={bill.id}>
                  <TableCell className="font-medium">{bill.title || "Untitled Bill"}</TableCell>
                  <TableCell>{bill.policyArea}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <status.icon className={`${status.color} h-4 w-4 mr-2`} />
                      <span>{status.label}</span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center">No bills found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
