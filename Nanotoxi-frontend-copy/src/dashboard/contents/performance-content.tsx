"use client";

import { useEffect, useState } from "react";
import { Activity, Target, History, Wrench } from "lucide-react";
import {
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ZAxis,
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
import { fetchRecentPredictions, type PredictionRecord } from "@/lib/api";

export function PerformanceContent() {
  const [predictions, setPredictions] = useState<PredictionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchRecentPredictions();
        setPredictions(data);
      } catch (error) {
        console.error("Failed to load recent predictions:", error);
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

  // 1. Calculate Metrics
  const total = predictions.length;
  const avgConf = total > 0 ? predictions.reduce((acc, p) => acc + p.confidence, 0) / total : 0;
  
  const toxicCount = predictions.filter(p => p.toxicity === "TOXIC").length;
  const nonToxicCount = total - toxicCount;
  const modeToxicity = toxicCount > nonToxicCount ? "TOXIC" : (nonToxicCount > toxicCount ? "NON-TOXIC" : "BALANCED");

  let actionText = "Awaiting Data";
  let actionColor = "text-muted-foreground";
  if (total > 0) {
    if (avgConf >= 0.8) {
      actionText = "Model Stable (Monitor)";
      actionColor = "text-emerald-500";
    } else if (avgConf >= 0.6) {
      actionText = "Review Edge Cases (Possible FPs)";
      actionColor = "text-yellow-500";
    } else {
      actionText = "Retrain Model (High Uncertainty)";
      actionColor = "text-red-500";
    }
  }

  // 2. Process Data for Line Chart (Predictions over time)
  // Group by hour
  const volumeMap: Record<string, number> = {};
  const sortedPredictions = [...predictions].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  
  sortedPredictions.forEach(p => {
    const d = new Date(p.timestamp);
    const key = `${d.getHours()}:00`; // Simplified for recent data
    volumeMap[key] = (volumeMap[key] || 0) + 1;
  });
  
  const volumeData = Object.keys(volumeMap).map(k => ({ time: k, count: volumeMap[k] }));

  // 3. Process Data for Scatter Chart (Confidence vs Timestamp vs Toxicity)
  const scatterDataToxic = sortedPredictions
    .filter(p => p.toxicity === "TOXIC")
    .map(p => ({
      timeStr: new Date(p.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      timeNum: new Date(p.timestamp).getTime(),
      confidence: Number((p.confidence * 100).toFixed(1)),
      id: p.nanoparticle_id
    }));

  const scatterDataNonToxic = sortedPredictions
    .filter(p => p.toxicity === "NON-TOXIC")
    .map(p => ({
      timeStr: new Date(p.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      timeNum: new Date(p.timestamp).getTime(),
      confidence: Number((p.confidence * 100).toFixed(1)),
      id: p.nanoparticle_id
    }));

  return (
    <div className="space-y-6 pb-10">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border shadow-sm rounded-xl">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-500/10">
              <History className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Recent Predictions</p>
              <h3 className="text-3xl font-bold tracking-tight">{total}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border shadow-sm rounded-xl">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-indigo-500/10">
              <Target className="w-6 h-6 text-indigo-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg Confidence</p>
              <h3 className="text-3xl font-bold tracking-tight">{(avgConf * 100).toFixed(1)}%</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border shadow-sm rounded-xl">
          <CardContent className="p-6 flex items-center gap-4">
            <div className={`p-3 rounded-lg ${modeToxicity === "TOXIC" ? "bg-red-500/10" : "bg-emerald-500/10"}`}>
              <Activity className={`w-6 h-6 ${modeToxicity === "TOXIC" ? "text-red-500" : "text-emerald-500"}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Mode Toxicity</p>
              <h3 className={`text-xl font-bold tracking-tight mt-1 ${modeToxicity === "TOXIC" ? "text-red-500" : "text-emerald-500"}`}>{modeToxicity}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border shadow-sm rounded-xl">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-muted">
              <Wrench className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Recommended Action</p>
              <h3 className={`text-sm font-bold tracking-tight mt-1 ${actionColor}`}>{actionText}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart: Volume over time */}
        <Card className="border shadow-sm rounded-xl overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Prediction Volume</CardTitle>
            <CardDescription>Number of predictions processed over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={volumeData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="time" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                  <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }}
                  />
                  <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Scatter Chart: Confidence vs Time */}
        <Card className="border shadow-sm rounded-xl overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Model Confidence</CardTitle>
            <CardDescription>Confidence scores by toxicity prediction</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis 
                    type="number" 
                    dataKey="timeNum" 
                    name="Time" 
                    domain={['auto', 'auto']}
                    tickFormatter={(unixTime) => new Date(unixTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} 
                  />
                  <YAxis 
                    type="number" 
                    dataKey="confidence" 
                    name="Confidence" 
                    domain={[0, 100]} 
                    unit="%" 
                    tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} 
                  />
                  <ZAxis type="category" dataKey="id" name="ID" />
                  <Tooltip 
                    cursor={{ strokeDasharray: "3 3" }}
                    contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                  <Scatter name="Toxic" data={scatterDataToxic} fill="#ef4444" shape="circle" />
                  <Scatter name="Non-Toxic" data={scatterDataNonToxic} fill="#10b981" shape="circle" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Predictions Table */}
      <Card className="border shadow-sm rounded-xl overflow-hidden">
        <CardHeader className="pb-3 border-b bg-muted/40">
          <CardTitle className="text-base font-semibold">Recent Prediction Log</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Nanoparticle ID</TableHead>
                <TableHead>Toxicity</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Risk Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {predictions.slice(0, 10).map((p, idx) => (
                <TableRow key={idx}>
                  <TableCell className="text-muted-foreground">
                    {new Date(p.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell className="font-medium">{p.nanoparticle_id}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${p.toxicity === "TOXIC" ? "bg-red-500/10 text-red-500" : "bg-emerald-500/10 text-emerald-500"}`}>
                      {p.toxicity}
                    </span>
                  </TableCell>
                  <TableCell>{(p.confidence * 100).toFixed(1)}%</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{p.risk_level}</TableCell>
                </TableRow>
              ))}
              {predictions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No recent predictions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
