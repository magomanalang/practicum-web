import { AreaChartAnalytics } from "@/designs/AreaChart";
import { LineChartAnalytics } from "@/designs/LineChart";
import { PieChartAnalytics } from "@/designs/PieChart";
import { RadarChartAnalytics } from "@/designs/RadarChart";

export default function Home() {
  return (
    <>
      <AreaChartAnalytics />
      <PieChartAnalytics />
      <RadarChartAnalytics />
      <LineChartAnalytics />
    </>
  );
}
