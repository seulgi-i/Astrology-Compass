// Vedic Astrology calculation engine (simplified sidereal calculations)

const ZODIAC_SIGNS = [
  "양자리(Aries)", "황소자리(Taurus)", "쌍둥이자리(Gemini)", "게자리(Cancer)",
  "사자자리(Leo)", "처녀자리(Virgo)", "천칭자리(Libra)", "전갈자리(Scorpio)",
  "사수자리(Sagittarius)", "염소자리(Capricorn)", "물병자리(Aquarius)", "물고기자리(Pisces)"
];

const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
  "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishtha", "Shatabhisha",
  "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

// Vimshottari dasha order and periods (years)
const DASHA_ORDER = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];
const DASHA_YEARS = [7, 20, 6, 10, 7, 18, 16, 19, 17];
const NAKSHATRA_DASHA_LORD: Record<string, string> = {
  "Ashwini": "Ketu", "Bharani": "Venus", "Krittika": "Sun", "Rohini": "Moon",
  "Mrigashira": "Mars", "Ardra": "Rahu", "Punarvasu": "Jupiter", "Pushya": "Saturn",
  "Ashlesha": "Mercury", "Magha": "Ketu", "Purva Phalguni": "Venus", "Uttara Phalguni": "Sun",
  "Hasta": "Moon", "Chitra": "Mars", "Swati": "Rahu", "Vishakha": "Jupiter",
  "Anuradha": "Saturn", "Jyeshtha": "Mercury", "Mula": "Ketu", "Purva Ashadha": "Venus",
  "Uttara Ashadha": "Sun", "Shravana": "Moon", "Dhanishtha": "Mars", "Shatabhisha": "Rahu",
  "Purva Bhadrapada": "Jupiter", "Uttara Bhadrapada": "Saturn", "Revati": "Mercury"
};

// Exaltation/Debilitation signs for planets (sidereal)
const PLANET_EXALTATION: Record<string, string> = {
  "Sun": "양자리(Aries)", "Moon": "황소자리(Taurus)", "Mars": "염소자리(Capricorn)",
  "Mercury": "처녀자리(Virgo)", "Jupiter": "게자리(Cancer)", "Venus": "물고기자리(Pisces)",
  "Saturn": "천칭자리(Libra)", "Rahu": "황소자리(Taurus)", "Ketu": "전갈자리(Scorpio)"
};
const PLANET_DEBILITATION: Record<string, string> = {
  "Sun": "천칭자리(Libra)", "Moon": "전갈자리(Scorpio)", "Mars": "게자리(Cancer)",
  "Mercury": "물고기자리(Pisces)", "Jupiter": "염소자리(Capricorn)", "Venus": "처녀자리(Virgo)",
  "Saturn": "양자리(Aries)", "Rahu": "전갈자리(Scorpio)", "Ketu": "황소자리(Taurus)"
};

// Julian Day calculation
function toJulianDay(year: number, month: number, day: number, hour = 0): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4)
    - Math.floor(y / 100) + Math.floor(y / 400) - 32045 + (hour - 12) / 24;
}

// Simplified mean longitude calculations (heliocentric, then convert)
// Days since J2000.0 = JD - 2451545.0
function getMeanSunLongitude(T: number): number {
  // T = Julian centuries since J2000.0
  const L0 = 280.46646 + 36000.76983 * T;
  const M = (357.52911 + 35999.05029 * T) * Math.PI / 180;
  const C = (1.914602 - 0.004817 * T) * Math.sin(M)
    + 0.019993 * Math.sin(2 * M)
    + 0.000289 * Math.sin(3 * M);
  return ((L0 + C) % 360 + 360) % 360;
}

function getMeanMoonLongitude(T: number): number {
  const L = 218.3164477 + 481267.88123421 * T;
  const M = (134.9633964 + 477198.8675055 * T) * Math.PI / 180;
  const Mp = (357.5291092 + 35999.0502909 * T) * Math.PI / 180;
  const D = (297.8501921 + 445267.1114034 * T) * Math.PI / 180;
  const F = (93.2720950 + 483202.0175233 * T) * Math.PI / 180;

  const lon = L
    + 6.288774 * Math.sin(M)
    + 1.274027 * Math.sin(2 * D - M)
    + 0.658314 * Math.sin(2 * D)
    + 0.213618 * Math.sin(2 * M)
    - 0.185116 * Math.sin(Mp)
    - 0.114332 * Math.sin(2 * F)
    + 0.058793 * Math.sin(2 * D - 2 * M);

  return ((lon % 360) + 360) % 360;
}

// Simplified planet mean longitudes
function getPlanetLongitudes(T: number): Record<string, number> {
  // Mean longitudes (very simplified)
  const planets: Record<string, number> = {
    Mercury: ((252.25032350 + 149472.67411175 * T) % 360 + 360) % 360,
    Venus:   ((181.97980085 + 58517.81538729 * T) % 360 + 360) % 360,
    Sun:     getMeanSunLongitude(T),
    Moon:    getMeanMoonLongitude(T),
    Mars:    ((355.43327 + 19140.30268 * T) % 360 + 360) % 360,
    Jupiter: ((34.33479 + 3034.90371 * T) % 360 + 360) % 360,
    Saturn:  ((50.07444 + 1222.11379 * T) % 360 + 360) % 360,
  };

  // Apply Lahiri ayanamsha correction (sidereal - tropical offset ~23.85° for year 2000, increases ~0.014°/yr)
  const ayanamsha = 23.85 + 0.014 * (T * 100); // rough approximation
  const result: Record<string, number> = {};
  for (const [planet, lon] of Object.entries(planets)) {
    result[planet] = ((lon - ayanamsha) % 360 + 360) % 360;
  }

  // Rahu (North Node) - moves retrograde
  result.Rahu = ((125.0445222 - 1934.136261 * T) % 360 + 360) % 360;
  result.Ketu = ((result.Rahu + 180) % 360 + 360) % 360;

  return result;
}

function getLongitudeSignAndDegree(longitude: number): { sign: string; house: number; degree: number } {
  const signIdx = Math.floor(longitude / 30);
  const degree = longitude % 30;
  return {
    sign: ZODIAC_SIGNS[signIdx] ?? ZODIAC_SIGNS[0],
    house: signIdx + 1,
    degree: Math.round(degree * 100) / 100,
  };
}

function getNakshatra(moonLon: number): string {
  const nakshatraSpan = 360 / 27; // 13.333...
  const idx = Math.floor(moonLon / nakshatraSpan);
  return NAKSHATRAS[idx % 27];
}

// Simplified ascendant calculation
function getAscendant(jd: number, latitude: number, longitude: number): number {
  // Sidereal time at Greenwich + location adjustment
  const T = (jd - 2451545.0) / 36525;
  const GMST = (280.46061837 + 360.98564736629 * (jd - 2451545) + 0.000387933 * T * T) % 360;
  const LST = ((GMST + longitude) % 360 + 360) % 360;

  // Simplified ascendant (tropical)
  const latRad = latitude * Math.PI / 180;
  const RAMC = LST * Math.PI / 180;
  const obliquity = (23.439291 - 0.013004 * T) * Math.PI / 180;

  const ascTan = Math.cos(RAMC) / (-Math.sin(RAMC) * Math.cos(obliquity) - Math.tan(latRad) * Math.sin(obliquity));
  let asc = (Math.atan(ascTan) * 180 / Math.PI + 360) % 360;

  // Adjust to correct quadrant
  if (Math.cos(RAMC) < 0) asc = (asc + 180) % 360;

  // Apply ayanamsha for sidereal
  const ayanamsha = 23.85 + 0.014 * (T * 100);
  return ((asc - ayanamsha) % 360 + 360) % 360;
}

// Parse location to approximate lat/lng
function parseLocation(birthPlace: string): { lat: number; lon: number } {
  const cityCoords: Record<string, { lat: number; lon: number }> = {
    "seoul": { lat: 37.5665, lon: 126.978 },
    "busan": { lat: 35.1796, lon: 129.0756 },
    "new york": { lat: 40.7128, lon: -74.006 },
    "london": { lat: 51.5074, lon: -0.1278 },
    "tokyo": { lat: 35.6762, lon: 139.6503 },
    "beijing": { lat: 39.9042, lon: 116.4074 },
    "mumbai": { lat: 19.0760, lon: 72.8777 },
    "paris": { lat: 48.8566, lon: 2.3522 },
    "los angeles": { lat: 34.0522, lon: -118.2437 },
    "chicago": { lat: 41.8781, lon: -87.6298 },
    "sydney": { lat: -33.8688, lon: 151.2093 },
    "toronto": { lat: 43.6532, lon: -79.3832 },
    "delhi": { lat: 28.6139, lon: 77.2090 },
    "shanghai": { lat: 31.2304, lon: 121.4737 },
    "singapore": { lat: 1.3521, lon: 103.8198 },
    "dubai": { lat: 25.2048, lon: 55.2708 },
    "berlin": { lat: 52.5200, lon: 13.4050 },
    "mexico city": { lat: 19.4326, lon: -99.1332 },
    "sao paulo": { lat: -23.5505, lon: -46.6333 },
    "moscow": { lat: 55.7558, lon: 37.6173 },
    "대구": { lat: 35.8714, lon: 128.6014 },
    "인천": { lat: 37.4563, lon: 126.7052 },
    "광주": { lat: 35.1595, lon: 126.8526 },
    "대전": { lat: 36.3504, lon: 127.3845 },
    "울산": { lat: 35.5384, lon: 129.3114 },
  };

  const lower = birthPlace.toLowerCase();
  for (const [city, coords] of Object.entries(cityCoords)) {
    if (lower.includes(city)) return coords;
  }

  // Default to Seoul if unknown
  if (lower.includes("korea") || lower.includes("한국") || lower.includes("남한")) {
    return { lat: 37.5665, lon: 126.978 };
  }

  // Generic default
  return { lat: 37.5665, lon: 126.978 };
}

// Calculate Vimshottari dasha for birth date
function calculateDasha(birthDate: string, nakshatra: string): { currentDasha: string; currentBhukti: string; dashaEndDate: string } {
  const today = new Date();
  const birth = new Date(birthDate);

  const dashaLord = NAKSHATRA_DASHA_LORD[nakshatra] ?? "Moon";
  const dashaIdx = DASHA_ORDER.indexOf(dashaLord);

  // Calculate elapsed years since birth
  const yearsElapsed = (today.getTime() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000);

  // Calculate which dasha period we're in
  let elapsed = 0;
  let currentDashaIdx = dashaIdx;
  let currentDashaYears = 0;

  for (let i = 0; i < 20; i++) {
    const idx = (dashaIdx + i) % 9;
    const years = DASHA_YEARS[idx];
    if (elapsed + years > yearsElapsed) {
      currentDashaIdx = idx;
      currentDashaYears = elapsed + years - yearsElapsed;
      break;
    }
    elapsed += years;
  }

  const currentDasha = DASHA_ORDER[currentDashaIdx];
  const dashaEndYear = today.getFullYear() + Math.floor(currentDashaYears);
  const dashaEndDate = `${dashaEndYear}-${String(today.getMonth() + 1).padStart(2, "0")}-01`;

  // Bhukti (sub-period) calculation
  const bhuktiLords = DASHA_ORDER.slice(currentDashaIdx).concat(DASHA_ORDER.slice(0, currentDashaIdx));
  const bhuktiDuration = DASHA_YEARS[currentDashaIdx] / 9;
  const daysInCurrentDasha = (yearsElapsed - (yearsElapsed - currentDashaYears + DASHA_YEARS[currentDashaIdx] - currentDashaYears)) * 365;
  const bhuktiIdx = Math.floor(((DASHA_YEARS[currentDashaIdx] - currentDashaYears) / DASHA_YEARS[currentDashaIdx]) * 9) % 9;
  const currentBhukti = bhuktiLords[bhuktiIdx] ?? bhuktiLords[0];

  return { currentDasha, currentBhukti, dashaEndDate };
}

export interface VedicResult {
  ascendant: string;
  moonSign: string;
  sunSign: string;
  nakshatra: string;
  dashaSystem: { currentDasha: string; currentBhukti: string; dashaEndDate: string };
  planets: Array<{
    name: string;
    sign: string;
    house: number;
    degree: number;
    isExalted: boolean;
    isDebilitated: boolean;
    nakshatra: string;
  }>;
  houseSignifications: Array<{ house: number; sign: string; planets: string[] }>;
}

export function calculateVedic(birthDate: string, birthTime: string, birthPlace: string): VedicResult {
  const [year, month, day] = birthDate.split("-").map(Number);
  const [hour, minute] = birthTime.split(":").map(Number);
  const hourDecimal = hour + minute / 60;

  const jd = toJulianDay(year, month, day, hourDecimal);
  const T = (jd - 2451545.0) / 36525;

  const { lat, lon } = parseLocation(birthPlace);
  const ascLon = getAscendant(jd, lat, lon);
  const { sign: ascSign } = getLongitudeSignAndDegree(ascLon);
  const ascSignIdx = Math.floor(ascLon / 30);

  const planetLons = getPlanetLongitudes(T);

  // Build planet list
  const planetNames = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  const planets = planetNames.map(name => {
    const lon = planetLons[name] ?? 0;
    const { sign, degree } = getLongitudeSignAndDegree(lon);
    // House = sign relative to ascendant
    const signIdx = Math.floor(lon / 30);
    const house = ((signIdx - ascSignIdx + 12) % 12) + 1;
    const nak = getNakshatra(lon);

    return {
      name,
      sign,
      house,
      degree,
      isExalted: PLANET_EXALTATION[name] === sign,
      isDebilitated: PLANET_DEBILITATION[name] === sign,
      nakshatra: nak,
    };
  });

  const moonPlanet = planets.find(p => p.name === "Moon");
  const sunPlanet = planets.find(p => p.name === "Sun");
  const moonNakshatra = moonPlanet?.nakshatra ?? "Ashwini";
  const moonSign = moonPlanet?.sign ?? ascSign;
  const sunSign = sunPlanet?.sign ?? ascSign;

  // Build house significations
  const houseSignifications = Array.from({ length: 12 }, (_, i) => {
    const houseNum = i + 1;
    const signIdx = (ascSignIdx + i) % 12;
    const sign = ZODIAC_SIGNS[signIdx];
    const planetsInHouse = planets.filter(p => p.house === houseNum).map(p => p.name);
    return { house: houseNum, sign, planets: planetsInHouse };
  });

  const dashaSystem = calculateDasha(birthDate, moonNakshatra);

  return {
    ascendant: ascSign,
    moonSign,
    sunSign,
    nakshatra: moonNakshatra,
    dashaSystem,
    planets,
    houseSignifications,
  };
}
