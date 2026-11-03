/**
 * AgroOlam Automated Treatment & Quarantine Reminder Service
 * Mijoz dori sotib olgach yoki tashxis qo'yilgach, 7 kundan so'ng 2-bosqich purkash
 * va karantin (hosil terish) davri tugashini avtomatik eslatish mexanizmi.
 */

export interface TreatmentReminder {
  id: string;
  orderId?: string;
  customerName: string;
  customerPhone: string;
  cropName: string;
  productName: string;
  brand: string;
  intervalDays: number; // Masalan: 7 kun
  quarantineDays: number; // Masalan: 14 kun
  firstTreatmentDate: string; // Boshlangan sana
  secondSprayingDate: string; // 2-marta sepish sanasi
  harvestSafeDate: string; // Karantin tugash sanasi
  status: "SCHEDULED" | "SENT" | "CANCELLED";
  channel: "SMS" | "TELEGRAM";
  messageSpraying: string;
  messageQuarantine: string;
  createdAt: string;
}

const LOCAL_REMINDERS_KEY = "agroolam_treatment_reminders_db";

export interface DrugRuleInfo {
  intervalDays: number;
  quarantineDays: number;
  brand: string;
  cropSuggestion: string;
}

class TreatmentReminderService {
  /**
   * Derive agronomic interval & pre-harvest interval (PHI) from medicine name
   */
  public static getRuleForProduct(productName: string): DrugRuleInfo {
    const lower = productName.toLowerCase();

    if (lower.includes("ridomil")) {
      return {
        intervalDays: 7,
        quarantineDays: 14,
        brand: "Syngenta",
        cropSuggestion: "Pomidor / Kartoshka",
      };
    }
    if (lower.includes("infinito")) {
      return {
        intervalDays: 10,
        quarantineDays: 14,
        brand: "Bayer",
        cropSuggestion: "Kartoshka / Sabzavotlar",
      };
    }
    if (lower.includes("topas")) {
      return {
        intervalDays: 7,
        quarantineDays: 5,
        brand: "Syngenta",
        cropSuggestion: "Bodring / Uzum",
      };
    }
    if (lower.includes("skor")) {
      return {
        intervalDays: 10,
        quarantineDays: 14,
        brand: "Syngenta",
        cropSuggestion: "Olma / Mevali Bog'",
      };
    }
    if (lower.includes("ampligo")) {
      return {
        intervalDays: 14,
        quarantineDays: 21,
        brand: "Syngenta",
        cropSuggestion: "Pomidor (Tuta absoluta) / G'o'za",
      };
    }
    if (lower.includes("koragen")) {
      return {
        intervalDays: 14,
        quarantineDays: 21,
        brand: "FMC",
        cropSuggestion: "Pomidor / Kolorado / Meva qurti",
      };
    }
    if (lower.includes("previkur")) {
      return {
        intervalDays: 10,
        quarantineDays: 3,
        brand: "Bayer",
        cropSuggestion: "Bodring / Tomchilatib sug'orish",
      };
    }
    if (lower.includes("kosayd") || lower.includes("kocide") || lower.includes("xom")) {
      return {
        intervalDays: 7,
        quarantineDays: 15,
        brand: "IFODA / Bio-Tech",
        cropSuggestion: "Meva daraxtlari / Ochiq maydon",
      };
    }

    // Default agronomic safeguard rule
    return {
      intervalDays: 7,
      quarantineDays: 14,
      brand: "AgroOlam Rasmiy",
      cropSuggestion: "Sabzavot / Issiqxona",
    };
  }

  /**
   * Calculate future calendar date by adding days
   */
  public static addDays(startDateStr: string, days: number): string {
    const d = new Date(startDateStr);
    d.setDate(d.getDate() + days);
    return d.toISOString().split("T")[0];
  }

  /**
   * Retrieve all saved reminders from storage
   */
  public static getAllReminders(): TreatmentReminder[] {
    try {
      const raw = localStorage.getItem(LOCAL_REMINDERS_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn("Could not load treatment reminders:", e);
    }
    return [];
  }

  /**
   * Save reminders list
   */
  public static saveAllReminders(reminders: TreatmentReminder[]): void {
    try {
      localStorage.setItem(LOCAL_REMINDERS_KEY, JSON.stringify(reminders));
    } catch (e) {
      console.warn("Could not save treatment reminders:", e);
    }
  }

  /**
   * Schedule a new treatment and quarantine reminder
   */
  public static scheduleReminder(params: {
    orderId?: string;
    customerName: string;
    customerPhone: string;
    cropName: string;
    productName: string;
    firstTreatmentDate?: string;
    intervalDays?: number;
    quarantineDays?: number;
    channel?: "SMS" | "TELEGRAM";
    lang?: "uz" | "en" | "ko";
  }): TreatmentReminder {
    const today = params.firstTreatmentDate || new Date().toISOString().split("T")[0];
    const rule = this.getRuleForProduct(params.productName);

    const intervalDays = params.intervalDays || rule.intervalDays;
    const quarantineDays = params.quarantineDays || rule.quarantineDays;

    const secondDate = this.addDays(today, intervalDays);
    const harvestDate = this.addDays(today, quarantineDays);

    const lang = params.lang || "uz";

    // Personalized AI Messages
    const messageSpraying =
      lang === "uz"
        ? `🌿 AgroOlam Eslatmasi: Assalomu alaykum, ${params.customerName}! ${intervalDays} kun oldin olingan "${params.productName}" preparatini ${params.cropName} ekiniga 2-bosqich purkash vaqti keldi. Barglardagi zang yoki nekroz to'xtaganini tekshirib, profilaktikani yakunlang.`
        : lang === "ko"
        ? `🌿 AgroOlam 알림: 안녕하세요, ${params.customerName}님! ${intervalDays}일 전 처방된 "${params.productName}" 약제의 2차 살포 시기입니다 (${params.cropName}). 병반 억제 여부를 확인하시고 2차 방제를 완료하세요.`
        : `🌿 AgroOlam Reminder: Hello ${params.customerName}! It's time for the 2nd application of "${params.productName}" on your ${params.cropName} (${intervalDays} days interval). Inspect foliage for lesion arrest and complete treatment.`;

    const messageQuarantine =
      lang === "uz"
        ? `🍎 AgroOlam Karantin Xabari: ${params.customerName}, "${params.productName}" dori vositasining ${quarantineDays} kunlik kutish (karantin) muddati tugadi. ${params.cropName} hosilini xavfsiz terib, bozorga chiqarishingiz mumkin!`
        : lang === "ko"
        ? `🍎 AgroOlam 안전 수확 안내: ${params.customerName}님, "${params.productName}" 약제의 ${quarantineDays}일간 안전사용기준(PHI) 기간이 종료되었습니다. 안심하고 수확 및 출하하세요!`
        : `🍎 AgroOlam Harvest Safety: ${params.customerName}, the ${quarantineDays}-day pre-harvest interval (PHI) for "${params.productName}" has elapsed. Your ${params.cropName} is now safe to harvest and market!`;

    const newReminder: TreatmentReminder = {
      id: `rem_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      orderId: params.orderId,
      customerName: params.customerName.trim() || "Xurmatli Dehqon",
      customerPhone: params.customerPhone.trim() || "+998 90 123 45 67",
      cropName: params.cropName.trim() || rule.cropSuggestion,
      productName: params.productName.trim(),
      brand: rule.brand,
      intervalDays,
      quarantineDays,
      firstTreatmentDate: today,
      secondSprayingDate: secondDate,
      harvestSafeDate: harvestDate,
      status: "SCHEDULED",
      channel: params.channel || "SMS",
      messageSpraying,
      messageQuarantine,
      createdAt: new Date().toISOString(),
    };

    const all = this.getAllReminders();
    all.unshift(newReminder);
    this.saveAllReminders(all);

    return newReminder;
  }

  /**
   * Filter reminders for an order
   */
  public static getRemindersForOrder(orderId: string): TreatmentReminder[] {
    const all = this.getAllReminders();
    return all.filter((r) => r.orderId === orderId);
  }

  /**
   * Delete reminder
   */
  public static deleteReminder(id: string): void {
    const all = this.getAllReminders().filter((r) => r.id !== id);
    this.saveAllReminders(all);
  }
}

export default TreatmentReminderService;

