"use client";

import { useEffect, useState } from "react";
import { Activity, Clock, Users, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchHealth, type HealthStatus } from "@/lib/api";

const recentActivity = [
  {
    id: 1,
    type: "incident",
    title: "Database latency spike",
    time: "2 min ago",
    status: "active",
  },
  {
    id: 2,
    type: "deploy",
    title: "api-gateway v2.3.1",
    time: "15 min ago",
    status: "success",
  },
  {
    id: 3,
    type: "incident",
    title: "Auth service 503",
    time: "1 hour ago",
    status: "resolved",
  },
  {
    id: 4,
    type: "deploy",
    title: "user-service v1.8.0",
    time: "2 hours ago",
    status: "success",
  },
  {
    id: 5,
    type: "incident",
    title: "CDN cache miss",
    time: "3 hours ago",
    status: "resolved",
  },
];

const supportTeam = [
  {
    id: 1,
    name: "Smita",
    role: "Owner",
    initials: "SM",
    status: "active",
  },
  {
    id: 2,
    name: "Yash",
    role: "Tech Lead",
    initials: "Ya",
    status: "active",
  },
  {
    id: 3,
    name: "Ronith",
    role: "Tech Lead",
    initials: "Ron",
    status: "available",
  },
  {
    id: 4,
    name: "Rishith",
    role: "Intern",
    initials: "Ri",
    status: "available",
  },
  {
    id: 5,
    name: "Roshni",
    role: "Intern",
    initials: "Ros",
    status: "available",
  },
];

export function RightPanel() {
  const [health, setHealth] = useState<HealthStatus | null>(null);

  useEffect(() => {
    const loadHealth = async () => {
      try {
        const data = await fetchHealth();
        setHealth(data);
      } catch (err) {
        console.error("Failed to load health status", err);
      }
    };
    
    // Initial load
    loadHealth();

    // Poll every 30 seconds to keep it "live"
    const interval = setInterval(loadHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <aside className="w-[280px] h-screen bg-card border-l border-border flex flex-col shrink-0 overflow-hidden">
      {/* System Status */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-foreground">System Status</h3>
          <span className={cn(
            "flex items-center gap-1.5 text-xs font-medium",
            health?.status === "healthy" ? "text-success" : "text-yellow-500"
          )}>
            <span className={cn(
              "w-2 h-2 rounded-full animate-pulse",
              health?.status === "healthy" ? "bg-success" : "bg-yellow-500"
            )} />
            {health?.status === "healthy" ? "Operational" : "Degraded"}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-muted/50">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Uptime</p>
            <p className="text-lg font-semibold text-foreground">
              {health?.uptime_percentage ? `${health.uptime_percentage}%` : "--"}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-muted/50">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">API Status</p>
            <p className="text-lg font-semibold text-foreground capitalize">
              {health?.status || "--"}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="p-5 border-b border-border">
        <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-muted-foreground" />
          Recent Activity
        </h3>
        <div className="space-y-3">
          {recentActivity.map((item) => (
            <button
              key={item.id}
              type="button"
              className="w-full flex items-start gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/60 transition-colors text-left group"
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                item.status === "active" 
                  ? "bg-destructive/10" 
                  : item.status === "success" 
                    ? "bg-success/10" 
                    : "bg-muted"
              )}>
                {item.type === "incident" ? (
                  item.status === "active" ? (
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-success" />
                  )
                ) : item.status === "success" ? (
                  <CheckCircle className="w-4 h-4 text-success" />
                ) : (
                  <XCircle className="w-4 h-4 text-destructive" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {item.title}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {item.time}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Support Team Removed as per request */}
    </aside>
  );
}
