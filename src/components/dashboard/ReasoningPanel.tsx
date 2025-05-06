
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

export function ReasoningPanel() {
  const [query, setQuery] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Query submitted:", query);
    // Would handle actual query here in a real app
  };
  
  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">
        Ask questions about parliamentary bills using AI reasoning capabilities
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="relative mb-4">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., Which environmental bills had the highest rejection rate?"
            className="pr-10"
          />
          <Button 
            type="submit" 
            size="sm" 
            className="absolute right-1 top-1/2 transform -translate-y-1/2"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </form>
      
      <Tabs defaultValue="query">
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
              <li>• Which policy areas have the highest bill rejection rates over the last year?</li>
              <li>• Do bills with multi-department reviews take significantly longer to approve?</li>
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
      </Tabs>
    </div>
  );
}
