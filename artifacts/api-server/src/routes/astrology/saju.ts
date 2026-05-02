// Saju (사주팔자) - Four Pillars of Destiny calculation engine

export const HEAVENLY_STEMS = ["갑(甲)", "을(乙)", "병(丙)", "정(丁)", "무(戊)", "기(己)", "경(庚)", "신(辛)", "임(壬)", "계(癸)"];
export const HEAVENLY_STEMS_SHORT = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"];
export const EARTHLY_BRANCHES = ["자(子)", "축(丑)", "인(寅)", "묘(卯)", "진(辰)", "사(巳)", "오(午)", "미(未)", "신(申)", "유(酉)", "술(戌)", "해(亥)"];
export const EARTHLY_BRANCHES_SHORT = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"];

export const STEM_ELEMENTS = ["목", "목", "화", "화", "토", "토", "금", "금", "수", "수"];
export const STEM_YIN_YANG = ["양", "음", "양", "음", "양", "음", "양", "음", "양", "음"];
export const BRANCH_ELEMENTS = ["수", "토", "목", "목", "토", "화", "화", "토", "금", "금", "토", "수"];

// Animals for earthly branches
export const BRANCH_ANIMALS = ["쥐(子)", "소(丑)", "호랑이(寅)", "토끼(卯)", "용(辰)", "뱀(巳)", "말(午)", "양(未)", "원숭이(申)", "닭(酉)", "개(戌)", "돼지(亥)"];

// Julian Day Number calculation
function toJulianDay(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

// Solar term (절기) month boundaries (approximate day of month for 12 major solar terms)
// These are the 12 months start points in solar terms (절기)
const SOLAR_TERM_MONTHS: Record<number, number[]> = {
  // [month in year (1-12): approximate day of start]
  1: [4, 5],   // 입춘 (Feb 3-5)
  2: [5, 6],   // 경칩 (Mar 5-7)
  3: [4, 6],   // 청명 (Apr 4-6)
  4: [5, 7],   // 입하 (May 5-7)
  5: [5, 7],   // 망종 (Jun 5-7)
  6: [6, 8],   // 소서 (Jul 6-8)
  7: [7, 8],   // 입추 (Aug 7-8)
  8: [7, 9],   // 백로 (Sep 7-9)
  9: [7, 9],   // 한로 (Oct 7-9)
  10: [7, 8],  // 입동 (Nov 7-8)
  11: [6, 8],  // 대설 (Dec 6-8)
  12: [4, 6],  // 소한 (Jan 4-6 next year)
};

// Get saju month index (0-11) based on solar terms
function getSajuMonth(year: number, month: number, day: number): number {
  // Saju months start at solar terms (절기), approx day 5-8 of each month
  // Month 1 (인월, 寅月) starts at 입춘 (~Feb 4)
  // Each saju month corresponds roughly to a solar month starting around day 5-7
  
  const threshold = SOLAR_TERM_MONTHS[month]?.[0] ?? 6;
  
  if (month === 1) {
    // January - if before 소한 (~Jan 5), still previous year's 12th month
    // If after 소한, it's month 12 of saju (축월)
    return day >= threshold ? 11 : 10; // Dec or Nov saju month
  } else if (month === 2) {
    // February - if before 입춘 (~Feb 4), it's 축월(month 11), after is 인월(month 0)
    return day >= threshold ? 0 : 11;
  } else {
    return day >= threshold ? month - 2 : month - 3;
  }
}

// Get year stem/branch (NOTE: saju year changes at 입춘 ~Feb 4)
function getYearPillar(year: number, month: number, day: number) {
  let sajuYear = year;
  // If before 입춘 (~Feb 4), use previous year
  if (month === 1 || (month === 2 && day < 4)) {
    sajuYear = year - 1;
  }
  
  // Reference: 1984 = 甲子 (stem=0, branch=0)
  const stemIdx = ((sajuYear - 1984) % 10 + 10) % 10;
  const branchIdx = ((sajuYear - 1984) % 12 + 12) % 12;
  
  return { stemIdx, branchIdx };
}

// Get month stem index based on year stem
function getMonthStemBase(yearStemIdx: number): number {
  // Month stem cycle depends on year stem
  // Years with stem 갑(0) or 기(5): 인월 starts with 병(2)
  // Years with stem 을(1) or 경(6): 인월 starts with 무(4)
  // Years with stem 병(2) or 신(7): 인월 starts with 경(6)
  // Years with stem 정(3) or 임(8): 인월 starts with 임(8)
  // Years with stem 무(4) or 계(9): 인월 starts with 갑(0)
  const bases = [2, 4, 6, 8, 0, 2, 4, 6, 8, 0];
  return bases[yearStemIdx];
}

// Get day pillar based on Julian Day Number
function getDayPillar(year: number, month: number, day: number) {
  const jd = toJulianDay(year, month, day);
  // Reference: JD 2451551 (Jan 7, 2000) = 甲子 (갑자, stem=0, branch=0)
  // Verified: 1994-02-16 = 계유(癸酉), diff=-2151 → stem=9, branch=9 ✓
  const refJD = 2451551;
  const diff = jd - refJD;
  const stemIdx = ((diff % 10) + 10) % 10;
  const branchIdx = ((diff % 12) + 12) % 12;
  return { stemIdx, branchIdx };
}

// Get hour pillar based on day stem and birth hour
function getHourPillar(dayStemIdx: number, hour: number) {
  // 12 two-hour periods: 자(23-1), 축(1-3), 인(3-5), 묘(5-7), 진(7-9), 사(9-11), 오(11-13), 미(13-15), 신(15-17), 유(17-19), 술(19-21), 해(21-23)
  let branchIdx: number;
  if (hour === 23 || hour < 1) branchIdx = 0;       // 자시
  else if (hour < 3) branchIdx = 1;                  // 축시
  else if (hour < 5) branchIdx = 2;                  // 인시
  else if (hour < 7) branchIdx = 3;                  // 묘시
  else if (hour < 9) branchIdx = 4;                  // 진시
  else if (hour < 11) branchIdx = 5;                 // 사시
  else if (hour < 13) branchIdx = 6;                 // 오시
  else if (hour < 15) branchIdx = 7;                 // 미시
  else if (hour < 17) branchIdx = 8;                 // 신시
  else if (hour < 19) branchIdx = 9;                 // 유시
  else if (hour < 21) branchIdx = 10;                // 술시
  else branchIdx = 11;                               // 해시

  // Hour stem cycle: days with stem 갑(0)/기(5): 자시=갑(0)
  // 을(1)/경(6): 자시=병(2), 병(2)/신(7): 자시=무(4)
  // 정(3)/임(8): 자시=경(6), 무(4)/계(9): 자시=임(8)
  const hourStemBases = [0, 2, 4, 6, 8, 0, 2, 4, 6, 8];
  const stemIdx = (hourStemBases[dayStemIdx] + branchIdx) % 10;

  return { stemIdx, branchIdx };
}

function makePillar(stemIdx: number, branchIdx: number) {
  return {
    heavenlyStem: HEAVENLY_STEMS[stemIdx],
    earthlyBranch: EARTHLY_BRANCHES[branchIdx],
    element: STEM_ELEMENTS[stemIdx],
    yin_yang: STEM_YIN_YANG[stemIdx],
  };
}

// Calculate lunar date (simplified approximation)
function getLunarDate(year: number, month: number, day: number): string {
  // Simplified: approximate lunar month (each lunar month ~29.53 days)
  const jd = toJulianDay(year, month, day);
  // New moon reference: JD 2451550.1 (Jan 6, 2000)
  const refNewMoon = 2451550.1;
  const lunarMonth = 29.53058867;
  const daysSinceRef = jd - refNewMoon;
  const lunarDayInCycle = ((daysSinceRef % lunarMonth) + lunarMonth) % lunarMonth;
  const lunarDay = Math.floor(lunarDayInCycle) + 1;
  
  // Approximate lunar month number
  const totalLunarMonths = Math.floor(daysSinceRef / lunarMonth);
  const lunarMonthNum = ((totalLunarMonths % 12) + 12) % 12 + 1;
  
  return `음력 ${lunarMonthNum}월 ${lunarDay}일`;
}

export interface SajuResult {
  yearPillar: ReturnType<typeof makePillar>;
  monthPillar: ReturnType<typeof makePillar>;
  dayPillar: ReturnType<typeof makePillar>;
  hourPillar: ReturnType<typeof makePillar>;
  dominantElement: string;
  elementBalance: Record<string, number>;
  dayMaster: string;
  lunarBirthDate: string;
}

export function calculateSaju(birthDate: string, birthTime: string): SajuResult {
  const [year, month, day] = birthDate.split("-").map(Number);
  const [hour, minute] = birthTime.split(":").map(Number);
  
  // Adjust for time zones - if time is near midnight, may shift day
  const adjustedHour = hour + (minute >= 30 ? 0.5 : 0);

  // Calculate pillars
  const { stemIdx: yearStemIdx, branchIdx: yearBranchIdx } = getYearPillar(year, month, day);
  
  const sajuMonthIdx = getSajuMonth(year, month, day);
  const monthStemBase = getMonthStemBase(yearStemIdx);
  const monthStemIdx = (monthStemBase + sajuMonthIdx) % 10;
  const monthBranchIdx = (sajuMonthIdx + 2) % 12; // Months start from 인(2)
  
  const { stemIdx: dayStemIdx, branchIdx: dayBranchIdx } = getDayPillar(year, month, day);
  const { stemIdx: hourStemIdx, branchIdx: hourBranchIdx } = getHourPillar(dayStemIdx, adjustedHour);

  const yearPillar = makePillar(yearStemIdx, yearBranchIdx);
  const monthPillar = makePillar(monthStemIdx, monthBranchIdx);
  const dayPillar = makePillar(dayStemIdx, dayBranchIdx);
  const hourPillar = makePillar(hourStemIdx, hourBranchIdx);

  // Calculate element balance (count all 8 characters)
  const elementCount: Record<string, number> = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
  for (const pillar of [yearPillar, monthPillar, dayPillar, hourPillar]) {
    elementCount[pillar.element] = (elementCount[pillar.element] || 0) + 1;
    // Also count from earthly branches
    const branchElem = BRANCH_ELEMENTS[EARTHLY_BRANCHES.indexOf(pillar.earthlyBranch)];
    if (branchElem) {
      elementCount[branchElem] = (elementCount[branchElem] || 0) + 1;
    }
  }

  // Dominant element
  const dominantElement = Object.entries(elementCount).sort((a, b) => b[1] - a[1])[0][0];

  // Rename keys to English for frontend charts
  const elementBalance: Record<string, number> = {
    목: elementCount.목,
    화: elementCount.화,
    토: elementCount.토,
    금: elementCount.금,
    수: elementCount.수,
  };

  const lunarBirthDate = getLunarDate(year, month, day);

  return {
    yearPillar,
    monthPillar,
    dayPillar,
    hourPillar,
    dominantElement,
    elementBalance,
    dayMaster: HEAVENLY_STEMS_SHORT[dayStemIdx],
    lunarBirthDate,
  };
}
