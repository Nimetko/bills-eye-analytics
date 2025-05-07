import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
export function ReasoningPanel() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    answer: string;
    policy_area: string;
    question: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const {
    toast
  } = useToast();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);

    // Create an AbortController to handle timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minute timeout

    try {
      // Encode the query for URL
      const encodedQuery = encodeURIComponent(query);
      const response = await fetch(`http://127.0.0.1:5050/analyze?query=${encodedQuery}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!response.ok) {
        throw new Error(`Failed to analyze query: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setAnalysisResult(data);
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('Error analyzing query:', error);

      // Handle different types of errors
      if (error instanceof DOMException && error.name === 'AbortError') {
        setError("Analysis timed out after 5 minutes. Please try a simpler query.");
        toast({
          title: "Analysis Timed Out",
          description: "The analysis took too long to complete. Please try a simpler query.",
          variant: "destructive"
        });
      } else {
        setError("Failed to analyze query. Please ensure the analysis service is running.");
        toast({
          title: "Analysis Failed",
          description: "Failed to analyze your query. Please check if the analysis service is running.",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to format paragraphs in the answer
  const formatAnswer = (text: string) => {
    return text.split('\n\n').map((paragraph, index) => <p key={index} className={index > 0 ? "mt-3" : ""}>
        {paragraph}
      </p>);
  };
  return <div>
      <p className="text-sm text-gray-500 mb-4">
        Ask questions about parliamentary bills using AI reasoning capabilities
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="relative mb-4">
          <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="e.g., Which environmental bills had the highest rejection rate?" className="pr-10" disabled={loading} />
          <Button type="submit" size="sm" className="absolute right-1 top-1/2 transform -translate-y-1/2" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>
      </form>
      
      {error && <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>}
      
      {analysisResult ? <div className="bg-white border rounded-md p-4 mt-4 max-h-[350px] overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-parliament-blue">
              {analysisResult.question}
            </h3>
            {analysisResult.policy_area && <Badge variant="outline" className="bg-parliament-purple/10 text-parliament-purple border-parliament-purple">
                {analysisResult.policy_area}
              </Badge>}
          </div>
          <div className="text-sm text-gray-700 space-y-1">
            {formatAnswer(analysisResult.answer)}
          </div>
        </div> : <Tabs defaultValue="query">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="query">Query</TabsTrigger>
            <TabsTrigger value="schema">Schema Info</TabsTrigger>
          </TabsList>
          
          <TabsContent value="query" className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className="cursor-pointer bg-parliament-purple">Bills by Policy Area</Badge>
              <Badge className="cursor-pointer" variant="outline">Rejection Causes</Badge>
              <Badge className="cursor-pointer" variant="outline">Processing Time</Badge>
            </div>
            
            <div className="bg-gray-50 rounded-md p-4 text-sm">
              <p className="font-medium mb-2">Sample Queries:</p>
              <ul className="space-y-2 text-gray-600">
                <li>• Why are health bills failing so often?</li>
                <li>• How many bills in the Economy policy area have been rejected?</li>
                <li>• What common language patterns appear in bills that get rejected?</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="schema" className="space-y-4">
            <div className="bg-gray-50 rounded-md p-4 text-sm">
              <p className="font-medium mb-2">Available Data Fields:</p>
              <ul className="space-y-1 text-gray-600">
                <li>• Bill ID, Title, Description</li>
                <li>• Introduction Date, Status, Decision Date</li>
                <li>• Sponsor, Policy Areas, Departments</li>
                <li>• Review Time, Decision, Rejection Reasons</li>
                <li>• Full Text, Key Phrases, Related Bills</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>}
    </div>;
}