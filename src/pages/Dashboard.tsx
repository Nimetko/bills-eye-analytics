
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SummaryStats } from "@/components/dashboard/SummaryStats";
import { RejectionsByPolicyArea } from "@/components/dashboard/RejectionsByPolicyArea";
import { ReasoningPanel } from "@/components/dashboard/ReasoningPanel";
import { KnowledgeGraph } from "@/components/dashboard/KnowledgeGraph";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function Dashboard() {
  const queryClient = useQueryClient();
  
  const handleRefreshData = () => {
    queryClient.invalidateQueries({ queryKey: ['bills'] });
    queryClient.invalidateQueries({ queryKey: ['approvalTimes'] });
    queryClient.invalidateQueries({ queryKey: ['rejections'] });
    queryClient.invalidateQueries({ queryKey: ['knowledgeGraph'] });
  };
  
  return (
    <div className="space-y-6 pb-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-parliament-blue">Parliamentary Bills Analysis</h2>
          <p className="text-gray-500 mt-1">
            Analyze legislative bills to see which get stalled or rejected, and why.
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button variant="outline" size="sm" className="flex items-center" onClick={handleRefreshData}>
            <RefreshCw size={16} className="mr-2" />
            Refresh Data
          </Button>
          <Button variant="outline" size="sm" className="flex items-center">
            <Download size={16} className="mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      <SummaryStats />
      
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle>Rejections by Policy Area</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-6">
          <div className="h-[400px] w-full">
            <RejectionsByPolicyArea />
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Knowledge Graph</CardTitle>
          </CardHeader>
          <CardContent className="h-[700px]">
            <KnowledgeGraph />
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Reasoning Panel</CardTitle>
          </CardHeader>
          <CardContent className="h-[500px] overflow-auto flex flex-col">
            <ReasoningPanel />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
