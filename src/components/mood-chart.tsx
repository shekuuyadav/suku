"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import type { EmotionDataPoint } from "@/lib/types";
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface MoodChartProps {
  data: EmotionDataPoint[];
}

const chartConfig = {
  count: {
    label: "Count",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function MoodChart({ data }: MoodChartProps) {
  return (
    <div className="h-[400px] w-full">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip cursor={{ fill: 'hsla(var(--primary), 0.1)' }} content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
