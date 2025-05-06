
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";

export default function BillsExplorer() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-parliament-blue">Bills Explorer</h2>
        <p className="text-gray-500 mt-1">
          Search and explore UK Parliamentary bills and their details.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle>Search Bills</CardTitle>
            <Button variant="outline" size="sm" className="flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative mb-6">
            <Input
              placeholder="Search bills by title, content, sponsor..."
              className="pl-10 py-6"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge className="bg-parliament-blue">Healthcare</Badge>
            <Badge className="bg-parliament-purple">Environment</Badge>
            <Badge variant="outline">Education</Badge>
            <Badge variant="outline">Security</Badge>
            <Badge variant="outline">Transportation</Badge>
            <Badge variant="outline">Finance</Badge>
            <Badge variant="outline">Housing</Badge>
          </div>
          
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">
                        Environmental Protection and Sustainable Development Bill
                      </h3>
                      <div className="flex items-center gap-x-2 mt-1">
                        <Badge variant="outline">Environment</Badge>
                        <span className="text-sm text-gray-500">
                          Introduced: 12 Mar 2023
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">
                        A bill to establish legal frameworks for environmental protection and sustainable development policies in the United Kingdom...
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className={`${i % 3 === 0 ? 'bg-red-500' : i % 3 === 1 ? 'bg-amber-500' : 'bg-green-500'}`}>
                        {i % 3 === 0 ? 'Rejected' : i % 3 === 1 ? 'In Progress' : 'Approved'}
                      </Badge>
                      <p className="text-sm text-gray-500 mt-1">
                        {i % 3 === 0 ? '13 Sep 2023' : i % 3 === 1 ? 'Ongoing' : '28 Jul 2023'}
                      </p>
                      <Button variant="link" size="sm" className="mt-2">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center mt-6">
            <Button variant="outline" size="sm">
              Load More Bills
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
