// Interpretation engine for Saju & Vedic astrology analysis

import type { SajuResult } from "./saju";
import type { VedicResult } from "./vedic";

const ELEMENT_TRAITS: Record<string, { strengths: string[]; weaknesses: string[] }> = {
  목: {
    strengths: ["창의적이고 성장 지향적인 사고", "강한 추진력과 독립심", "인도력과 비전 제시 능력"],
    weaknesses: ["고집이 강해 유연성 부족", "충동적 결정 경향", "지나친 자기 주장"],
  },
  화: {
    strengths: ["열정적이고 카리스마 넘치는 성격", "빠른 통찰력과 판단력", "사람들을 이끄는 리더십"],
    weaknesses: ["충동적이고 감정 기복이 있음", "지구력 부족", "섣부른 판단"],
  },
  토: {
    strengths: ["안정적이고 신뢰할 수 있는 성격", "강한 책임감과 인내심", "현실적이고 실용적인 사고"],
    weaknesses: ["변화에 저항하는 경향", "지나치게 보수적", "고집스러움"],
  },
  금: {
    strengths: ["정확하고 분석적인 사고력", "결단력과 원칙 준수", "높은 기준과 완벽주의"],
    weaknesses: ["감정 표현이 서툴음", "완벽주의로 인한 스트레스", "냉철하고 차가울 수 있음"],
  },
  수: {
    strengths: ["직관력과 지혜가 뛰어남", "적응력과 유연한 사고", "깊은 통찰과 철학적 사고"],
    weaknesses: ["우유부단한 경향", "감정 조절의 어려움", "과도한 사색으로 실행력 부족"],
  },
};

const ELEMENT_CAREER: Record<string, string> = {
  목: "창의적인 분야, 교육, 법률, 의료, 사회적 영향력이 큰 직업에서 두각을 나타냅니다. 리더십이 요구되는 위치가 적합합니다.",
  화: "예술, 연예, 마케팅, 영업, 정치, 강의 등 사람들 앞에 서는 직업에서 빛을 발합니다. 열정을 쏟을 수 있는 분야를 찾는 것이 중요합니다.",
  토: "부동산, 금융, 농업, 관리직, 행정, 경영 분야에서 안정적으로 성과를 냅니다. 장기적인 프로젝트와 팀 관리에 강점이 있습니다.",
  금: "법조계, 군인, 경찰, 엔지니어링, 기술, 정밀 분야에서 탁월한 능력을 발휘합니다. 명확한 구조와 규칙이 있는 환경이 적합합니다.",
  수: "철학, 종교, 심리학, 연구, 작가, 예술가 등 내면 탐구와 관련된 분야에 재능이 있습니다. 자유롭고 창의적인 환경이 필요합니다.",
};

const ELEMENT_RELATIONSHIP: Record<string, string> = {
  목: "독립적인 성격으로 파트너에게 자유를 중시하며, 성장을 함께하는 관계를 원합니다. 지적 자극이 있는 파트너에게 끌립니다.",
  화: "뜨겁고 열정적인 사랑을 추구하며, 감정 표현이 솔직합니다. 흥미와 설레임이 지속되는 관계를 원합니다.",
  토: "안정적이고 헌신적인 관계를 추구합니다. 신뢰와 지속성을 중시하며, 가정을 중요하게 생각합니다.",
  금: "완벽한 파트너를 기대하는 경향이 있어 실망할 수 있습니다. 존경과 신뢰를 바탕으로 한 관계에서 오래 지속됩니다.",
  수: "감성적이고 영적인 연결을 중시합니다. 깊은 대화와 정신적 교감이 있는 관계를 원합니다.",
};

const ELEMENT_HEALTH: Record<string, string> = {
  목: "간과 담낭 건강에 주의하세요. 스트레스 관리와 규칙적인 운동이 중요합니다. 봄철 건강 관리에 특히 신경 쓰세요.",
  화: "심장과 혈관 건강을 주의해야 합니다. 지나친 흥분 상태를 피하고 충분한 휴식을 취하세요. 여름철 건강 관리가 중요합니다.",
  토: "소화기관과 비위 건강에 신경 쓰세요. 규칙적인 식사와 적절한 체중 관리가 필요합니다.",
  금: "폐와 대장 건강에 주의하세요. 호흡기 질환과 피부 트러블에 취약할 수 있습니다. 가을철 건강에 특히 주의하세요.",
  수: "신장과 방광, 뼈와 관절 건강에 신경 쓰세요. 충분한 수면과 수분 섭취가 중요합니다. 겨울철 건강 관리가 필요합니다.",
};

const DASHA_MEANINGS: Record<string, { theme: string; keywords: string[] }> = {
  Sun: { theme: "권위, 자아 확립, 리더십의 시기", keywords: ["명성", "리더십", "자기 표현", "권력"] },
  Moon: { theme: "감성, 직관, 가정과 내면 성장의 시기", keywords: ["직관", "감성", "가정", "창의성"] },
  Mars: { theme: "열정, 용기, 도전과 행동의 시기", keywords: ["용기", "행동", "경쟁", "성취"] },
  Mercury: { theme: "소통, 학습, 지적 성장의 시기", keywords: ["소통", "학습", "사업", "여행"] },
  Jupiter: { theme: "성장, 지혜, 번영과 행운의 시기", keywords: ["성장", "풍요", "지혜", "교육"] },
  Venus: { theme: "사랑, 예술, 물질적 풍요의 시기", keywords: ["사랑", "예술", "재물", "아름다움"] },
  Saturn: { theme: "인내, 책임, 시련과 성숙의 시기", keywords: ["인내", "책임", "규율", "성숙"] },
  Rahu: { theme: "변화, 야망, 새로운 방향으로의 전환 시기", keywords: ["변화", "야망", "혁신", "도전"] },
  Ketu: { theme: "영성, 해방, 내면 탐구와 정화의 시기", keywords: ["영성", "해방", "직관", "초연"] },
};

const LIFE_PATH_TEMPLATES: Record<string, string[]> = {
  목: [
    "당신의 삶은 끊임없는 성장과 변화를 통해 이루어집니다. 목(木) 기운이 강한 당신은 마치 나무가 하늘을 향해 뻗어 나가듯, 높은 이상과 목표를 향해 나아가는 삶을 살게 됩니다.",
    "창의성과 독창성이 당신의 최대 무기입니다. 고정된 틀에 얽매이지 않고 새로운 길을 개척하는 능력이 인생의 핵심 테마입니다.",
  ],
  화: [
    "열정과 빛으로 세상을 밝히는 것이 당신의 사명입니다. 화(火) 기운이 강한 당신은 강렬한 존재감으로 주변 사람들에게 영감과 에너지를 줍니다.",
    "순간의 열정을 지속적인 성과로 연결하는 법을 배우는 것이 삶의 핵심 과제입니다. 감정을 잘 다스릴수록 더 큰 성취를 이룰 수 있습니다.",
  ],
  토: [
    "안정과 신뢰를 바탕으로 착실히 쌓아 올리는 삶이 당신의 방식입니다. 토(土) 기운이 강한 당신은 중심을 잡고 모든 것을 아우르는 힘을 가지고 있습니다.",
    "급변하는 세상 속에서도 중심을 잃지 않는 것이 당신의 강점입니다. 꾸준함과 성실함이 결국 가장 큰 성공을 가져다 줍니다.",
  ],
  금: [
    "정밀함과 원칙으로 자신만의 세계를 구축하는 것이 당신의 삶입니다. 금(金) 기운이 강한 당신은 높은 기준과 완벽을 추구하며 탁월한 성과를 만들어냅니다.",
    "자신의 기준을 타인에게도 요구하는 경향이 있어 관계에서 마찰이 생길 수 있습니다. 유연성을 키우는 것이 삶의 균형을 이루는 열쇠입니다.",
  ],
  수: [
    "깊은 지혜와 직관으로 세상의 본질을 꿰뚫어 보는 것이 당신의 능력입니다. 수(水) 기운이 강한 당신은 물처럼 어디에나 스며들어 적응하는 놀라운 유연성을 가지고 있습니다.",
    "내면의 풍부한 감성과 철학적 사고가 당신을 특별하게 만듭니다. 직관을 믿고 행동으로 옮기는 용기가 필요합니다.",
  ],
};

// Generate daewoon list based on saju
function generateDaewoon(gender: string, yearStemYinYang: string, birthYear: number, birthMonth: number, birthDay: number): Array<{
  period: string; startAge: number; endAge: number; heavenlyStem: string; earthlyBranch: string; element: string; theme: string; keywords: string[];
}> {
  const STEMS = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"];
  const BRANCHES = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"];
  const BRANCH_ELEM = ["수", "토", "목", "목", "토", "화", "화", "토", "금", "금", "토", "수"];

  // Daewoon direction: male with yang year or female with yin year = forward; else backward
  const isYang = yearStemYinYang === "양";
  const isMale = gender === "male";
  const forward = (isMale && isYang) || (!isMale && !isYang);

  // Start from month pillar and advance/retreat by one unit per daewoon
  // We use month branch index as base
  const refMonthBranch = ((birthMonth - 1) + (birthDay >= 6 ? 1 : 0)) % 12;
  const refMonthStem = (birthYear * 12 + refMonthBranch) % 10;

  const startAgeBase = 5 + Math.floor(Math.random() * 4); // typically 3-8 years for first daewoon

  return Array.from({ length: 8 }, (_, i) => {
    const offset = forward ? i + 1 : -(i + 1);
    const stemIdx = ((refMonthStem + offset) % 10 + 10) % 10;
    const branchIdx = ((refMonthBranch + offset) % 12 + 12) % 12;
    const startAge = startAgeBase + i * 10;
    const endAge = startAge + 9;

    const dashaData = Object.values(DASHA_MEANINGS)[i % 9];

    return {
      period: `${startAge}~${endAge}세`,
      startAge,
      endAge,
      heavenlyStem: STEMS[stemIdx],
      earthlyBranch: BRANCHES[branchIdx],
      element: BRANCH_ELEM[branchIdx],
      theme: dashaData.theme,
      keywords: dashaData.keywords,
    };
  });
}

function getCurrentYearFortune(dominantElement: string, currentDasha: string): string {
  const year = new Date().getFullYear();
  const yearStemIdx = ((year - 1984) % 10 + 10) % 10;
  const STEMS_EN = ["목양", "목음", "화양", "화음", "토양", "토음", "금양", "금음", "수양", "수음"];
  const yearElement = STEMS_EN[yearStemIdx];

  const fortuneMap: Record<string, string> = {
    목: `${year}년은 목(木)의 해로, 성장과 새로운 시작의 에너지가 강합니다. 창의적 프로젝트와 새로운 인연이 찾아오는 시기입니다. ${currentDasha} 다샤의 영향으로 이 시기의 변화를 적극적으로 활용하세요.`,
    화: `${year}년은 적극적인 행동과 열정의 에너지가 넘치는 해입니다. 오래된 계획을 실행에 옮기기에 좋은 시기이며, 인간관계에서 새로운 만남이 풍성합니다.`,
    토: `${year}년은 안정과 기반을 다지는 중요한 해입니다. 부동산, 재테크, 경력 개발 등 장기적 투자와 계획을 세우기에 적합합니다. 꾸준한 노력이 좋은 결실을 맺습니다.`,
    금: `${year}년은 정밀함과 결단력이 요구되는 해입니다. 중요한 결정을 내려야 할 순간들이 찾아오며, 명확한 판단으로 성과를 거둘 수 있습니다. 건강 관리에도 특별히 신경 쓰세요.`,
    수: `${year}년은 지혜와 직관이 중요한 해입니다. 내면의 목소리에 귀를 기울이고, 배움과 여행, 영적 성장의 기회를 적극적으로 활용하세요.`,
  };

  return fortuneMap[dominantElement] ?? fortuneMap["목"];
}

function generateOverallScore(dayMaster: string, planets: VedicResult["planets"]): Record<string, number> {
  // Base scores with some variation based on planetary positions
  const baseScores = { wealth: 65, career: 70, love: 60, health: 65, luck: 68 };

  // Jupiter's position affects wealth and luck
  const jupiter = planets.find(p => p.name === "Jupiter");
  if (jupiter?.isExalted) { baseScores.wealth += 15; baseScores.luck += 12; }
  if (jupiter?.isDebilitated) { baseScores.wealth -= 10; baseScores.luck -= 8; }

  // Venus affects love
  const venus = planets.find(p => p.name === "Venus");
  if (venus?.isExalted) baseScores.love += 15;
  if (venus?.isDebilitated) baseScores.love -= 10;

  // Sun affects career
  const sun = planets.find(p => p.name === "Sun");
  if (sun?.isExalted) baseScores.career += 12;
  if (sun?.isDebilitated) baseScores.career -= 8;

  // Moon affects health and love
  const moon = planets.find(p => p.name === "Moon");
  if (moon?.isExalted) { baseScores.health += 10; baseScores.love += 8; }
  if (moon?.isDebilitated) { baseScores.health -= 8; baseScores.love -= 5; }

  // Clamp to 0-100
  return Object.fromEntries(
    Object.entries(baseScores).map(([k, v]) => [k, Math.max(20, Math.min(95, v))]
    )
  );
}

export interface InterpretationResult {
  strengths: string[];
  weaknesses: string[];
  lifePath: string;
  careerGuidance: string;
  relationshipStyle: string;
  healthAdvice: string;
  currentPeriodSummary: string;
  daewoonList: Array<{
    period: string; startAge: number; endAge: number;
    heavenlyStem: string; earthlyBranch: string; element: string;
    theme: string; keywords: string[];
  }>;
  currentYearFortune: string;
  overallScore: { wealth: number; career: number; love: number; health: number; luck: number };
}

export function generateInterpretation(
  saju: SajuResult,
  vedic: VedicResult,
  gender: string,
  birthDate: string,
): InterpretationResult {
  const [birthYear, birthMonth, birthDay] = birthDate.split("-").map(Number);
  const elem = saju.dominantElement;

  const elemTraits = ELEMENT_TRAITS[elem] ?? ELEMENT_TRAITS["목"];
  const lifePathTemplates = LIFE_PATH_TEMPLATES[elem] ?? LIFE_PATH_TEMPLATES["목"];

  // Extra strength from vedic exaltations
  const exaltedPlanets = vedic.planets.filter(p => p.isExalted).map(p => p.name);
  const extraStrengths: string[] = [];
  if (exaltedPlanets.includes("Jupiter")) extraStrengths.push("높은 지혜와 철학적 통찰력");
  if (exaltedPlanets.includes("Sun")) extraStrengths.push("강한 자아 정체성과 리더십");
  if (exaltedPlanets.includes("Venus")) extraStrengths.push("예술적 감각과 대인관계 능력");
  if (exaltedPlanets.includes("Moon")) extraStrengths.push("풍부한 감성과 직관력");
  if (exaltedPlanets.includes("Mercury")) extraStrengths.push("뛰어난 분석력과 소통 능력");

  const overallScore = generateOverallScore(saju.dayMaster, vedic.planets);

  const currentDashaInfo = DASHA_MEANINGS[vedic.dashaSystem.currentDasha] ?? DASHA_MEANINGS["Moon"];

  const currentPeriodSummary = `현재 베딕 점성술에서는 ${vedic.dashaSystem.currentDasha} 다샤(${vedic.dashaSystem.currentBhukti} 부크티) 기간입니다. 이 시기는 "${currentDashaInfo.theme}" 의 영향을 받으며, ${currentDashaInfo.keywords.join(", ")} 등의 주제가 부각됩니다. ${vedic.dashaSystem.dashaEndDate}까지 이 에너지가 지속됩니다. 사주의 ${elem}(木/水/火/金/土) 기운과 결합되어 이 시기는 특히 ${elem === "목" ? "성장과 도전" : elem === "화" ? "열정과 성취" : elem === "토" ? "안정과 기반" : elem === "금" ? "결단과 완성" : "지혜와 성찰"}의 기운이 강하게 작용합니다.`;

  const daewoonList = generateDaewoon(gender, saju.yearPillar.yin_yang, birthYear, birthMonth, birthDay);

  return {
    strengths: [...elemTraits.strengths, ...extraStrengths].slice(0, 5),
    weaknesses: elemTraits.weaknesses,
    lifePath: lifePathTemplates.join(" "),
    careerGuidance: ELEMENT_CAREER[elem] ?? "",
    relationshipStyle: ELEMENT_RELATIONSHIP[elem] ?? "",
    healthAdvice: ELEMENT_HEALTH[elem] ?? "",
    currentPeriodSummary,
    daewoonList,
    currentYearFortune: getCurrentYearFortune(elem, vedic.dashaSystem.currentDasha),
    overallScore: {
      wealth: overallScore.wealth,
      career: overallScore.career,
      love: overallScore.love,
      health: overallScore.health,
      luck: overallScore.luck,
    },
  };
}
