import { Router } from "express";
import { AnalyzeAstrologyBody, GetTodayFortuneBody } from "@workspace/api-zod";
import { calculateSaju } from "./saju";
import { calculateVedic } from "./vedic";
import { generateInterpretation } from "./interpretation";
import { generateTodayFortune } from "./today";

const router = Router();

router.post("/analyze", async (req, res) => {
  const parsed = AnalyzeAstrologyBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "INVALID_INPUT", message: parsed.error.message });
    return;
  }

  const { birthDate, birthTime, gender, birthPlace, timezone } = parsed.data;

  try {
    const saju = calculateSaju(birthDate, birthTime);
    const vedic = calculateVedic(birthDate, birthTime, birthPlace);
    const interpretation = generateInterpretation(saju, vedic, gender, birthDate);

    res.json({
      request: parsed.data,
      saju,
      vedic,
      interpretation,
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to analyze astrology");
    res.status(500).json({ error: "CALCULATION_ERROR", message: "Failed to calculate astrology data" });
  }
});

router.post("/today-fortune", async (req, res) => {
  const parsed = GetTodayFortuneBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "INVALID_INPUT", message: parsed.error.message });
    return;
  }

  const { birthDate, birthTime } = parsed.data;

  try {
    const fortune = generateTodayFortune(birthDate, birthTime);
    res.json(fortune);
  } catch (err) {
    req.log.error({ err }, "Failed to generate today fortune");
    res.status(500).json({ error: "CALCULATION_ERROR", message: "Failed to generate today's fortune" });
  }
});

export default router;
