import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { StatusDistribution } from "@/lib/dashboardService";

interface StatusChartProps {
  data: StatusDistribution[];
}

const statusLabels: Record<string, string> = {
  draft: "Draft",
  sent: "Sent",
  paid: "Paid",
  overdue: "Overdue",
  cancelled: "Cancelled",
};

const statusColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export function StatusChart({ data }: StatusChartProps) {
  const chartData = data
    .filter((d) => d.count > 0)
    .map((d) => ({
      name: statusLabels[d.status] || d.status,
      value: d.count,
      status: d.status,
    }));

  if (chartData.length === 0) {
    chartData.push({ name: "No Data", value: 1, status: "none" });
  }

  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="flex items-center gap-4">
      <ResponsiveContainer width={140} height={140}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={42}
            outerRadius={65}
            paddingAngle={2}
            dataKey="value"
            stroke="none"
          >
            {chartData.map((_, index) => (
              <Cell
                key={index}
                fill={statusColors[index % statusColors.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 0,
              fontSize: 12,
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="flex-1 space-y-2">
        {chartData.map((d, i) => (
          <div key={d.status} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5"
                style={{
                  backgroundColor: statusColors[i % statusColors.length],
                }}
              />
              <span className="text-muted-foreground">{d.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-medium">{d.value}</span>
              <span className="text-muted-foreground">
                ({total > 0 ? Math.round((d.value / total) * 100) : 0}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
