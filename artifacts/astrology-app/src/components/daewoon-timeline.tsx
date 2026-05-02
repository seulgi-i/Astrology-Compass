import React from "react";
import { DaewoonEntry } from "@workspace/api-client-react/src/generated/api.schemas";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface DaewoonTimelineProps {
  data: DaewoonEntry[];
}

export function DaewoonTimeline({ data }: DaewoonTimelineProps) {
  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-lg pb-6">
      <div className="flex w-max space-x-4 p-4">
        {data.map((period, idx) => (
          <motion.div
            key={period.period}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            className="flex flex-col w-[280px] bg-card/40 border border-border/50 rounded-xl overflow-hidden mystic-border group hover:-translate-y-1 transition-transform"
          >
            <div className="bg-primary/10 p-3 border-b border-primary/20 flex justify-between items-center">
              <span className="font-mono text-sm text-primary">Age {period.startAge}-{period.endAge}</span>
              <span className="font-serif text-muted-foreground">{period.period}</span>
            </div>
            
            <div className="p-5 flex-1 flex flex-col gap-4">
              <div className="flex justify-center gap-3">
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-kr font-bold text-foreground drop-shadow-md">{period.heavenlyStem}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-kr font-bold text-foreground drop-shadow-md">{period.earthlyBranch}</span>
                </div>
              </div>
              
              <div className="text-center">
                <Badge variant="outline" className="bg-background/50 text-xs mb-3">{period.element}</Badge>
                <h4 className="font-medium text-foreground mb-2 text-sm">{period.theme}</h4>
              </div>
              
              <div className="flex flex-wrap gap-1 mt-auto">
                {period.keywords.map(kw => (
                  <span key={kw} className="text-[10px] bg-secondary px-2 py-1 rounded text-secondary-foreground">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" className="bg-card/50" />
    </ScrollArea>
  );
}
