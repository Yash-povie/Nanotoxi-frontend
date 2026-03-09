"use client";

import { useState } from "react";
import { ModeToggle } from "@/components/mode-toggle"
import type { Section } from "./main-dashboard";
import { OverviewContent } from "./contents/overview-content";
import { IncidentsContent } from "./contents/incidents-content";
import { ToxicityContent } from "./contents/toxicity-content";
import { PerformanceContent } from "./contents/performance-content";
import { ErrorsContent } from "./contents/errors-content";
import { SlaContent } from "./contents/sla-content";
import { OncallContent } from "./contents/oncall-content";
import { ContactTeamContent } from "./contents/contact-team-content";
import { ServicesContent } from "./contents/services-content";
import { PostmortemsContent } from "./contents/postmortems-content";
import { SettingsContent } from "./contents/settings-content";
import { Bell, Calendar, RefreshCw, AlertCircle, Cpu, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MainContentProps {
  activeSection: Section;
}

const sectionConfig: Record<Section, { title: string; subtitle: string }> = {
  overview: { title: "System Overview", subtitle: "Real-time Engineering Metrics" },
  incidents: { title: "Data & Requests", subtitle: "Nanoparticle Types & Contact Requests" },
  toxicity: { title: "Toxicity Analysis", subtitle: "Toxicity Distribution & History" },
  performance: { title: "Prediction History", subtitle: "Recent Inferences & Model Confidence" },
  errors: { title: "Error Tracking", subtitle: "Exceptions & Error Rates" },
  sla: { title: "SLA & Uptime", subtitle: "Service Level Monitoring" },
  oncall: { title: "Dataset Acquisition", subtitle: "Dataset requests and distribution metrics" },
  contact: { title: "Contact Team", subtitle: "Team Availability Status" },
  services: { title: "Forms Console", subtitle: "Test API Form Submissions" },
  postmortems: { title: "Postmortems", subtitle: "Incident Reports & Learnings" },
  settings: { title: "Settings", subtitle: "Configuration & Integrations" },
};

export function MainContent({ activeSection }: MainContentProps) {
  const config = sectionConfig[activeSection];
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "overview": return <OverviewContent />;
      case "incidents": return <IncidentsContent />;
      case "toxicity": return <ToxicityContent />;
      case "performance": return <PerformanceContent />;
      case "errors": return <ErrorsContent />;
      case "sla": return <SlaContent />;
      case "oncall": return <OncallContent />;
      case "contact": return <ContactTeamContent />;
      case "services": return <ServicesContent />;
      case "postmortems": return <PostmortemsContent />;
      case "settings": return <SettingsContent />;
      default: return <OverviewContent />;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      {/* Header */}
      <header className="h-16 px-8 flex items-center justify-between border-b border-border bg-card shrink-0">
        <div>
          <h1 className="text-lg font-semibold text-foreground tracking-tight">
            {config.title}
          </h1>
          <p className="text-sm text-muted-foreground">{config.subtitle}</p>
        </div>

        {/* New Top Metadata - Model Version Info */}
        <div className="hidden xl:flex items-center gap-6 ml-auto mr-8 pr-8 border-r border-border/50">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-primary/10 rounded-lg text-primary">
                 <Cpu className="w-4 h-4" />
               </div>
               <div className="flex flex-col">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Model Version</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">v2.4.0</span>
                    <Badge variant="secondary" className="text-[10px] h-4 px-1 py-0 bg-emerald-500/10 text-emerald-600 border-emerald-200">Stable</Badge>
                  </div>
               </div>
            </div>
            
            <div className="flex items-center gap-3">
               <div className="p-2 bg-muted rounded-lg text-muted-foreground">
                 <Clock className="w-4 h-4" />
               </div>
               <div className="flex flex-col">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Last Retrained</span>
                  <span className="text-sm font-bold text-foreground">2h 15m ago</span>
               </div>
            </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Time Range */}
          <Button variant="outline" size="sm" className="gap-2 bg-transparent hidden md:flex">
            <Calendar className="w-4 h-4" />
            <span>Last 24 hours</span>
          </Button>

          {/* Refresh */}
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 bg-transparent hidden md:flex"
            onClick={handleRefresh}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </Button>

          {/* Alerts */}
          <button
            type="button"
            className="relative p-2 rounded-xl hover:bg-muted transition-colors"
            aria-label="Alerts"
          >
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full animate-pulse" />
          </button>

          {/* Primary Action */}
          <Button size="sm" className="gap-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground">
            <AlertCircle className="w-4 h-4" />
            <span>Report Incident</span>
          </Button>
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto p-8">
        <div key={`${activeSection}-${refreshKey}`} className="animate-fade-in">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}