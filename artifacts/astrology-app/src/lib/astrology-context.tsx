import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { AstrologyRequest, AstrologyAnalysis, TodayFortune } from "@workspace/api-client-react/src/generated/api.schemas";

interface AstrologyContextType {
  request: AstrologyRequest | null;
  setRequest: (req: AstrologyRequest) => void;
  analysis: AstrologyAnalysis | null;
  setAnalysis: (res: AstrologyAnalysis) => void;
  todayFortune: TodayFortune | null;
  setTodayFortune: (res: TodayFortune) => void;
}

const AstrologyContext = createContext<AstrologyContextType | undefined>(undefined);

export function AstrologyProvider({ children }: { children: ReactNode }) {
  const [request, setRequestState] = useState<AstrologyRequest | null>(() => {
    const saved = localStorage.getItem("astro_request");
    return saved ? JSON.parse(saved) : null;
  });
  
  const [analysis, setAnalysisState] = useState<AstrologyAnalysis | null>(() => {
    const saved = localStorage.getItem("astro_analysis");
    return saved ? JSON.parse(saved) : null;
  });

  const [todayFortune, setTodayFortuneState] = useState<TodayFortune | null>(() => {
    const saved = localStorage.getItem("astro_today");
    return saved ? JSON.parse(saved) : null;
  });

  const setRequest = (req: AstrologyRequest) => {
    setRequestState(req);
    localStorage.setItem("astro_request", JSON.stringify(req));
  };

  const setAnalysis = (res: AstrologyAnalysis) => {
    setAnalysisState(res);
    localStorage.setItem("astro_analysis", JSON.stringify(res));
  };

  const setTodayFortune = (res: TodayFortune) => {
    setTodayFortuneState(res);
    localStorage.setItem("astro_today", JSON.stringify(res));
  };

  return (
    <AstrologyContext.Provider value={{ request, setRequest, analysis, setAnalysis, todayFortune, setTodayFortune }}>
      {children}
    </AstrologyContext.Provider>
  );
}

export function useAstrologyStore() {
  const context = useContext(AstrologyContext);
  if (context === undefined) {
    throw new Error("useAstrologyStore must be used within an AstrologyProvider");
  }
  return context;
}
