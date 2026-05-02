import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { useAstrologyStore } from "@/lib/astrology-context";
import { motion } from "framer-motion";
import { SajuPillars } from "@/components/saju-chart";
import { ElementBalance } from "@/components/element-balance";
import { VedicChartVisual } from "@/components/vedic-chart";
import { DaewoonTimeline } from "@/components/daewoon-timeline";
import { FortuneScores, LifePathInterpretation } from "@/components/interpretation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useGetTodayFortune } from "@workspace/api-client-react";

export default function Result() {
  const [, setLocation] = useLocation();
  const { analysis, request, todayFortune, setTodayFortune } = useAstrologyStore();
  const getTodayFortuneMutation = useGetTodayFortune();

  useEffect(() => {
    if (!analysis || !request) {
      setLocation("/");
    }
  }, [analysis, request, setLocation]);

  useEffect(() => {
    if (request && !todayFortune && !getTodayFortuneMutation.isPending) {
      getTodayFortuneMutation.mutate({ data: request }, {
        onSuccess: (data) => setTodayFortune(data)
      });
    }
  }, [request, todayFortune, getTodayFortuneMutation, setTodayFortune]);

  if (!analysis) return null;

  return (
    <div className="min-h-[100dvh] w-full p-4 md:p-8 starlight-grid pb-24">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/50 mt-4 md:mt-8"
        >
          <div>
            <Button variant="ghost" size="sm" onClick={() => setLocation("/")} className="mb-4 -ml-3 text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> New Reading
            </Button>
            <h1 className="text-4xl md:text-5xl font-serif text-primary drop-shadow-md">Your Celestial Map</h1>
            <p className="text-muted-foreground mt-2 text-lg font-mono">
              {request?.birthDate} • {request?.birthTime} • {request?.birthPlace}
            </p>
          </div>
          
          <div className="text-right bg-card/30 p-4 rounded-xl border border-primary/20 mystic-border">
            <div className="text-sm uppercase tracking-widest text-muted-foreground mb-1">Day Master</div>
            <div className="text-4xl font-kr font-bold text-primary drop-shadow-[0_0_10px_rgba(220,180,80,0.5)]">{analysis.saju.dayMaster}</div>
          </div>
        </motion.header>

        {/* Today's Fortune Banner */}
        {todayFortune && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-primary/10 via-accent/10 to-transparent border-l-4 border-primary p-6 rounded-r-xl"
          >
            <h3 className="font-serif text-xl mb-2 text-foreground">Today's Guidance</h3>
            <p className="text-muted-foreground mb-4">{todayFortune.overall}</p>
            <div className="flex flex-wrap gap-4 text-sm font-mono">
              <span className="bg-card/50 px-3 py-1 rounded border border-border">Color: <span className="text-primary">{todayFortune.luckyColor}</span></span>
              <span className="bg-card/50 px-3 py-1 rounded border border-border">Number: <span className="text-primary">{todayFortune.luckyNumber}</span></span>
              <span className="bg-card/50 px-3 py-1 rounded border border-border">Direction: <span className="text-primary">{todayFortune.luckyDirection}</span></span>
            </div>
          </motion.div>
        )}

        {/* Four Pillars */}
        <section>
          <div className="mb-8">
            <h2 className="text-2xl font-serif text-foreground mb-2 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-primary/50" />
              The Four Pillars (Saju)
            </h2>
            <p className="text-muted-foreground">The ancient Chinese energetic blueprint of your birth.</p>
          </div>
          
          <div className="bg-card/20 backdrop-blur-sm rounded-xl p-6 md:p-8 mystic-border">
            <SajuPillars data={analysis.saju} />
          </div>
        </section>

        {/* Chart row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Element Balance */}
          <section className="bg-card/20 rounded-xl mystic-border p-6 lg:col-span-1 flex flex-col">
            <h3 className="font-serif text-xl mb-2 text-primary">Elemental Balance</h3>
            <p className="text-xs text-muted-foreground mb-6">Distribution of Wood, Fire, Earth, Metal, and Water.</p>
            <div className="flex-1 flex items-center justify-center">
              <ElementBalance data={analysis.saju.elementBalance} />
            </div>
            <div className="mt-4 text-center">
              <span className="text-sm text-muted-foreground">Dominant Element: </span>
              <span className="font-bold text-primary">{analysis.saju.dominantElement}</span>
            </div>
          </section>
          
          {/* Vedic Chart */}
          <section className="bg-card/20 rounded-xl mystic-border p-6 lg:col-span-2 overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-serif text-xl mb-2 text-primary">Vedic Astrology</h3>
                <p className="text-xs text-muted-foreground">The Kundali alignment of planets at your birth.</p>
              </div>
              <div className="text-right text-sm">
                <div className="text-muted-foreground">Ascendant (Lagna)</div>
                <div className="font-medium text-foreground">{analysis.vedic.ascendant}</div>
              </div>
            </div>
            
            <VedicChartVisual data={analysis.vedic} />
          </section>
        </div>

        {/* Fortune Scores */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-serif text-foreground mb-2 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-primary/50" />
              Life Potentials
            </h2>
          </div>
          <FortuneScores scores={analysis.interpretation.overallScore} />
        </section>

        {/* Daewoon Timeline */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-serif text-foreground mb-2 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-primary/50" />
              Daewoon Cycles
            </h2>
            <p className="text-muted-foreground">Your 10-year major fortune shifts.</p>
          </div>
          
          <DaewoonTimeline data={analysis.interpretation.daewoonList} />
        </section>

        {/* Interpretations */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-serif text-foreground mb-2 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-primary/50" />
              The Sage's Reading
            </h2>
          </div>
          
          <LifePathInterpretation data={analysis.interpretation} />
        </section>

      </div>
    </div>
  );
}
