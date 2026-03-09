"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Activity,
  Zap,
  Users,
  Database,
  FlaskConical,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  fetchHealth,
  fetchStats,
  fetchPredictionsOverTime,
  fetchRequestStats,
  fetchContactRequests,
  fetchDatasetRequests,
  fetchNanoparticleTypes,
  type HealthStatus,
  type Stats,
  type PredictionDataPoint,
  type RequestStats,
  type ContactRequest,
  type DatasetRequest,
  type NanoparticleType,
} from "@/lib/api";

const cardShadow = "rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px, rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px, rgba(42, 51, 70, 0.04) 0px 6px 6px -3px, rgba(14, 63, 126, 0.04) 0px 12px 12px -6px, rgba(14, 63, 126, 0.04) 0px 24px 24px -12px";

export function OverviewContent() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [predictions, setPredictions] = useState<PredictionDataPoint[]>([]);
  const [requestStats, setRequestStats] = useState<RequestStats | null>(null);
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);
  const [datasetRequests, setDatasetRequests] = useState<DatasetRequest[]>([]);
  const [nanoparticleTypes, setNanoparticleTypes] = useState<NanoparticleType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [
          statsData,
          healthData,
          predictionsData,
          reqStatsData,
          contactData,
          datasetData,
          nanoData,
        ] = await Promise.all([
          fetchStats(),
          fetchHealth(),
          fetchPredictionsOverTime(),
          fetchRequestStats(),
          fetchContactRequests(),
          fetchDatasetRequests(),
          fetchNanoparticleTypes(),
        ]);

        setStats(statsData);
        setHealth(healthData);
        setPredictions(predictionsData);
        setRequestStats(reqStatsData);
        setContactRequests(contactData);
        setDatasetRequests(datasetData);
        setNanoparticleTypes(nanoData);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Calculate generic metrics for display
  const metrics = [
    {
      label: "Active Incidents",
      value: "3", // Hardcoded for aesthetic match
      change: "+2",
      trend: "up", // Bad thing for incidents
      icon: AlertTriangle,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      wrapperClass: "border-l-4 border-l-red-500",
    },
    {
      label: "Deployments Today",
      value: "8", // Hardcoded for aesthetic match
      change: "+3",
      trend: "up", // Good thing
      icon: Zap,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      wrapperClass: "border-l-4 border-l-blue-500",
    },
    {
      label: "Error Rate",
      value: "0.42%", // Hardcoded for aesthetic match
      change: "-0.12%",
      trend: "down", // Good thing
      icon: Activity,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      wrapperClass: "border-l-4 border-l-emerald-500",
    },
    {
      label: "Uptime (30d)",
      value: "99.98%",
      change: "+0.01%",
      trend: "up",
      icon: CheckCircle,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      wrapperClass: "border-l-4 border-l-emerald-500",
    },
  ];

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">System Overview</h2>
          <p className="text-sm text-muted-foreground mt-1">Real-time Engineering Metrics</p>
        </div>
        <div className="flex gap-2">
           <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 gap-2">
             <Clock className="w-4 h-4" />
             Last 24 hours
           </button>
           <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-9 px-4 py-2 gap-2 shadow-sm">
             <AlertTriangle className="w-4 h-4" />
             Report Incident
           </button>
        </div>
      </div>

      {/* KPI Cards - Aesthetic update */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const isPositiveTrend = metric.trend === "up" && metric.label !== "Active Incidents" && metric.label !== "Error Rate";
          // Logic: Incidents UP is BAD. Error Rate UP is BAD. Uptime UP is GOOD. Deployments UP is GOOD.
          
          let trendColor = "text-emerald-500";
          if (metric.label === "Active Incidents" && metric.change.startsWith("+")) trendColor = "text-red-500";
          if (metric.label === "Error Rate" && metric.change.startsWith("-")) trendColor = "text-emerald-500";
          
          return (
            <div
              key={metric.label}
              className="bg-card rounded-xl p-5 border shadow-sm relative overflow-hidden transition-all hover:shadow-md"
            >
              <div className="flex justify-between items-start mb-4">
                 <div className={`p-2.5 rounded-lg ${metric.bgColor}`}>
                    <Icon className={`w-5 h-5 ${metric.color}`} />
                 </div>
                 <div className={`flex items-center text-xs font-bold ${trendColor}`}>
                    {metric.change.startsWith("+") ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingUp className="w-3 h-3 mr-1 rotate-180" />}
                    {metric.change}
                 </div>
              </div>
              <div>
                <h3 className="text-3xl font-bold tracking-tight text-foreground">{metric.value}</h3>
                <p className="text-sm font-medium text-muted-foreground mt-1">{metric.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Request Volume Chart (Takes up 2 cols) */}
        <Card className="lg:col-span-2 border shadow-sm rounded-xl overflow-hidden">
             <CardHeader className="flex flex-row items-center justify-between pb-2">
                 <div className="space-y-1">
                     <CardTitle className="text-base font-semibold">Request Volume</CardTitle>
                     <CardDescription>Requests per hour</CardDescription>
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        Requests
                    </span>
                 </div>
             </CardHeader>
             <CardContent>
                <div className="h-[500px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={predictions}>
                      <defs>
                        <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                            backgroundColor: 'var(--card)', 
                            border: '1px solid var(--border)',
                            borderRadius: '8px' 
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="count" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorRequests)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
             </CardContent>
          </Card>

        {/* Active Incidents List (Takes up 1 col) */}
        <Card className="border shadow-sm rounded-xl overflow-hidden flex flex-col h-full">
            <CardHeader className="pb-3 border-b bg-muted/40">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold">Active Incidents</CardTitle>
                    <span className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-bold px-2 py-1 rounded-full border border-red-200 dark:border-red-800">3 open</span>
                </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto p-0">
                <div className="divide-y divide-border">
                    {/* Dummy Incident 1 */}
                    <div className="p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                             <span className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase border border-yellow-200 dark:border-yellow-800">High</span>
                            <span className="text-[10px] text-muted-foreground font-mono">INC-2847</span>
                        </div>
                        <p className="text-sm font-medium leading-tight mb-2 text-foreground">Database latency spike in us-east-1</p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/> 23 min</span>
                            <div className="flex items-center gap-1.5">
                               <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">SM</div>
                               <span>Sarah M.</span>
                            </div>
                        </div>
                    </div>

                    {/* Dummy Incident 2 */}
                    <div className="p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                             <span className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase border border-red-200 dark:border-red-800">Critical</span>
                            <span className="text-[10px] text-muted-foreground font-mono">INC-2846</span>
                        </div>
                        <p className="text-sm font-medium leading-tight mb-2 text-foreground">Payment gateway timeout errors</p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/> 45 min</span>
                             <div className="flex items-center gap-1.5">
                               <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 flex items-center justify-center text-[10px] font-bold">MC</div>
                               <span>Mike C.</span>
                            </div>
                        </div>
                    </div>

                    {/* Dummy Incident 3 */}
                    <div className="p-4 hover:bg-muted/50 transition-colors">
                         <div className="flex justify-between items-start mb-2">
                            <span className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase border border-gray-200 dark:border-gray-700">Medium</span>
                            <span className="text-[10px] text-muted-foreground font-mono">INC-2845</span>
                        </div>
                        <p className="text-sm font-medium leading-tight mb-2 text-foreground">CDN cache invalidation delay</p>
                         <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/> 1h 12m</span>
                            <div className="flex items-center gap-1.5">
                               <div className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 flex items-center justify-center text-[10px] font-bold">LP</div>
                               <span>Lisa P.</span>
                            </div>
                        </div>
                    </div>

                    {/* Dummy Incident 4 */}
                    <div className="p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                             <span className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase border border-yellow-200 dark:border-yellow-800">High</span>
                            <span className="text-[10px] text-muted-foreground font-mono">INC-2844</span>
                        </div>
                        <p className="text-sm font-medium leading-tight mb-2 text-foreground">API Rate limiting misconfiguration</p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/> 2h 05m</span>
                            <div className="flex items-center gap-1.5">
                               <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 flex items-center justify-center text-[10px] font-bold">DK</div>
                               <span>David K.</span>
                            </div>
                        </div>
                    </div>

                    {/* Dummy Incident 5 */}
                    <div className="p-4 hover:bg-muted/50 transition-colors">
                         <div className="flex justify-between items-start mb-2">
                            <span className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase border border-gray-200 dark:border-gray-700">Medium</span>
                            <span className="text-[10px] text-muted-foreground font-mono">INC-2843</span>
                        </div>
                        <p className="text-sm font-medium leading-tight mb-2 text-foreground">Background worker queue backup</p>
                         <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/> 3h 40m</span>
                            <div className="flex items-center gap-1.5">
                               <div className="w-5 h-5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 flex items-center justify-center text-[10px] font-bold">JL</div>
                               <span>Jenny L.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
