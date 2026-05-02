import React from "react";
import { SajuChartElementBalance } from "@workspace/api-client-react/src/generated/api.schemas";
import { ResponsiveContainer, PolarGrid, PolarAngleAxis, RadarChart, Radar, Tooltip } from "recharts";
import { motion } from "framer-motion";

interface ElementBalanceProps {
  data: SajuChartElementBalance;
}

export function ElementBalance({ data }: ElementBalanceProps) {
  const chartData = [
    { subject: "Wood", A: data.wood || data["목"] || 0, fullMark: 100 },
    { subject: "Fire", A: data.fire || data["화"] || 0, fullMark: 100 },
    { subject: "Earth", A: data.earth || data["토"] || 0, fullMark: 100 },
    { subject: "Metal", A: data.metal || data["금"] || 0, fullMark: 100 },
    { subject: "Water", A: data.water || data["수"] || 0, fullMark: 100 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full flex flex-col items-center"
    >
      <div className="w-full h-[300px] md:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
            <PolarGrid stroke="hsl(var(--primary)/0.2)" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12, fontFamily: "var(--font-serif)" }} />
            <Radar
              name="Element Score"
              dataKey="A"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.3}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }}
              itemStyle={{ color: "hsl(var(--primary))" }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
