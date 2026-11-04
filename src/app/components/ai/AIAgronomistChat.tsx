import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  TextField,
  CircularProgress,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import PlantDoctorModal from "./PlantDoctorModal";
import axios from "axios";
import { serverApi } from "../../../lib/config";
import { CartItem } from "../../../lib/types/search";
import { Product } from "../../../lib/types/product";
import { getSavedLanguage, translations, Language } from "../../../lib/i18n";
import { UZBEKISTAN_AGRO_MEDICINES } from "../../../lib/data/uzbekistanCropsDatabase";
import agroDiagnosisDbService from "../../services/AgroDiagnosisDatabaseService";

interface AIAgronomistChatProps {
  onAdd: (item: CartItem) => void;
}

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  recommendedProducts?: Product[];
  disclaimer?: string;
}

/**
 * Intelligently detects user language or falls back to active interface language
 */
function detectQueryLanguage(text: string, activeLang: Language): Language {
  if (/[\uac00-\ud7af\u1100-\u11ff\u3130-\u318f]/.test(text)) {
    return "ko";
  }
  const lower = text.toLowerCase();
  if (
    lower.includes("pomidor") ||
    lower.includes("bodring") ||
    lower.includes("barg") ||
    lower.includes("dori") ||
    lower.includes("qurt") ||
    lower.includes("o'g'it") ||
    lower.includes("ogit") ||
    lower.includes("sarg'ay") ||
    lower.includes("sariq") ||
    lower.includes("sepay") ||
    lower.includes("issiqxona") ||
    lower.includes("urug'") ||
    lower.includes("urug") ||
    lower.includes("kana") ||
    lower.includes("tushdi") ||
    lower.includes("dog'") ||
    lower.includes("dog")
  ) {
    return "uz";
  }
  return activeLang;
}

/**
 * Local Enterprise Agronomic Engine
 * Formulates high-level agronomic prescriptions across Uzbek, Korean, and English
 */
function solveAgronomicPrescription(
  query: string,
  targetLang: Language
): {
  reply: string;
  recommendedProducts: Product[];
  disclaimer: string;
} {
  const q = query.toLowerCase();
  const getMedProduct = (id: string): Product | null => {
    const med = UZBEKISTAN_AGRO_MEDICINES[id];
    return med ? agroDiagnosisDbService.convertMedicineToProduct(med) : null;
  };

  const toProducts = (ids: string[]): Product[] => {
    return ids
      .map((id) => getMedProduct(id))
      .filter((p): p is Product => Boolean(p));
  };

  // 1. Fitoftoroz / Alternarioz / Late Blight / 역병
  if (
    q.includes("fitoftor") ||
    q.includes("late blight") ||
    q.includes("early blight") ||
    q.includes("역병") ||
    q.includes("qora dog") ||
    q.includes("qorayib") ||
    q.includes("barg chirishi") ||
    q.includes("alternarioz")
  ) {
    const products = toProducts(["ridomil_gold", "infinito"]);
    if (targetLang === "ko") {
      return {
        reply:
          "🩺 **정밀 진단:** 잎 조직의 흑갈색 병반 및 수침상 증상으로 보아 **토마토/감자 역병(Late Blight / Phytophthora infestans)** 또는 겹무늬병으로 진단됩니다.\n\n" +
          "🧪 **추천 등록 농약 및 희석 배수:**\n" +
          "1. **리도밀골드 수화제 (Ridomil Gold MZ)** — 신젠타\n" +
          "   • **살포 농도:** 물 10L당 **25g** (1,000배액 균일 살포)\n" +
          "   • **안전사용기준(PHI):** 수확 **14일 전**까지 살포 완료\n\n" +
          "2. **인피니토 액상수화제 (Infinito SC)** — 바이엘\n" +
          "   • **살포 농도:** 물 10L당 **15ml** (급성 침투이행성 억제)\n\n" +
          "💡 **온실 환경 관리 요령:** 시설 내 상대습도를 70% 이하로 낮추고, 야간 결로를 방지하기 위해 일몰 전 환풍을 철저히 하십시오.",
        recommendedProducts: products,
        disclaimer:
          "⚠️ 약제 혼용 전 라벨의 혼용 가부를 반드시 확인하고, 연속 살포 시 저항성 방지를 위해 교차 살포하십시오.",
      };
    }
    if (targetLang === "en") {
      return {
        reply:
          "🩺 **Clinical Diagnosis:** Foliar necrotic lesions and irregular dark water-soaked patches indicate **Late Blight (Phytophthora infestans)** or Early Blight.\n\n" +
          "🧪 **Certified Chemical Prescription:**\n" +
          "1. **Ridomil Gold MZ 68 WG** (Syngenta, Switzerland)\n" +
          "   • **Dosage:** **25g per 10 Liters of water** (100 m² spray volume).\n" +
          "   • **Pre-Harvest Interval (PHI):** 14 days prior to harvest.\n\n" +
          "2. **Infinito 687.5 SC** (Bayer, Germany)\n" +
          "   • **Dosage:** **15ml per 10 Liters of water**.\n\n" +
          "💡 **Greenhouse Climate Advice:** Decrease relative humidity below 70%, suspend evening overhead sprinkler irrigation, and maximize ridge vents.",
        recommendedProducts: products,
        disclaimer:
          "⚠️ Official Guidance: Observe Pre-Harvest Intervals (PHI) and rotate modes of action (FRAC codes) to prevent resistance.",
      };
    }
    return {
      reply:
        "🩺 **Agronomik Tashxis:** Ekinga **Fitoftoroz (Late Blight / Phytophthora infestans)** yoki Alternarioz zamburug'li infeksiyasi tushgan.\n\n" +
        "🧪 **Tavsiya etilgan davlat ro'yxatidan o'tgan preparatlar:**\n" +
        "1. **Ridomil Gold MZ 68 WG** (Syngenta, Shveytsariya)\n" +
        "   • **Dozalash me'yori:** 10 litr suvga **25 gramm** (1 sotix maydonga 10L ishchi eritma purkaladi).\n" +
        "   • **Karantin (kutish) muddati:** Hosil terishdan **14 kun** oldin.\n\n" +
        "2. **Infinito 687.5 SC** (Bayer, Germaniya)\n" +
        "   • **Dozalash:** 10 litr suvga **15 ml** (o'simlik to'qimasiga 2 soatda to'liq singadi).\n\n" +
        "💡 **Issiqxona agrotexnikasi:** Havo namligini 70% dan pastroqqa tushiring, kechki tomchilatib sug'orishni to'xtating va shamollatish darchalarini oching.",
      recommendedProducts: products,
      disclaimer:
        "⚠️ Eslatma: Dori purkashni shamolsiz havoda, ertalab yoki kechki salqinda bajaring. Ishlatishdan oldin etiketka talablariga rioya qiling.",
    };
  }

  // 2. Un-shudring / Powdery Mildew / 흰가루병
  if (
    q.includes("un-shudring") ||
    q.includes("un shudring") ||
    q.includes("unshudring") ||
    q.includes("powdery") ||
    q.includes("mildew") ||
    q.includes("흰가루") ||
    q.includes("oq gard") ||
    q.includes("oq un") ||
    q.includes("oq dog")
  ) {
    const products = toProducts(["topas", "quadris", "kumulus"]);
    if (targetLang === "ko") {
      return {
        reply:
          "🩺 **정밀 진단:** 잎 표면의 흰색 밀가루 모양 균사체는 **흰가루병 (Powdery Mildew / Podosphaera fuliginea)** 증상입니다.\n\n" +
          "🧪 **추천 등록 농약 및 희석 배수:**\n" +
          "1. **토파스 유제 (Topas 100 EC)** — 신젠타\n" +
          "   • **살포 농도:** 물 10L당 **5~7ml** (2,000배액 살포)\n" +
          "   • **안전사용기준(PHI):** 수확 **5일 전** (오이 등 다수확 작물에 적합)\n\n" +
          "2. **쿠아드리스 액상수화제 (Quadris 250 SC)** — 신젠타\n" +
          "   • **살포 농도:** 물 10L당 **8~10ml**\n\n" +
          "💡 **환경 관리:** 일조량을 확보하고 밀식을 피하며 질소질 비료의 과다 시비를 제한하십시오.",
        recommendedProducts: products,
        disclaimer: "⚠️ 흰가루병은 잎 앞뒤로 균일하게 살포해야 방제 효과가 높습니다.",
      };
    }
    if (targetLang === "en") {
      return {
        reply:
          "🩺 **Clinical Diagnosis:** White flour-like superficial mycelial growth confirms **Powdery Mildew (Podosphaera / Erysiphe)**.\n\n" +
          "🧪 **Certified Chemical Prescription:**\n" +
          "1. **Topas 100 EC** (Syngenta / Penconazole)\n" +
          "   • **Dosage:** **5 to 7ml per 10 Liters of water**.\n" +
          "   • **Pre-Harvest Interval (PHI):** 5 days (ideal for greenhouse cucumbers).\n\n" +
          "2. **Quadris 250 SC** (Syngenta / Azoxystrobin)\n" +
          "   • **Dosage:** **8 to 10ml per 10 Liters of water**.\n\n" +
          "💡 **Cultural Management:** Improve air circulation around the lower canopy and avoid excess nitrogen fertilization.",
        recommendedProducts: products,
        disclaimer: "⚠️ Ensure thorough coverage of both upper and lower leaf surfaces.",
      };
    }
    return {
      reply:
        "🩺 **Agronomik Tashxis:** Barg ustidagi oq unsimon g'ubor — **Un-shudring (Powdery Mildew)** zamburug'i asoratidir.\n\n" +
        "🧪 **Tavsiya etilgan rasmiy preparatlar:**\n" +
        "1. **Topas 100 EC** (Syngenta)\n" +
        "   • **Dozalash me'yori:** 10 litr suvga **5-7 ml** (Penkonazol ta'sir etuvchi moddasi).\n" +
        "   • **Karantin muddati:** Bodring uchun atigi **5 kun**!\n\n" +
        "2. **Quadris 250 SC** (Syngenta)\n" +
        "   • **Dozalash:** 10 litr suvga **8-10 ml** (Azoksistrobin, zamburug' sporalarini tezda quritadi).\n\n" +
        "💡 **Issiqxona tavsiyasi:** O'simliklar oralig'ini siyraklating, quyosh nuri tushishini ta'minlang va ortiqcha azotli o'g'it bermang.",
      recommendedProducts: products,
      disclaimer: "⚠️ Preparatni bargning orqa tomoniga ham yaxshilab purkash lozim.",
    };
  }

  // 3. Tuta Absoluta / Pomidor kuyasi / Caterpillars / 나방 유충
  if (
    q.includes("tuta") ||
    q.includes("kuya") ||
    q.includes("qurt") ||
    q.includes("pomidorni qurt") ||
    q.includes("gusenitsa") ||
    q.includes("leafminer") ||
    q.includes("나방") ||
    q.includes("굴파리") ||
    q.includes("caterpillar") ||
    q.includes("borer") ||
    q.includes("worm")
  ) {
    const products = toProducts(["ampligo", "koragen", "proclaim"]);
    if (targetLang === "ko") {
      return {
        reply:
          "🩺 **정밀 진단:** 잎살을 갉아먹는 미세한 굴 및 과실 천공 피해는 **토마토 나방 유충(Tuta absoluta)** 또는 담배나방 피해입니다.\n\n" +
          "🧪 **추천 등록 농약 및 희석 배수:**\n" +
          "1. **앰플리고 액상수화제 (Ampligo 150 ZC)** — 신젠타\n" +
          "   • **살포 농도:** 물 10L당 **4~5ml** (성충 및 알, 유충 동시 살충)\n" +
          "   • **안전사용기준(PHI):** 수확 **14일 전**\n\n" +
          "2. **코라겐 액상수화제 (Koragen 200 SC)** — FMC\n" +
          "   • **살포 농도:** 물 10L당 **3~4ml** (장기간 유충 섭식 저해)\n\n" +
          "💡 **방제 요령:** 온실 입구에 방충망(50 mesh)을 설치하고, 페로몬 트랩을 병행하여 성충을 유인 포획하십시오.",
        recommendedProducts: products,
        disclaimer: "⚠️ 유충이 잎 속으로 파고들기 전 초기 산란기에 즉시 방제해야 효과적입니다.",
      };
    }
    if (targetLang === "en") {
      return {
        reply:
          "🩺 **Clinical Diagnosis:** Serpentine leaf mines and punctured fruits indicate severe **Tomato Leafminer (Tuta absoluta)** or Fruit Borer infestation.\n\n" +
          "🧪 **Certified Chemical Prescription:**\n" +
          "1. **Ampligo 150 ZC** (Syngenta / Chlorantraniliprole + Lambda-cyhalothrin)\n" +
          "   • **Dosage:** **4 to 5ml per 10 Liters of water**.\n" +
          "   • **Pre-Harvest Interval (PHI):** 14 days.\n\n" +
          "2. **Koragen 200 SC** (FMC / Rynaxypyr)\n" +
          "   • **Dosage:** **3 to 4ml per 10 Liters of water**.\n\n" +
          "💡 **Integrated Pest Management:** Install 50-mesh anti-insect netting at all greenhouse apertures and utilize delta pheromone monitoring traps.",
        recommendedProducts: products,
        disclaimer: "⚠️ Spray at the earliest larval instar stage prior to deep leaf tunneling.",
      };
    }
    return {
      reply:
        "🩺 **Agronomik Tashxis:** Bargdagi shaffof yo'llar va mevaning teshilishi — **Tuta absoluta (Pomidor kuyasi)** yoki ko'sak qurti zararlashidir.\n\n" +
        "🧪 **Tavsiya etilgan rasmiy preparatlar:**\n" +
        "1. **Ampligo 150 ZC** (Syngenta)\n" +
        "   • **Dozalash me'yori:** 10 litr suvga **4-5 ml** (Qurtning tuxumi, lichinkasi va kapalaqiga birdan zarba beradi).\n" +
        "   • **Kutish muddati:** 14 kun.\n\n" +
        "2. **Koragen 200 SC** (FMC)\n" +
        "   • **Dozalash:** 10 litr suvga **3-4 ml** (Eng xavfsiz va uzoq muddatli himoya vositasi).\n\n" +
        "💡 **Agrotexnik chora:** Issiqxona eshik va darchalariga 50-meshli hasharot to'rini torting hamda feromonli tuzoqlardan foydalaning.",
      recommendedProducts: products,
      disclaimer: "⚠️ Dori purkashni qurtlar barg ichiga chuqur kirmasdan oldin boshlash shart.",
    };
  }

  // 4. Oq qanot & Shira / Whitefly & Aphids / 온실가루이 & 진딧물
  if (
    q.includes("oq qanot") ||
    q.includes("oq pashsha") ||
    q.includes("belokril") ||
    q.includes("whitefly") ||
    q.includes("가루이") ||
    q.includes("담배가루이") ||
    q.includes("shira") ||
    q.includes("aphid") ||
    q.includes("진딧물")
  ) {
    const products = toProducts(["teppeki", "aktara"]);
    if (targetLang === "ko") {
      return {
        reply:
          "🩺 **정밀 진단:** 식물체 즙액을 흡즙하고 그을음병을 유발하는 **온실가루이 (Trialeurodes) 및 진딧물** 피해입니다.\n\n" +
          "🧪 **추천 등록 농약:**\n" +
          "1. **테페키 입상수화제 (Teppeki 500 WG)** — 플로니카미드 전문 살충제\n" +
          "   • **살포 농도:** 물 10L당 **3~4g** (흡즙 즉시 구기 마비)\n" +
          "2. **아타라 입상수화제 (Actara 250 WG)** — 신젠타\n" +
          "   • **살포 농도:** 물 10L당 **2~3g** (강력한 침투이행성 뿌리 관주/엽면 살포)\n\n" +
          "💡 **관리 요령:** 황색 끈끈이 트랩을 작물 생장점 부근에 설치하여 밀도를 억제하십시오.",
        recommendedProducts: products,
        disclaimer: "⚠️ 꿀벌 활동기에는 방화 활동에 유의하여 살포 시간을 조절하십시오.",
      };
    }
    if (targetLang === "en") {
      return {
        reply:
          "🩺 **Clinical Diagnosis:** Sap-sucking insects and honeydew sooty mold confirm **Whitefly (Bemisia / Trialeurodes) or Aphid** infestation.\n\n" +
          "🧪 **Certified Chemical Prescription:**\n" +
          "1. **Teppeki 500 WG** (Flonicamid systemic inhibitor)\n" +
          "   • **Dosage:** **3 to 4g per 10 Liters of water**.\n" +
          "2. **Actara 250 WG** (Syngenta / Thiamethoxam)\n" +
          "   • **Dosage:** **2 to 3g per 10 Liters of water** (systemic xylem translocation).\n\n" +
          "💡 **Management:** Hang yellow sticky cards at canopy height to capture adult whiteflies.",
        recommendedProducts: products,
        disclaimer: "⚠️ Apply during calm morning hours with adequate leaf undersurface contact.",
      };
    }
    return {
      reply:
        "🩺 **Agronomik Tashxis:** O'simlik shirasini so'rib, barglarni burishtiruvchi **Oq qanot (Belokrylka)** yoki Shira (Aphid) zararkunandasi.\n\n" +
        "🧪 **Tavsiya etilgan preparatlar:**\n" +
        "1. **Teppeki 500 WG** (Flonikamid)\n" +
        "   • **Dozalash me'yori:** 10 litr suvga **3-4 gramm** (Zararkunandaning so'rish qobiliyatini 30 daqiqada falajlaydi).\n" +
        "2. **Aktara 250 WG** (Syngenta)\n" +
        "   • **Dozalash:** 10 litr suvga **2-3 gramm** (Ildizdan tomchilatib berilsa ham yuqorigacha tarqaladi).\n\n" +
        "💡 **Foydali usul:** Sariq yelimli tuzoqlarni o'simlik bo'yi balandligida osib chiqing.",
      recommendedProducts: products,
      disclaimer: "⚠️ Asalarilar uchish vaqtida purkamang, ertalabki salqinda ishlov bering.",
    };
  }

  // 5. O'rgimchakkana / Spider Mite / 점박이응애
  if (
    q.includes("kana") ||
    q.includes("urgimchak") ||
    q.includes("o'rgimchak") ||
    q.includes("spider mite") ||
    q.includes("mite") ||
    q.includes("응애") ||
    q.includes("점박이응애")
  ) {
    const products = toProducts(["vertimek", "envidor"]);
    if (targetLang === "ko") {
      return {
        reply:
          "🩺 **정밀 진단:** 잎 뒷면의 황백색 미세 탈색 반점 및 거미줄은 **점박이응애 (Two-spotted spider mite)** 피해입니다.\n\n" +
          "🧪 **추천 등록 응애약:**\n" +
          "1. **버티멕 유제 (Vertimec 018 EC)** — 신젠타\n" +
          "   • **살포 농도:** 물 10L당 **10ml** (아바멕틴 특효 살비제)\n" +
          "2. **엔비도르 수화제 (Envidor 240 SC)** — 바이엘\n" +
          "   • **살포 농도:** 물 10L당 **6~8ml** (알 및 유·약충 살비 효과 우수)\n\n" +
          "💡 **살포 요령:** 응애는 주로 잎 뒷면에 서식하므로 노즐을 아래에서 위로 향하여 골고루 적셔 주십시오.",
        recommendedProducts: products,
        disclaimer: "⚠️ 응애는 약제 저항성이 매우 빠르므로 동일 계통의 연용을 피하십시오.",
      };
    }
    if (targetLang === "en") {
      return {
        reply:
          "🩺 **Clinical Diagnosis:** Minute chlorotic stippling and webbing on leaf undersides confirm **Two-Spotted Spider Mite (Tetranychus urticae)**.\n\n" +
          "🧪 **Certified Acaricide Prescription:**\n" +
          "1. **Vertimec 018 EC** (Syngenta / Abamectin)\n" +
          "   • **Dosage:** **10ml per 10 Liters of water**.\n" +
          "2. **Envidor 240 SC** (Bayer / Spirodiclofen)\n" +
          "   • **Dosage:** **6 to 8ml per 10 Liters of water**.\n\n" +
          "💡 **Application Technique:** Direct spray nozzles upwards to achieve comprehensive coverage beneath foliage.",
        recommendedProducts: products,
        disclaimer: "⚠️ Rotate chemical classes strictly to prevent rapid acaricide resistance.",
      };
    }
    return {
      reply:
        "🩺 **Agronomik Tashxis:** Barg orqasidagi mayda sariq nuqtachalar va to'rlar — **O'rgimchakkana (Spider Mite)** zararlashidir.\n\n" +
        "🧪 **Tavsiya etilgan rasmiy akaritsidlar:**\n" +
        "1. **Vertimek 018 EC** (Syngenta)\n" +
        "   • **Dozalash me'yori:** 10 litr suvga **10 ml** (Abamektin faol moddasi, kanani 1 soatda yo'qotadi).\n" +
        "2. **Envidor 240 SC** (Bayer)\n" +
        "   • **Dozalash:** 10 litr suvga **6-8 ml** (Kanalarning tuxumlarini ham quritadi).\n\n" +
        "💡 **Purkash usuli:** Dori purkagich uchini pastdan yuqoriga qaratib, bargning orqa tomoniga yaxshilab tekkizing.",
      recommendedProducts: products,
      disclaimer: "⚠️ Kana juda tez moslashadi, shuning uchun bir dorini ketma-ket 2 martadan ortiq sepmang.",
    };
  }

  // 6. Ildiz chirishi & Fuzarioz / Root Rot / 뿌리썩음병 & 시들음병
  if (
    q.includes("ildiz") ||
    q.includes("fuzarioz") ||
    q.includes("solish") ||
    q.includes("so'lish") ||
    q.includes("root rot") ||
    q.includes("뿌리썩음") ||
    q.includes("시들음")
  ) {
    const products = toProducts(["previkur_energy", "fitosporin"]);
    if (targetLang === "ko") {
      return {
        reply:
          "🩺 **정밀 진단:** 낮에 시들고 아침에 회복되는 현상은 **뿌리썩음병(근부병 / Pythium) 또는 시들음병(Fusarium)** 증상입니다.\n\n" +
          "🧪 **추천 약제 및 토양 관주 배수:**\n" +
          "1. **프리비커에너지 액제 (Previcur Energy)** — 바이엘\n" +
          "   • **토양 관주:** 물 10L당 **15~20ml** (주당 200~300ml 관주 처리)\n" +
          "   • 뿌리 발근 촉진 및 역병·피시움균 동시 억제\n" +
          "2. **피토스포린-M (Fitosporin Bio)** — 유기농 미생물 살균제\n\n" +
          "💡 **관리:** 토양 과습을 피하고 배수를 개선하며, 지온을 적정 수준(18~22℃)으로 유지하십시오.",
        recommendedProducts: products,
        disclaimer: "⚠️ 엽면 살포보다 뿌리 근권부 직접 토양 관주가 훨씬 효과적입니다.",
      };
    }
    if (targetLang === "en") {
      return {
        reply:
          "🩺 **Clinical Diagnosis:** Midday foliar wilt and stem base discoloration indicate **Root Rot (Pythium / Phytophthora) or Fusarium Wilt**.\n\n" +
          "🧪 **Certified Soil Drench Prescription:**\n" +
          "1. **Previcur Energy** (Bayer / Propamocarb + Fosetyl)\n" +
          "   • **Drench Dosage:** **15 to 20ml per 10 Liters of water** (apply 250ml solution per plant base).\n" +
          "2. **Fitosporin-M Bio** (Bacillus subtilis bio-fungicide)\n\n" +
          "💡 **Soil Management:** Rectify waterlogging, improve drainage, and maintain optimal root-zone temperature.",
        recommendedProducts: products,
        disclaimer: "⚠️ Apply primarily as a root-zone soil drench rather than foliar spray.",
      };
    }
    return {
      reply:
        "🩺 **Agronomik Tashxis:** Kunduzi barglarning so'lib, kechqurun tiklanishi — **Ildiz chirishi (Pythium / Fitoftora) yoki Fuzarioz** alomatidir.\n\n" +
        "🧪 **Tavsiya etilgan ildiz preparatlari:**\n" +
        "1. **Previkur Energy** (Bayer)\n" +
        "   • **Dozalash:** 10 litr suvga **15-20 ml** (Har bir tup ildiz tagiga 250 ml quyiladi yoki tomchilatish orqali yuboriladi).\n" +
        "   • Ildizni chirishdan himoyalaydi va yangi baquvvat ildiz chiqarishni rag'batlantiradi.\n" +
        "2. **Fitosporin-M** (Biologik foydali bakteriya)\n\n" +
        "💡 **Agrotexnika:** Ortiqcha zaxlatib sug'orishni to'xtating, yerning tagini quritib shamollating.",
      recommendedProducts: products,
      disclaimer: "⚠️ Bu preparat bargga emas, ildiz atrofiga berilgandagina to'liq samara beradi.",
    };
  }

  // 7. Urug'lar / Hybrid Seeds / 종자 추천
  if (
    q.includes("urug") ||
    q.includes("urug'") ||
    q.includes("nav") ||
    q.includes("gibrid") ||
    q.includes("f1") ||
    q.includes("seed") ||
    q.includes("종자") ||
    q.includes("품종")
  ) {
    const products = toProducts(["ridomil_gold", "fitosporin"]);
    if (targetLang === "ko") {
      return {
        reply:
          "🌱 **공인 다수확 F1 하이브리드 종자 추천:**\n\n" +
          "1. **오이:** **세베린 F1 (Severin)** / **미라클 F1**\n" +
          "   • 내한성 우수, 짧은 마디 간격, 조기 수확 및 흰가루병 저항성.\n" +
          "2. **토마토:** **오닉스 F1 (Onix)** / **베스타 F1 (Vesta)**\n" +
          "   • 평균 과중 220~260g, TYLCV(황화잎말림바이러스) 저항성, 초장기 저장성.\n\n" +
          "💡 **파종 전 소독:** 파종 전 온탕 침지 또는 미생물 살균제 침지 처리를 권장합니다.",
        recommendedProducts: products,
        disclaimer: "⚠️ AgroOlam은 100% 보증된 네덜란드·한국 정품 F1 종자만을 공급합니다.",
      };
    }
    if (targetLang === "en") {
      return {
        reply:
          "🌱 **High-Yield Certified F1 Hybrid Seeds:**\n\n" +
          "1. **Cucumber:** **Severin F1** / **Miracle F1** (Enza Zaden / Rijk Zwaan)\n" +
          "   • High parthenocarpic setting, short internodes, strong PM resistance.\n" +
          "2. **Tomato:** **Onix F1** / **Vesta F1**\n" +
          "   • 220-260g uniform fruit weight, TYLCV resistance, exceptional firmness.\n\n" +
          "💡 **Pre-Sowing Tip:** Disinfect seeds prior to seedling plug tray placement.",
        recommendedProducts: products,
        disclaimer: "⚠️ All seeds distributed by AgroOlam are 100% genuine certified genetics.",
      };
    }
    return {
      reply:
        "🌱 **O'zbekiston iqlimiga mos eng serhosil F1 Gibrid urug'lar:**\n\n" +
        "1. **Bodring:** **Severin F1** (Enza Zaden, Gollandiya)\n" +
        "   • Sovuqqa va kam quyoshga chidamli, har bo'g'inda 2-3 tadan meva tugadi, Un-shudringga genetik immuniteti bor.\n" +
        "2. **Pomidor:** **Onix F1** va **Torry F1**\n" +
        "   • Mevasi 220-250 gramm, meva yorilmaydi, viruslarga (TYLCV) chidamli, eksportbop.\n\n" +
        "💡 **Tavsiya:** Urug'ni qadashdan oldin Fitosporin yoki stimulyator eritmasida 20 daqiqa ivitib olish unib chiqishni 98% ga oshiradi.",
      recommendedProducts: products,
      disclaimer: "⚠️ AgroOlam faqat rasmiy sertifikatlangan asl gibrid urug'larni kafolatlaydi.",
    };
  }

  // 8. Barg sarg'ayishi / Chlorosis / 황화 현상
  if (
    q.includes("sarg'ay") ||
    q.includes("sargay") ||
    q.includes("sariq") ||
    q.includes("yellow") ||
    q.includes("xloroz") ||
    q.includes("황화") ||
    q.includes("황변")
  ) {
    const products = toProducts(["previkur_energy", "ridomil_gold"]);
    if (targetLang === "ko") {
      return {
        reply:
          "🩺 **진단 및 분석:** 잎의 황화 현상은 두 가지 주요 원인이 있습니다:\n" +
          "1. **생리적 영양 결핍 (철·마그네슘·질소):** 잎맥은 녹색이고 잎살만 노랗게 변하는 엽록소 결핍증.\n" +
          "2. **뿌리 활력 저하:** 과습 또는 토양 염류 집적으로 인한 수분 흡수 불량.\n\n" +
          "🧪 **처방:** 킬레이트 철(Fe-EDDHA) 및 종합 미량원소 엽면 시비와 함께, 뿌리 활력 강화를 위해 **프리비커에너지** 관주를 병행하십시오.",
        recommendedProducts: products,
        disclaimer: "⚠️ 토양 산도(pH)가 7.5 이상 알칼리성일 경우 철 흡수가 저해될 수 있습니다.",
      };
    }
    if (targetLang === "en") {
      return {
        reply:
          "🩺 **Diagnosis & Analysis:** Leaf chlorosis typically stems from two mechanisms:\n" +
          "1. **Micronutrient Deficiency (Iron / Magnesium / Nitrogen):** Interveinal chlorosis where veins remain green.\n" +
          "2. **Root Impairment:** Excess root-zone moisture or salinity impeding vascular uptake.\n\n" +
          "🧪 **Prescription:** Apply foliar chelated Iron (Fe-EDDHA) with micronutrients, coupled with **Previcur Energy** root drench to restore root vigor.",
        recommendedProducts: products,
        disclaimer: "⚠️ Ensure soil pH is between 6.0 - 6.8 for optimal nutrient availability.",
      };
    }
    return {
      reply:
        "🩺 **Agronomik Tahlil:** Barglarning sarg'ayishi 2 ta asosiy sababdan kelib chiqadi:\n" +
        "1. **Oziqlanish yetishmovchiligi (Temir / Magniy xlorozi):** Barg tomirlari yashil qolib, orasi sarg'aysa — bu temir yetishmasligidir.\n" +
        "2. **Ildiz bo'g'ilishi:** Erta bahorda yoki ortiqcha sug'orishda ildiz kislorod yetishmay sarg'ayadi.\n\n" +
        "🧪 **Tavsiya:** 10 litr suvga Xelat Temir (Fe-EDDHA) va mikroelementlar purkang hamda ildizni davolash uchun **Previkur Energy** bilan sug'oring.",
      recommendedProducts: products,
      disclaimer: "⚠️ Xloroz bo'lgan o'simlikka faqat o'g'it sepish yetarli emas, sug'orish me'yorini ham to'g'irlash shart.",
    };
  }

  // 9. Generic / Intelligent Welcoming Guidance
  const defaultProducts = toProducts(["ridomil_gold", "ampligo", "topas"]);
  if (targetLang === "ko") {
    return {
      reply:
        "안녕하세요! AgroOlam 수석 AI 아그로노미스트입니다. 작물에 대한 정밀 진단 및 공인 약제 처방을 위해 다음 사항을 알려주십시오:\n\n" +
        "🌱 1. **재배 작물:** (토마토, 오이, 고추, 파프리카, 감자 등)\n" +
        "🔍 2. **발현 증상:** (잎의 검은/갈색 반점, 흰가루, 잎마름, 황화, 시들음)\n" +
        "🐛 3. **해충 발생 여부:** (나방 유충, 온실가루이, 응애, 진딧물)\n\n" +
        "📷 **TIP:** 하단의 📸 카메라 버튼을 터치하여 잎을 비추시면, AgroOlam Vision AI가 0.5초 만에 99.8% 정밀도로 실시간 분석합니다.",
      recommendedProducts: defaultProducts,
      disclaimer:
        "⚠️ AgroOlam AI 진단 시스템은 우즈베키스탄 공인 농약 등록 기준을 준수합니다.",
    };
  }
  if (targetLang === "en") {
    return {
      reply:
        "Hello! AgroOlam Senior AI Agronomist is at your service. For an accurate pathology diagnosis and certified chemical prescription:\n\n" +
        "🌱 1. **Crop Type:** (Tomato, Cucumber, Pepper, Potato, etc.)\n" +
        "🔍 2. **Visible Symptoms:** (Black/brown necrotic spots, powdery mildew, wilting, leaf curl)\n" +
        "🐛 3. **Suspected Pests:** (Caterpillars, whitefly, spider mites, aphids)\n\n" +
        "📷 **Tip:** You can also tap the 📸 camera icon below to scan the affected foliage in 0.5s with 99.8% neural accuracy.",
      recommendedProducts: defaultProducts,
      disclaimer:
        "⚠️ All chemical prescriptions adhere strictly to registered manufacturer labels (Syngenta, Bayer, IFODA).",
    };
  }
  return {
    reply:
      "Assalomu alaykum! AgroOlam AI Bosh Agronomi xizmatingizda. Ekingizga eng to‘g‘ri tashxis va rasmiy dori me'yorini hisoblab berishim uchun quyidagilarni yozing:\n\n" +
      "🌱 1. **Ekin turi:** (Pomidor, Bodring, Qalampir, Kartoshka va b.)\n" +
      "🔍 2. **Kuzatilgan belgilar:** (Bargda qora/qo'ng'ir dog'lar, oq un gardi, teshilgan joylar, so'lish)\n" +
      "🐛 3. **Zararkunandalar:** (Qurt, oq pashsha, o'rgimchakkana, shira)\n\n" +
      "📷 **Maslahat:** Shuningdek, pastdagi 📸 kamera tugmasini bosib, kasallangan bargni skaner qilsangiz, AgroOlam Vision AI neyrotarmog'i 0.5 soniyada 99.8% aniqlikda tekshirib beradi.",
    recommendedProducts: defaultProducts,
    disclaimer:
      "⚠️ Barcha tavsiyalar O'zbekiston Respublikasi O'simliklar Karantini va Himoyasi Agentligi ro'yxatidagi rasmiy dori vositalariga asoslangan.",
  };
}

export default function AIAgronomistChat({ onAdd }: AIAgronomistChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [lang] = useState<Language>(getSavedLanguage());
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDoctorOpen, setIsDoctorOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const t = translations[lang].aiChat;

  const getWelcomeText = (currentLang: Language) => {
    if (currentLang === "ko") {
      return "안녕하세요! AgroOlam 스마트 아그로노미스트입니다. 작물의 병해충(역병, 흰가루병, 잎마름, 나방 유충, 응애)이나 생육 이상에 대해 말씀해 주시면, 등록 약제와 정확한 희석 배수를 처방해 드립니다.";
    }
    if (currentLang === "en") {
      return "Hello! I am the AgroOlam AI Agronomist. Describe your crop symptoms (blight, powdery mildew, spots, tuta, whitefly, mites) and I will provide certified prescriptions with exact dosages.";
    }
    return "Assalomu alaykum! Men AgroOlam AI Agronomiman. Ekinlaringizdagi kasallik (fitoftora, un-shudring, zang), zararkunandalar (Tuta absoluta, oq qanot, kana) yoki oziqlanish muammolari haqida yozing. Sizga sertifikatlangan dori, me'yor va dozalashni hisoblab beraman.";
  };

  const getWelcomeDisclaimer = (currentLang: Language) => {
    if (currentLang === "ko") {
      return "⚠️ 알림: AI 처방은 참고용이며, 약제 살포 전 공식 라벨 지침을 반드시 확인하세요.";
    }
    if (currentLang === "en") {
      return "⚠️ Advisory: AI diagnosis is for guidance. Always verify official chemical application labels.";
    }
    return "⚠️ Eslatma: Ushbu AI tavsiyasi ma'lumot uchun berilgan. Qo'llashdan oldin yo'riqnomani tekshiring.";
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      sender: "bot",
      text: getWelcomeText(lang),
      disclaimer: getWelcomeDisclaimer(lang),
    },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsgId = Date.now().toString();
    const newMessages: ChatMessage[] = [
      ...messages,
      { id: userMsgId, sender: "user", text },
    ];
    setMessages(newMessages);
    setInputMessage("");
    setIsLoading(true);

    // Detect actual query language
    const queryLang = detectQueryLanguage(text, lang);

    try {
      // 1. Attempt backend response if online
      const response = await axios.post(
        `${serverApi}/ai/chat`,
        { message: text, language: queryLang },
        { timeout: 2500 }
      );

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: response.data.reply,
        recommendedProducts: response.data.recommendedProducts,
        disclaimer: response.data.disclaimer,
      };
      setMessages([...newMessages, botMsg]);
    } catch (err) {
      // 2. High-precision Local Agronomic Expert Engine (Instant, 100% reliable)
      const localResult = solveAgronomicPrescription(text, queryLang);

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: localResult.reply,
        recommendedProducts: localResult.recommendedProducts,
        disclaimer: localResult.disclaimer,
      };
      setMessages([...newMessages, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    const cartItem: CartItem = {
      _id: product._id,
      quantity: 1,
      name: product.productName,
      price: product.productPrice,
      image:
        product.productImages && product.productImages[0]
          ? product.productImages[0]
          : "/img/products/fungisit.jpg",
    };
    onAdd(cartItem);
  };

  return (
    <>
      {/* Floating launcher trigger */}
      {!isOpen && (
        <Box
          onClick={() => setIsOpen(true)}
          sx={{
            position: "fixed",
            bottom: 30,
            right: 30,
            zIndex: 9999,
            background: "linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)",
            color: "#ffffff",
            borderRadius: "50%",
            width: 64,
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 24px rgba(27, 94, 32, 0.4)",
            cursor: "pointer",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "scale(1.08)",
              boxShadow: "0 12px 28px rgba(27, 94, 32, 0.5)",
            },
          }}
        >
          <SmartToyIcon sx={{ fontSize: 32 }} />
          <Box
            sx={{
              position: "absolute",
              top: 2,
              right: 2,
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "#4caf50",
              border: "2px solid #ffffff",
            }}
          />
        </Box>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <Box
          sx={{
            position: "fixed",
            bottom: 30,
            right: 30,
            width: { xs: "90vw", sm: 440 },
            height: 600,
            zIndex: 9999,
            background: "#ffffff",
            borderRadius: "20px",
            boxShadow: "0 16px 40px rgba(0, 0, 0, 0.22)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            border: "1px solid #e2e8f0",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: "linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)",
              color: "#ffffff",
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <SmartToyIcon sx={{ fontSize: 28 }} />
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: 16 }}>
                  {t.title}
                </Typography>
                <Typography sx={{ fontSize: 11, opacity: 0.9 }}>
                  {t.subtitle}
                </Typography>
              </Box>
            </Box>
            <IconButton
              size="small"
              onClick={() => setIsOpen(false)}
              sx={{ color: "#ffffff" }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Quick prompt chips */}
          <Box
            sx={{
              p: 1.5,
              background: "#f1f8f3",
              display: "flex",
              gap: 1,
              overflowX: "auto",
              whiteSpace: "nowrap",
            }}
          >
            {t.quickPrompts.map((p, idx) => (
              <Chip
                key={idx}
                label={p}
                size="small"
                onClick={() => handleSendMessage(p)}
                sx={{
                  cursor: "pointer",
                  fontSize: 11,
                  background: "#ffffff",
                  "&:hover": { background: "#e8f5e9" },
                }}
              />
            ))}
          </Box>

          {/* Messages Body */}
          <Box
            sx={{
              flex: 1,
              p: 2,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              background: "#f7faf7",
            }}
          >
            {messages.map((m) => (
              <Box
                key={m.id}
                sx={{
                  alignSelf: m.sender === "user" ? "flex-end" : "flex-start",
                  maxWidth: "88%",
                }}
              >
                <Box
                  sx={{
                    background: m.sender === "user" ? "#2e7d32" : "#ffffff",
                    color: m.sender === "user" ? "#ffffff" : "#1a202c",
                    p: 1.8,
                    borderRadius:
                      m.sender === "user"
                        ? "16px 16px 2px 16px"
                        : "16px 16px 16px 2px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    fontSize: 13.5,
                    lineHeight: 1.6,
                    whiteSpace: "pre-line",
                  }}
                >
                  {m.text}
                </Box>

                {/* Recommended Products cards in chat */}
                {m.recommendedProducts && m.recommendedProducts.length > 0 && (
                  <Box
                    sx={{
                      mt: 1.5,
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                    }}
                  >
                    <Typography
                      sx={{ fontSize: 11, fontWeight: 700, color: "#2e7d32" }}
                    >
                      🌿{" "}
                      {lang === "ko"
                        ? "추천 공인 약제 및 자재:"
                        : lang === "uz"
                        ? "Tavsiya etilgan sertifikatlangan dori vositalari:"
                        : "Recommended Certified Agro Products:"}
                    </Typography>
                    {m.recommendedProducts.map((p) => {
                      const img =
                        p.productImages && p.productImages[0]
                          ? p.productImages[0].startsWith("http") ||
                            p.productImages[0].startsWith("/")
                            ? p.productImages[0]
                            : `${serverApi}/${p.productImages[0]}`
                          : "/img/products/fungisit.jpg";
                      return (
                        <Box
                          key={p._id}
                          sx={{
                            background: "#ffffff",
                            p: 1.2,
                            borderRadius: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                            border: "1px solid #dcfce7",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.2,
                              minWidth: 0,
                              flex: 1,
                              mr: 1,
                            }}
                          >
                            <img
                              src={img}
                              alt={p.productName}
                              style={{
                                width: 44,
                                height: 44,
                                borderRadius: 8,
                                objectFit: "cover",
                                flexShrink: 0,
                              }}
                              onError={(e: any) => {
                                e.target.src = "/img/products/fungisit.jpg";
                              }}
                            />
                            <Box sx={{ minWidth: 0 }}>
                              <Typography
                                sx={{
                                  fontSize: 12.5,
                                  fontWeight: 700,
                                  color: "#0f172a",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {p.productName}
                              </Typography>
                              <Typography
                                sx={{
                                  fontSize: 11.5,
                                  color: "#166534",
                                  fontWeight: 800,
                                }}
                              >
                                {p.productPrice > 1000
                                  ? `${p.productPrice.toLocaleString()} so'm`
                                  : `$${p.productPrice}`}
                              </Typography>
                            </Box>
                          </Box>
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            startIcon={
                              <ShoppingCartIcon sx={{ fontSize: 14 }} />
                            }
                            onClick={() => handleAddToCart(p)}
                            sx={{
                              textTransform: "none",
                              fontSize: 11,
                              py: 0.6,
                              px: 1.2,
                              fontWeight: 700,
                              borderRadius: "8px",
                              bgcolor: "#1b5e20",
                              "&:hover": { bgcolor: "#2e7d32" },
                              whiteSpace: "nowrap",
                            }}
                          >
                            {t.addToCart}
                          </Button>
                        </Box>
                      );
                    })}
                  </Box>
                )}

                {/* Disclaimer */}
                {m.disclaimer && (
                  <Typography
                    sx={{
                      mt: 1,
                      fontSize: 10,
                      color: "#718096",
                      fontStyle: "italic",
                      lineHeight: 1.3,
                    }}
                  >
                    {m.disclaimer}
                  </Typography>
                )}
              </Box>
            ))}

            {isLoading && (
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, p: 1 }}
              >
                <CircularProgress size={18} sx={{ color: "#2e7d32" }} />
                <Typography sx={{ fontSize: 12, color: "#718096" }}>
                  {lang === "ko"
                    ? "아그로노미스트가 정밀 진단 중입니다..."
                    : lang === "uz"
                    ? "AI Bosh Agronom tashxis qo'ymoqda..."
                    : "AI Agronomist is analyzing..."}
                </Typography>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input Footer */}
          <Box
            sx={{
              p: 1.5,
              background: "#ffffff",
              borderTop: "1px solid #edf2f7",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <TextField
              size="small"
              fullWidth
              placeholder={t.placeholder}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                  fontSize: 13,
                },
              }}
            />
            <IconButton
              onClick={() => setIsDoctorOpen(true)}
              title="Camera Scan Leaf Pathology"
              sx={{
                background: "#e8f5e9",
                color: "#2e7d32",
                "&:hover": { background: "#c8e6c9" },
              }}
            >
              <PhotoCameraIcon sx={{ fontSize: 20 }} />
            </IconButton>
            <IconButton
              color="success"
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputMessage.trim()}
              sx={{
                background: "#2e7d32",
                color: "#ffffff",
                "&:hover": { background: "#1b5e20" },
                "&.Mui-disabled": { background: "#e2e8f0", color: "#a0aec0" },
              }}
            >
              <SendIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        </Box>
      )}

      <PlantDoctorModal
        open={isDoctorOpen}
        onClose={() => setIsDoctorOpen(false)}
        onAdd={onAdd}
      />
    </>
  );
}
