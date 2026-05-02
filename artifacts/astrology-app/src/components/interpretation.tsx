import React from "react";
import { InterpretationOverallScore, Interpretation } from "@workspace/api-client-react/src/generated/api.schemas";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface ScoresProps {
  scores: InterpretationOverallScore;
}

export function FortuneScores({ scores }: ScoresProps) {
  const items = [
    { label: "Wealth", value: scores.wealth, color: "text-chart-1", bg: "bg-chart-1" },
    { label: "Career", value: scores.career, color: "text-chart-2", bg: "bg-chart-2" },
    { label: "Love", value: scores.love, color: "text-chart-4", bg: "bg-chart-4" },
    { label: "Health", value: scores.health, color: "text-chart-5", bg: "bg-chart-5" },
    { label: "Overall Luck", value: scores.luck, color: "text-primary", bg: "bg-primary" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
      {items.map((item, idx) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.1, duration: 0.4 }}
          className="bg-card/30 p-4 rounded-xl border border-border/50 flex flex-col items-center justify-center gap-3 text-center hover-elevate"
        >
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/30" />
              <circle 
                cx="50" cy="50" r="45" 
                fill="none" stroke="currentColor" strokeWidth="8" 
                strokeDasharray={`${item.value * 2.827} 282.7`}
                className={`${item.color} transition-all duration-1000 ease-out`} 
              />
            </svg>
            <span className="absolute text-sm font-bold">{item.value}</span>
          </div>
          <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">{item.label}</span>
        </motion.div>
      ))}
    </div>
  );
}

export function LifePathInterpretation({ data }: { data: Interpretation }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-card/20 border-border/50">
        <CardHeader>
          <CardTitle className="font-serif text-xl text-primary">Strengths & Weaknesses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="text-sm uppercase tracking-widest text-muted-foreground mb-3">Strengths</h4>
            <div className="flex flex-wrap gap-2">
              {data.strengths.map((s, i) => (
                <Badge key={i} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">{s}</Badge>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm uppercase tracking-widest text-muted-foreground mb-3">Areas for Growth</h4>
            <div className="flex flex-wrap gap-2">
              {data.weaknesses.map((s, i) => (
                <Badge key={i} variant="outline" className="border-border/50 text-muted-foreground">{s}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/20 border-border/50">
        <CardHeader>
          <CardTitle className="font-serif text-xl text-primary">Life Path & Purpose</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground/80 leading-relaxed text-sm md:text-base">
            {data.lifePath}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-card/20 border-border/50 md:col-span-2">
        <CardHeader>
          <CardTitle className="font-serif text-xl text-primary">Guidance</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-chart-2 uppercase tracking-wider">Career</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{data.careerGuidance}</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-chart-4 uppercase tracking-wider">Relationships</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{data.relationshipStyle}</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-chart-5 uppercase tracking-wider">Health</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{data.healthAdvice}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
