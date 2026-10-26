/**
 * Agrivia Agro-Chemical Compatibility & Incompatibility Rules Matrix (Domain Moat)
 * Curated based on real-world agronomy and plant pathology standards.
 */

export interface ChemicalRule {
  substances: string[];
  severity: "DANGER" | "WARNING" | "INFO";
  title: string;
  reason: string;
  recommendation: string;
}

export const chemicalIncompatibilities: ChemicalRule[] = [
  {
    substances: ["copper", "sulfur"],
    severity: "DANGER",
    title: "Mis va Oltingugurt Ziddiyati (Copper + Sulfur Incompatibility)",
    reason:
      "Mis preparatlari (mis kuporosi, xloroksid) va oltingugurtni birgalikda aralashtirish kuchli fitotoksik birikma hosil qilib, o'simlik barglarini kuydiradi!",
    recommendation:
      "Ushbu preparatlarni aslo bir idishda aralashtirmang. Purkashlar orasida kamida 10-14 kun oraliq saqlang.",
  },
  {
    substances: ["captan", "mineral_oil"],
    severity: "DANGER",
    title: "Kaptan va Moyli Vositalar Ziddiyati (Captan + Mineral Oil)",
    reason:
      "Kaptan fungitsidini har qanday mineral yoki organik moylar bilan birga ishlatish barg to'qimalarining chuqur nekroziga sabab bo'ladi.",
    recommendation:
      "Moyli vositalar sepilgan bo'lsa, kamida 14 kundan keyingina Kaptan qo'llashga ruxsat etiladi.",
  },
  {
    substances: ["calcium", "phosphate"],
    severity: "WARNING",
    title: "Kalsiy va Fosfat Cho'kmasi (Calcium + Phosphate Precipitation)",
    reason:
      "Kalsiyli o'g'itlar fosfatli birikmalar bilan erimaydigan kalsiy-fosfat qattiq cho'kmasini hosil qiladi.",
    recommendation:
      "Aralashma idishida cho'kma hosil bo'ladi va purkagich filtrlarini yopib qo'yadi. Alohida purkash tavsiya etiladi.",
  },
];

export const weatherSprayingGuidelines = {
  maxWindSpeedKmH: 15, // km/h
  minTempC: 12,
  maxTempC: 28,
  rainCautionHours: 24,
  rules: [
    "Do not spray within 24 hours of expected rain (active substances wash off into soil).",
    "Spray during cool early mornings (06:00 - 09:00) or late evenings (18:00 - 20:30) to avoid solar lens effect burning.",
    "Do not spray during peak midday heat (> 30°C) as active substances rapidly evaporate and lose efficacy.",
  ],
};

