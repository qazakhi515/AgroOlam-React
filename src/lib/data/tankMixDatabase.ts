/**
 * AgroOlam Tank-Mix Chemical Compatibility Database & Evaluation Engine
 * Respublika qishloq xo'jaligida ro'yxatdan o'tgan fungitsidlar, insektitsidlar,
 * o'g'itlar va biologik preparatlarning o'zaro kimyoviy va biologik mosligi.
 */

export type ChemicalCategory = "fungicide" | "insecticide" | "fertilizer" | "bio" | "oil";
export type CompatibilityStatus = "compatible" | "caution" | "incompatible";
export type WalesOrder = "W" | "A" | "L" | "E" | "S";

export interface TankMixChemical {
  id: string;
  name: string;
  brand: string;
  category: ChemicalCategory;
  activeSubstance: string;
  formulation: string; // e.g. "WDG", "SC", "EC", "SL", "WP"
  walesStep: WalesOrder;
  walesDescriptionUz: string;
  walesDescriptionEn: string;
  walesDescriptionKo: string;
  phRange: string;
  inStockId?: string; // Links to product store if available
  notesUz: string;
  notesEn: string;
  notesKo: string;
}

export interface CompatibilityRule {
  chemA: string;
  chemB: string;
  status: CompatibilityStatus;
  titleUz: string;
  titleEn: string;
  titleKo: string;
  reasonUz: string;
  reasonEn: string;
  reasonKo: string;
  scientificDetailUz: string;
  scientificDetailEn: string;
  scientificDetailKo: string;
}

export interface TankMixPreset {
  id: string;
  titleUz: string;
  titleEn: string;
  titleKo: string;
  descriptionUz: string;
  descriptionEn: string;
  descriptionKo: string;
  chemicals: string[];
  expectedStatus: CompatibilityStatus;
}

export const TANK_MIX_CHEMICALS: Record<string, TankMixChemical> = {
  ridomil_gold: {
    id: "ridomil_gold",
    name: "Ridomil Gold MZ 68 WG",
    brand: "Syngenta",
    category: "fungicide",
    activeSubstance: "Mefenoksam 40 g/kg + Mankotseb 640 g/kg",
    formulation: "WDG (Suvda eruvchan quruq granula)",
    walesStep: "A",
    walesDescriptionUz: "Granulalarni avval ozroq suvda eritib, bochkaga 2-bo'lib quying",
    walesDescriptionEn: "Pre-dissolve dry granules and add 2nd to water tank",
    walesDescriptionKo: "과립제를 먼저 물에 녹여 탱크에 2번째로 투입",
    phRange: "6.0 - 7.0 (Neytral)",
    notesUz: "Fitoftora va peronosporozga qarshi tizimli fungitsid.",
    notesEn: "Systemic fungicide against late blight and downy mildew.",
    notesKo: "역병 및 노균병 전문 침투성 살균제.",
  },
  infinito: {
    id: "infinito",
    name: "Infinito 687.5 SC",
    brand: "Bayer",
    category: "fungicide",
    activeSubstance: "Propamokarb gidroxlorid 625 g/l + Fluopikolid 62.5 g/l",
    formulation: "SC (Suspenziya konsentrati)",
    walesStep: "L",
    walesDescriptionUz: "Suyuq suspenziyani 3-bo'lib bochkaga quying",
    walesDescriptionEn: "Add liquid suspension 3rd into water tank",
    walesDescriptionKo: "액상 수화제를 3번째로 투입",
    phRange: "5.5 - 6.5 (Kuchsiz kislotali)",
    notesUz: "Kartoshka va sabzavotlar fitoftoroziga translaminar himoya.",
    notesEn: "Translaminar protection for vegetables against Phytophthora.",
    notesKo: "채소류 역병 방제용 트랜스라미나 보호제.",
  },
  topas_100: {
    id: "topas_100",
    name: "Topas 100 EC",
    brand: "Syngenta",
    category: "fungicide",
    activeSubstance: "Penkonazol 100 g/l",
    formulation: "EC (Emulsiya konsentrati)",
    walesStep: "E",
    walesDescriptionUz: "Emulsiya konsentratini 4-bo'lib qo'shing",
    walesDescriptionEn: "Add emulsifiable concentrate 4th into tank",
    walesDescriptionKo: "유제를 4번째로 투입",
    phRange: "6.0 - 7.5",
    notesUz: "Un-shudring (o'rik, uzum, bodring, pomidor) kasalliklariga qarshi.",
    notesEn: "Specialized triazole against powdery mildew.",
    notesKo: "흰가루병 전문 트리아졸계 살균제.",
  },
  skor_250: {
    id: "skor_250",
    name: "Skor 250 EC",
    brand: "Syngenta",
    category: "fungicide",
    activeSubstance: "Difenokonazol 250 g/l",
    formulation: "EC (Emulsiya konsentrati)",
    walesStep: "E",
    walesDescriptionUz: "Emulsiya konsentratini 4-bo'lib qo'shing",
    walesDescriptionEn: "Add emulsifiable concentrate 4th into tank",
    walesDescriptionKo: "유제를 4번째로 투입",
    phRange: "6.0 - 7.5",
    notesUz: "Parsha, alternarioz va barg dog'lanishlariga qarshi keng ta'sirli.",
    notesEn: "Broad spectrum triazole for scab and leaf spots.",
    notesKo: "흑성병 및 점무늬병 전문 광범위 살균제.",
  },
  previkur_energy: {
    id: "previkur_energy",
    name: "Previkur Energy SL",
    brand: "Bayer",
    category: "fungicide",
    activeSubstance: "Propamokarb 530 g/l + Fosetil alyuminiy 310 g/l",
    formulation: "SL (Suvdagi eruvchan konsentrat)",
    walesStep: "S",
    walesDescriptionUz: "Suvli eritmani oxirida, bochka to'lishidan oldin qo'shing",
    walesDescriptionEn: "Add water-soluble liquid last before filling tank",
    walesDescriptionKo: "수용액을 마지막 단계에 투입",
    phRange: "4.5 - 5.5 (Kislotali muhit)",
    notesUz: "Ildiz chirishi va qora oyoqqa qarshi tomchilatib sug'orish va purkash vositasi.",
    notesEn: "Acidic formulation for root rot and pythium.",
    notesKo: "잘록병 및 뿌리썩음병 전문 수용성 살균제.",
  },
  xom_copper: {
    id: "xom_copper",
    name: "XOM (Mis Xloroksid 90% WP)",
    brand: "IFODA Agro",
    category: "fungicide",
    activeSubstance: "Mis xloroksidi 900 g/kg",
    formulation: "WP (Ho'llanuvchi kukun)",
    walesStep: "A",
    walesDescriptionUz: "Kukunni chelakda iliq suv bilan alohida eritib, 2-bo'lib quying",
    walesDescriptionEn: "Pre-mix wettable powder in bucket before pouring 2nd",
    walesDescriptionKo: "수화제를 별도 용기에서 완전히 푼 후 2번째로 투입",
    phRange: "7.0 - 8.0 (Kuchsiz ishqoriy)",
    notesUz: "Bakterioz va zamburug'larga qarshi kontakt mis preparati.",
    notesEn: "Contact copper fungicide/bactericide.",
    notesKo: "구리계 접촉성 살균/살균제.",
  },
  kocide_2000: {
    id: "kocide_2000",
    name: "Kosayd 2000 (Kocide 35 WG)",
    brand: "Bio-Tech",
    category: "fungicide",
    activeSubstance: "Mis gidroksid 350 g/kg",
    formulation: "WDG (Suvda eruvchan granula)",
    walesStep: "A",
    walesDescriptionUz: "Granulani eritmaga 2-bo'lib qo'shing",
    walesDescriptionEn: "Add copper granules 2nd into water tank",
    walesDescriptionKo: "구리계 입제를 2번째로 투입",
    phRange: "7.0 - 8.5 (Ishqoriy)",
    notesUz: "Bakterial nekroz va kuyishlarga qarshi yuqori faol mis preparati.",
    notesEn: "High-bioavailability copper hydroxide.",
    notesKo: "수산화제2구리 고효율 방제제.",
  },
  kumulus_df: {
    id: "kumulus_df",
    name: "Kumulus DF (Oltingugurt 80%)",
    brand: "BASF",
    category: "fungicide",
    activeSubstance: "Oltingugurt (Sulfur) 800 g/kg",
    formulation: "WDG (Suvda eruvchan granula)",
    walesStep: "A",
    walesDescriptionUz: "Oltingugurt granulasini 2-bo'lib bochkaga quying",
    walesDescriptionEn: "Add sulfur dry flowables 2nd into tank",
    walesDescriptionKo: "황 과립형제를 2번째로 투입",
    phRange: "6.5 - 7.5",
    notesUz: "Un-shudring va kanalarga qarshi kontaktli tabiiy mineral vosita.",
    notesEn: "Natural sulfur fungicide and acaricide against powdery mildew.",
    notesKo: "유황계 천연 흰가루병 및 응애 방제제.",
  },
  ampligo: {
    id: "ampligo",
    name: "Ampligo 150 ZC",
    brand: "Syngenta",
    category: "insecticide",
    activeSubstance: "Xlorantraniliprol 100 g/l + Lyambda-tsigalotrin 50 g/l",
    formulation: "ZC (Aralash suspenziya & mikrokapsula)",
    walesStep: "L",
    walesDescriptionUz: "Mikrokapsulali suspenziyani 3-bo'lib qo'shing",
    walesDescriptionEn: "Add microcapsule suspension 3rd into tank",
    walesDescriptionKo: "미세캡슐 액상수화제를 3번째로 투입",
    phRange: "5.5 - 7.0",
    notesUz: "Pomidor kuyasi (Tuta absoluta), ko'sak qurti va shiralarga qarshi 21 kunlik himoya.",
    notesEn: "Rapid knockdown & residual control against Tuta absoluta & lepidoptera.",
    notesKo: "토마토 가는나방 및 나방류 21일 지속 방제 살충제.",
  },
  koragen: {
    id: "koragen",
    name: "Koragen 200 SC",
    brand: "FMC",
    category: "insecticide",
    activeSubstance: "Xlorantraniliprol 200 g/l (Rynaxypyr)",
    formulation: "SC (Suspenziya konsentrati)",
    walesStep: "L",
    walesDescriptionUz: "Suspenziyani 3-bo'lib bochkaga quying",
    walesDescriptionEn: "Add suspension concentrate 3rd into tank",
    walesDescriptionKo: "액상 수화제를 3번째로 투입",
    phRange: "6.0 - 7.0",
    notesUz: "Kapalak qurtlari va zararkunandalarga qarshi yuqori xavfsiz selektiv insektitsid.",
    notesEn: "Selective anthranilic diamide insecticide for worms & borers.",
    notesKo: "디아마이드계 선택성 프리미엄 나방 살충제.",
  },
  aktara: {
    id: "aktara",
    name: "Aktara 25 WG",
    brand: "Syngenta",
    category: "insecticide",
    activeSubstance: "Tiametoksam 250 g/kg",
    formulation: "WG (Suvda eruvchan granula)",
    walesStep: "A",
    walesDescriptionUz: "Granulani ozroq suvda eritib 2-bo'lib quying",
    walesDescriptionEn: "Dissolve granules and add 2nd into tank",
    walesDescriptionKo: "입제를 물에 풀어 2번째로 투입",
    phRange: "6.0 - 7.5",
    notesUz: "Shira, oqqanot va tripslarga qarshi ildizdan va bargdan tizimli insektitsid.",
    notesEn: "Systemic neonicotinoid against aphids, whiteflies and thrips.",
    notesKo: "진딧물, 온실가루이, 총채벌레 침투이행성 살충제.",
  },
  bi_58: {
    id: "bi_58",
    name: "Bi-58 Noviy (Dimetoat 40%)",
    brand: "BASF",
    category: "insecticide",
    activeSubstance: "Dimetoat 400 g/l",
    formulation: "EC (Emulsiya konsentrati)",
    walesStep: "E",
    walesDescriptionUz: "Emulsiya konsentratini 4-bo'lib qo'shing",
    walesDescriptionEn: "Add emulsifiable concentrate 4th into tank",
    walesDescriptionKo: "유제를 4번째로 투입",
    phRange: "4.0 - 6.0 (Kislotali)",
    notesUz: "Fosfororganik tizimli va kontaktli insektitsid-akaritsid.",
    notesEn: "Organophosphate insecticide-acaricide sensitive to alkaline water.",
    notesKo: "유기인계 살충·살응애제 (알칼리수 분해 주의).",
  },
  kalsiy_selitrasi: {
    id: "kalsiy_selitrasi",
    name: "Kalsiy Selitrasi (Calcium Nitrate)",
    brand: "Yara / O'zkimyosanoat",
    category: "fertilizer",
    activeSubstance: "N: 15.5% + CaO: 26.5% (Eruvchan Kalsiy)",
    formulation: "SL (Suvda to'liq eruvchan granula)",
    walesStep: "S",
    walesDescriptionUz: "Suvdagi o'g'it eritmasini oxirgi bosqichda qo'shing",
    walesDescriptionEn: "Add dissolved fertilizer in the final stage",
    walesDescriptionKo: "완전 용해 후 마지막 단계에 투입",
    phRange: "5.5 - 6.5",
    notesUz: "Barg uchi chirishi (apical rot)ga qarshi kalsiy ozuqasi.",
    notesEn: "Soluble calcium for preventing blossom end rot.",
    notesKo: "배꼽썩음병 예방용 수용성 칼슘 비료.",
  },
  karbamid: {
    id: "karbamid",
    name: "Karbamid (Urea 46% N)",
    brand: "NavoiyAzot",
    category: "fertilizer",
    activeSubstance: "Azot (N) 46.2%",
    formulation: "SL (Suvda to'liq eruvchan)",
    walesStep: "S",
    walesDescriptionUz: "Karbamidni oldindan eritib oxirgi bosqichda qo'shing (0.3-0.5%)",
    walesDescriptionEn: "Dissolve urea and add in the final stage (0.3-0.5% max)",
    walesDescriptionKo: "요소를 물에 녹여 마지막에 첨가 (농도 0.3-0.5% 권장)",
    phRange: "6.5 - 7.5",
    notesUz: "Bargdan oziqlantiruvchi va pestitsid singishini kuchaytiruvchi vosita.",
    notesEn: "Foliar nitrogen and penetration enhancer.",
    notesKo: "엽면시비용 질소 및 약제 침투 촉진제.",
  },
  kaliy_monofosfat: {
    id: "kaliy_monofosfat",
    name: "Kaliy Monofosfat (MKP 0-52-34)",
    brand: "Haifa / EuroChem",
    category: "fertilizer",
    activeSubstance: "P2O5: 52% + K2O: 34%",
    formulation: "SL (Suvda eruvchan kukun)",
    walesStep: "S",
    walesDescriptionUz: "Eritib bochkaga eng oxirida qo'shing",
    walesDescriptionEn: "Dissolve and add at the final stage",
    walesDescriptionKo: "수용액을 최종 단계에 투입",
    phRange: "4.5 - 5.0 (Kislotali)",
    notesUz: "Meva tugish, shirinlik va ildiz tizimini baquvvat qiluvchi o'g'it.",
    notesEn: "High-phosphorus potassium fertilizer for fruit development.",
    notesKo: "착과 및 과실 비대용 고인산칼륨 비료.",
  },
  magniy_sulfat: {
    id: "magniy_sulfat",
    name: "Magniy Sulfat (Epsom tuzi)",
    brand: "K+S Minerals",
    category: "fertilizer",
    activeSubstance: "MgO: 16% + SO3: 32%",
    formulation: "SL (Suvda eruvchan kristall)",
    walesStep: "S",
    walesDescriptionUz: "Oxirgi bosqichda qo'shing",
    walesDescriptionEn: "Add in the final stage",
    walesDescriptionKo: "최종 단계에 투입",
    phRange: "6.5 - 7.0",
    notesUz: "Fotosintezni kuchaytiruvchi magniy va oltingugurt manbai.",
    notesEn: "Magnesium and sulfur source for chlorophyll synthesis.",
    notesKo: "엽록소 합성 촉진 마그네슘 황산염.",
  },
  gumik_kislota: {
    id: "gumik_kislota",
    name: "Gumat Kaliy + Hümik Kislotalar",
    brand: "Bio-Agro Organik",
    category: "fertilizer",
    activeSubstance: "Gumat tuzlari 80% + Fulvo kislotalar",
    formulation: "SL (Suyuq eritmali)",
    walesStep: "S",
    walesDescriptionUz: "Bochka to'lishidan oldin qo'shing",
    walesDescriptionEn: "Add before tank is fully topped up",
    walesDescriptionKo: "물 채우기 전 투입",
    phRange: "8.0 - 9.5 (Ishqoriy)",
    notesUz: "O'simlik stressini oluvchi va ildizni faollashtiruvchi tabiiy stimulyator.",
    notesEn: "Natural biostimulant for anti-stress and nutrient uptake.",
    notesKo: "스트레스 완화 및 양분 흡수 촉진 부식산 제제.",
  },
  fitosporin_m: {
    id: "fitosporin_m",
    name: "Fitosporin-M (Bio-Fungitsid)",
    brand: "Bio-Organik O'zbekiston",
    category: "bio",
    activeSubstance: "Tirik bakteriya: Bacillus subtilis 26 D (10^9 hujayra/g)",
    formulation: "Bio (Pasta / Suyuqlik)",
    walesStep: "S",
    walesDescriptionUz: "Iliq suvda (xlorlanmagan!) oldindan 1 soat ivitib, oxirida qo'shing",
    walesDescriptionEn: "Activate in non-chlorinated water 1h before adding last",
    walesDescriptionKo: "염소 없는 미온수에 1시간 활성화 후 마지막에 투입",
    phRange: "6.5 - 7.5 (Neytral)",
    notesUz: "Ekologik toza biologik vosita. Kimyoviy fungitsidlar bilan aralashtirilmaydi!",
    notesEn: "Live bio-control agent. Do not mix with chemical fungicides or copper!",
    notesKo: "생균 미생물 제제. 화학 살균제 및 동제 혼용 금지!",
  },
  preparat_30: {
    id: "preparat_30",
    name: "Preparat 30-Plyus (Mineral moy 76%)",
    brand: "NPP AgroHim",
    category: "oil",
    activeSubstance: "Vazelin moyi / Mineral neft moyi 760 g/kg",
    formulation: "EC (Konsentrat moy emulsiyasi)",
    walesStep: "E",
    walesDescriptionUz: "Bochkaga 4-bo'lib qo'shing va doimiy aralashtiring",
    walesDescriptionEn: "Add 4th into tank and maintain constant agitation",
    walesDescriptionKo: "유화제를 4번째로 투입하고 지속 교반",
    phRange: "6.5 - 7.5",
    notesUz: "Erta bahor va qishki qurt tuxumlari, qalqondorlarga qarshi mineral moy.",
    notesEn: "Dormant mineral oil against overwintering scales and mites.",
    notesKo: "월동 해충 및 깍지벌레 방제용 기계유유제.",
  },
  revus: {
    id: "revus",
    name: "Revus 250 SC",
    brand: "Syngenta",
    category: "fungicide",
    activeSubstance: "Mandipropamid 250 g/l",
    formulation: "SC (Suspenziya konsentrati)",
    walesStep: "L",
    walesDescriptionUz: "Suyuq suspenziyani 3-bo'lib quying",
    walesDescriptionEn: "Add liquid suspension 3rd into water tank",
    walesDescriptionKo: "액상 수화제를 3번째로 투입",
    phRange: "6.0 - 7.0",
    notesUz: "Fitoftora va peronosporozga qarshi LOK-FLOV tizimli himoya.",
    notesEn: "Mandipropamid against late blight and downy mildew.",
    notesKo: "역병 및 노균병 전문 만디프로파미드 살균제.",
  },
  quadris: {
    id: "quadris",
    name: "Quadris 250 SC",
    brand: "Syngenta",
    category: "fungicide",
    activeSubstance: "Azoksistrobin 250 g/l",
    formulation: "SC (Suspenziya konsentrati)",
    walesStep: "L",
    walesDescriptionUz: "Suspenziyani 3-bo'lib qo'shing",
    walesDescriptionEn: "Add suspension 3rd into tank",
    walesDescriptionKo: "액상 수화제를 3번째로 투입",
    phRange: "6.0 - 7.5",
    notesUz: "Universal strobilurin fungitsidi. Moyli preparatlar bilan qo'shilmaydi!",
    notesEn: "Broad-spectrum strobilurin. Never tank-mix with horticultural oils!",
    notesKo: "스트로빌루린계 광범위 살균제 (오일 혼용 절대 금지).",
  },
  luna_tranquility: {
    id: "luna_tranquility",
    name: "Luna Tranquility SC",
    brand: "Bayer",
    category: "fungicide",
    activeSubstance: "Fluopiram 125 g/l + Pirimetanil 375 g/l",
    formulation: "SC (Suspenziya konsentrati)",
    walesStep: "L",
    walesDescriptionUz: "Suspenziyani 3-bo'lib quying",
    walesDescriptionEn: "Add suspension 3rd into water tank",
    walesDescriptionKo: "액상 수화제를 3번째로 투입",
    phRange: "5.5 - 7.0",
    notesUz: "Kulrang chirish (Botrytis), oidium va parshaga qarshi tizimli kombinatsiya.",
    notesEn: "Dual active SDHI + anilinopyrimidine for Botrytis and powdery mildew.",
    notesKo: "잿빛곰팡이병 및 흰가루병 전문 종합 살균제.",
  },
  switch_62: {
    id: "switch_62",
    name: "Switch 62.5 WG",
    brand: "Syngenta",
    category: "fungicide",
    activeSubstance: "Tsiprodinil 375 g/kg + Flyudioksonil 250 g/kg",
    formulation: "WG (Suvda eruvchan granula)",
    walesStep: "A",
    walesDescriptionUz: "Granulani oldindan ozroq suvda eritib 2-bo'lib qo'shing",
    walesDescriptionEn: "Pre-dissolve granules and add 2nd into tank",
    walesDescriptionKo: "입제를 물에 풀어 2번째로 투입",
    phRange: "6.0 - 7.0",
    notesUz: "Meva va g'ujumlar chirishiga qarshi jahon standarti.",
    notesEn: "Dual-action contact and translaminar against fruit rots.",
    notesKo: "과실 썩음병 및 모닐리아 전문 프리미엄 수화제.",
  },
  bravo_500: {
    id: "bravo_500",
    name: "Bravo 500 SC",
    brand: "Syngenta",
    category: "fungicide",
    activeSubstance: "Xlorotalonil 500 g/l",
    formulation: "SC (Suspenziya konsentrati)",
    walesStep: "L",
    walesDescriptionUz: "Suspenziyani 3-bo'lib quying",
    walesDescriptionEn: "Add suspension 3rd into tank",
    walesDescriptionKo: "액상 수화제를 3번째로 투입",
    phRange: "6.5 - 7.5",
    notesUz: "Kuchli kontaktli himoya qatlami, fitoftora va alternariozga qarshi.",
    notesEn: "Multi-site contact protectant against blights.",
    notesKo: "광범위 접촉성 보호 살균제.",
  },
  proclaim: {
    id: "proclaim",
    name: "Proclaim 05 SG",
    brand: "Syngenta",
    category: "insecticide",
    activeSubstance: "Emamektin benzoat 50 g/kg",
    formulation: "SG (Eruvchan granula)",
    walesStep: "A",
    walesDescriptionUz: "Granulani 2-bo'lib qo'shing",
    walesDescriptionEn: "Add soluble granules 2nd into tank",
    walesDescriptionKo: "수용성 과립제를 2번째로 투입",
    phRange: "5.5 - 7.0",
    notesUz: "Tuta absoluta, g'o'za qurti va tunlamlarga qarshi translaminar zarba.",
    notesEn: "Bio-derived insecticide against leaf miners and caterpillars.",
    notesKo: "토마토 가는나방 및 나방 유충 전문 살충제.",
  },
  vertimek: {
    id: "vertimek",
    name: "Vertimec 018 EC",
    brand: "Syngenta",
    category: "insecticide",
    activeSubstance: "Abamektin 18 g/l",
    formulation: "EC (Emulsiya konsentrati)",
    walesStep: "E",
    walesDescriptionUz: "Emulsiya konsentratini 4-bo'lib qo'shing",
    walesDescriptionEn: "Add emulsifiable concentrate 4th into tank",
    walesDescriptionKo: "유제를 4번째로 투입",
    phRange: "6.0 - 7.5",
    notesUz: "O'rgimchakkana, zang kanasi va tripslarga qarshi tabiiy akaritsid.",
    notesEn: "Acaricide against two-spotted spider mites and thrips.",
    notesKo: "응애류 및 총채벌레 전문 천연 유래 살비제.",
  },
  envidor: {
    id: "envidor",
    name: "Envidor 240 SC",
    brand: "Bayer",
    category: "insecticide",
    activeSubstance: "Spirodiklofen 240 g/l",
    formulation: "SC (Suspenziya konsentrati)",
    walesStep: "L",
    walesDescriptionUz: "Suspenziyani 3-bo'lib quying",
    walesDescriptionEn: "Add suspension 3rd into tank",
    walesDescriptionKo: "액상 수화제를 3번째로 투입",
    phRange: "5.5 - 7.0",
    notesUz: "Barcha o'rgimchakkana turlarining tuxum va lichinkalariga 30 kunlik himoya.",
    notesEn: "Lipid biosynthesis inhibitor targeting all spider mite stages.",
    notesKo: "응애 전생육기 (알·유충·성충) 억제 프리미엄 살비제.",
  },
  teppeki: {
    id: "teppeki",
    name: "Teppeki 50 WG",
    brand: "Bio-Tech",
    category: "insecticide",
    activeSubstance: "Flonikamid 500 g/kg",
    formulation: "WG (Suvda eruvchan granula)",
    walesStep: "A",
    walesDescriptionUz: "Granulani 2-bo'lib qo'shing",
    walesDescriptionEn: "Add granules 2nd into tank",
    walesDescriptionKo: "과립제를 2번째로 투입",
    phRange: "6.0 - 7.5",
    notesUz: "Shira va oqqanotga qarshi tizimli antifeedant, foydali arilarga xavfsiz.",
    notesEn: "Selective antifeedant against aphids & whiteflies, pollinator-safe.",
    notesKo: "진딧물·가루이 전문 선택성 섭식저해제 (수정벌 안전).",
  },
  belt: {
    id: "belt",
    name: "Belt 480 SC",
    brand: "Bayer",
    category: "insecticide",
    activeSubstance: "Flyubendiamid 480 g/l",
    formulation: "SC (Suspenziya konsentrati)",
    walesStep: "L",
    walesDescriptionUz: "Suspenziyani 3-bo'lib quying",
    walesDescriptionEn: "Add suspension 3rd into tank",
    walesDescriptionKo: "액상 수화제를 3번째로 투입",
    phRange: "6.0 - 7.0",
    notesUz: "Barcha kapalak qurtlari va kuyalarga qarshi mushak blokatori.",
    notesEn: "Ryanodine receptor modulator against lepidopteran larvae.",
    notesKo: "나방 전문 근육 신경 차단 살충제.",
  },
  aliett: {
    id: "aliett",
    name: "Aliette 80 WG",
    brand: "Bayer",
    category: "fungicide",
    activeSubstance: "Fosetil-Al 800 g/kg",
    formulation: "WG (Suvda eruvchan granula)",
    walesStep: "A",
    walesDescriptionUz: "Granulani 2-bo'lib qo'shing. Mis va kislotali o'g'itlar bilan aralashtirmang!",
    walesDescriptionEn: "Add granules 2nd. Do not mix with copper or foliar fertilizers!",
    walesDescriptionKo: "2번째 투입. 구리제 및 엽면시비용 비료와 혼용 금지!",
    phRange: "3.5 - 4.5 (Kuchli kislotali)",
    notesUz: "Haqiqiy ikki tomonlama tizimli bakterioz va ildiz chirishi vositasi.",
    notesEn: "True two-way systemic fungicide/bactericide.",
    notesKo: "양방향 침투이행성 세균병 및 역병 방제제.",
  },
  kuporoksat: {
    id: "kuporoksat",
    name: "Cuproxat 345 SC",
    brand: "Bio-Tech",
    category: "fungicide",
    activeSubstance: "Uch asosli mis sulfati 345 g/l",
    formulation: "SC (Suyuq suspenziya konsentrati)",
    walesStep: "L",
    walesDescriptionUz: "Suyuq suspenziyani 3-bo'lib quying",
    walesDescriptionEn: "Add liquid suspension 3rd into water tank",
    walesDescriptionKo: "액상 수화제를 3번째로 투입",
    phRange: "6.5 - 7.5 (Neytral mis)",
    notesUz: "Mevali bog'lar va sabzavotlar uchun o'simlikni kuydirmaydigan suyuq mis.",
    notesEn: "Neutral liquid copper for fruit orchards and tender vegetables.",
    notesKo: "약해 없는 중성 액상 구리계 살균제.",
  },
};

/**
 * Agronomic Tank-Mix Pairwise Interaction Rules
 */
export const COMPATIBILITY_RULES: CompatibilityRule[] = [
  // 1. Copper + Sulfur = Severe Leaf Burn
  {
    chemA: "xom_copper",
    chemB: "kumulus_df",
    status: "incompatible",
    titleUz: "Fitotoksiklik: Mis va Oltingugurt Aralashmasi Xavfli!",
    titleEn: "Phytotoxicity: Copper + Sulfur Clash!",
    titleKo: "약해 발생: 구리제와 황제 혼용 절대 금지!",
    reasonUz: "Mis birikmalari oltingugurt bilan qo'shilganda qoramtir mis sulfid reaksiyasi sodir bo'ladi va o'simlik barglarini 100% kuydirib, mevalarni qora dog'lar bilan zararlaydi.",
    reasonEn: "Copper and sulfur react to form copper sulfide, causing severe foliar burn, leaf drop and black russeting on fruits.",
    reasonKo: "구리와 황 성분이 반응하여 황화구리를 형성, 잎 타들어감 및 과실 흑점 약해를 유발합니다.",
    scientificDetailUz: "Cu2+ + S2- -> CuS (Erimaydigan toksik cho'kma). Oraliq muddat: kamida 14-20 kun bo'lishi shart.",
    scientificDetailEn: "Cu2+ + S2- -> CuS (Toxic precipitate). Wait at least 14-20 days between sprays.",
    scientificDetailKo: "Cu2+ + S2- -> CuS (불용성 독성 침전). 살포 간격 최소 14~20일 유지 필수.",
  },
  {
    chemA: "kocide_2000",
    chemB: "kumulus_df",
    status: "incompatible",
    titleUz: "Fitotoksiklik: Kosayd (Mis) va Kumulus (Oltingugurt) Aralashmasi Xavfli!",
    titleEn: "Phytotoxicity: Kocide (Copper) + Sulfur Incompatible!",
    titleKo: "약해 주의: 코사이드(구리)와 유황 혼용 불가!",
    reasonUz: "Ishqoriy mis gidroksid oltingugurt bilan aralashganda kuchli issiqlik va zaharli sulfid birikmalari ajralib chiqadi.",
    reasonEn: "Alkaline copper hydroxide combined with colloidal sulfur causes scorching under sunlight.",
    reasonKo: "알칼리성 수산화동과 콜로이드 황 혼용 시 광화학 반응으로 잎 고사 위험.",
    scientificDetailUz: "Barg to'qimalarining nekroziga olib keladi. Birga sepish qat'iyan taqiqlanadi.",
    scientificDetailEn: "Causes acute leaf necrosis. Strictly prohibited in one spray tank.",
    scientificDetailKo: "급성 잎 괴사 유발. 단일 탱크 혼용 엄격 금지.",
  },

  // 2. Copper + Previkur Energy (Fosetyl-Al) = Acid/Base Crash
  {
    chemA: "xom_copper",
    chemB: "previkur_energy",
    status: "incompatible",
    titleUz: "Kimyoviy Parchalanish: Mis va Previkur Energy Mos Emas!",
    titleEn: "Chemical Degradation: Copper + Previkur Energy Incompatible!",
    titleKo: "화학적 분해: 동제와 프리비커 에너지 혼용 금지!",
    reasonUz: "Previkur Energy tarkibidagi Fosetil alyuminiy kuchli kislotali (pH ~4.5-5.0). Mis xloroksidi esa neytral-ishqoriy muhitda turishi kerak. Aralashganda eritmada mis ioni erkin ajralib barglarni qattiq kuydiradi.",
    reasonEn: "Fosetyl-Al in Previkur has an acidic pH (~4.5), which dissolves copper into free ionic Cu++, burning crop foliage rapidly.",
    reasonKo: "프리비커의 포세틸알루미늄은 강산성으로 구리를 유리 구리 이온으로 용출시켜 극심한 약해를 유발합니다.",
    scientificDetailUz: "pH tushishi natijasida erkin Cu2+ ionlari kritik chegaradan oshib ketadi.",
    scientificDetailEn: "Acid-driven ionization of copper creates toxic free ionic Cu++ levels.",
    scientificDetailKo: "pH 급감에 따른 유리 Cu2+ 농도 급상승으로 작물 독성 발생.",
  },
  {
    chemA: "kocide_2000",
    chemB: "previkur_energy",
    status: "incompatible",
    titleUz: "Kimyoviy Parchalanish: Kosayd va Previkur Mos Emas!",
    titleEn: "Chemical Incompatibility: Kocide + Previkur!",
    titleKo: "화학 반응 주의: 코사이드와 프리비커 혼용 불가!",
    reasonUz: "Kislotali Previkur va ishqoriy Kosayd bir-birining faolligini neytrallaydi va filtrni to'sib qo'yadigan shilimshiq cho'kma beradi.",
    reasonEn: "Acidic Previkur neutralizes copper hydroxide and causes rapid flocculation that clogs nozzles.",
    reasonKo: "산염기 중화 반응으로 노즐을 막는 슬러지 침전물이 발생합니다.",
    scientificDetailUz: "Purkagich filtrlarini tiqib qo'yadi va himoya samarasini 90% yo'qotadi.",
    scientificDetailEn: "Precipitates clog filtration systems and reduce fungicidal efficacy by 90%.",
    scientificDetailKo: "여과망 막힘 및 살균 효과 90% 이상 상실.",
  },

  // 3. Copper + Bio Agent (Fitosporin) = Bio Annihilation
  {
    chemA: "xom_copper",
    chemB: "fitosporin_m",
    status: "incompatible",
    titleUz: "Biologik Zarar: Mis Fitosporin Bakteriyalarini O'ldiradi!",
    titleEn: "Biocidal Inactivation: Copper Destroys Fitosporin Live Bacteria!",
    titleKo: "생균 사멸: 구리제가 피토스포린 유익균을 전멸시킵니다!",
    reasonUz: "Fitosporin-M tarkibidagi tirik Bacillus subtilis bakteriyalari mis ionlari ta'sirida 10 daqiqa ichida nobud bo'ladi. Biologik himoya samarasiz bo'ladi.",
    reasonEn: "Live Bacillus subtilis spores in Fitosporin are rapidly killed by bactericidal copper ions within minutes.",
    reasonKo: "피토스포린의 유익균(바실러스 서브틸리스)이 구리 이온의 살균력으로 전멸합니다.",
    scientificDetailUz: "Biologik preparatni sepishdan oldin yoki keyin kamida 7-10 kun kutilishi lozim.",
    scientificDetailEn: "Allow at least 7-10 days between bio-fungicides and copper treatments.",
    scientificDetailKo: "생물 농약과 동제 살포 간격은 최소 7~10일 이상 띄워야 합니다.",
  },
  {
    chemA: "kocide_2000",
    chemB: "fitosporin_m",
    status: "incompatible",
    titleUz: "Biologik Zarar: Kosayd Fitosporinni Foydasiz Qiladi!",
    titleEn: "Biocidal Clash: Kocide Kills Bio-Agent Bacteria!",
    titleKo: "생물 살균제 파괴: 코사이드가 미생물균을 불활성화합니다!",
    reasonUz: "Kosayd kuchli bakteritsid hisoblanadi va foydali bakteriyalarni bir zumda sterilizatsiya qiladi.",
    reasonEn: "Kocide is a strong bactericide that sterilizes all beneficial bio-control bacteria.",
    reasonKo: "강력한 살균 작용으로 유익 미생물을 즉시 불활성화시킵니다.",
    scientificDetailUz: "Biologik himoyaga ketgan mablag' havoga uchadi.",
    scientificDetailEn: "Wastes bio-control investment with zero residual biological efficacy.",
    scientificDetailKo: "미생물 방제 효과가 0이 됩니다.",
  },

  // 4. Sulfur + Mineral Oil = 100% Leaf Scorching
  {
    chemA: "kumulus_df",
    chemB: "preparat_30",
    status: "incompatible",
    titleUz: "HALOKATLI XAVF: Oltingugurt va Mineral Moyni Aslo Aralashtirmang!",
    titleEn: "CATASTROPHIC RISK: Never Mix Sulfur with Mineral Oils!",
    titleKo: "치명적 약해: 유황과 기계유유제 절대 혼용 금지!",
    reasonUz: "Oltingugurt mineral moy bilan qo'shilsa yoki moy sepilganidan keyin 21 kun ichida oltingugurt sepilsa, barg mum qavatini eritib, butun o'simlikni kuydirib, quritib tashlaydi!",
    reasonEn: "Mixing sulfur with petroleum/mineral oil dissolves the plant's cuticle wax layer, causing devastating plant death and foliage collapse.",
    reasonKo: "황과 광물성 오일이 결합하면 잎의 큐티클 왁스층을 녹여 잎 전체가 타죽는 괴사 피해를 입힙니다.",
    scientificDetailUz: "Oraliq muddat: Kamida 21–30 kun bo'lishi shart. Agro-qoidabuzarliklarning eng xavflisi!",
    scientificDetailEn: "Safety interval: Must wait 21 to 30 days between oil and sulfur applications.",
    scientificDetailKo: "안전 살포 간격: 오일과 황제 간 최소 21~30일 간격 필수 준수.",
  },

  // 5. Calcium Nitrate + Phosphates/Sulfates = Gypsum & Cludge Clog
  {
    chemA: "kalsiy_selitrasi",
    chemB: "kaliy_monofosfat",
    status: "incompatible",
    titleUz: "Cho'kma Xavfi: Kalsiy va Fosfat Suvda Erimaydigan Cho'kma Hosil Qiladi!",
    titleEn: "Precipitation Risk: Calcium + Phosphate Forms Insoluble Sludge!",
    titleKo: "침전 형성: 칼슘과 인산 혼용 시 불용성 침전물 발생!",
    reasonUz: "Kalsiy ioni erkin fosfat bilan qo'shilib suvda erimaydigan Kalsiy Fosfat (Ca3(PO4)2) hosil qiladi. U bochka tubida oq quyqa bo'lib qoladi va purkagich filtrlarini qattiq tiqadi.",
    reasonEn: "Free calcium binds with orthophosphate to create insoluble tricalcium phosphate, dropping out as chalky sludge that plugs filters and nozzles.",
    reasonKo: "칼슘과 인산이 결합하여 불용성 인산칼슘 침전물을 형성, 스프레이 노즐과 밸브를 막습니다.",
    scientificDetailUz: "3Ca2+ + 2PO4(3-) -> Ca3(PO4)2 (Cho'kma). O'g'itlar o'simlikka singmaydi.",
    scientificDetailEn: "3Ca2+ + 2PO4(3-) -> Ca3(PO4)2 (Precipitate). Nutrients become unavailable to the crop.",
    scientificDetailKo: "3Ca2+ + 2PO4(3-) -> Ca3(PO4)2 (침전). 양분이 불용화되어 흡수 불가.",
  },
  {
    chemA: "kalsiy_selitrasi",
    chemB: "magniy_sulfat",
    status: "incompatible",
    titleUz: "Cho'kma Xavfi: Kalsiy va Sulfat Gips Cho'kmasi Beradi!",
    titleEn: "Precipitation Risk: Calcium + Sulfate Forms Gypsum Sludge!",
    titleKo: "석고 침전 주의: 칼슘과 황산염 혼용 시 석고 침전!",
    reasonUz: "Kalsiy selitrasi magniy sulfat bilan aralashganda suvda kam eruvchan Kalsiy Sulfat (Gips - CaSO4) hosil bo'ladi. Nayzalar darhol tiqiladi.",
    reasonEn: "Calcium combines with sulfate to yield calcium sulfate (gypsum), which crystallizes in the tank and jams plumbing lines.",
    reasonKo: "칼슘과 황산염이 반응하여 석고(CaSO4) 결정을 형성, 관수 및 분무 라인을 막습니다.",
    scientificDetailUz: "Ca2+ + SO4(2-) -> CaSO4 (Gips). Alohida idishlarda eritib, turli kunlarda sepiladi.",
    scientificDetailEn: "Ca2+ + SO4(2-) -> CaSO4 (Gypsum). Apply on separate days or via dual-tank system.",
    scientificDetailKo: "Ca2+ + SO4(2-) -> CaSO4. 분리 탱크 시비 또는 시비 일자 분리 필요.",
  },

  // 6. Organophosphate (Bi-58) + Alkaline Copper = Rapid Hydrolysis
  {
    chemA: "bi_58",
    chemB: "xom_copper",
    status: "incompatible",
    titleUz: "Zaharlilikning Yo'qolishi: Bi-58 Ishqoriy Mis Bilan Parchalanadi!",
    titleEn: "Efficacy Loss: Bi-58 Hydrolyzes in Alkaline Copper Mix!",
    titleKo: "효능 상실: Bi-58 유기인계는 알칼리성 동제에서 급속 분해!",
    reasonUz: "Bi-58 (Dimetoat) kislotali muhitni yoqtiradi (pH 4.5-6.0). Ishqoriy mis xloroksidida bir necha daqiqada gidrolizlanib, hasharotlarga qarshi ta'sirini 80% yo'qotadi.",
    reasonEn: "Dimethoate rapidly hydrolyzes in alkaline pH (>7.0) provided by copper, losing 80% insecticidal power within minutes.",
    reasonKo: "디메토에이트는 알칼리수에서 급속 가수분해되어 살충력을 상실합니다.",
    scientificDetailUz: "Ishqoriy gidroliz natijasida preparat samarasiz suvga aylanadi.",
    scientificDetailEn: "Alkaline hydrolysis destroys the organophosphate active compound.",
    scientificDetailKo: "알칼리 가수분해로 유효 성분 파괴.",
  },

  // 7. SYNERGIES & HIGH COMPATIBILITY (Green Light)
  {
    chemA: "ridomil_gold",
    chemB: "ampligo",
    status: "compatible",
    titleUz: "A'lo Moslik: Fitoftoroz va Zararkunanda Qurtlarga Qarshi Kuchli Tank Aralashmasi",
    titleEn: "Super Synergy: Ridomil Gold + Ampligo (Blight + Worms)",
    titleKo: "완벽 혼용: 리도밀골드 + 앰플리고 (역병 & 나방 동시 방제)",
    reasonUz: "Ridomil Gold (WDG) va Ampligo (ZC) to'liq mos keladi. Bir vaqtning o'zida pomidor va kartoshkadagi fitoftoroz, alternarioz hamda ko'sak qurti, Tuta absoluta hasharotlarini bartaraf etadi.",
    reasonEn: "Ridomil Gold (WDG) and Ampligo (ZC) mix cleanly. Simultaneously controls late blight and lepidopteran pests with zero antagonism.",
    reasonKo: "리도밀골드와 앰플리고는 완벽히 혼용되어 역병과 나방류를 한 번에 방제합니다.",
    scientificDetailUz: "Aralashtirish tartibi: 1. Suv 60% -> 2. Ridomil Gold -> 3. Ampligo -> 4. Suv to'ldirish.",
    scientificDetailEn: "Mixing order: 1. Water 60% -> 2. Ridomil Gold -> 3. Ampligo -> 4. Top up water.",
    scientificDetailKo: "혼용 순서: 1. 물 60% -> 2. 리도밀골드 -> 3. 앰플리고 -> 4. 물 채우기.",
  },
  {
    chemA: "infinito",
    chemB: "koragen",
    status: "compatible",
    titleUz: "Xavfsiz Kombinatsiya: Infinito + Koragen",
    titleEn: "Safe Combination: Infinito + Koragen",
    titleKo: "안전 혼용: 인피니토 + 코라겐",
    reasonUz: "Sabzavotlarda fitoftora va kolorado qo'ng'izi, tunlamalarga qarshi eng xavfsiz va samarali suspenziya aralashmasi.",
    reasonEn: "Premier suspension mix for blight and caterpillars in nightshade crops.",
    reasonKo: "가지과 작물 역병 및 나방류 최고 안전성 조합.",
    scientificDetailUz: "Har ikkisi SC formulyatsiyasida bo'lib, bochkada oson tarqaladi.",
    scientificDetailEn: "Both are SC formulations that disperse smoothly with low risk of foaming.",
    scientificDetailKo: "둘 다 SC 제형으로 거품 없이 균일하게 분산됩니다.",
  },
  {
    chemA: "topas_100",
    chemB: "skor_250",
    status: "compatible",
    titleUz: "Kuchli Davolash Samerasi: Topas + Skor Triazol Majmuasi",
    titleEn: "Powerful Dual Triazole: Topas + Skor",
    titleKo: "상승 효과: 토파즈 + 스코어 혼용 (흰가루병 & 점무늬병)",
    reasonUz: "Penkonazol va Difenokonazol bir-birini to'ldiradi. Mevali bog'larda parsha, un-shudring va moniliozga qarshi kuchli davolovchi samara beradi.",
    reasonEn: "Penconazole and Difenoconazole complement each other for scab, powdery mildew and fruit rots.",
    reasonKo: "펜코나졸과 디페노코나졸이 상호 보완하여 흰가루병과 흑성병을 강력 치료합니다.",
    scientificDetailUz: "Formulyatsiyalar (EC + EC) bir xil va oson aralashadi.",
    scientificDetailEn: "EC + EC formulation blends cleanly without phase separation.",
    scientificDetailKo: "유제+유제 제형으로 층분리 없이 안정적 혼합.",
  },
  {
    chemA: "topas_100",
    chemB: "ampligo",
    status: "compatible",
    titleUz: "Universal Himoya: Topas + Ampligo",
    titleEn: "Universal Mix: Topas + Ampligo",
    titleKo: "만능 방제 조합: 토파즈 + 앰플리고",
    reasonUz: "Bodring va pomidorda un-shudring va shira, oqqanot zararkunandalariga qarshi bir paytda sepish xavfsiz.",
    reasonEn: "Safe tank mix against powdery mildew and whitefly/thrips.",
    reasonKo: "흰가루병과 진딧물/가루이 동시 방제에 안전한 조합.",
    scientificDetailUz: "Eritish tartibiga rioya qilinsa (L -> E), barqaror emulsiya hosil bo'ladi.",
    scientificDetailEn: "Add Ampligo (ZC) first, then Topas (EC) for stable emulsion.",
    scientificDetailKo: "앰플리고(ZC) 투입 후 토파즈(EC) 투입 시 안정적인 유제 형성.",
  },
  {
    chemA: "karbamid",
    chemB: "ampligo",
    status: "compatible",
    titleUz: "Singishni Kuchaytiruvchi: Karbamid (0.3%) + Ampligo",
    titleEn: "Penetration Booster: Urea (0.3%) + Ampligo",
    titleKo: "흡수 촉진 조합: 요소(0.3%) + 앰플리고",
    reasonUz: "Kam dozadagi karbamid barg kutilulasini yumshatib, Ampligo preparatining zararkunandalarga tez yetib borishini ta'minlaydi va o'simlikni oziqlantiradi.",
    reasonEn: "Mild urea softens the foliar cuticle, enhancing insecticide penetration and greening leaves.",
    reasonKo: "저농도 요소는 잎 큐티클을 부드럽게 하여 약제 침투율을 높입니다.",
    scientificDetailUz: "Karbamid miqdori 100 litr suvga 300–400 grammdan oshmasligi shart.",
    scientificDetailEn: "Do not exceed 300-400g urea per 100L water to avoid leaf tip burn.",
    scientificDetailKo: "물 100L당 요소 300~400g 이하 준수.",
  },
  {
    chemA: "kalsiy_selitrasi",
    chemB: "ampligo",
    status: "compatible",
    titleUz: "Oziqlantirish & Himoya: Kalsiy Selitrasi + Ampligo",
    titleEn: "Nutrient & Pest Control: Calcium Nitrate + Ampligo",
    titleKo: "칼슘 공급 & 살충: 질산칼슘 + 앰플리고",
    reasonUz: "Kalsiy selitrasi Ampligo bilan kimyoviy cho'kma hosil qilmaydi. Pomidorda meva uchi chirishi oldini olib, qurtlarga qarshi himoya qiladi.",
    reasonEn: "Calcium nitrate does not precipitate Ampligo. Safe combination for blossom end rot prevention and caterpillar control.",
    reasonKo: "질산칼슘과 앰플리고는 침전 없이 안전하게 혼용됩니다.",
    scientificDetailUz: "Avval Ampligo (ZC), keyin eritilgan kalsiy selitrasi qo'shiladi.",
    scientificDetailEn: "Add Ampligo first, then pre-dissolved calcium nitrate.",
    scientificDetailKo: "앰플리고 투입 후 용해된 질산칼슘 투입.",
  },
  {
    chemA: "gumik_kislota",
    chemB: "ridomil_gold",
    status: "compatible",
    titleUz: "Stressga Qarshi Kombinatsiya: Gumat Kaliy + Ridomil Gold",
    titleEn: "Anti-Stress Duo: Potassium Humate + Ridomil Gold",
    titleKo: "항스트레스 조합: 부식산칼륨 + 리도밀골드",
    reasonUz: "Gumat preparatlari o'simlikning zamburug'li kasallikdan keyingi stressini yengishga yordam beradi va immunitetni kuchaytiradi.",
    reasonEn: "Humates stimulate crop recovery from pathogen stress while Ridomil halts fungal spread.",
    reasonKo: "부식산이 병해 스트레스 회복을 돕고 리도밀이 균류를 차단합니다.",
    scientificDetailUz: "Aralashtirish xavfsiz, pH neytral darajada saqlanadi.",
    scientificDetailEn: "Safe mix, maintains neutral tank pH.",
    scientificDetailKo: "안전 혼용, 중성 pH 유지.",
  },
  {
    chemA: "kuporoksat",
    chemB: "kumulus_df",
    status: "incompatible",
    titleUz: "Fitotoksiklik: Cuproxat (Mis) va Kumulus (Oltingugurt) Aralashmasi Xavfli!",
    titleEn: "Phytotoxicity: Cuproxat (Copper) + Sulfur Incompatible!",
    titleKo: "약해 주의: 쿠프록사트(구리)와 유황 혼용 금지!",
    reasonUz: "Suyuq mis sulfat oltingugurt bilan qo'shilganda qora rangli toksik mis sulfid hosil qilib barglarni qattiq kuydiradi.",
    reasonEn: "Liquid copper sulfate with sulfur generates phytotoxic copper sulfide, leading to leaf scorching.",
    reasonKo: "액상 황산동과 황이 결합하여 황화구리를 형성, 극심한 약해 발생.",
    scientificDetailUz: "Cu2+ va S zarrachalari o'rtasidagi ekzotermik reaksiyani oldini olish uchun 15 kun oraliq saqlansin.",
    scientificDetailEn: "Maintain at least 15 days interval between applications.",
    scientificDetailKo: "최소 15일 이상의 살포 간격 필수.",
  },
  {
    chemA: "aliett",
    chemB: "kuporoksat",
    status: "incompatible",
    titleUz: "Kislotali Reaksiya: Aliette va Cuproxat (Mis) Mos Emas!",
    titleEn: "Acid Shock: Aliette + Copper Incompatible!",
    titleKo: "산성 충돌: 알리에트와 구리제 혼용 불가!",
    reasonUz: "Aliette (Fosetil-Al) kuchli kislotali muhitga ega. Mis bilan aralashganda mis ionlarini eritib o'simlikka kuchli toksik zarba beradi.",
    reasonEn: "Aliette's acidic Fosetyl-Al solubilizes copper into free toxic Cu++ ions that scorch foliage.",
    reasonKo: "알리에트의 산성 성분이 구리를 용출시켜 잎을 태우는 약해를 유발합니다.",
    scientificDetailUz: "Tank pH qiymati <4.0 ga tushib ketadi, fitotoksik erkin mis ajraladi.",
    scientificDetailEn: "Tank pH drops below 4.0, precipitating ionic phytotoxicity.",
    scientificDetailKo: "탱크 pH 4.0 이하로 급락, 유리 구리 약해 유발.",
  },
  {
    chemA: "quadris",
    chemB: "preparat_30",
    status: "incompatible",
    titleUz: "Kutikula Shikastlanishi: Quadris va Mineral Moylar Qo'shilmaydi!",
    titleEn: "Severe Burn: Quadris + Horticultural Oil Prohibited!",
    titleKo: "왁스층 파괴: 콰드리스와 기계유 혼용 절대 금지!",
    reasonUz: "Quadris (strobilurin) preparatlari mineral moylar bilan qo'shilganda o'simlik bargining tabiiy mum himoya qavatini parchalab tashlaydi va quyoshda bargni butunlay kuydiradi.",
    reasonEn: "Strobilurin fungicides mixed with oils penetrate and dissolve the cuticular wax layer, causing devastating sunburn.",
    reasonKo: "스트로빌루린계 살균제와 오일 혼용 시 잎 왁스층이 녹아 직사광선 아래 고사합니다.",
    scientificDetailUz: "Barg kutikulasining o'tkazuvchanligi buziladi va nekroz boshlanadi.",
    scientificDetailEn: "Disrupts cuticular lipid bilayers, inducing severe tissue collapse.",
    scientificDetailKo: "큐티클 지질 이중층 파괴로 엽육 조직 괴사 유도.",
  },
  {
    chemA: "revus",
    chemB: "ampligo",
    status: "compatible",
    titleUz: "Standart Tank-Miks: Revus 250 SC + Ampligo 150 ZC",
    titleEn: "Synergistic Mix: Revus 250 SC + Ampligo 150 ZC",
    titleKo: "표준 혼용 조합: 레부스 + 앰플리고",
    reasonUz: "Pomidor va kartoshkada fitoftoroz va kapalak qurtlariga qarshi jahon dehqonchiligida eng ko'p sinovdan o'tgan xavfsiz va samarali kombinatsiya.",
    reasonEn: "Tested synergistic tank-mix against Phytophthora blight and lepidopteran borers in solanaceous crops.",
    reasonKo: "가지과 작물 역병 및 나방 동시 방제 표준 안전 조합.",
    scientificDetailUz: "Ikkala preparat ham neytral pH da barqaror turadi, cho'kma hosil qilmaydi.",
    scientificDetailEn: "Both formulations remain chemically stable at neutral pH.",
    scientificDetailKo: "중성 pH에서 두 제형 모두 안정적 분산 유지.",
  },
  {
    chemA: "switch_62",
    chemB: "topas_100",
    status: "compatible",
    titleUz: "Bog'lar va Uzumzorlar: Switch 62.5 WG + Topas 100 EC",
    titleEn: "Vineyard Defense: Switch 62.5 WG + Topas 100 EC",
    titleKo: "포도원 종합 방제: 스위치 + 토파즈",
    reasonUz: "Uzum va shaftolida kulrang meva chirishi (Botrytis) va un-shudring (oidium)ga qarshi birdaniga ikkita yo'nalishda davolaydi.",
    reasonEn: "Simultaneous defense against Botrytis bunch rot and powdery mildew in grapes and stone fruit.",
    reasonKo: "포도 및 핵과류 잿빛곰팡이병과 흰가루병 동시 치료 조합.",
    scientificDetailUz: "Tsiprodinil, flyudioksonil va penkonazol bir-biriga to'sqinlik qilmaydi.",
    scientificDetailEn: "Active ingredients show high chemical compatibility without flocculation.",
    scientificDetailKo: "응집 현상 없이 유효 성분 상호 간섭 없음.",
  },
];

/**
 * 5 Famous Real-World Tank Mix Presets
 */
export const TANK_MIX_PRESETS: TankMixPreset[] = [
  {
    id: "preset_blight_caterpillar",
    titleUz: "Pomidor va Kartoshka: Fitoftoroz + Qurtlarga Qarshi",
    titleEn: "Tomato & Potato: Blight + Caterpillar Defence",
    titleKo: "토마토 & 감자: 역병 + 나방 종합 방제",
    descriptionUz: "Ridomil Gold MZ 68 WG + Ampligo 150 ZC (Xavfsiz va samarali)",
    descriptionEn: "Ridomil Gold MZ 68 WG + Ampligo 150 ZC (Safe and synergistic)",
    descriptionKo: "리도밀골드 + 앰플리고 (안전한 상승 시너지)",
    chemicals: ["ridomil_gold", "ampligo"],
    expectedStatus: "compatible",
  },
  {
    id: "preset_danger_copper_sulfur",
    titleUz: "XAVFLI MISOL: Mis (XOM) + Oltingugurt (Kumulus)",
    titleEn: "DANGER EXAMPLE: Copper + Sulfur",
    titleKo: "위험 예시: 구리제(XOM) + 유황(쿠물루스)",
    descriptionUz: "Mis sulfid hosil qilib barglarni qattiq kuydiradi (Qat'iyan man etiladi)",
    descriptionEn: "Forms toxic copper sulfide and scorches crops (Strictly prohibited)",
    descriptionKo: "황화구리 형성으로 극심한 잎 괴사 유발 (절대 혼용 금지)",
    chemicals: ["xom_copper", "kumulus_df"],
    expectedStatus: "incompatible",
  },
  {
    id: "preset_danger_calcium_phosphate",
    titleUz: "CHO'KMA MISOLI: Kalsiy Selitrasi + Kaliy Monofosfat",
    titleEn: "PRECIPITATION EXAMPLE: Calcium Nitrate + MKP Phosphate",
    titleKo: "침전 예시: 질산칼슘 + 제1인산칼륨(MKP)",
    descriptionUz: "Erimaydigan gips/kalsiy fosfat hosil qilib, filtrlarni tiqib qo'yadi",
    descriptionEn: "Creates insoluble tricalcium phosphate chalk that clogs sprayers",
    descriptionKo: "불용성 인산칼슘 침전으로 노즐 완전 막힘",
    chemicals: ["kalsiy_selitrasi", "kaliy_monofosfat"],
    expectedStatus: "incompatible",
  },
  {
    id: "preset_powdery_mildew_strike",
    titleUz: "Bog'lar va Issiqxona: Un-Shudringga Kuchli Zarba",
    titleEn: "Orchards & Greenhouses: Dual Powdery Mildew Strike",
    titleKo: "과원 & 온실: 흰가루병 강력 방제 조합",
    descriptionUz: "Topas 100 EC + Skor 250 EC (Triazol guruhining kuchaytirilgan ta'siri)",
    descriptionEn: "Topas 100 EC + Skor 250 EC (Dual systemic triazole control)",
    descriptionKo: "토파즈 + 스코어 (이중 침투성 트리아졸 치료)",
    chemicals: ["topas_100", "skor_250"],
    expectedStatus: "compatible",
  },
  {
    id: "preset_danger_bio_copper",
    titleUz: "FOYDASIZ ARALASHMA: Fitosporin (Bio) + Kosayd 2000 (Mis)",
    titleEn: "BIOCIDAL EXAMPLE: Fitosporin (Bio) + Kocide (Copper)",
    titleKo: "무효화 예시: 피토스포린(미생물) + 코사이드(동제)",
    descriptionUz: "Kosayd mis bakteritsidi Fitosporin tirik bakteriyalarini butunlay yo'q qiladi",
    descriptionEn: "Copper hydroxide kills all beneficial live Bacillus subtilis spores",
    descriptionKo: "구리제의 살균 작용으로 피토스포린 생균 전멸",
    chemicals: ["fitosporin_m", "kocide_2000"],
    expectedStatus: "incompatible",
  },
];

/**
 * Result of evaluating a custom combination of 2 or more chemicals
 */
export interface TankMixEvaluationResult {
  overallStatus: CompatibilityStatus;
  statusScore: number; // 0 to 100
  title: string;
  summary: string;
  selectedChemicals: TankMixChemical[];
  conflicts: CompatibilityRule[];
  synergies: CompatibilityRule[];
  walesStepOrder: {
    step: WalesOrder;
    chemical: TankMixChemical;
    instruction: string;
  }[];
  jarTestGuide: {
    step1: string;
    step2: string;
    step3: string;
  };
  recommendedWaterPH: string;
}

/**
 * Evaluates compatibility of 2 to 4 selected chemicals
 */
export function evaluateTankMix(
  chemicalIds: string[],
  lang: "uz" | "en" | "ko" = "uz"
): TankMixEvaluationResult {
  const selectedChemicals = chemicalIds
    .map((id) => TANK_MIX_CHEMICALS[id])
    .filter(Boolean);

  if (selectedChemicals.length < 2) {
    return {
      overallStatus: "caution",
      statusScore: 50,
      title:
        lang === "uz"
          ? "Kamida 2 ta preparat tanlang"
          : lang === "ko"
          ? "최소 2가지 약제를 선택하세요"
          : "Select at least 2 chemicals",
      summary:
        lang === "uz"
          ? "Kimyoviy aralashma tahlili uchun ro'yxatdan 2 yoki undan ortiq preparatni tanlang."
          : lang === "ko"
          ? "혼용 적합성 분석을 위해 2가지 이상의 약제를 선택해 주세요."
          : "Please choose two or more agrochemicals to evaluate tank-mix safety.",
      selectedChemicals,
      conflicts: [],
      synergies: [],
      walesStepOrder: [],
      jarTestGuide: {
        step1: "",
        step2: "",
        step3: "",
      },
      recommendedWaterPH: "6.0 - 6.5",
    };
  }

  const conflicts: CompatibilityRule[] = [];
  const synergies: CompatibilityRule[] = [];

  // Pairwise evaluation
  for (let i = 0; i < selectedChemicals.length; i++) {
    for (let j = i + 1; j < selectedChemicals.length; j++) {
      const idA = selectedChemicals[i].id;
      const idB = selectedChemicals[j].id;

      const rule = COMPATIBILITY_RULES.find(
        (r) =>
          (r.chemA === idA && r.chemB === idB) ||
          (r.chemA === idB && r.chemB === idA)
      );

      if (rule) {
        if (rule.status === "incompatible") {
          conflicts.push(rule);
        } else if (rule.status === "compatible") {
          synergies.push(rule);
        }
      } else {
        // Generic Category Heuristics
        const catA = selectedChemicals[i].category;
        const catB = selectedChemicals[j].category;

        // Copper + Bio
        if (
          (catA === "bio" && (idB === "xom_copper" || idB === "kocide_2000")) ||
          (catB === "bio" && (idA === "xom_copper" || idA === "kocide_2000"))
        ) {
          conflicts.push({
            chemA: idA,
            chemB: idB,
            status: "incompatible",
            titleUz: "Biologik preparat va Mis birikmasi",
            titleEn: "Bio Agent + Copper Incompatibility",
            titleKo: "생물 농약과 동제 혼용 불가",
            reasonUz: "Mis preparatlari tirik biologik zamburug' va bakteriyalarni butunlay yo'q qiladi.",
            reasonEn: "Copper compounds neutralize and kill active bio-control microorganisms.",
            reasonKo: "동제는 유익 미생물을 즉시 사멸시킵니다.",
            scientificDetailUz: "Alohida, 7 kun oraliq bilan sepilsin.",
            scientificDetailEn: "Apply separately with 7 days interval.",
            scientificDetailKo: "7일 이상 간격을 두고 단독 살포하세요.",
          });
        }
      }
    }
  }

  // WALES Mixing Order determination:
  // Step precedence: W (1) -> A (2) -> L (3) -> E (4) -> S (5)
  const orderWeights: Record<WalesOrder, number> = {
    W: 1,
    A: 2,
    L: 3,
    E: 4,
    S: 5,
  };

  const sortedForWales = [...selectedChemicals].sort(
    (a, b) => orderWeights[a.walesStep] - orderWeights[b.walesStep]
  );

  const walesStepOrder = sortedForWales.map((chem) => ({
    step: chem.walesStep,
    chemical: chem,
    instruction:
      lang === "uz"
        ? chem.walesDescriptionUz
        : lang === "ko"
        ? chem.walesDescriptionKo
        : chem.walesDescriptionEn,
  }));

  let overallStatus: CompatibilityStatus = "compatible";
  let statusScore = 100;
  let title = "";
  let summary = "";

  if (conflicts.length > 0) {
    overallStatus = "incompatible";
    statusScore = 15;
    title =
      lang === "uz"
        ? "Qat'iyan Man Etiladi! (Fitotoksiklik yoki Cho'kma Xavfi)"
        : lang === "ko"
        ? "혼용 절대 불가! (약해 또는 불용성 침전 위험)"
        : "Strictly Prohibited! (Phytotoxicity or Clogging Risk)";
    summary =
      lang === "uz"
        ? `Ushbu preparatlarni bir bochkada aralashtirish ekin barglarini kuydirishi, purkagich filtrlarini tiqishi yoki preparat ta'sirini butunlay yo'qotishi mumkin (${conflicts.length} ta jiddiy to'qnashuv aniqlandi).`
        : lang === "ko"
        ? `해당 약제들을 한 탱크에 혼용할 경우 잎 괴사 약해, 노즐 막힘 또는 약효 상실을 유발합니다 (${conflicts.length}건의 치명적 충돌 발견).`
        : `Mixing these chemicals in a single tank will cause severe phytotoxicity, filter clogging or efficacy loss (${conflicts.length} critical conflicts found).`;
  } else if (synergies.length > 0) {
    overallStatus = "compatible";
    statusScore = 98;
    title =
      lang === "uz"
        ? "A'lo Darajadagi Moslik (Xavfsiz Tank Aralashmasi)"
        : lang === "ko"
        ? "완벽 혼용 적합 (상승 시너지 조합)"
        : "Highly Compatible (Safe Tank-Mix Synergy)";
    summary =
      lang === "uz"
        ? "Tanlangan preparatlar bir-biriga kimyoviy to'sqinlik qilmaydi. Bir paytda purkash vaqt va yoqilg'ini tejaydi hamda hosilni har tomonlama himoya qiladi."
        : lang === "ko"
        ? "선택한 약제들은 화학적 충돌 없이 안전하게 혼용 가능하며 노동력과 시간을 절감합니다."
        : "These chemicals are fully compatible with verified synergy, saving spray labor while maximizing pest & disease suppression.";
  } else {
    // No specific conflict or synergy registered -> caution / jar test
    overallStatus = "caution";
    statusScore = 70;
    title =
      lang === "uz"
        ? "Shartli Moslik (Sinov Talab Qilinadi)"
        : lang === "ko"
        ? "조건부 혼용 가능 (사전 테스트 권장)"
        : "Conditional Compatibility (Jar Test Recommended)";
    summary =
      lang === "uz"
        ? "Ushbu preparatlar o'rtasida to'g'ridan-to'g'ri kimyoviy xavf aniqlanmadi, biroq suv qattiqligi va haroratiga qarab avval kichik bankada 15 daqiqalik sinov o'tkazish tavsiya etiladi."
        : lang === "ko"
        ? "직접적인 충돌은 없으나 수질과 온도에 따라 침전이 생길 수 있으므로 소량 병 테스트(Jar Test)를 권장합니다."
        : "No direct chemical incompatibility identified, but water hardness and pH vary. A 15-minute jar test is strongly advised before large-scale tank mixing.";
  }

  const jarTestGuide = {
    step1:
      lang === "uz"
        ? "1. Shaffof 1 litrlik shisha bankaga 700 ml xona haroratidagi suv quying."
        : lang === "ko"
        ? "1. 투명한 1L 유리병에 실온의 물 700ml를 채웁니다."
        : "1. Fill a clean 1-liter clear jar with 700 ml of ambient water.",
    step2:
      lang === "uz"
        ? "2. WALES tartibi bo'yicha dorilardan mutanosib ravishda (1-2 ml/gramm) solib, har biridan keyin yaxshilab chayqating."
        : lang === "ko"
        ? "2. WALES 순서에 따라 각 약제를 소량(1~2ml/g) 투입 후 매번 흔들어 섞습니다."
        : "2. Add chemicals proportionally (1-2 ml/g) following the WALES order, shaking after each addition.",
    step3:
      lang === "uz"
        ? "3. 15 daqiqa kuting. Agar qatlamlanish, qattiq cho'kma yoki idish qizib ketishi kuzatilmasa — aralashma xavfsiz!"
        : lang === "ko"
        ? "3. 15분간 관찰합니다. 층분리, 응고, 발열이 없으면 탱크 혼용이 안전합니다!"
        : "3. Wait 15 minutes. If no sludge, heat generation, or rapid separation occurs, the mix is field-safe!",
  };

  return {
    overallStatus,
    statusScore,
    title,
    summary,
    selectedChemicals,
    conflicts,
    synergies,
    walesStepOrder,
    jarTestGuide,
    recommendedWaterPH: "5.8 - 6.5 (Kuchsiz kislotali suv maqbul)",
  };
}

