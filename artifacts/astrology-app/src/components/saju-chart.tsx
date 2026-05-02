import React from "react";
import { SajuChart } from "@workspace/api-client-react/src/generated/api.schemas";
import { motion } from "framer-motion";

interface SajuChartProps {
  data: SajuChart;
}

const elementColors: Record<string, string> = {
  Wood: "text-chart-wood",
  Fire: "text-chart-fire",
  Earth: "text-chart-earth",
  Metal: "text-chart-metal",
  Water: "text-chart-water",
  목: "text-chart-wood",
  화: "text-chart-fire",
  토: "text-chart-earth",
  금: "text-chart-metal",
  수: "text-chart-water",
};

const getElementColor = (el: string) => {
  for (const [key, val] of Object.entries(elementColors)) {
    if (el.includes(key)) return val;
  }
  return "text-foreground";
};

export function SajuPillars({ data }: SajuChartProps) {
  const pillars = [
    { title: "Hour", data: data.hourPillar },
    { title: "Day", data: data.dayPillar },
    { title: "Month", data: data.monthPillar },
    { title: "Year", data: data.yearPillar },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 md:gap-6">
      {pillars.map((pillar, idx) => (
        <motion.div
          key={pillar.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.15, duration: 0.6 }}
          className="flex flex-col items-center"
        >
          <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-4 font-serif">{pillar.title}</h4>
          
          <div className="flex flex-col gap-2 w-full max-w-[100px]">
            {/* Heavenly Stem */}
            <div className="aspect-square mystic-border rounded-lg bg-card/50 flex flex-col items-center justify-center p-2 cosmic-glow relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className={`text-4xl md:text-5xl font-kr font-bold ${getElementColor(pillar.data.element)} drop-shadow-md`}>
                {pillar.data.heavenlyStem}
              </span>
            </div>
            
            {/* Earthly Branch */}
            <div className="aspect-square mystic-border rounded-lg bg-card/30 flex flex-col items-center justify-center p-2 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tl from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className={`text-4xl md:text-5xl font-kr font-bold ${getElementColor(pillar.data.element)} drop-shadow-md`}>
                {pillar.data.earthlyBranch}
              </span>
            </div>
            
            {/* Element info */}
            <div className="text-center mt-2">
              <span className="text-xs text-muted-foreground">{pillar.data.element} ({pillar.data.yin_yang})</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
