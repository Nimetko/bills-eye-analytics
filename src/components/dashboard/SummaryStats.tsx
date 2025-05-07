
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, AlertTriangle, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function SummaryStats() {
  const [totalBills, setTotalBills] = useState<number | null>(null);
  const [approvedBills, setApprovedBills] = useState<number>(0);
  const [rejectedBills, setRejectedBills] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBillsData() {
      try {
        // Get total bill count
        const { count: totalCount, error: totalError } = await supabase
          .from('all_bills_uk')
          .select('*', { count: 'exact', head: true });
        
        if (totalError) {
          console.error('Error fetching bill count:', totalError);
          return;
        }
        
        // Get approved bills (isAct = true)
        const { count: approvedCount, error: approvedError } = await supabase
          .from('all_bills_uk')
          .select('*', { count: 'exact', head: true })
          .eq('isAct', true);
          
        if (approvedError) {
          console.error('Error fetching approved bills count:', approvedError);
          return;
        }
        
        // Get rejected bills (isAct = false)
        const { count: rejectedCount, error: rejectedError } = await supabase
          .from('all_bills_uk')
          .select('*', { count: 'exact', head: true })
          .eq('isAct', false);
          
        if (rejectedError) {
          console.error('Error fetching rejected bills count:', rejectedError);
          return;
        }
        
        setTotalBills(totalCount);
        setApprovedBills(approvedCount || 0);
        setRejectedBills(rejectedCount || 0);
      } catch (error) {
        console.error('Error fetching bill data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchBillsData();
  }, []);

  // Calculate percentages
  const approvalRate = totalBills && totalBills > 0 ? Math.round((approvedBills / totalBills) * 100) : 0;
  const rejectionRate = totalBills && totalBills > 0 ? Math.round((rejectedBills / totalBills) * 100) : 0;

  const stats = [
    {
      title: "Total Bills",
      value: loading ? "Loading..." : totalBills?.toString() || "0",
      change: "All parliamentary bills",
      icon: FileText,
      color: "text-blue-500",
    },
    {
      title: "Rejection Rate",
      value: loading ? "Loading..." : `${rejectionRate}%`,
      change: `${rejectedBills} bills rejected`,
      icon: AlertTriangle,
      color: "text-red-500",
    },
    {
      title: "Approval Rate",
      value: loading ? "Loading..." : `${approvalRate}%`,
      change: `${approvedBills} bills approved`,
      icon: CheckCircle,
      color: "text-green-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
              </div>
              <div className={`rounded-full p-2 ${stat.color} bg-opacity-10`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
