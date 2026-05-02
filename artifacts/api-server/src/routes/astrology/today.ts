// Today's fortune calculation

const LUCKY_COLORS = ["보라색", "금색", "짙은 청색", "에메랄드 그린", "루비 레드", "백금", "코발트 블루", "앰버", "티파니 블루", "다크 로즈"];
const LUCKY_DIRECTIONS = ["북동쪽", "남서쪽", "동쪽", "서쪽", "북쪽", "남쪽", "남동쪽", "북서쪽"];

function seedRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0x100000000;
  };
}

const FORTUNE_TEMPLATES = {
  wealth: [
    { score: 80, description: "재물운이 강합니다. 투자나 사업 계획을 실행하기 좋은 날입니다. 예상치 못한 수입이 생길 수도 있습니다." },
    { score: 65, description: "재물운이 무난한 편입니다. 큰 지출은 피하고 현명한 소비를 유지하세요." },
    { score: 45, description: "재물 손실에 주의하세요. 충동 구매나 무리한 투자는 오늘 피하는 것이 좋습니다." },
    { score: 90, description: "최고의 재물운입니다. 오늘 시작하는 사업이나 계약은 좋은 결과를 가져옵니다." },
    { score: 55, description: "재물운이 보통입니다. 계획적인 소비와 저축에 집중하는 하루가 되세요." },
  ],
  career: [
    { score: 85, description: "직업운이 빛납니다. 중요한 프레젠테이션이나 미팅에서 좋은 결과를 기대할 수 있습니다." },
    { score: 70, description: "업무 능률이 높은 날입니다. 미뤄두었던 중요한 과제를 처리하기 좋습니다." },
    { score: 50, description: "직장에서 신중하게 행동하세요. 오해가 생기기 쉬운 날이므로 소통에 주의가 필요합니다." },
    { score: 78, description: "커리어 발전의 기회가 올 수 있습니다. 적극적으로 자신을 어필하세요." },
    { score: 60, description: "동료와의 협력이 중요한 날입니다. 팀워크를 강조하면 좋은 성과를 낼 수 있습니다." },
  ],
  love: [
    { score: 88, description: "연애운이 최고조입니다. 새로운 만남이나 기존 관계의 발전을 기대해보세요." },
    { score: 62, description: "감정 표현에 신중을 기하세요. 오늘은 듣는 것이 말하는 것보다 더 중요합니다." },
    { score: 75, description: "파트너와의 소통이 원활한 날입니다. 진심을 담은 대화로 더 깊은 유대를 쌓으세요." },
    { score: 48, description: "연애에서 갈등이 생기기 쉬운 날입니다. 감정을 조절하고 이해를 먼저 구하세요." },
    { score: 82, description: "매력이 넘치는 날입니다. 소개팅이나 사교 모임에 적극 참여하세요." },
  ],
  health: [
    { score: 78, description: "건강 상태가 양호합니다. 적당한 운동과 균형 잡힌 식사로 활력을 유지하세요." },
    { score: 55, description: "피로가 쌓이기 쉬운 날입니다. 충분한 휴식과 수분 섭취에 신경 쓰세요." },
    { score: 85, description: "에너지가 넘치는 날입니다. 새로운 운동을 시작하거나 활동적인 계획을 세워보세요." },
    { score: 40, description: "건강에 주의가 필요한 날입니다. 무리한 활동을 삼가고 몸의 신호에 귀를 기울이세요." },
    { score: 70, description: "전반적으로 건강한 하루가 될 것입니다. 명상이나 스트레칭으로 정신적 안정을 찾아보세요." },
  ],
};

const OVERALL_FORTUNES = [
  "오늘은 새로운 시작에 적합한 날입니다. 별자리와 사주의 기운이 당신에게 유리하게 작용하고 있으니 중요한 결정을 내리기에 좋은 시기입니다. 직감을 믿고 행동하세요.",
  "오늘은 내면의 성장과 성찰이 중요한 날입니다. 표면적인 성과보다 자신을 돌아보고 앞으로의 방향을 재정비하는 시간을 가져보세요.",
  "오늘은 인간관계에서 긍정적인 에너지가 흐릅니다. 중요한 만남이나 대화를 시도하기에 적합한 날이며, 진실한 소통이 좋은 결실을 맺을 것입니다.",
  "오늘은 창의성과 영감이 넘치는 날입니다. 예술적 활동이나 새로운 아이디어를 발전시키는 데 에너지를 쏟으면 뛰어난 성과를 낼 수 있습니다.",
  "오늘의 우주 에너지는 안정과 균형을 지향합니다. 급진적인 변화보다는 현재의 것을 다지고 완성하는 방향으로 집중하세요.",
  "행운의 별이 당신을 비추는 날입니다. 오랫동안 바라왔던 기회가 찾아올 수 있으니 눈을 크게 뜨고 주변을 살펴보세요.",
];

const ADVICES = [
  "오늘은 경청의 힘을 믿으세요. 말을 아끼고 귀를 열면 중요한 정보와 통찰을 얻게 됩니다.",
  "인내가 오늘의 키워드입니다. 성급한 결정보다 신중한 숙고가 더 나은 결과를 가져올 것입니다.",
  "감사함을 표현하는 하루가 되세요. 주변의 소중한 사람들에게 진심을 전하면 관계가 더욱 풍요로워집니다.",
  "직관을 신뢰하세요. 논리보다 마음이 이끄는 방향이 오늘은 더 옳은 선택일 수 있습니다.",
  "유연성이 오늘의 강점입니다. 예상치 못한 변화에 두려워하지 말고 흐름에 몸을 맡겨보세요.",
  "오늘은 창의적인 문제 해결을 시도해보세요. 틀을 깨는 아이디어가 훌륭한 해결책이 될 수 있습니다.",
];

const WARNINGS = [
  "오늘은 계약서나 중요 문서에 서명할 때 세심하게 검토하세요. 작은 부분이 큰 차이를 만들 수 있습니다.",
  "감정적인 언쟁을 피하세요. 오늘은 말이 상처가 되기 쉬우니 충분히 생각한 후 말하는 습관이 중요합니다.",
  "지나친 자신감은 금물입니다. 겸손함을 유지하고 타인의 조언에도 귀를 기울이세요.",
  "재정적인 충동 구매를 주의하세요. 오늘의 욕구가 내일의 후회가 될 수 있습니다.",
  "에너지 낭비를 조심하세요. 불필요한 논쟁이나 소모적인 상황에서 거리를 두는 것이 좋습니다.",
  "새로운 인연을 맺을 때 성급하게 신뢰를 주지 마세요. 시간을 두고 천천히 관계를 발전시키세요.",
];

export function generateTodayFortune(birthDate: string, birthTime: string) {
  const today = new Date();
  const dateStr = today.toISOString().split("T")[0];

  // Create a deterministic seed based on birth date + today
  const seedStr = birthDate + dateStr;
  let seed = 0;
  for (const char of seedStr) seed += char.charCodeAt(0);
  const rand = seedRandom(seed);

  const colorIdx = Math.floor(rand() * LUCKY_COLORS.length);
  const directionIdx = Math.floor(rand() * LUCKY_DIRECTIONS.length);
  const luckyNumber = Math.floor(rand() * 9) + 1;
  const overallIdx = Math.floor(rand() * OVERALL_FORTUNES.length);
  const adviceIdx = Math.floor(rand() * ADVICES.length);
  const warningIdx = Math.floor(rand() * WARNINGS.length);

  const wealthIdx = Math.floor(rand() * FORTUNE_TEMPLATES.wealth.length);
  const careerIdx = Math.floor(rand() * FORTUNE_TEMPLATES.career.length);
  const loveIdx = Math.floor(rand() * FORTUNE_TEMPLATES.love.length);
  const healthIdx = Math.floor(rand() * FORTUNE_TEMPLATES.health.length);

  return {
    date: dateStr,
    overall: OVERALL_FORTUNES[overallIdx],
    luckyColor: LUCKY_COLORS[colorIdx],
    luckyNumber,
    luckyDirection: LUCKY_DIRECTIONS[directionIdx],
    areas: {
      wealth: FORTUNE_TEMPLATES.wealth[wealthIdx],
      career: FORTUNE_TEMPLATES.career[careerIdx],
      love: FORTUNE_TEMPLATES.love[loveIdx],
      health: FORTUNE_TEMPLATES.health[healthIdx],
    },
    advice: ADVICES[adviceIdx],
    warningSign: WARNINGS[warningIdx],
  };
}
