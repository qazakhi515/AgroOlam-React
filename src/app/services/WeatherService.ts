import axios from "axios";

export interface AgroOutbreakAlert {
  diseaseNameUz: string;
  diseaseNameEn: string;
  diseaseNameKo: string;
  pathogen: string;
  riskLevel: "high" | "medium" | "low";
  riskScore: number; // 0 - 100
  affectedCropsUz: string;
  affectedCropsEn: string;
  affectedCropsKo: string;
  conditionTriggerUz: string;
  conditionTriggerEn: string;
  conditionTriggerKo: string;
  urgencyAdviceUz: string;
  urgencyAdviceEn: string;
  urgencyAdviceKo: string;
  recommendedMedicines: {
    name: string;
    brand: string;
    activeSubstance: string;
    dosage: string;
    priceUzs: number;
    image: string;
  }[];
}

export interface DailyAgroForecast {
  date: string;
  dayNameUz: string;
  dayNameEn: string;
  dayNameKo: string;
  maxTemp: number;
  minTemp: number;
  humidity: number;
  rainProb: number;
  windSpeed: number;
  icon: string;
  primaryRiskUz: string;
  primaryRiskEn: string;
  primaryRiskKo: string;
  riskLevel: "high" | "medium" | "low";
}

export interface AgroWeatherData {
  regionId: string;
  city: string;
  cityUz: string;
  cityEn: string;
  cityKo: string;
  region: string;
  regionUz: string;
  regionEn: string;
  regionKo: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  rainProb: number;
  condition: string;
  conditionUz: string;
  conditionEn: string;
  conditionKo: string;
  icon: string;
  agroAdvice: string;
  agroAdviceUz: string;
  agroAdviceEn: string;
  agroAdviceKo: string;
  statusLevel: "optimal" | "warning" | "caution";
  lastUpdated: string;
  outbreakAlerts: AgroOutbreakAlert[];
  sevenDayForecast: DailyAgroForecast[];
}

export interface RegionMetadata {
  id: string;
  nameUz: string;
  nameEn: string;
  nameKo: string;
  regionUz: string;
  regionEn: string;
  regionKo: string;
  lat: number;
  lon: number;
}

export const UZBEKISTAN_AGRO_REGIONS: Record<string, RegionMetadata> = {
  andijan: {
    id: "andijan",
    nameUz: "Andijon",
    nameEn: "Andijan",
    nameKo: "안디잔",
    regionUz: "Farg'ona Vodiysi Issiqxonalar Hududi",
    regionEn: "Fergana Valley Greenhouse Belt",
    regionKo: "페르가나 분지 온실 집중 단지",
    lat: 40.7821,
    lon: 72.3442,
  },
  samarkand: {
    id: "samarkand",
    nameUz: "Samarqand",
    nameEn: "Samarkand",
    nameKo: "사마르칸트",
    regionUz: "Zarafshon Vodiysi Agro-Bog'lari",
    regionEn: "Zarafshan Valley Orchard & Farmland",
    regionKo: "자라프샨 과수 및 원예 농업 단지",
    lat: 39.6542,
    lon: 66.9597,
  },
  tashkent: {
    id: "tashkent",
    nameUz: "Toshkent",
    nameEn: "Tashkent",
    nameKo: "타슈켄트",
    regionUz: "Zangiota & Qibray Katta Issiqxonalari",
    regionEn: "Zangiata & Qibray Commercial Greenhouses",
    regionKo: "장기아타 및 키브라이 현대식 온실 단지",
    lat: 41.2995,
    lon: 69.2401,
  },
  bukhara: {
    id: "bukhara",
    nameUz: "Buxoro",
    nameEn: "Bukhara",
    nameKo: "부하라",
    regionUz: "G'arbiy Erta Hosil & Issiqxona Klasteri",
    regionEn: "Western Early Harvest & Greenhouse Cluster",
    regionKo: "서부 조기 수확 온실 클러스터",
    lat: 39.7747,
    lon: 64.4286,
  },
  surkhandarya: {
    id: "surkhandarya",
    nameUz: "Termiz (Surxondaryo)",
    nameEn: "Termez",
    nameKo: "테르메즈",
    regionUz: "Janubiy Subtropik Erta Sabzavotchilik",
    regionEn: "Southern Subtropical Early Vegetable Zone",
    regionKo: "남부 아열대 조기 채소 재배 단지",
    lat: 37.2242,
    lon: 67.2783,
  },
};

const DAY_NAMES_UZ = ["Yakshanba", "Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"];
const DAY_NAMES_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAY_NAMES_KO = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];

class WeatherService {
  /**
   * Evaluates agronomic disease risks based on temperature, humidity, and rain
   */
  public static calculateOutbreakRisks(
    temp: number,
    humidity: number,
    rainProb: number
  ): AgroOutbreakAlert[] {
    const alerts: AgroOutbreakAlert[] = [];

    // 1. Late Blight (Fitoftoroz) & Downy Mildew
    // Triggers: High Humidity (>75%) + Moderate Temperature (15-24°C)
    if (humidity >= 75 && temp >= 12 && temp <= 25) {
      const riskScore = Math.min(
        95,
        Math.round(55 + (humidity - 75) * 2 + (rainProb > 40 ? 15 : 5))
      );
      alerts.push({
        diseaseNameUz: "Fitoftoroz va Peronosporoz (Late Blight)",
        diseaseNameEn: "Late Blight & Downy Mildew",
        diseaseNameKo: "역병 및 노균병 (Phytophthora)",
        pathogen: "Phytophthora infestans & Pseudoperonospora cubensis",
        riskLevel: riskScore >= 80 ? "high" : "medium",
        riskScore,
        affectedCropsUz: "Pomidor, Kartoshka, Bodring, Baqlajon",
        affectedCropsEn: "Tomato, Potato, Cucumber, Eggplant",
        affectedCropsKo: "토마토, 감자, 오이, 가지",
        conditionTriggerUz: `Yuqori namlik (${humidity}%) + optimal harorat (${temp}°C)`,
        conditionTriggerEn: `High relative humidity (${humidity}%) + mild temp (${temp}°C)`,
        conditionTriggerKo: `고습도 (${humidity}%) 및 적정 온도 (${temp}°C)`,
        urgencyAdviceUz:
          "Zudlik bilan issiqxona darchalarini shamollating va kechki payt sug'orishni to'xtating. Zamburug' sporalarining unib chiqishi uchun ayni qulay sharoit. 24 soat ichida profilaktik purkash shart!",
        urgencyAdviceEn:
          "Ventilate greenhouses immediately and avoid evening irrigation. Ideal conditions for fungal sporulation. Apply preventive systemic fungicides within 24 hours!",
        urgencyAdviceKo:
          "온실 환기를 즉시 실시하고 야간 관수를 중단하세요. 포자 발아에 최적 조건이므로 24시간 내 예방 살균제를 살포하십시오!",
        recommendedMedicines: [
          {
            name: "Ridomil Gold MZ 68 WG",
            brand: "Syngenta",
            activeSubstance: "Mefenoksam 40 g/kg + Mankotseb 640 g/kg",
            dosage: "25g / 10L suv",
            priceUzs: 145000,
            image: "img/harvest.jpg",
          },
          {
            name: "Infinito 687.5 SC",
            brand: "Bayer",
            activeSubstance: "Propamokarb + Fluopikolid",
            dosage: "15ml / 10L suv",
            priceUzs: 180000,
            image: "img/agrolab.jpg",
          },
        ],
      });
    }

    // 2. Powdery Mildew (Un-shudring) & Rust
    // Triggers: Temperature (20-30°C) + Fluctuating Humidity (50-70%)
    if (temp >= 19 && temp <= 32 && humidity >= 45 && humidity <= 78) {
      const riskScore = Math.min(88, Math.round(50 + (temp - 19) * 2));
      alerts.push({
        diseaseNameUz: "Un-Shudring va Qo'ng'ir Dog'lanish (Powdery Mildew)",
        diseaseNameEn: "Powdery Mildew & Leaf Spot",
        diseaseNameKo: "흰가루병 및 갈색점무늬병",
        pathogen: "Erysiphe cichoracearum & Leveillula taurica",
        riskLevel: riskScore >= 75 ? "high" : "medium",
        riskScore,
        affectedCropsUz: "Bodring, Qovun, Uzum, Pomidor, Olma",
        affectedCropsEn: "Cucumber, Melon, Grape, Tomato, Apple",
        affectedCropsKo: "오이, 멜론, 포도, 토마토, 사과",
        conditionTriggerUz: `Mo''tadil iliq havo (${temp}°C) va quruq-nam oraliq iqlim`,
        conditionTriggerEn: `Warm conditions (${temp}°C) with fluctuating humidity`,
        conditionTriggerKo: `온난한 기온 (${temp}°C) 및 주야간 습도 교차`,
        urgencyAdviceUz:
          "Barg ustida oq unsimon g'ubor paydo bo'lish xavfi yuqori. Kasallik 3 kunda butun maydonga tarqaladi. Triazol guruhidagi dorilar bilan profilaktika qiling.",
        urgencyAdviceEn:
          "High risk of white powdery fungal coating. Spreads across whole crop canopy in 3 days. Preventive triazole application strongly advised.",
        urgencyAdviceKo:
          "잎 표면에 흰가루 균사체 급속 번식 위험. 3일 내 전면 확산 가능하므로 트리아졸계 살균제로 선제 방제하세요.",
        recommendedMedicines: [
          {
            name: "Topas 100 EC",
            brand: "Syngenta",
            activeSubstance: "Penkonazol 100 g/l",
            dosage: "5ml / 10L suv",
            priceUzs: 95000,
            image: "img/disease.jpg",
          },
          {
            name: "Skor 250 EC",
            brand: "Syngenta",
            activeSubstance: "Difenokonazol 250 g/l",
            dosage: "5ml / 10L suv",
            priceUzs: 110000,
            image: "img/harvest.jpg",
          },
        ],
      });
    }

    // 3. Spider Mites & Thrips / Lepidoptera Pests
    // Triggers: Hot (>27°C) and Dry (Humidity < 50%)
    if (temp >= 26 && humidity < 55) {
      alerts.push({
        diseaseNameUz: "O'rgimchakkana va Pomidor Kuyasi (Spider Mite & Tuta)",
        diseaseNameEn: "Two-Spotted Spider Mite & Tuta Absoluta",
        diseaseNameKo: "점박이응애 및 토마토 가는나방",
        pathogen: "Tetranychus urticae & Tuta absoluta",
        riskLevel: temp >= 30 ? "high" : "medium",
        riskScore: Math.min(92, Math.round(60 + (temp - 26) * 3)),
        affectedCropsUz: "Pomidor, Bodring, Baqlajon, Qulupnay",
        affectedCropsEn: "Tomato, Cucumber, Eggplant, Strawberry",
        affectedCropsKo: "토마토, 오이, 가지, 딸기",
        conditionTriggerUz: `Issiq va quruq mikroiqlim (${temp}°C, ${humidity}% namlik)`,
        conditionTriggerEn: `Hot & dry microclimate (${temp}°C, ${humidity}% RH)`,
        conditionTriggerKo: `고온 건조 환경 (${temp}°C, 습도 ${humidity}%)`,
        urgencyAdviceUz:
          "Quruq issiqda kanalar 5 kunda yangi avlod beradi. Barg orqasidagi o'rgimchak to'rlarini tekshiring, havoni namlantiring va selektiv insektitsidlar seping.",
        urgencyAdviceEn:
          "Mite generations cycle every 5 days under hot dry canopy. Inspect leaf undersides, mist foliage, and spray selective acaricides/diamides.",
        urgencyAdviceKo:
          "고온 건조 시 응애 번식 주기 5일로 단축. 잎 뒷면 거미줄 점검 및 엽면 가습, 전문 살충제 살포 필요.",
        recommendedMedicines: [
          {
            name: "Ampligo 150 ZC",
            brand: "Syngenta",
            activeSubstance: "Xlorantraniliprol + Lyambda-tsigalotrin",
            dosage: "4ml / 10L suv",
            priceUzs: 85000,
            image: "img/agrolab.jpg",
          },
          {
            name: "Koragen 200 SC",
            brand: "FMC",
            activeSubstance: "Xlorantraniliprol 200 g/l",
            dosage: "3ml / 10L suv",
            priceUzs: 165000,
            image: "img/harvest.jpg",
          },
        ],
      });
    }

    // 4. Root Rot / Pythium / Black Leg (Salqin va ortiqcha namlik)
    if (temp <= 14 && humidity >= 70) {
      alerts.push({
        diseaseNameUz: "Ildiz Chirishi va Qora Oyoq (Pythium Root Rot)",
        diseaseNameEn: "Pythium Damping-Off & Root Rot",
        diseaseNameKo: "모잘록병 및 뿌리썩음병",
        pathogen: "Pythium debaryanum & Rhizoctonia solani",
        riskLevel: "medium",
        riskScore: 70,
        affectedCropsUz: "Ko'chatlar, Bodring, Pomidor, Qalampir",
        affectedCropsEn: "Seedlings, Cucumber, Tomato, Pepper",
        affectedCropsKo: "유묘, 오이, 토마토, 고추",
        conditionTriggerUz: `Salqin harorat (${temp}°C) va sovuq nam ildiz muhiti`,
        conditionTriggerEn: `Cold root zone (${temp}°C) and excessive moisture`,
        conditionTriggerKo: `저온 (${temp}°C) 및 과습한 토양 근권`,
        urgencyAdviceUz:
          "Ildiz tizimida havo yetishmasligi tufayli chirish xavfi. Tuproqni qizdirish, sug'orishni to'xtatish va Previkur Energy bilan tomchilatib sug'orish tavsiya etiladi.",
        urgencyAdviceEn:
          "Lack of root oxygenation triggers damping-off. Warm substrate, stop watering and drench with Previkur Energy.",
        urgencyAdviceKo:
          "뿌리 호흡 곤란으로 잘록병 유발. 난방 공급 및 관수 중단, 프리비커 관주 처리 권장.",
        recommendedMedicines: [
          {
            name: "Previkur Energy SL",
            brand: "Bayer",
            activeSubstance: "Propamokarb + Fosetil alyuminiy",
            dosage: "15ml / 10L suv",
            priceUzs: 135000,
            image: "img/disease.jpg",
          },
        ],
      });
    }

    return alerts;
  }

  /**
   * Fetch live weather and compute 7-day predictive agro-pathology risks
   */
  public static async getRegionalAgroWeather(
    regionId: string = "andijan"
  ): Promise<AgroWeatherData> {
    const region = UZBEKISTAN_AGRO_REGIONS[regionId] || UZBEKISTAN_AGRO_REGIONS.andijan;

    try {
      // High-resolution Agro forecast from Open-Meteo
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${region.lat}&longitude=${region.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,relative_humidity_2m_max,precipitation_probability_max,wind_speed_10m_max,weather_code&timezone=Asia%2FTashkent`;

      const res = await axios.get(url, { timeout: 4000 });

      if (res.data && res.data.current) {
        const cur = res.data.current;
        const temp = Math.round(cur.temperature_2m);
        const hum = Math.round(cur.relative_humidity_2m);
        const wind = Number(cur.wind_speed_10m.toFixed(1));

        const daily = res.data.daily || {};
        const dates: string[] = daily.time || [];
        const maxTemps: number[] = daily.temperature_2m_max || [];
        const minTemps: number[] = daily.temperature_2m_min || [];
        const humidities: number[] = daily.relative_humidity_2m_max || [];
        const rainProbs: number[] = daily.precipitation_probability_max || [];
        const windSpeeds: number[] = daily.wind_speed_10m_max || [];

        const currentRainProb = rainProbs.length > 0 ? rainProbs[0] : 10;

        // Calculate live disease alerts
        const outbreakAlerts = this.calculateOutbreakRisks(temp, hum, currentRainProb);

        let statusLevel: "optimal" | "warning" | "caution" = "optimal";
        let adviceUz = "Ob-havo qulay: ekinlar fotosintezi va meva o'sishi me'yorida davom etmoqda.";
        let adviceEn = "Optimal weather: crop photosynthesis and fruit development progressing smoothly.";
        let adviceKo = "최적 기상 조건: 작물 광합성 활발 및 정상 생육 진행 중.";

        let icon = "🌤️";
        let conditionUz = "Qulay iqlim";
        let conditionEn = "Favorable Climate";
        let conditionKo = "적정 기후";

        if (outbreakAlerts.some((a) => a.riskLevel === "high")) {
          statusLevel = "warning";
          icon = "⚠️";
          conditionUz = "Yuqori patologiya xavfi";
          conditionEn = "High Pathology Risk";
          conditionKo = "병해충 고위험";
          const highAlert = outbreakAlerts.find((a) => a.riskLevel === "high") || outbreakAlerts[0];
          adviceUz = highAlert.urgencyAdviceUz;
          adviceEn = highAlert.urgencyAdviceEn;
          adviceKo = highAlert.urgencyAdviceKo;
        } else if (hum >= 75) {
          statusLevel = "warning";
          icon = "💧";
          conditionUz = "Yuqori namlik";
          conditionEn = "High Humidity";
          conditionKo = "과습 주의";
          adviceUz = "Havoda namlik yuqori: Fitoftoroz va chirish kasalliklarining oldini olish uchun shamollatish zarur!";
          adviceEn = "High humidity detected: Ventilate greenhouse immediately to prevent late blight and fungal rots!";
          adviceKo = "높은 습도 감지: 역병 및 잿빛곰팡이병 예방을 위해 즉시 온실 환기 시설을 가동하세요!";
        } else if (temp <= 5) {
          statusLevel = "caution";
          icon = "❄️";
          conditionUz = "Sovuq havo oqimi";
          conditionEn = "Cold Air Wave";
          conditionKo = "저온 한파";
          adviceUz = "Qora sovuq xavfi: Isitish tizimlari va 3 qavatli salafan germetikligini tekshiring!";
          adviceEn = "Frost alert: Inspect heating systems and verify 3-layer film hermetic seal!";
          adviceKo = "서리 및 냉해 경보: 난방 설비를 점검하고 3중 온실 필름 밀폐 상태를 확인하세요!";
        } else if (wind >= 10) {
          statusLevel = "caution";
          icon = "💨";
          conditionUz = "Kuchli shamol";
          conditionEn = "Strong Winds";
          conditionKo = "강풍 주의";
          adviceUz = "Shamol plyonkalarni shikastlamasligi uchun ventilyatsiyani yoping va tirgovichlarni mustahkamlang!";
          adviceEn = "High winds: Close side vents and reinforce film anchors to prevent tearing!";
          adviceKo = "강풍 감지: 필름 파손 방지를 위해 측창을 닫고 온실 고정 밴드를 보강하세요!";
        } else {
          statusLevel = "optimal";
          icon = "☀️";
          conditionUz = "Quyoshli, optimal";
          conditionEn = "Sunny & Optimal";
          conditionKo = "맑음, 최적 생육";
        }

        // Build 7-day forecast
        const sevenDayForecast: DailyAgroForecast[] = dates.slice(0, 7).map((dStr, idx) => {
          const dObj = new Date(dStr);
          const dayIdx = dObj.getDay();
          const dayMax = maxTemps[idx] !== undefined ? Math.round(maxTemps[idx]) : temp;
          const dayMin = minTemps[idx] !== undefined ? Math.round(minTemps[idx]) : temp - 8;
          const dayHum = humidities[idx] !== undefined ? Math.round(humidities[idx]) : hum;
          const dayRain = rainProbs[idx] !== undefined ? Math.round(rainProbs[idx]) : 0;
          const dayWind = windSpeeds[idx] !== undefined ? Number((windSpeeds[idx] / 3.6).toFixed(1)) : wind;

          let dayRisk = "Xavfsiz";
          let dayRiskEn = "Low Risk";
          let dayRiskKo = "안전";
          let riskLvl: "high" | "medium" | "low" = "low";
          let dayIcon = "☀️";

          if (dayHum >= 80 || dayRain >= 60) {
            dayRisk = "Fitoftoroz (85%)";
            dayRiskEn = "Blight Outbreak (85%)";
            dayRiskKo = "역병 위험 (85%)";
            riskLvl = "high";
            dayIcon = "🌧️";
          } else if (dayMax >= 25 && dayHum >= 55) {
            dayRisk = "Un-shudring (65%)";
            dayRiskEn = "Powdery Mildew (65%)";
            dayRiskKo = "흰가루병 (65%)";
            riskLvl = "medium";
            dayIcon = "🌤️";
          } else if (dayMax >= 28) {
            dayRisk = "Zararkunanda/Kana (60%)";
            dayRiskEn = "Spider Mite (60%)";
            dayRiskKo = "응애 활성 (60%)";
            riskLvl = "medium";
            dayIcon = "☀️";
          }

          return {
            date: dStr,
            dayNameUz: DAY_NAMES_UZ[dayIdx],
            dayNameEn: DAY_NAMES_EN[dayIdx],
            dayNameKo: DAY_NAMES_KO[dayIdx],
            maxTemp: dayMax,
            minTemp: dayMin,
            humidity: dayHum,
            rainProb: dayRain,
            windSpeed: dayWind,
            icon: dayIcon,
            primaryRiskUz: dayRisk,
            primaryRiskEn: dayRiskEn,
            primaryRiskKo: dayRiskKo,
            riskLevel: riskLvl,
          };
        });

        return {
          regionId: region.id,
          city: region.nameUz,
          cityUz: region.nameUz,
          cityEn: region.nameEn,
          cityKo: region.nameKo,
          region: region.regionUz,
          regionUz: region.regionUz,
          regionEn: region.regionEn,
          regionKo: region.regionKo,
          temperature: temp,
          humidity: hum,
          windSpeed: wind,
          rainProb: currentRainProb,
          condition: conditionUz,
          conditionUz,
          conditionEn,
          conditionKo,
          icon,
          agroAdvice: adviceUz,
          agroAdviceUz: adviceUz,
          agroAdviceEn: adviceEn,
          agroAdviceKo: adviceKo,
          statusLevel,
          lastUpdated: new Date().toLocaleTimeString("uz-UZ", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          outbreakAlerts,
          sevenDayForecast,
        };
      }

      return this.getFallbackWeather(region);
    } catch (e) {
      return this.getFallbackWeather(region);
    }
  }

  /**
   * Backward-compatible helper for Andijan
   */
  public static async getAndijanAgroWeather(): Promise<AgroWeatherData> {
    return this.getRegionalAgroWeather("andijan");
  }

  /**
   * Robust offline fallback with simulated realistic meteorological values
   */
  private static getFallbackWeather(region: RegionMetadata): AgroWeatherData {
    const temp = region.id === "surkhandarya" ? 22 : region.id === "andijan" ? 18 : 19;
    const hum = region.id === "andijan" ? 82 : 65;
    const wind = 3.2;
    const rainProb = region.id === "andijan" ? 45 : 10;

    const outbreakAlerts = this.calculateOutbreakRisks(temp, hum, rainProb);

    const isWarning = hum >= 75;
    return {
      regionId: region.id,
      city: region.nameUz,
      cityUz: region.nameUz,
      cityEn: region.nameEn,
      cityKo: region.nameKo,
      region: region.regionUz,
      regionUz: region.regionUz,
      regionEn: region.regionEn,
      regionKo: region.regionKo,
      temperature: temp,
      humidity: hum,
      windSpeed: wind,
      rainProb,
      condition: isWarning ? "Yuqori namlik (Xavf)" : "Qulay iqlim",
      conditionUz: isWarning ? "Yuqori namlik (Xavf)" : "Qulay iqlim",
      conditionEn: isWarning ? "High Humidity (Risk)" : "Optimal Climate",
      conditionKo: isWarning ? "과습 주의 (위험)" : "적정 기후",
      icon: isWarning ? "💧" : "🌤️",
      agroAdvice: isWarning
        ? "⚠️ Havoda namlik yuqori: Pomidor va bodringda fitoftoroz va un-shudring xavfi 85%! Darchalarni ochib shamollating va Ridomil Gold purkash tavsiya etiladi."
        : "Ob-havo me'yorida: odatiy agrotexnik parvarish va tomchilatib sug'orishni davom ettirish mumkin.",
      agroAdviceUz: isWarning
        ? "⚠️ Havoda namlik yuqori: Pomidor va bodringda fitoftoroz va un-shudring xavfi 85%! Darchalarni ochib shamollating va Ridomil Gold purkash tavsiya etiladi."
        : "Ob-havo me'yorida: odatiy agrotexnik parvarish va tomchilatib sug'orishni davom ettirish mumkin.",
      agroAdviceEn: isWarning
        ? "⚠️ High humidity detected: 85% risk of blight and powdery mildew on tomatoes/cucumbers! Ventilate and apply Ridomil Gold."
        : "Weather is normal: standard agronomic care and drip irrigation may proceed.",
      agroAdviceKo: isWarning
        ? "⚠️ 높은 습도 감지: 토마토 및 오이 역병/흰가루병 발병 위험 85%! 온실 측창을 개방하여 환기하고 리도밀골드 살포를 권장합니다."
        : "기상 조건 양호: 통상적인 생육 관리 및 점적 관수를 지속하세요.",
      statusLevel: isWarning ? "warning" : "optimal",
      lastUpdated: new Date().toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" }),
      outbreakAlerts,
      sevenDayForecast: [
        {
          date: "2026-11-04",
          dayNameUz: "Ertaga",
          dayNameEn: "Tomorrow",
          dayNameKo: "내일",
          maxTemp: temp + 1,
          minTemp: temp - 9,
          humidity: hum + 2,
          rainProb: 35,
          windSpeed: 3.5,
          icon: "🌧️",
          primaryRiskUz: "Fitoftoroz xavfi (82%)",
          primaryRiskEn: "Blight Risk (82%)",
          primaryRiskKo: "역병 위험 (82%)",
          riskLevel: "high",
        },
        {
          date: "2026-11-05",
          dayNameUz: "Payshanba",
          dayNameEn: "Thursday",
          dayNameKo: "목요일",
          maxTemp: temp - 1,
          minTemp: temp - 8,
          humidity: 88,
          rainProb: 70,
          windSpeed: 4.2,
          icon: "🌧️",
          primaryRiskUz: "Yuqori Fitoftora (88%)",
          primaryRiskEn: "High Blight (88%)",
          primaryRiskKo: "역병 경보 (88%)",
          riskLevel: "high",
        },
        {
          date: "2026-11-06",
          dayNameUz: "Juma",
          dayNameEn: "Friday",
          dayNameKo: "금요일",
          maxTemp: temp + 2,
          minTemp: temp - 7,
          humidity: 70,
          rainProb: 20,
          windSpeed: 3.1,
          icon: "🌤️",
          primaryRiskUz: "Un-shudring (65%)",
          primaryRiskEn: "Powdery Mildew (65%)",
          primaryRiskKo: "흰가루병 (65%)",
          riskLevel: "medium",
        },
        {
          date: "2026-11-07",
          dayNameUz: "Shanba",
          dayNameEn: "Saturday",
          dayNameKo: "토요일",
          maxTemp: temp + 3,
          minTemp: temp - 6,
          humidity: 62,
          rainProb: 5,
          windSpeed: 2.8,
          icon: "☀️",
          primaryRiskUz: "Xavfsiz / Optimal",
          primaryRiskEn: "Optimal / Safe",
          primaryRiskKo: "안전 최적",
          riskLevel: "low",
        },
      ],
    };
  }
}

export default WeatherService;
