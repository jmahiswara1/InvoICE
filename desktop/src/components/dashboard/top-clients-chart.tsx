import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { TopClient } from "@/lib/dashboardService";

interface TopClientsChartProps {
  data: TopClient[];
}

export function TopClientsChart({ data }: TopClientsChartProps) {
  const chartData = [...data].reverse();

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-sm text-muted-foreground">
        Belum ada data klien
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 0, right: 16, bottom: 0, left: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="hsl(var(--border))"
          horizontal={false}
        />
        <XAxis
          type="number"
          tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
          axisLine={false}
          tickLine={false}
          width={80}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--background))",
            border: "1px solid hsl(var(--border))",
            borderRadius: 0,
            fontSize: 12,
          }}
          cursor={{ fill: "hsl(var(--muted))" }}
          formatter={(value) => [`${value ?? 0} invoice`, "Total"]}
        />
        <Bar dataKey="invoice_count" radius={[0, 0, 0, 0]}>
          {chartData.map((_, index) => (
            <Cell
              key={index}
              fill={`hsl(var(--chart-${(index % 5) + 1}))`}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}