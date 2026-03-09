"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { Activity, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LoginLog {
  name: string;
  role: string;
  timestamp: number;
  device: string;
}

function timeAgo(date: number) {
  const seconds = Math.floor((Date.now() - date) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " mins ago";
  return "Just now";
}

export function ContactTeamContent() {
  const { user } = useAuth();
  const [history, setHistory] = useState<LoginLog[]>([]);

  useEffect(() => {
    // Load history from localStorage
    try {
       const storedHistory = localStorage.getItem("login_history");
       if (storedHistory) {
         setHistory(JSON.parse(storedHistory));
       } else {
         // Fallback/Initial Mock Data if empty
         const mockData = [
            { name: "Rishith", role: "Intern", timestamp: Date.now() - 120000, device: "Chrome / Windows" },
            { name: "Yash", role: "Tech Lead", timestamp: Date.now() - 900000, device: "Chrome / Mac" },
            { name: "Ronith", role: "Support Agent", timestamp: Date.now() - 3600000, device: "Chrome / Linux" },
            { name: "Smita", role: "Support Lead", timestamp: Date.now() - 10800000, device: "Safari / Mac" },
         ];
         setHistory(mockData);
         localStorage.setItem("login_history", JSON.stringify(mockData));
       }
    } catch (e) {
      console.error("Failed to load login history", e);
    }
  }, []);
  
  // The first item in history is usually the current session if we just logged in.
  // We want the *previous* session for the "Last Active" card.
  // If the top history item matches the current user, skip it to find the last *different* person or simply the previous session.
  
  // Actually, usually "Last Active Team Member" implies someone else. 
  // But if I am effectively the only one, it could be my previous session.
  // Let's assume history[0] is the current active session (me).
  // So history[1] is the last active team member (before me).
  
  const lastOnlineUser = history.length > 1 ? history[1] : (history[0] || { name: "None", role: "N/A", timestamp: Date.now() });
  
  // For the log list, we can show everyone from history[1] onwards as "Offline", 
  // and manually show history[0] (current user) as "Online" to be precise, 
  // OR just iterate the whole list and mark top as Online.
  // Let's match the old design: Current user card + List.

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Contact Team</h2>
          <p className="text-muted-foreground">Real-time team availability and status logs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Current User (Online) */}
        <Card className="border-l-4 border-l-green-500 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
             <Badge className="bg-green-500/10 text-green-600 border-green-200 hover:bg-green-500/20 gap-1.5 pl-1.5">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
               ONLINE
             </Badge>
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-muted-foreground font-medium">Current Session</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-5 mt-2">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary border-4 border-background shadow-sm">
                {user?.name?.charAt(0) || "U"}
              </div>
              <div>
                <h3 className="text-3xl font-bold text-foreground">{user?.name || "Guest User"}</h3>
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-green-500" />
                  Active now
                </p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t flex items-center justify-between text-sm">
               <span className="text-muted-foreground">Session ID: <span className="font-mono text-foreground">SES-{Math.floor(Math.random() * 10000)}</span></span>
               <span className="text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded">Logged In</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Last User (Offline/Away) */}
        <Card className="border-l-4 border-l-slate-400 shadow-sm relative overflow-hidden bg-slate-50/50 dark:bg-slate-900/10">
           <div className="absolute top-0 right-0 p-4">
             <Badge variant="outline" className="text-muted-foreground gap-1.5 pl-1.5">
               <span className="w-2 h-2 rounded-full bg-slate-400" />
               OFFLINE
             </Badge>
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-muted-foreground font-medium">Last Active Team Member</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-5 mt-2">
              <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-3xl font-bold text-muted-foreground border-4 border-background shadow-sm grayscale opacity-70">
                {lastOnlineUser.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-3xl font-bold text-muted-foreground/80">{lastOnlineUser.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Last seen {timeAgo(lastOnlineUser.timestamp)}
                </p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t flex items-center justify-between text-sm">
               <span className="text-muted-foreground">Role: <span className="font-medium text-foreground">{lastOnlineUser.role}</span></span>
               <span className="text-muted-foreground font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">Signed Out</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Full Log Table */}
       <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Recent Login Activity</CardTitle>
          <CardDescription>Authentication log for team members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
             {/* Show current user first as Online, then history (excluding the current top history item if it's the same session) */}
             <div className="flex items-center justify-between py-2 border-b last:border-0 hover:bg-muted/30 px-2 rounded transition-colors">
                 <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="font-medium text-sm">{user?.name || "Guest"}</span>
                 </div>
                 <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <span>Chrome / Windows</span>
                    <span className="w-24 text-right">Now</span>
                 </div>
             </div>
             
             {/* Render History from index 1 (previous sessions) */}
             {history.slice(1).map((log, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b last:border-0 hover:bg-muted/30 px-2 rounded transition-colors">
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-slate-300" />
                      <span className="font-medium text-sm">{log.name}</span>
                   </div>
                   <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <span>{log.device || "Unknown Device"}</span>
                      <span className="w-24 text-right">{timeAgo(log.timestamp)}</span>
                   </div>
                </div>
             ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
