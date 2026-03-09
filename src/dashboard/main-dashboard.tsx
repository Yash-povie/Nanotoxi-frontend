"use client";

import { useState } from "react";
import { AppSidebar } from "./app-sidebar";   // Added curly braces
import { MainContent } from "./main-content";   // Added curly braces
import { RightPanel } from "./right-panel";     // Added curly braces
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/lib/auth"; // Import useAuth
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// This type is exported so app-sidebar and main-content can stay in sync
export type Section = 
  | "overview" 
  | "incidents" 
  | "performance" 
  | "deployments" 
  | "errors" 
  | "services" 
  | "oncall" 
  | "sla" 
  | "postmortems" 
  | "settings";

export default function MainDashboard() {
  const [activeSection, setActiveSection] = useState<Section>("overview");
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // If loading, show nothing or spinner
  if (isLoading) return null;

  // If not loading and not authenticated, return null (we are redirecting)
  if (!isAuthenticated) return null;

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        {/* The navigation sidebar on the left */}
        <AppSidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
        
        {/* The central area where your charts and tables live */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <MainContent activeSection={activeSection} />
        </div>
        
        {/* The metrics/alerts panel on the right */}
        <RightPanel />
      </div>
    </SidebarProvider>
  );
}