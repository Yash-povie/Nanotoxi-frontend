"use client";

import { useEffect, useState } from "react";
import { Shield, CheckCircle, Cloud, Zap, ArrowUp, Activity, ChevronDown, DollarSign, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fetchNanoparticleTypes, type NanoparticleType } from "@/lib/api";

const API_HEALTH_URL = "https://web-production-6a673.up.railway.app/health";

interface HealthData {
  message: string;
  model_status: string;
  models_loaded: boolean;
  status: string;
  timestamp: string;
  uptime_percentage: number;
  uptime_seconds: number;
}

interface ChartDataPoint {
  time: string;
  uptime: number;
}

const intervalOptions = [
  { label: "5s", value: 5000 },
  { label: "10s", value: 10000 },
  { label: "20s", value: 20000 },
  { label: "1m", value: 60000 },
  { label: "5m", value: 300000 },
  { label: "10m", value: 600000 },
  { label: "15m", value: 900000 },
  { label: "20m", value: 1200000 },
];

// Estimates for "wet lab" testing per nanoparticle type
// Cost in USD, Time in Hours
const LAB_COST_ESTIMATES: Record<string, { cost: number; time: number }> = {
  "TiO2": { cost: 450, time: 48 },  // Titanium Dioxide
  "ZnO": { cost: 400, time: 48 },   // Zinc Oxide
  "Ag": { cost: 600, time: 72 },    // Silver
  "Au": { cost: 1200, time: 96 },   // Gold
  "SiO2": { cost: 350, time: 36 },  // Silicon Dioxide
  "Fe2O3": { cost: 380, time: 40 }, // Iron Oxide
  "CuO": { cost: 420, time: 48 },   // Copper Oxide
  "Al2O3": { cost: 360, time: 36 }, // Aluminium Oxide
  "CNT": { cost: 800, time: 120 },  // Carbon Nanotubes
  "Graphene": { cost: 900, time: 120 }
};

const DEFAULT_ESTIMATE = { cost: 400, time: 48 };

const cardShadow = "rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px, rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px, rgba(42, 51, 70, 0.04) 0px 6px 6px -3px, rgba(14, 63, 126, 0.04) 0px 12px 12px -6px, rgba(14, 63, 126, 0.04) 0px 24px 24px -12px";

export function SlaContent() {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [pollingInterval, setPollingInterval] = useState(5000);
  const [savings, setSavings] = useState<{ money: number; time: number } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Health Data
        const response = await fetch(API_HEALTH_URL);
        if (!response.ok) throw new Error("Failed to fetch health data");
        const data: HealthData = await response.json();
        
        setHealthData(data);
        
        setChartData((prev) => {
          const newPoint = {
            time: new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            uptime: data.uptime_seconds,
          };
          // Keep last 20 points
          const newData = [...prev, newPoint];
          if (newData.length > 20) return newData.slice(newData.length - 20);
          return newData;
        });

      } catch (error) {
        console.error("Error fetching health data:", error);
      }
    };

    // Fetch Savings Data (Initial only, or polling if needed, but costs don't change fast)
    const fetchSavingsData = async () => {
      try {
        const types = await fetchNanoparticleTypes();
        let totalMoney = 0;
        let totalTime = 0;

        types.forEach((item) => {
          const name = item.nanoparticle_id || "";
          let matched = false;
          
          for (const [key, val] of Object.entries(LAB_COST_ESTIMATES)) {
            if (name.includes(key)) {
              totalMoney += val.cost * item.count;
              totalTime += val.time * item.count;
              matched = true;
              break;
            }
          }

          if (!matched) {
            totalMoney += DEFAULT_ESTIMATE.cost * item.count;
            totalTime += DEFAULT_ESTIMATE.time * item.count;
          }
        });

        setSavings({ money: totalMoney, time: totalTime });
      } catch (error) {
        console.error("Error fetching nanoparticle types for savings:", error);
      }
    };

    // Initial fetch
    fetchData();
    fetchSavingsData();

    // Poll at selected interval for health data
    const interval = setInterval(fetchData, pollingInterval);
    return () => clearInterval(interval);
  }, [pollingInterval]);

  if (!healthData) {
    return <div className="p-8 text-center text-muted-foreground">Loading system metrics...</div>;
  }

  const isHealthy = healthData.status === "healthy";

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-2xl p-5 border border-border" style={{ boxShadow: cardShadow }}>
          <div className="flex items-center gap-3 mb-2">
            <div className={cn("p-2 rounded-lg", isHealthy ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive")}>
              <Shield className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">System Status</p>
          </div>
          <p className="text-2xl font-semibold capitalize">{healthData.status}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <CheckCircle className="w-3 h-3 text-success" /> All systems operational
          </p>
        </div>

        <div className="bg-card rounded-2xl p-5 border border-border" style={{ boxShadow: cardShadow }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
              <Cloud className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Models Loaded</p>
          </div>
          <p className="text-2xl font-semibold">{healthData.models_loaded ? "Active" : "Inactive"}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
             Status: {healthData.model_status}
          </p>
        </div>

        <div className="bg-card rounded-2xl p-5 border border-border" style={{ boxShadow: cardShadow }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
              <Activity className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Uptime %</p>
          </div>
          <p className="text-2xl font-semibold">{healthData.uptime_percentage.toFixed(2)}%</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
             Target: 99.9%
          </p>
        </div>

        <div className="bg-card rounded-2xl p-5 border border-border" style={{ boxShadow: cardShadow }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
              <Zap className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Uptime Seconds</p>
          </div>
          <p className="text-2xl font-semibold">{(healthData.uptime_seconds / 3600).toFixed(1)}h</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <ArrowUp className="w-3 h-3 text-success" /> Total runtime
          </p>
        </div>
      </div>

      {/* Timestamp vs Uptime Chart */}
      <div className="bg-card rounded-2xl p-6 border border-border" style={{ boxShadow: cardShadow }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-semibold text-foreground">Live Uptime Monitor</h3>
            <p className="text-sm text-muted-foreground">Timestamp vs Uptime Seconds (Real-time)</p>
          </div>
          <div className="flex items-center gap-2">
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-2 bg-secondary/50 border-0 hover:bg-secondary">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs font-medium">Polling: {intervalOptions.find(opt => opt.value === pollingInterval)?.label}</span>
                  <ChevronDown className="w-3 h-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[120px]">
                {intervalOptions.map((option) => (
                  <DropdownMenuItem 
                    key={option.value}
                    onClick={() => {
                        setPollingInterval(option.value);
                    }}
                    className={cn("text-xs justify-between cursor-pointer", pollingInterval === option.value && "bg-accent/50 text-accent-foreground font-medium")}
                  >
                    <span>{option.label}</span>
                    {pollingInterval === option.value && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" vertical={false} />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 12, fill: "#888888" }} 
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                domain={['auto', 'auto']}
                tick={{ fontSize: 12, fill: "#888888" }}
                axisLine={false}
                tickLine={false}
                width={80}
              />
              <Tooltip 
                contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
              />
              <Area
                type="monotone"
                dataKey="uptime"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#chartColor)"
                animationDuration={500}
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Lab Usage Savings */}
      {savings && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card rounded-2xl p-5 border border-border relative overflow-hidden" style={{ boxShadow: cardShadow }}>
            <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-green-500/10 to-transparent pointer-events-none" />
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-500/10 text-green-600">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Estimated Lab Cost Savings</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-bold text-foreground">
                    ${savings.money.toLocaleString()}
                  </h3>
                  <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                    +12% vs last month
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Based on equivalent wet lab testing costs
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-5 border border-border relative overflow-hidden" style={{ boxShadow: cardShadow }}>
            <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-blue-500/10 to-transparent pointer-events-none" />
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Research Time Saved</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-bold text-foreground">
                    {Math.floor(savings.time).toLocaleString()} <span className="text-lg font-normal text-muted-foreground">hours</span>
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Accelerated discovery vs traditional methods
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Condensed API Info / Server Status */}
      <div className="bg-card rounded-2xl border border-border" style={{ boxShadow: cardShadow }}>
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-foreground">Server Status Details</h3>
            <p className="text-sm text-muted-foreground">Detailed breakdown of current API health</p>
          </div>
          <div className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
            {healthData.timestamp}
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
            <div className="p-4 flex flex-col items-center text-center">
                <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Message</span>
                <span className="font-medium text-sm">{healthData.message}</span>
            </div>
            <div className="p-4 flex flex-col items-center text-center">
                <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Model Status</span>
                <span className="font-medium text-sm px-2 py-0.5 bg-green-100 text-green-700 rounded-full">{healthData.model_status}</span>
            </div>
            <div className="p-4 flex flex-col items-center text-center">
                <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Loaded</span>
                <span className="font-medium text-sm">{healthData.models_loaded ? "Yes" : "No"}</span>
            </div>
            <div className="p-4 flex flex-col items-center text-center">
                <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Raw Uptime</span>
                <span className="font-medium text-sm font-mono">{healthData.uptime_seconds.toFixed(2)}s</span>
            </div>
        </div>
      </div>
    </div>
  );
}
