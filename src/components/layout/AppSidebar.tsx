
import { useSidebar } from "./SidebarContext";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Dashboard,
  FileText,
  ChartBar,
  Search,
  Settings,
  BookText,
  ChartLine,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppSidebar() {
  const { collapsed } = useSidebar();
  const location = useLocation();
  
  const menuItems = [
    {
      title: "Dashboard",
      icon: Dashboard,
      path: "/",
    },
    {
      title: "Bills Explorer",
      icon: FileText,
      path: "/bills",
    },
    {
      title: "Analytics",
      icon: ChartBar,
      path: "/analytics",
    },
    {
      title: "Insights",
      icon: ChartLine,
      path: "/insights",
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/settings",
    },
  ];

  return (
    <div
      className={cn(
        "h-screen bg-sidebar border-r border-border flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center p-4 border-b border-border">
        <BookText size={28} className="text-parliament-purple" />
        {!collapsed && (
          <div className="ml-2 font-semibold text-lg text-parliament-purple">
            UK Bills Analyzer
          </div>
        )}
      </div>

      <div className="flex-grow py-4 overflow-y-auto">
        <nav className="px-2 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center px-3 py-2 rounded-md transition-colors",
                location.pathname === item.path
                  ? "bg-parliament-purple bg-opacity-15 text-parliament-purple"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <item.icon
                size={20}
                className={cn(
                  location.pathname === item.path
                    ? "text-parliament-purple"
                    : "text-gray-500"
                )}
              />
              {!collapsed && <span className="ml-3">{item.title}</span>}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          className="w-full flex items-center justify-center"
        >
          <Search size={16} />
          {!collapsed && <span className="ml-2">Search Bills</span>}
        </Button>
      </div>
    </div>
  );
}
