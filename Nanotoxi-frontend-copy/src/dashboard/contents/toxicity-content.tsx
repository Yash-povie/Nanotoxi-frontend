"use client";

import { useEffect, useState } from "react";
import { PieChart as PieChartIcon, Activity, Database } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchToxicityDistribution, type ToxicityDistribution } from "@/lib/api";

const COLORS = ["#ef4444", "#10b981"]; // Red for toxic, Green for non-toxic

export function ToxicityContent() {
  const [data, setData] = useState<ToxicityDistribution | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const distData = await fetchToxicityDistribution();
        setData(distData);
      } catch (error) {
        console.error("Failed to load toxicity distribution:", error);
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

  const chartData = data ? [
    { name: "Toxic", value: data.toxic },
    { name: "Non-Toxic", value: data.non_toxic },
  ] : [];

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Toxicity Analysis</h2>
          <p className="text-sm text-muted-foreground mt-1">Toxicity Distribution & History</p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border shadow-sm rounded-xl">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-500/10">
              <Database className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Predictions</p>
              <h3 className="text-3xl font-bold tracking-tight">{data?.total || 0}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border shadow-sm rounded-xl">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-red-500/10">
              <Activity className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Toxic</p>
              <h3 className="text-3xl font-bold tracking-tight">{data?.toxic || 0}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border shadow-sm rounded-xl">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-emerald-500/10">
              <Activity className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Non-Toxic</p>
              <h3 className="text-3xl font-bold tracking-tight">{data?.non_toxic || 0}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border shadow-sm rounded-xl overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Toxicity Distribution</CardTitle>
            <CardDescription>Ratio of toxic vs non-toxic predictions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={100}
                    outerRadius={140}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "var(--card)", 
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      color: "#10b981" // Force green text for visibility in dark mode
                    }}
                    itemStyle={{ color: "#10b981" }} // Ensure the item text is also green
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
