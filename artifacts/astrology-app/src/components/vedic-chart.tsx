import React from "react";
import { VedicChart as VedicChartType, VedicPlanet } from "@workspace/api-client-react/src/generated/api.schemas";
import { motion } from "framer-motion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface VedicChartProps {
  data: VedicChartType;
}

export function VedicChartVisual({ data }: VedicChartProps) {
  // Map planets to houses
  const houseMap = new Map<number, VedicPlanet[]>();
  
  // Initialize empty houses
  for (let i = 1; i <= 12; i++) {
    houseMap.set(i, []);
  }

  // Populate
  data.planets.forEach(p => {
    const h = houseMap.get(p.house);
    if (h) h.push(p);
  });

  return (
    <div className="flex flex-col xl:flex-row gap-8 w-full">
      {/* South Indian Chart Style representation (Square grid) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-md mx-auto aspect-square grid grid-cols-4 grid-rows-4 gap-[1px] bg-primary/20 p-[1px] mystic-border rounded-sm"
      >
        {/* Helper to render a house block */}
        {([12, 1, 2, 3, 11, 0, 0, 4, 10, 0, 0, 5, 9, 8, 7, 6] as number[]).map((houseNum, idx) => {
          if (houseNum === 0) {
            // Center empty space
            return <div key={`empty-${idx}`} className="bg-card/50" />;
          }

          const planets = houseMap.get(houseNum) || [];
          const isAscendant = data.ascendant && planets.some(p => p.name === "Ascendant" || p.name === "Lagna" || data.ascendant.includes(houseNum.toString())); // Simplified check
          
          return (
            <div key={`house-${houseNum}`} className="bg-card relative p-2 flex flex-col items-center justify-center overflow-hidden">
              <span className="absolute top-1 left-1 text-[10px] text-muted-foreground opacity-50">{houseNum}</span>
              {isAscendant && <span className="absolute bottom-1 right-1 text-[10px] text-primary">ASC</span>}
              
              <div className="flex flex-wrap gap-1 justify-center">
                {planets.map(p => (
                  <span key={p.name} className={`text-xs ${p.isExalted ? 'text-chart-1 font-bold' : p.isDebilitated ? 'text-destructive' : 'text-foreground'}`}>
                    {p.name.substring(0, 2).toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Planet Table */}
      <div className="flex-1">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-primary/70 font-serif">Planet</TableHead>
              <TableHead className="text-primary/70 font-serif">Sign</TableHead>
              <TableHead className="text-primary/70 font-serif text-center">House</TableHead>
              <TableHead className="text-primary/70 font-serif">Nakshatra</TableHead>
              <TableHead className="text-primary/70 font-serif text-right">Dignity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.planets.map((planet, idx) => (
              <TableRow key={planet.name} className="border-border/20 hover:bg-primary/5 transition-colors">
                <TableCell className="font-medium">{planet.name}</TableCell>
                <TableCell className="text-muted-foreground">{planet.sign}</TableCell>
                <TableCell className="text-center font-mono text-xs">{planet.house}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{planet.nakshatra}</TableCell>
                <TableCell className="text-right">
                  {planet.isExalted && <Badge variant="outline" className="text-chart-1 border-chart-1/30 bg-chart-1/10">Exalted</Badge>}
                  {planet.isDebilitated && <Badge variant="outline" className="text-destructive border-destructive/30 bg-destructive/10">Debilitated</Badge>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-6 bg-card/30 p-4 rounded-lg border border-border/50 text-sm flex justify-between items-center">
          <span className="text-muted-foreground">Current Dasha</span>
          <span className="font-serif text-primary text-lg">{data.dashaSystem.currentDasha} / {data.dashaSystem.currentBhukti}</span>
        </div>
      </div>
    </div>
  );
}
