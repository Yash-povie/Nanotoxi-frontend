"use client";

import { useState, useEffect } from "react";
import { 
  Building2, 
  Database, 
  FlaskConical, 
  Activity,
  User,
  Mail,
  HardDrive,
  Search,
  PieChart as PieChartIcon,
  ShieldAlert,
  Contact,
  Users,
  Briefcase
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { fetchDatasetRequests, type DatasetRequest } from "@/lib/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

const COLORS = ["#0ea5e9", "#22c55e", "#eab308", "#f43f5e", "#8b5cf6"];

interface SupportMember {
  id: string;
  name: string;
  role: string;
  status: "available" | "busy" | "offline";
  specialty: string;
  contact: string;
}

const SUPPORT_TEAM: SupportMember[] = [
  { id: "1", name: "Dr. Sarah Chen", role: "Lead Toxicologist", status: "available", specialty: "Nano-bio Interaction", contact: "sarah.c@nanotoxi.ai" },
  { id: "2", name: "James Wilson", role: "Technical Support", status: "busy", specialty: "API Integration", contact: "james.w@nanotoxi.ai" },
  { id: "3", name: "Dr. Emily Zhang", role: "Data Specialist", status: "available", specialty: "Dataset Queries", contact: "emily.z@nanotoxi.ai" },
  { id: "4", name: "Michael Chang", role: "Compliance Officer", status: "offline", specialty: "Regulatory Safety", contact: "michael.c@nanotoxi.ai" },
];

export function OncallContent() {
  const [requests, setRequests] = useState<DatasetRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] = useState<SupportMember>(SUPPORT_TEAM[0]);

  // Use existing dataset requests for "Incoming Research Inquiries"
  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchDatasetRequests();
        setRequests(data);
      } catch (error) {
        console.error("Failed to load dataset requests:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="w-full h-full flex flex-col space-y-6 p-2">
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-2xl font-bold tracking-tight">Support Team</h2>
           <p className="text-muted-foreground">Expert assistance for researchers and API users</p>
        </div>
        <div className="flex items-center gap-2">
           <Badge variant="secondary" className="h-8 gap-1.5 px-3 bg-muted">
             <div className="w-2 h-2 rounded-full bg-green-500" />
             <span className="text-xs font-medium">Support Online</span>
           </Badge>
        </div>
      </div>

      {/* Team Status Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        {SUPPORT_TEAM.map((member) => (
          <Card key={member.id} className={`cursor-pointer transition-all hover:shadow-md ${selectedMember?.id === member.id ? 'border-primary ring-1 ring-primary' : ''}`} onClick={() => setSelectedMember(member)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{member.role}</CardTitle>
              <div className={`w-2 h-2 rounded-full ${
                  member.status === 'available' ? 'bg-green-500' : 
                  member.status === 'busy' ? 'bg-orange-500' : 'bg-slate-300'
              }`} />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold truncate">{member.name}</div>
              <p className="text-xs text-muted-foreground truncate">{member.specialty}</p>
              <div className="mt-2 text-[10px] text-muted-foreground bg-muted/50 p-1 rounded inline-block">
                {member.contact}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Operational Dashboard */}
      <div className="grid gap-4 md:grid-cols-7 h-[500px]">
        
        {/* Left: Selected Member Detail & Tasks */}
        <Card className="md:col-span-3 flex flex-col shadow-sm">
           <CardHeader>
             <CardTitle className="flex items-center gap-2">
               <Briefcase className="w-5 h-5 text-primary" />
               Specialist Profile
             </CardTitle>
             <CardDescription>Contact info and current availability</CardDescription>
           </CardHeader>
           <CardContent className="flex-1 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-2xl font-bold text-secondary-foreground">
                  {selectedMember.name.charAt(0)}
                </div>
                <div>
                   <h3 className="text-xl font-bold">{selectedMember.name}</h3>
                   <Badge variant={selectedMember.status === 'available' ? "default" : "secondary"}>
                     {selectedMember.status.toUpperCase()}
                   </Badge>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground uppercase">Specialty</p>
                      <p className="font-medium">{selectedMember.specialty}</p>
                   </div>
                   <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground uppercase">Support ID</p>
                      <p className="font-medium font-mono">SUP-{selectedMember.id}09</p>
                   </div>
                </div>

                <div className="space-y-2">
                   <h4 className="text-sm font-semibold flex items-center gap-2">
                      <Activity className="w-4 h-4" /> Description
                   </h4>
                   <div className="p-3 border rounded-lg text-sm bg-background">
                      Available for consultation regarding {selectedMember.specialty.toLowerCase()} and general platform inquiries. Please schedule a ticket for complex analysis requests.
                   </div>
                </div>
              </div>
           </CardContent>
        </Card>

        {/* Right: Incoming Research Inquiries (Modified form of old dataset requests) */}
        <Card className="md:col-span-4 flex flex-col shadow-sm overflow-hidden">
           <CardHeader className="pb-3">
             <div className="flex items-center justify-between">
               <div>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-primary" />
                    Support Tickets & Inquiries
                  </CardTitle>
                  <CardDescription>Incoming dataset requests & collaboration signals</CardDescription>
               </div>
               <Badge variant="secondary">{requests.length} Pending</Badge>
             </div>
           </CardHeader>
           <CardContent className="flex-1 overflow-y-auto p-0">
             <div className="divide-y">
                {requests.slice(0, 10).map((req, i) => (
                   <div key={i} className="p-4 hover:bg-muted/30 transition-colors flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">
                         <FlaskConical className="w-4 h-4" />
                      </div>
                      <div className="flex-1 space-y-1">
                         <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{req.organization}</p>
                            <span className="text-xs text-muted-foreground">{new Date(req.timestamp).toLocaleDateString()}</span>
                         </div>
                         <p className="text-xs text-muted-foreground line-clamp-1">{req.research_area}</p>
                         <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-[10px] h-5">{req.dataset_size}</Badge>
                            <span className="text-[10px] text-muted-foreground">Req by: {req.name}</span>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
           </CardContent>
        </Card>

      </div>
    </div>
  );
}
