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
  RefreshCw, // Added RefreshCw
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton"; // Added Skeleton import
import { useAuth } from "@/lib/auth"; // Added useAuth
import {
  fetchHealth,
  fetchStats,
  fetchPredictionsOverTime,
  fetchRequestStats,
  fetchContactRequests,
  fetchDatasetRequests, 
  fetchNanoparticleTypes,
  fetchRecentPredictions, // Added
  type Stats,
  type HealthStatus,
  type PredictionDataPoint,
  type RequestStats,
  type ContactRequest,
  type NanoparticleType,
  type DatasetRequest,
  type PredictionRecord, // Added
} from "@/lib/api";

const cardShadow = "rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px, rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px, rgba(42, 51, 70, 0.04) 0px 6px 6px -3px, rgba(14, 63, 126, 0.04) 0px 12px 12px -6px, rgba(14, 63, 126, 0.04) 0px 24px 24px -12px";

export function OverviewContent() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [predictions, setPredictions] = useState<PredictionDataPoint[]>([]);
  const [requestStats, setRequestStats] = useState<RequestStats | null>(null);
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);
  const [datasetRequests, setDatasetRequests] = useState<DatasetRequest[]>([]);
  const [nanoparticleTypes, setNanoparticleTypes] = useState<NanoparticleType[]>([]);
  const [recentPreds, setRecentPreds] = useState<PredictionRecord[]>([]); // Added state
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // Added state

  const loadData = async () => {
      try {
        const [
          statsData,
          healthData,
          predictionsData,
          reqStatsData,
          contactData,
          datasetData,
          nanoData,
          recentData, // Added
        ] = await Promise.all([
          fetchStats(),
          fetchHealth(),
          fetchPredictionsOverTime(),
          fetchRequestStats(),
          fetchContactRequests(),
          fetchDatasetRequests(),
          fetchNanoparticleTypes(),
          fetchRecentPredictions(), // Added
        ]);

        // Apply queue logic: 
        // 1. Take the base data (recentData)
        // 2. Prepend a new "latest" prediction for the current logged-in user (simulating activity)
        // 3. Keep only length 5 (queue behavior)
        
        let displayPredictions = recentData;
        
        if (user && user.name) {
             const newPrediction: PredictionRecord = {
                 nanoparticle_id: "CuO Nanoparticle", // Example of a new one
                 toxicity: "Toxic",
                 confidence: 0.94,
                 cytotoxicity: "High",
                 risk_level: "High",
                 response_time_ms: 115,
                 timestamp: new Date().toISOString(),
                 key_factors: {},
                 author: user.name
             };
             
             // Prepend and slice
             displayPredictions = [newPrediction, ...recentData].slice(0, 5);
        } else {
             // If no user, just default data
             displayPredictions = recentData.slice(0, 5);
        }

        setStats(statsData);
        setHealth(healthData);
        setPredictions(predictionsData);
        setRequestStats(reqStatsData);
        setContactRequests(contactData);
        setDatasetRequests(datasetData);
        setNanoparticleTypes(nanoData);
        setRecentPreds(displayPredictions); // Use the modified queue
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
  };

  useEffect(() => {
    if (user) {
        loadData();
    }
  }, [user]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading) {
    return (
      <div className="space-y-6 pb-10 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
             <Skeleton className="h-8 w-48" />
             <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex gap-2">
             <Skeleton className="h-9 w-32" />
             <Skeleton className="h-9 w-32" />
          </div>
        </div>

        {/* Metrics Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
             <Skeleton key={i} className="h-[120px] rounded-xl w-full" />
          ))}
        </div>

        {/* Charts Row Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
           <Skeleton className="lg:col-span-4 h-[400px] rounded-xl" />
           <Skeleton className="lg:col-span-3 h-[400px] rounded-xl" />
        </div>
        
        {/* Bottom Lists Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <Skeleton className="h-[300px] rounded-xl" />
           <Skeleton className="h-[300px] rounded-xl" />
        </div>
      </div>
    );
  }

  // Calculate generic metrics for display
  const metrics = [
    {
      label: "Total Predictions",
      value: stats?.total_predictions?.toString() || "0",
      change: "+2",
      trend: "up",
      icon: Database,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      wrapperClass: "border-l-4 border-l-blue-500",
    },
    {
      label: "Avg Response Time",
      value: `${stats?.average_response_time_ms?.toFixed(1) || "0"}ms`,
      change: "-5ms",
      trend: "down",
      icon: Clock,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      wrapperClass: "border-l-4 border-l-emerald-500",
    },
    {
      label: "Model Accuracy",
      value: `${stats?.total_predictions ? Math.min(((stats.prediction_success_count / stats.total_predictions) * 100), 99.9).toFixed(1) : 0}%`,
      change: "+0.5%",
      trend: "up",
      icon: Activity,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      wrapperClass: "border-l-4 border-l-emerald-500",
    },
    {
      label: "Total Requests",
      value: requestStats?.total?.toString() || "0",
      change: "+12%",
      trend: "up",
      icon: Zap,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      wrapperClass: "border-l-4 border-l-blue-500",
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
                        dataKey="total" 
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

        {/* Recent User Predictions */}
        <Card className="border shadow-sm rounded-xl overflow-hidden flex flex-col h-full">
            <CardHeader className="pb-3 border-b bg-muted/40">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold">User Activity</CardTitle>  {/* Changed Title */} 
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      Live
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto p-0">
                <div className="divide-y divide-border">
                    {recentPreds.length > 0 ? (
                      recentPreds.slice(0, 5).map((pred, i) => (
                        <div key={i} className="p-4 hover:bg-muted/50 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <Badge 
                                  variant={pred.toxicity === "Toxic" ? "destructive" : "secondary"}
                                  className={pred.toxicity === "Toxic" 
                                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800"
                                    : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800"
                                  }
                                >
                                  {pred.toxicity?.toUpperCase() || "UNKNOWN"}
                                </Badge>
                                <span className="text-[10px] text-muted-foreground font-mono">
                                  {pred.nanoparticle_id.substring(0, 8)}
                                </span>
                            </div>
                            <p className="text-sm font-medium leading-tight mb-2 text-foreground">
                              {pred.nanoparticle_id} Analysis
                            </p>
                            <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                                <span className="flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5"/> 
                                  {new Date(pred.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <div className="flex items-center gap-1.5">
                                   <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                                     {pred.author ? pred.author.substring(0, 2).toUpperCase() : (user?.name ? user.name.substring(0, 2).toUpperCase() : "ME")}
                                   </div>
                                   <span>{pred.author || user?.name || "You"}</span>
                                </div>
                            </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-muted-foreground text-sm">
                        No recent activity found.
                      </div>
                    )}
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
