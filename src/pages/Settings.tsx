
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-parliament-blue">Settings</h2>
        <p className="text-gray-500 mt-1">
          Configure your dashboard preferences and data sources.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input id="name" defaultValue="Policy Analyst" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Notifications</Label>
                <Input id="email" defaultValue="analyst@example.gov.uk" />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications">Enable Notifications</Label>
                <Switch id="notifications" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="analytics">Share Analytics</Label>
                <Switch id="analytics" />
              </div>
              
              <Button>Save Preferences</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Data Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="api-key">Parliament Data API Key</Label>
                <Input id="api-key" type="password" defaultValue="••••••••••••••••" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="refresh-rate">Data Refresh Rate</Label>
                <Select defaultValue="daily">
                  <SelectTrigger id="refresh-rate">
                    <SelectValue placeholder="Select refresh rate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="data-range">Default Data Range</Label>
                <Select defaultValue="12months">
                  <SelectTrigger id="data-range">
                    <SelectValue placeholder="Select data range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3months">Last 3 Months</SelectItem>
                    <SelectItem value="6months">Last 6 Months</SelectItem>
                    <SelectItem value="12months">Last 12 Months</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button>Update Data Settings</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
