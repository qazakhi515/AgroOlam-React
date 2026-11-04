import {
  UZBEKISTAN_CROPS,
  UZBEKISTAN_AGRO_MEDICINES,
  UzbekistanCrop,
  CropDisease,
  AgroMedicine,
  CropVariety,
} from "../../lib/data/uzbekistanCropsDatabase";
import { Product } from "../../lib/types/product";
import { ProductCollection, ProductSize, ProductStatus } from "../../lib/enums/product.enum";

export interface DosageCalculationResult {
  medicineId: string;
  medicineName: string;
  brand: string;
  activeSubstance: string;
  areaInSotix: number;
  waterLiters: number;
  chemicalQuantity: number;
  chemicalUnit: "g" | "ml";
  dosagePer10LInstruction: string;
  preHarvestIntervalDays: number;
  estimatedPriceUzs: number;
  safetyAdvice: string;
}

export interface DiagnosisExportPayload {
  cropName: string;
  diseaseName: string;
  pathogen: string;
  urgency: string;
  symptoms: string;
  treatments: string[];
  recommendedMedicines: {
    name: string;
    brand: string;
    activeSubstance: string;
    dosagePer10L: string;
    phiDays: number;
    priceUzs: number;
  }[];
  consultationPhone: string;
}

class AgroDiagnosisDatabaseService {
  /**
   * Return all 11 registered agricultural crops in Uzbekistan
   */
  public getAllCrops(): UzbekistanCrop[] {
    return UZBEKISTAN_CROPS;
  }

  /**
   * Find crop by URL-friendly slug (e.g. "pomidor", "bodring", "balgar", "kartoshka")
   */
  public getCropBySlug(slug: string): UzbekistanCrop | undefined {
    const normalized = slug.trim().toLowerCase();
    return UZBEKISTAN_CROPS.find(
      (crop) =>
        crop.slug.toLowerCase() === normalized ||
        crop.id.toLowerCase() === normalized
    );
  }

  /**
   * Find crop by ID (e.g. "tomato", "cucumber", "bell_pepper")
   */
  public getCropById(id: string): UzbekistanCrop | undefined {
    return UZBEKISTAN_CROPS.find((c) => c.id.toLowerCase() === id.toLowerCase());
  }

  /**
   * Return all registered agrochemicals from Syngenta, Bayer, IFODA Agro, etc.
   */
  public getAllMedicines(): AgroMedicine[] {
    return Object.values(UZBEKISTAN_AGRO_MEDICINES);
  }

  /**
   * Get specific registered medicine by ID
   */
  public getMedicineById(id: string): AgroMedicine | undefined {
    return UZBEKISTAN_AGRO_MEDICINES[id];
  }

  /**
   * Find disease across all crops by unique disease code
   */
  public findDiseaseByCode(
    code: string
  ): { crop: UzbekistanCrop; disease: CropDisease } | undefined {
    const normalized = code.toUpperCase().trim();
    for (const crop of UZBEKISTAN_CROPS) {
      const disease = crop.diseases.find((d) => d.code.toUpperCase() === normalized);
      if (disease) {
        return { crop, disease };
      }
    }
    return undefined;
  }

  /**
   * Return all registered medicines recommended for a given disease
   */
  public getMedicinesForDisease(diseaseCode: string): AgroMedicine[] {
    const found = this.findDiseaseByCode(diseaseCode);
    if (!found) return [];

    return found.disease.recommendedMedicineIds
      .map((medId) => UZBEKISTAN_AGRO_MEDICINES[medId])
      .filter((m): m is AgroMedicine => Boolean(m));
  }

  public getMedicineImage(id: string): string {
    const map: Record<string, string> = {
      ridomil_gold: "/img/products/RidomilGoldSL_Gallon_ChemicalWarehouse_512x512.webp",
      infinito: "/img/products/bayerdori.jpg",
      ampligo: "/img/products/fungisit.jpg",
      koragen: "/img/products/Belt-SC-480-1Ltr.webp",
      topas: "/img/products/score.webp",
      quadris: "/img/products/Syngenta-Miravis-Duo.webp",
      aktara: "/img/products/Actara-25.webp",
      teppeki: "/img/products/teppeki.webp",
      vertimek: "/img/products/vertimec.webp",
      envidor: "/img/products/envidor.jpg",
      proclaim: "/img/products/Proclaim-05-SG-250g.jpg",
      luna_tranquility: "/img/products/lunatranquilty.jpeg",
      aliett: "/img/products/alliete.jpeg",
      kuporoksat: "/img/products/cuproxat.jpeg",
      previkur_energy: "/img/products/bayerdori.jpg",
      xom_copper: "/img/products/cuproxat.jpeg",
      kumulus: "/img/products/fungisit.jpg",
      fitosporin: "/img/products/gomus.jpg",
    };
    return map[id] || "/img/products/fungisit.jpg";
  }

  /**
   * Convert agro medicine database entry into a Product model compatible with Cart and Shop
   */
  public convertMedicineToProduct(medicine: AgroMedicine): Product {
    return {
      _id: `crop_med_${medicine.id}`,
      productCollection: ProductCollection.DRINK, // fallback or cast to any if needed
      productStatus: ProductStatus.PROCESS,
      productName: `${medicine.name} (${medicine.brand})`,
      productPrice: medicine.priceUzsEstimate,
      productLeftCount: 50,
      productSize: ProductSize.NORMAL,
      productVolume: 0.5,
      productDesc: `${medicine.description} Faol modda: ${medicine.activeSubstance}. Tavsiya dozasi: ${medicine.dosagePer10LWater}. PHI: ${medicine.preHarvestIntervalDays} kun.`,
      productImages: [this.getMedicineImage(medicine.id)],
      productViews: 450,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /**
   * Calculate precise chemical amount and water volume required for a given area in Sotix (1 sotix = 100 m2)
   * Standard agricultural norm: 1 sotix ~ 10 liters of spray solution.
   */
  public calculateDosage(
    medicineId: string,
    areaInSotix: number
  ): DosageCalculationResult | null {
    const medicine = this.getMedicineById(medicineId);
    if (!medicine || areaInSotix <= 0) return null;

    // 1 sotix = 10L water for standard field/greenhouse foliage spraying
    const waterLiters = Math.max(1, Math.round(areaInSotix * 10));

    // Parse dosage per 10L (e.g., "25 gramm", "15 ml", "30-40 ml", "5 g")
    const rawDosage = medicine.dosagePer10LWater.toLowerCase();
    const isLiquid = rawDosage.includes("ml") || rawDosage.includes("l");
    const unit: "g" | "ml" = isLiquid ? "ml" : "g";

    // Extract numerical value or average of range
    const numbers = rawDosage.match(/\d+(\.\d+)?/g);
    let basePer10L = 20; // default fallback

    if (numbers && numbers.length > 0) {
      if (numbers.length === 1) {
        basePer10L = parseFloat(numbers[0]);
      } else {
        // Average if range given, e.g. "30-40" -> 35
        basePer10L = (parseFloat(numbers[0]) + parseFloat(numbers[1])) / 2;
      }
    }

    const totalChemical = Math.round(basePer10L * areaInSotix * 10) / 10;
    const packsNeeded = Math.max(1, Math.ceil(areaInSotix / 5)); // Estimate 1 standard pack per 5 sotix
    const estimatedPriceUzs = medicine.priceUzsEstimate * packsNeeded;

    return {
      medicineId: medicine.id,
      medicineName: medicine.name,
      brand: medicine.brand,
      activeSubstance: medicine.activeSubstance,
      areaInSotix,
      waterLiters,
      chemicalQuantity: totalChemical,
      chemicalUnit: unit,
      dosagePer10LInstruction: medicine.dosagePer10LWater,
      preHarvestIntervalDays: medicine.preHarvestIntervalDays,
      estimatedPriceUzs,
      safetyAdvice: `Xavflilik sinfi: ${medicine.hazardClass}. Hosilni yig'ishdan kamida ${medicine.preHarvestIntervalDays} kun oldin purkash to'xtatilishi shart. Himoya kiyimi va respirator taqing.`,
    };
  }

  /**
   * Search crops, varieties, and diseases by search term
   */
  public search(
    query: string
  ): {
    crops: UzbekistanCrop[];
    diseases: { crop: UzbekistanCrop; disease: CropDisease }[];
    medicines: AgroMedicine[];
  } {
    const q = query.trim().toLowerCase();
    if (!q) {
      return { crops: [], diseases: [], medicines: [] };
    }

    const matchedCrops = UZBEKISTAN_CROPS.filter(
      (c) =>
        c.nameUz.toLowerCase().includes(q) ||
        c.nameRu.toLowerCase().includes(q) ||
        c.nameEn.toLowerCase().includes(q) ||
        c.latinName.toLowerCase().includes(q)
    );

    const matchedDiseases: { crop: UzbekistanCrop; disease: CropDisease }[] = [];
    UZBEKISTAN_CROPS.forEach((crop) => {
      crop.diseases.forEach((d) => {
        if (
          d.nameUz.toLowerCase().includes(q) ||
          d.nameLat.toLowerCase().includes(q) ||
          d.symptomsUz.toLowerCase().includes(q) ||
          d.code.toLowerCase().includes(q)
        ) {
          matchedDiseases.push({ crop, disease: d });
        }
      });
    });

    const matchedMedicines = Object.values(UZBEKISTAN_AGRO_MEDICINES).filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.activeSubstance.toLowerCase().includes(q) ||
        m.brand.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q)
    );

    return {
      crops: matchedCrops,
      diseases: matchedDiseases,
      medicines: matchedMedicines,
    };
  }

  /**
   * Generate an agronomic prescription summary ready for export or Telegram dispatch
   */
  public generatePrescriptionPayload(
    diseaseCode: string,
    areaInSotix: number = 10
  ): DiagnosisExportPayload | null {
    const found = this.findDiseaseByCode(diseaseCode);
    if (!found) return null;

    const { crop, disease } = found;
    const medicines = this.getMedicinesForDisease(diseaseCode);

    return {
      cropName: `${crop.nameUz} (${crop.latinName})`,
      diseaseName: disease.nameUz,
      pathogen: disease.nameLat,
      urgency: disease.urgencyLevel,
      symptoms: disease.symptomsUz,
      treatments: disease.treatmentsUz,
      recommendedMedicines: medicines.map((m) => ({
        name: m.name,
        brand: m.brand,
        activeSubstance: m.activeSubstance,
        dosagePer10L: m.dosagePer10LWater,
        phiDays: m.preHarvestIntervalDays,
        priceUzs: m.priceUzsEstimate,
      })),
      consultationPhone: "+998 (71) 200-44-88",
    };
  }
}

export const agroDiagnosisDbService = new AgroDiagnosisDatabaseService();
export default agroDiagnosisDbService;
