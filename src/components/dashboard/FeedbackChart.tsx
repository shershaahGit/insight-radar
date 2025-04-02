
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ChartData {
  name: string;
  positive: number;
  neutral: number;
  negative: number;
}

interface FeedbackChartProps {
  data: ChartData[];
  title: string;
  description?: string;
}

export function FeedbackChart({ data, title, description }: FeedbackChartProps) {
  const [activeTab, setActiveTab] = useState("weekly");
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    // In a real app, this would filter based on the selected time range
    // For now, we'll just use the same data for demonstration
    setChartData(data);
  }, [data, activeTab]);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <Tabs defaultValue="weekly" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="positive" fill="#4ade80" name="Positive" />
              <Bar dataKey="neutral" fill="#a3a3a3" name="Neutral" />
              <Bar dataKey="negative" fill="#f87171" name="Negative" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
