/**
 * Uzbekistan Official Agricultural Crops & Plant Pathology Database
 * Curated according to:
 * - O'zbekiston Respublikasi O'simliklar Karantini va Himoyasi Agentligi (karantin.uz)
 * - Davlat Kimyo Ro'yxati (Gosreestr 2024-2026)
 * - IFODA Agro Kimyo, Syngenta Uzbekistan, Bayer CropScience
 */

export interface AgroMedicine {
  id: string;
  name: string;
  brand: "Syngenta" | "Bayer" | "IFODA Agro" | "BASF" | "FMC" | "Bio-Tech";
  activeSubstance: string;
  formulation: string; // e.g. "WDG", "EC", "SC", "WP"
  category: "Fungitsid" | "Insektitsid" | "Bio-Preparat" | "Akaritsid" | "Bakteritsid";
  dosagePer10LWater: string;
  dosagePer10Sotix: string;
  preHarvestIntervalDays: number; // Kutish muddati (PHI)
  hazardClass: "II" | "III" | "IV (Organik)";
  priceUzsEstimate: number;
  inStockUzbekistan: boolean;
  description: string;
}

export interface CropDisease {
  code: string;
  nameUz: string;
  nameLat: string;
  category: "Zamburug'li" | "Bakterial" | "Zararkunanda" | "Virusli" | "Fiziologik";
  severityIndex: number; // 1-100
  urgencyLevel: "Yuqori Xavf" | "O'rtacha Xavf" | "Profilaktika";
  symptomsUz: string;
  tempOptimalAdvice: string;
  humidityOptimalAdvice: string;
  irrigationAdvice: string;
  treatmentsUz: string[];
  recommendedMedicineIds: string[];
}

export interface CropVariety {
  name: string;
  origin: "Gollandiya" | "O'zbekiston" | "Turkiya" | "Koreya" | "Yaponiya";
  type: "F1 Gibrid" | "Mahalliy Seleksiya";
  cycleDays: number;
  yieldPerHectareTons: string;
  keyResistance: string;
}

export interface UzbekistanCrop {
  id: string;
  slug: string;
  nameUz: string;
  nameRu: string;
  nameEn: string;
  latinName: string;
  growthType: "Issiqxona & Ochiq Dala" | "Asosan Issiqxona" | "Asosan Ochiq Dala";
  popularVarieties: CropVariety[];
  diseases: CropDisease[];
}

// --------------------------------------------------------------------------
// 1. MASTER REGISTERED MEDICINES IN UZBEKISTAN
// --------------------------------------------------------------------------
export const UZBEKISTAN_AGRO_MEDICINES: Record<string, AgroMedicine> = {
  ridomil_gold: {
    id: "ridomil_gold",
    name: "Ridomil Gold MZ 68 WG",
    brand: "Syngenta",
    activeSubstance: "Mefenoksam 40 g/kg + Mankotseb 640 g/kg",
    formulation: "Suvda eruvchan quruq granula (WDG)",
    category: "Fungitsid",
    dosagePer10LWater: "25 gramm",
    dosagePer10Sotix: "250 gramm (100L suvga)",
    preHarvestIntervalDays: 14,
    hazardClass: "III",
    priceUzsEstimate: 145000,
    inStockUzbekistan: true,
    description: "Fitoftora, peronosporoz va alternariozga qarshi tizimli va kontaktli universal fungitsid.",
  },
  infinito: {
    id: "infinito",
    name: "Infinito 687.5 SC",
    brand: "Bayer",
    activeSubstance: "Propamokarb gidroxlorid 625 g/l + Fluopikolid 62.5 g/l",
    formulation: "Suspenziya konsentrati (SC)",
    category: "Fungitsid",
    dosagePer10LWater: "15 ml",
    dosagePer10Sotix: "150 ml (100L suvga)",
    preHarvestIntervalDays: 14,
    hazardClass: "III",
    priceUzsEstimate: 180000,
    inStockUzbekistan: true,
    description: "Kartoshka va sabzavotlar fitoftoroziga qarshi uzoq muddatli kuchli translaminar himoya.",
  },
  topas_100: {
    id: "topas_100",
    name: "Topas 100 EC",
    brand: "Syngenta",
    activeSubstance: "Penkonazol 100 g/l",
    formulation: "Emulsiya konsentrati (EC)",
    category: "Fungitsid",
    dosagePer10LWater: "5 ml",
    dosagePer10Sotix: "40-50 ml",
    preHarvestIntervalDays: 5,
    hazardClass: "III",
    priceUzsEstimate: 95000,
    inStockUzbekistan: true,
    description: "Bodring, meva va poliz ekinlaridagi un-shudring (oq palak) zamburug'iga qarshi eng tezkor davolovchi vosita.",
  },
  previkur_energy: {
    id: "previkur_energy",
    name: "Previkur Energy",
    brand: "Bayer",
    activeSubstance: "Propamokarb 530 g/l + Fosetil 310 g/l",
    formulation: "Suvli konsentrat (SL)",
    category: "Fungitsid",
    dosagePer10LWater: "15 ml (tomchilatish orqali)",
    dosagePer10Sotix: "150-200 ml",
    preHarvestIntervalDays: 3,
    hazardClass: "III",
    priceUzsEstimate: 165000,
    inStockUzbekistan: true,
    description: "Ildiz chirishi, qora oyoqcha va peronosporozga qarshi ildiz orqali singuvchi kuchli stimulyator.",
  },
  entofito_super: {
    id: "entofito_super",
    name: "Ento-Fito Super",
    brand: "IFODA Agro",
    activeSubstance: "Mis xloroksid 90% asosi",
    formulation: "Xo'llanuvchi kukun (WP)",
    category: "Fungitsid",
    dosagePer10LWater: "25-30 gramm",
    dosagePer10Sotix: "250-300 gramm",
    preHarvestIntervalDays: 10,
    hazardClass: "III",
    priceUzsEstimate: 85000,
    inStockUzbekistan: true,
    description: "O'zbekistonda ishlab chiqarilgan, sabzavot va poliz ekinlaridagi zamburug'li dog'lanishlarga qarshi samarali.",
  },
  kocide_2000: {
    id: "kocide_2000",
    name: "Kosayd 2000 (Kocide)",
    brand: "Bio-Tech",
    activeSubstance: "Mis gidroksidi 538 g/kg",
    formulation: "Suvda eruvchan quruq granula",
    category: "Bakteritsid",
    dosagePer10LWater: "20 gramm",
    dosagePer10Sotix: "200 gramm",
    preHarvestIntervalDays: 10,
    hazardClass: "III",
    priceUzsEstimate: 110000,
    inStockUzbekistan: true,
    description: "Bakterial dog'lanish, vilt va kuymalarga qarshi eng zamonaviy bio-mavjud mis zarrachalari.",
  },
  xom_copper: {
    id: "xom_copper",
    name: "XOM (Mis Xloroksid 90%)",
    brand: "IFODA Agro",
    activeSubstance: "Mis xloroksidi 900 g/kg",
    formulation: "Xo'llanuvchi kukun (WP)",
    category: "Fungitsid",
    dosagePer10LWater: "25 gramm",
    dosagePer10Sotix: "250 gramm",
    preHarvestIntervalDays: 14,
    hazardClass: "III",
    priceUzsEstimate: 45000,
    inStockUzbekistan: true,
    description: "Klassik va tejamkor himoya vositasi, bakterial va zamburug'li infeksiyalarga qarshi qo'llaniladi.",
  },
  ampligo: {
    id: "ampligo",
    name: "Ampligo 150 ZC",
    brand: "Syngenta",
    activeSubstance: "Xlorantraniliprol 100 g/l + Lyambda-sigalotrin 50 g/l",
    formulation: "Mikrokapsulalangan suspenziya",
    category: "Insektitsid",
    dosagePer10LWater: "4 ml",
    dosagePer10Sotix: "30-40 ml",
    preHarvestIntervalDays: 14,
    hazardClass: "II",
    priceUzsEstimate: 120000,
    inStockUzbekistan: true,
    description: "Pomidor kuyasi (Tuta absoluta), karam kuyasi, tunlam va barg kemiruvchi barcha qurtlarga 100% zarba.",
  },
  koragen: {
    id: "koragen",
    name: "Koragen 200 SC",
    brand: "FMC",
    activeSubstance: "Xlorantraniliprol (Rynaxypyr) 200 g/l",
    formulation: "Suspenziya konsentrati (SC)",
    category: "Insektitsid",
    dosagePer10LWater: "2-3 ml",
    dosagePer10Sotix: "20 ml",
    preHarvestIntervalDays: 14,
    hazardClass: "III",
    priceUzsEstimate: 90000,
    inStockUzbekistan: true,
    description: "Kolorado qo'ng'izi, meva xo'ri va kapalak qurtlarini tuxumdan chiqish bosqichidayoq to'xtatuvchi jahon etaloni.",
  },
  fitosporin: {
    id: "fitosporin",
    name: "Fitosporin-M (Organik Bio)",
    brand: "Bio-Tech",
    activeSubstance: "Bacillus subtilis shtamm 26 D",
    formulation: "Suyuq bio-eritma / pasta",
    category: "Bio-Preparat",
    dosagePer10LWater: "15-20 ml",
    dosagePer10Sotix: "150 ml",
    preHarvestIntervalDays: 1,
    hazardClass: "IV (Organik)",
    priceUzsEstimate: 40000,
    inStockUzbekistan: true,
    description: "Ko'katlar va mevali ekinlar uchun 100% tabiiy va xavfsiz bio-fungitsid. Hosilni uzish kunida ham ishlatish mumkin.",
  },
  kumulus: {
    id: "kumulus",
    name: "Kumulus DF (Oltingugurt)",
    brand: "BASF",
    activeSubstance: "Oltingugurt (Sulfur) 800 g/kg",
    formulation: "Suvda oson eruvchan granula",
    category: "Akaritsid",
    dosagePer10LWater: "30-40 gramm",
    dosagePer10Sotix: "300 gramm",
    preHarvestIntervalDays: 4,
    hazardClass: "IV (Organik)",
    priceUzsEstimate: 55000,
    inStockUzbekistan: true,
    description: "Un-shudring va o'rgimchakkanaga qarshi ikkita ta'sirga ega tabiiy mineral fungitsid-akaritsid.",
  },
};

// --------------------------------------------------------------------------
// 2. 11 KEY CROPS IN UZBEKISTAN WITH POPULAR HYBRIDS & PATHOLOGIES
// --------------------------------------------------------------------------
export const UZBEKISTAN_CROPS: UzbekistanCrop[] = [
  // 1. POMIDOR
  {
    id: "tomato",
    slug: "pomidor",
    nameUz: "Pomidor",
    nameRu: "Томат / Помидор",
    nameEn: "Tomato",
    latinName: "Lycopersicon esculentum",
    growthType: "Issiqxona & Ochiq Dala",
    popularVarieties: [
      { name: "Sayxun F1", origin: "O'zbekiston", type: "F1 Gibrid", cycleDays: 70, yieldPerHectareTons: "90-110 t/ga", keyResistance: "Fitoftora, Mozaika" },
      { name: "Bobkat F1", origin: "Gollandiya", type: "F1 Gibrid", cycleDays: 65, yieldPerHectareTons: "85-100 t/ga", keyResistance: "Issiqlikka chidamli, Vilt" },
      { name: "Bella Rosa F1", origin: "Yaponiya", type: "F1 Gibrid", cycleDays: 75, yieldPerHectareTons: "100-120 t/ga", keyResistance: "Yorilishga va viruslarga chidamli" },
    ],
    diseases: [
      {
        code: "TOMATO_LATE_BLIGHT",
        nameUz: "Pomidor Fitoftorasi (Late Blight)",
        nameLat: "Phytophthora infestans",
        category: "Zamburug'li",
        severityIndex: 88,
        urgencyLevel: "Yuqori Xavf",
        symptomsUz: "Barg orqasida kulrang-oqish g'ubor, qora-jigarrang nekroz o'choqlari, mevalarning qattiq chirishi.",
        tempOptimalAdvice: "+24°C...+26°C (shamollatish)",
        humidityOptimalAdvice: "60% dan pastga tushirish",
        irrigationAdvice: "Faqat tomchilatib, bargni quruq holda sug'orish",
        treatmentsUz: [
          "Zararlangan pastki barglarni zudlik bilan kesib, issiqxonadan tashqarida yo'q qilish",
          "Ridomil Gold MZ 68 WG yoki Infinito 687.5 SC bilan 7 kun oralig'ida to'liq ishlov berish",
          "Kaliy-fosforli ozuqalar orqali o'simlik immunitetini oshirish",
        ],
        recommendedMedicineIds: ["ridomil_gold", "infinito", "entofito_super"],
      },
      {
        code: "TOMATO_TUTA_ABSOLUTA",
        nameUz: "Pomidor Kuyasi (Tuta Absoluta)",
        nameLat: "Tuta absoluta",
        category: "Zararkunanda",
        severityIndex: 92,
        urgencyLevel: "Yuqori Xavf",
        symptomsUz: "Barg to'qimasi orasida oqish 'minalar' (yo'laklar), meva bandi atrofida mayda teshiklar.",
        tempOptimalAdvice: "Feromon tutqichlar o'rnatish",
        humidityOptimalAdvice: "Issiqxona to'rlarini yopish (Anti-insect net)",
        irrigationAdvice: "Me'yorda sug'orish",
        treatmentsUz: [
          "Feromon va suvli tuzoqlar o'rnatib kapalaklarni tutish",
          "Ampligo 150 ZC yoki Koragen bilan tunlam qurtlariga qarshi purkash",
        ],
        recommendedMedicineIds: ["ampligo", "koragen"],
      },
    ],
  },

  // 2. BODRING
  {
    id: "cucumber",
    slug: "bodring",
    nameUz: "Bodring",
    nameRu: "Огурец",
    nameEn: "Cucumber",
    latinName: "Cucumis sativus",
    growthType: "Asosan Issiqxona",
    popularVarieties: [
      { name: "Mirabell F1", origin: "Gollandiya", type: "F1 Gibrid", cycleDays: 42, yieldPerHectareTons: "120-150 t/ga", keyResistance: "Kladosporioz, Un-shudring" },
      { name: "Bjorn F1", origin: "Gollandiya", type: "F1 Gibrid", cycleDays: 40, yieldPerHectareTons: "110-140 t/ga", keyResistance: "Qora dog'lanish, kuchli generativlik" },
      { name: "Orzu F1", origin: "O'zbekiston", type: "F1 Gibrid", cycleDays: 45, yieldPerHectareTons: "80-100 t/ga", keyResistance: "Mahalliy iqlimga moslashuvchan" },
    ],
    diseases: [
      {
        code: "CUCUMBER_POWDERY_MILDEW",
        nameUz: "Bodring Un-shudringi (Oq palak)",
        nameLat: "Podosphaera xanthii",
        category: "Zamburug'li",
        severityIndex: 68,
        urgencyLevel: "O'rtacha Xavf",
        symptomsUz: "Barg yuzasida un sepilgandek oppoq dog'lar, fotosintez to'xtashi va barglarning qovjirashi.",
        tempOptimalAdvice: "+25°C...+28°C",
        humidityOptimalAdvice: "55% - 60% me'yorida ushlash",
        irrigationAdvice: "Ildiz orqali iliq suv bilan sug'orish",
        treatmentsUz: [
          "Topas 100 EC bilan kechki payt profilaktik purkash",
          "Oltingugurtli Kumulus DF preparatidan me'yorida foydalanish",
        ],
        recommendedMedicineIds: ["topas_100", "kumulus", "previkur_energy"],
      },
      {
        code: "CUCUMBER_ROOT_ROT",
        nameUz: "Bodring Ildiz Chirishi (Fusarium)",
        nameLat: "Fusarium solani / Pythium",
        category: "Zamburug'li",
        severityIndex: 82,
        urgencyLevel: "Yuqori Xavf",
        symptomsUz: "Poya asosining qo'ng'irlashishi, kunduzi o'simlik so'lib kechasi tiklanishi, keyin butunlay qurishi.",
        tempOptimalAdvice: "Substrat haroratini +20°C dan tushirmaslik",
        humidityOptimalAdvice: "Ortiqcha zaxobni to'xtatish",
        irrigationAdvice: "Drenajni tozalash va EC ko'rsatkichini pasaytirish",
        treatmentsUz: [
          "Previkur Energy bilan ildiz zonasini sug'orish (har bir tupga 200ml eritma)",
          "Substratga biologik Triyodermin kiritish",
        ],
        recommendedMedicineIds: ["previkur_energy", "fitosporin"],
      },
    ],
  },

  // 3. BOLGAR QALAMPIRI
  {
    id: "bell_pepper",
    slug: "bolgar-qalampiri",
    nameUz: "Bolgar Qalampiri",
    nameRu: "Болгарский перец",
    nameEn: "Bell Pepper",
    latinName: "Capsicum annuum grossum",
    growthType: "Issiqxona & Ochiq Dala",
    popularVarieties: [
      { name: "Kredo F1", origin: "O'zbekiston", type: "F1 Gibrid", cycleDays: 70, yieldPerHectareTons: "45-60 t/ga", keyResistance: "Vertitsillyoz vilt" },
      { name: "Armada F1", origin: "Gollandiya", type: "F1 Gibrid", cycleDays: 75, yieldPerHectareTons: "70-90 t/ga", keyResistance: "Qalin devorli, transportbop" },
    ],
    diseases: [
      {
        code: "PEPPER_BACTERIAL_SPOT",
        nameUz: "Bolgar Qalampiri Bakterial Dog'lanishi",
        nameLat: "Xanthomonas vesicatoria",
        category: "Bakterial",
        severityIndex: 79,
        urgencyLevel: "Yuqori Xavf",
        symptomsUz: "Barglarda mayda qoramtir-suvli dog'lar, barglarning chetidan sarg'ayib so'lishi va to'kilishi.",
        tempOptimalAdvice: "+22°C...+25°C",
        humidityOptimalAdvice: "65% dan oshirmaslik",
        irrigationAdvice: "Tomchilatib, ildiz shamollatilishini oshirish",
        treatmentsUz: [
          "Kosayd 2000 (Kocide) yoki XOM preparati bilan 7 kun oraliqda purkash",
          "Kalsiy nitrat berib meva uchi chirishini (apikal chirish) oldini olish",
        ],
        recommendedMedicineIds: ["kocide_2000", "xom_copper", "previkur_energy"],
      },
    ],
  },

  // 4. ACHCHIQ QALAMPIR
  {
    id: "chili_pepper",
    slug: "achchiq-qalampir",
    nameUz: "Achchiq Qalampir",
    nameRu: "Острый перец",
    nameEn: "Chili Pepper",
    latinName: "Capsicum frutescens",
    growthType: "Issiqxona & Ochiq Dala",
    popularVarieties: [
      { name: "Uchqun", origin: "O'zbekiston", type: "Mahalliy Seleksiya", cycleDays: 80, yieldPerHectareTons: "25-35 t/ga", keyResistance: "Issiqqa va sho'rga chidamli" },
      { name: "Shakira F1", origin: "Gollandiya", type: "F1 Gibrid", cycleDays: 68, yieldPerHectareTons: "40-55 t/ga", keyResistance: "Virusli mozaika" },
    ],
    diseases: [
      {
        code: "CHILI_FUSARIUM",
        nameUz: "Qalampir Fuzarioz So'lishi",
        nameLat: "Fusarium oxysporum",
        category: "Zamburug'li",
        severityIndex: 75,
        urgencyLevel: "O'rtacha Xavf",
        symptomsUz: "Pastki barglarning to'satdan sarg'ayishi, poya kesilganda tomirlarning qorayishi.",
        tempOptimalAdvice: "+24°C",
        humidityOptimalAdvice: "60%",
        irrigationAdvice: "Ortiqcha suv to'planishini bartaraf etish",
        treatmentsUz: [
          "Previkur Energy bilan ildizdan ishlov berish",
          "Fitosporin bio-preparati bilan profilaktika qilish",
        ],
        recommendedMedicineIds: ["previkur_energy", "fitosporin", "xom_copper"],
      },
    ],
  },

  // 5. BAQLAJON
  {
    id: "eggplant",
    slug: "baqlajon",
    nameUz: "Baqlajon",
    nameRu: "Баклажан",
    nameEn: "Eggplant",
    latinName: "Solanum melongena",
    growthType: "Issiqxona & Ochiq Dala",
    popularVarieties: [
      { name: "Avitsenna", origin: "O'zbekiston", type: "Mahalliy Seleksiya", cycleDays: 85, yieldPerHectareTons: "50-65 t/ga", keyResistance: "Issiqqa chidamli" },
      { name: "Bibo F1 (Oq)", origin: "Gollandiya", type: "F1 Gibrid", cycleDays: 60, yieldPerHectareTons: "60-75 t/ga", keyResistance: "Kasalikklarga yuqori tolerantlik" },
    ],
    diseases: [
      {
        code: "EGGPLANT_VERTICILLIUM",
        nameUz: "Baqlajon Vertitsillyozi (Vilt)",
        nameLat: "Verticillium dahliae",
        category: "Zamburug'li",
        severityIndex: 85,
        urgencyLevel: "Yuqori Xavf",
        symptomsUz: "Barglarning V-simon sarg'ayishi, meva tugishning to'xtashi, ildiz bo'g'zining qurishi.",
        tempOptimalAdvice: "+25°C",
        humidityOptimalAdvice: "60%",
        irrigationAdvice: "Ildizga o'rtacha namlik ta'minlash",
        treatmentsUz: [
          "Previkur Energy va XOM bilan navbatma-navbat ishlov berish",
          "Kolorado qo'ng'izi va o'rgimchakkanaga qarshi Ampligo sepish",
        ],
        recommendedMedicineIds: ["previkur_energy", "ampligo", "xom_copper"],
      },
    ],
  },

  // 6. LOBIYA VA DUKKAKLILAR
  {
    id: "beans",
    slug: "lobiya",
    nameUz: "Lobiya va Dukkaklilar",
    nameRu: "Фасоль / Бобовые",
    nameEn: "Beans & Legumes",
    latinName: "Phaseolus vulgaris",
    growthType: "Asosan Ochiq Dala",
    popularVarieties: [
      { name: "Ravon", origin: "O'zbekiston", type: "Mahalliy Seleksiya", cycleDays: 65, yieldPerHectareTons: "3-4 t/ga", keyResistance: "Qurg'oqchilikka chidamli" },
    ],
    diseases: [
      {
        code: "BEANS_ANTHRACNOSE",
        nameUz: "Lobiya Antraknozi",
        nameLat: "Colletotrichum lindemuthianum",
        category: "Zamburug'li",
        severityIndex: 72,
        urgencyLevel: "O'rtacha Xavf",
        symptomsUz: "Barg tomirlarida va dukkaklarida chuqur qoramtir-qizil dog'lar, urug'larning nobud bo'lishi.",
        tempOptimalAdvice: "+20°C...+24°C",
        humidityOptimalAdvice: "Shamollatish",
        irrigationAdvice: "Bargni xo'llamasdan sug'orish",
        treatmentsUz: [
          "XOM yoki Ento-Fito Super bilan gullashgacha profilaktik purkash",
        ],
        recommendedMedicineIds: ["xom_copper", "entofito_super"],
      },
    ],
  },

  // 7. KO'KATLAR (KASHNICH & UKROP)
  {
    id: "herbs",
    slug: "kashnich-va-ukrop",
    nameUz: "Ko'katlar (Kashnich & Ukrop)",
    nameRu: "Зелень (Кинза и Укроп)",
    nameEn: "Herbs (Coriander & Dill)",
    latinName: "Coriandrum sativum / Anethum graveolens",
    growthType: "Issiqxona & Ochiq Dala",
    popularVarieties: [
      { name: "Orom (Ukrop)", origin: "O'zbekiston", type: "Mahalliy Seleksiya", cycleDays: 35, yieldPerHectareTons: "18-22 t/ga", keyResistance: "Tez urug'lamaydi, xushbo'y" },
      { name: "Yulduz (Kashnich)", origin: "O'zbekiston", type: "Mahalliy Seleksiya", cycleDays: 30, yieldPerHectareTons: "15-20 t/ga", keyResistance: "Sovuqqa chidamli" },
    ],
    diseases: [
      {
        code: "HERBS_FUSARIUM_ROT",
        nameUz: "Ko'katlar Fuzarioz Ildiz Chirishi",
        nameLat: "Fusarium spp.",
        category: "Zamburug'li",
        severityIndex: 60,
        urgencyLevel: "Profilaktika",
        symptomsUz: "Ildiz bo'g'zining ingichkalashishi va sarg'ayishi. Ko'katlarga kimyo sepilmaydi!",
        tempOptimalAdvice: "+18°C...+22°C",
        humidityOptimalAdvice: "50-60%",
        irrigationAdvice: "Ildiz orqali me'yorida sug'orish",
        treatmentsUz: [
          "Faqat 100% organik Fitosporin-M bio-preparati bilan sug'orish",
          "Urug'larni ekishdan oldin bio-stimulyator bilan zararsizlantirish",
        ],
        recommendedMedicineIds: ["fitosporin"],
      },
    ],
  },

  // 8. KARTOSHKA
  {
    id: "potato",
    slug: "kartoshka",
    nameUz: "Kartoshka",
    nameRu: "Картофель",
    nameEn: "Potato",
    latinName: "Solanum tuberosum",
    growthType: "Asosan Ochiq Dala",
    popularVarieties: [
      { name: "Sante", origin: "Gollandiya", type: "F1 Gibrid", cycleDays: 75, yieldPerHectareTons: "35-45 t/ga", keyResistance: "Fitoftora, Nematoda" },
      { name: "Arizona", origin: "Gollandiya", type: "F1 Gibrid", cycleDays: 70, yieldPerHectareTons: "40-50 t/ga", keyResistance: "Erta hosilli, yuqori tovar ko'rinishi" },
    ],
    diseases: [
      {
        code: "POTATO_LATE_BLIGHT",
        nameUz: "Kartoshka Fitoftorasi",
        nameLat: "Phytophthora infestans",
        category: "Zamburug'li",
        severityIndex: 90,
        urgencyLevel: "Yuqori Xavf",
        symptomsUz: "Barglarda suvli qoramtir dog'lar, pastki tomonda oq mog'or, tugunaklarning qattiq qo'ng'ir chirishi.",
        tempOptimalAdvice: "+18°C...+22°C",
        humidityOptimalAdvice: "Namlik 75% dan oshganda xavf yuqori",
        irrigationAdvice: "Egatlarni zaxlatmaslik",
        treatmentsUz: [
          "Ridomil Gold MZ yoki Infinito bilan profilaktik purkash",
          "Kolorado qo'ng'iziga qarshi Koragen 200 SC bilan aralashtirib ishlov berish",
        ],
        recommendedMedicineIds: ["ridomil_gold", "infinito", "koragen"],
      },
    ],
  },

  // 9. SARIMSOQ VA PIYOZ
  {
    id: "garlic_onion",
    slug: "sarimsoq-va-piyoz",
    nameUz: "Sarimsoq va Piyoz",
    nameRu: "Чеснок и Лук",
    nameEn: "Garlic & Onion",
    latinName: "Allium sativum / Allium cepa",
    growthType: "Asosan Ochiq Dala",
    popularVarieties: [
      { name: "Maykop (Sarimsoq)", origin: "O'zbekiston", type: "Mahalliy Seleksiya", cycleDays: 110, yieldPerHectareTons: "12-16 t/ga", keyResistance: "Qattiq sovuqqa chidamli" },
      { name: "Ravnaq (Piyoz)", origin: "O'zbekiston", type: "Mahalliy Seleksiya", cycleDays: 100, yieldPerHectareTons: "60-80 t/ga", keyResistance: "Uzoq saqlanuvchan" },
    ],
    diseases: [
      {
        code: "ALLIUM_PERONOSPORA",
        nameUz: "Piyoz va Sarimsoq Peronosporozi (Soxta un-shudring)",
        nameLat: "Peronospora destructor",
        category: "Zamburug'li",
        severityIndex: 78,
        urgencyLevel: "Yuqori Xavf",
        symptomsUz: "Patsimon barglarda och yashil cho'ziq dog'lar, kulrang-binafsharang g'ubor va patlarning sinishi.",
        tempOptimalAdvice: "+15°C...+20°C",
        humidityOptimalAdvice: "Barg ustidan sug'orishni to'xtatish",
        irrigationAdvice: "Egatlab sug'orish",
        treatmentsUz: [
          "Ridomil Gold yoki XOM bilan yopishqoq (prilipatel) qo'shib purkash",
        ],
        recommendedMedicineIds: ["ridomil_gold", "xom_copper"],
      },
    ],
  },

  // 10. KARAM
  {
    id: "cabbage",
    slug: "karam",
    nameUz: "Karam",
    nameRu: "Капуста",
    nameEn: "Cabbage",
    latinName: "Brassica oleracea",
    growthType: "Asosan Ochiq Dala",
    popularVarieties: [
      { name: "Farida F1", origin: "O'zbekiston", type: "F1 Gibrid", cycleDays: 55, yieldPerHectareTons: "45-55 t/ga", keyResistance: "Yorilishga chidamli erta pishar" },
      { name: "Rinda F1", origin: "Gollandiya", type: "F1 Gibrid", cycleDays: 85, yieldPerHectareTons: "80-100 t/ga", keyResistance: "Katta zich boshli, uzoq saqlanuvchan" },
    ],
    diseases: [
      {
        code: "CABBAGE_MOTH",
        nameUz: "Karam Kuyasi va Qurtlari (Cabbage Moth)",
        nameLat: "Plutella xylostella / Pieris brassicae",
        category: "Zararkunanda",
        severityIndex: 86,
        urgencyLevel: "Yuqori Xavf",
        symptomsUz: "Barglarda darchasimon teshiklar, barg skeletlanishi, karam boshining ichiga qurt kirib ifloslashi.",
        tempOptimalAdvice: "Qurtlar sonini muntazam monitoring qilish",
        humidityOptimalAdvice: "Optimal",
        irrigationAdvice: "Egatlab sug'orish",
        treatmentsUz: [
          "Ampligo 150 ZC yoki Koragen preparatlari bilan 10-14 kun oraliqda ishlov berish",
        ],
        recommendedMedicineIds: ["ampligo", "koragen"],
      },
    ],
  },

  // 11. REDISKA
  {
    id: "radish",
    slug: "rediska",
    nameUz: "Rediska",
    nameRu: "Редис",
    nameEn: "Radish",
    latinName: "Raphanus sativus",
    growthType: "Issiqxona & Ochiq Dala",
    popularVarieties: [
      { name: "Dungan", origin: "O'zbekiston", type: "Mahalliy Seleksiya", cycleDays: 25, yieldPerHectareTons: "20-25 t/ga", keyResistance: "Erta hosilli, po'kaklashmaydi" },
      { name: "Celesta F1", origin: "Gollandiya", type: "F1 Gibrid", cycleDays: 22, yieldPerHectareTons: "30-35 t/ga", keyResistance: "Yorilishga chidamli, yorqin qizil" },
    ],
    diseases: [
      {
        code: "RADISH_FLEA_BEETLE",
        nameUz: "Xochgullilar Burgachasi (Flea Beetle)",
        nameLat: "Phyllotreta cruciferae",
        category: "Zararkunanda",
        severityIndex: 70,
        urgencyLevel: "O'rtacha Xavf",
        symptomsUz: "Urug' unib chiqishi bilanoq mayda qora sakrovchi hasharotlar bargda mayda teshikchalar ochib quritishi.",
        tempOptimalAdvice: "+20°C",
        humidityOptimalAdvice: "Tuproq namligini yetarli saqlash (quruqda avj oladi)",
        irrigationAdvice: "Muntazam yengil sug'orish",
        treatmentsUz: [
          "Qisqa kutish muddatli bio-vositalar yoki zudlik bilan Fitosporin va Karate bilan ishlov berish",
        ],
        recommendedMedicineIds: ["fitosporin", "ampligo"],
      },
    ],
  },
];

export const UZBEKISTAN_CROPS_DATABASE = UZBEKISTAN_CROPS;

