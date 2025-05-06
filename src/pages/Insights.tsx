
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Insights() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-parliament-blue">Insights</h2>
        <p className="text-gray-500 mt-1">
          Actionable insights and recommendations based on bill analysis.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Best Practices Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center">
              <input type="checkbox" id="check1" className="mr-2" />
              <label htmlFor="check1" className="text-gray-700">Use clear, precise language avoiding ambiguity</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="check2" className="mr-2" />
              <label htmlFor="check2" className="text-gray-700">Include comprehensive impact assessment</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="check3" className="mr-2" />
              <label htmlFor="check3" className="text-gray-700">Consult with all relevant departments early</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="check4" className="mr-2" />
              <label htmlFor="check4" className="text-gray-700">Address potential legal challenges proactively</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="check5" className="mr-2" />
              <label htmlFor="check5" className="text-gray-700">Provide clear implementation timeline</label>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Time Reduction Opportunity</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <div className="h-full flex flex-col justify-center items-center">
              <div className="text-5xl font-bold text-parliament-purple mb-2">20%</div>
              <p className="text-gray-500 text-center">Estimated reduction in approval time by following best practices</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Common Rejection Factors</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ul className="list-disc pl-5 space-y-2">
              <li>Insufficient cross-department consultation (38%)</li>
              <li>Ambiguous implementation guidelines (27%)</li>
              <li>Inadequate impact assessment (21%)</li>
              <li>Budget implications not fully addressed (14%)</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
