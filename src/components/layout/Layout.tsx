
import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { useSidebar } from "./SidebarContext";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Bell, User } from "lucide-react";

export default function Layout() {
  const { collapsed, toggleCollapsed } = useSidebar();
  
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleCollapsed}
              className="mr-4"
            >
              {collapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </Button>
            <h1 className="text-xl font-semibold">UK Parliament Bills Analysis</h1>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-3 pr-8 py-1 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-parliament-purple focus:border-parliament-purple"
              />
              <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
