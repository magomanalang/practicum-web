import { AreaChartAnalytics } from "@/designs/AreaChart";
import { LineChartAnalytics } from "@/designs/LineChart";
import { PieChartAnalytics } from "@/designs/PieChart";
import { RadarChartAnalytics } from "@/designs/RadarChart";

export default function Home() {
  return (
    <div className="flex flex-col p-6 w-full max-w-7xl mx-auto gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Overview of visitor metrics and trends.
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <AreaChartAnalytics />
        </div>
        <div className="flex-1">
          <LineChartAnalytics />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <PieChartAnalytics />
        </div>
        <div className="flex-1">
          <RadarChartAnalytics />
        </div>
      </div>
    </div>
  );
}
