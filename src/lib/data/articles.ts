import { ArticleCategory, ArticleStatus } from "../enums/article.enum";
import { Article } from "../types/article";

export const initialArticles: Article[] = [
  {
    _id: "art-001",
    articleTitle: "Un-shudring (Powdery Mildew) kasalligini erta aniqlash va davolash usullari",
    articleBrief:
      "Issiqxonalar va ochiq dalada un-shudring paydo bo'lishining sabablari, oldini olish qoidalari va eng samarali fungitsidlar tavsiyasi.",
    articleContent: `Un-shudring (Powdery Mildew) — pomidor, bodring, poliz ekinlari va tokzorlarga eng ko'p zarar yetkazadigan zamburug'li kasalliklardan biridir. Kasallik odatda havo harorati 20-25°C bo'lib, havo namligi yuqori bo'lganda tez rivojlanadi.

### Asosiy alomatlari:
1. Bargning ustki qismida oqish, un sepilgandek dog'lar paydo bo'ladi.
2. Kasallik rivojlangach, barg sarg'ayib quriydi va to'kiladi.
3. Fotosintez to'xtashi natijasida hosil 40-60% gacha kamayadi.

### Davolash va Agro-Tavsiyalar:
- **Profilaktika:** Ekinlar orasida havo aylanishini ta'minlang, ortiqcha azotli o'g'it berishdan saqlaning.
- **Preparatlar:** Kasallikning boshlang'ich bosqichida Penkonazol (Topas) yoki Triadimefon asosidagi tizimli fungitsidlarni 10-14 kunlik oraliq bilan purkash tavsiya etiladi.
- **Ziddiyat qoidasi:** Oltingugurtli preparatlarni moyli vositalar sepilgandan keyin kamida 14 kun davomida ishlatish taqiqlanadi!`,
    articleCategory: ArticleCategory.KASALLIKLAR,
    articleStatus: ArticleStatus.ACTIVE,
    articleImage: "https://images.unsplash.com/photo-1592417817098-8f3d69103a89?auto=format&fit=crop&w=800&q=80",
    articleViews: 1420,
    articleLikes: 89,
    author: "Agro-Konsultant Usmonov",
    readingTime: "4 daqiqa",
    recommendedProducts: [
      {
        _id: "prod-topas",
        productName: "Topas 100 EC Fungitsid",
        productPrice: 45000,
        productImage: "/img/fresh.webp",
      },
    ],
    createdAt: "2026-10-20T10:00:00.000Z",
    updatedAt: "2026-10-20T10:00:00.000Z",
  },
  {
    _id: "art-002",
    articleTitle: "Issiqxona uchun serhosil bodring va pomidor urug'larini to'g'ri tanlash",
    articleBrief:
      "Gibrid F1 urug'larning afzalliklari, kasalliklarga chidamlilik ko'rsatkichlari va unuvchanlikni oshirish sirlari.",
    articleContent: `Urug' — bo'lajak hosilning poydevori. Noto'g'ri tanlangan urug' har qancha mehnat va dori sarflanmasin, kutilgan natijani bermaydi.

### Tanlashda nimalarga e'tibor berish lozim?
1. **Partenokarpik navlar:** Issiqxona sharoitida changlatuvchi hasharotlarsiz hosil beruvchi o'z-o'zidan changlanuvchi duragaylarni tanlang.
2. **Kasalliklarga immunitet:** To'plamda TmVF (Tamaki mozaikasi, Vertitsillyoz, Fuzarioz) ga chidamli belgisi borligini tekshiring.
3. **Ekologik moslashuvchanlik:** Mintaqangizning iqlimiga va tuproq sho'rlanishiga chidamli golland va mahalliy sara navlar eng yaxshi natijani ko'rsatadi.`,
    articleCategory: ArticleCategory.URUG_VA_HOSIL,
    articleStatus: ArticleStatus.ACTIVE,
    articleImage: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80",
    articleViews: 2150,
    articleLikes: 142,
    author: "Seleksioner Mutaxassis",
    readingTime: "5 daqiqa",
    recommendedProducts: [
      {
        _id: "prod-cucum",
        productName: "Gibrid Bodring Urug'i F1",
        productPrice: 65000,
        productImage: "/img/coming.webp",
      },
    ],
    createdAt: "2026-10-22T14:30:00.000Z",
    updatedAt: "2026-10-22T14:30:00.000Z",
  },
  {
    _id: "art-003",
    articleTitle: "Agro-kimyoda dori ziddiyatlari: Qaysi preparatlarni birga aralashtirib bo'lmaydi?",
    articleBrief:
      "Barglarni kuydirib qo'ymaslik uchun mis kuporosi, oltingugurt, fosforli va moyli preparatlarning kimyoviy moslik jadvali.",
    articleContent: `Dehqonlar vaqtni tejash uchun ko'pincha insektitsid, fungitsid va bargdan oziqlantiruvchi o'g'itlarni bir idishda aralashtirib (bak aralashmasi) sepishadi. Biroq, kimyoviy nomutanosiblik o'simlikni butunlay nobud qilishi mumkin!

### Eng xavfli 3 ta xato:
1. **Mis preparatlari va Oltingugurt:** Mis kuporosi, xloroksid kabi preparatlarni oltingugurt bilan aslo aralashtirmang. Bu fitotoksik birikma hosil qiladi.
2. **Kalsiy va Fosfor/Sulfatlar:** Kalsiyli o'g'itlar sulfat yoki fosfatlar bilan reaksiyaga kirishib, erimaydigan cho'kma hosil qiladi va purkagich filtrlarini yopib qo'yadi.
3. **Ishqoriy va Kislotali muhit:** Bordos suyuqligi kabi ishqoriy vositalar ko'pchilik zamonaviy fosfor-organik insektitsidlarning ta'sir kuchini yo'qotadi.`,
    articleCategory: ArticleCategory.AGRO_TAVSIYALAR,
    articleStatus: ArticleStatus.ACTIVE,
    articleImage: "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=800&q=80",
    articleViews: 3890,
    articleLikes: 278,
    author: "Agro-Kimyogar Usmonov",
    readingTime: "6 daqiqa",
    recommendedProducts: [],
    createdAt: "2026-10-24T09:15:00.000Z",
    updatedAt: "2026-10-24T09:15:00.000Z",
  },
  {
    _id: "art-004",
    articleTitle: "Kuzgi va qishki tayyorgarlik: Bog'larni zararkunandalardan tozalash",
    articleBrief:
      "Daraxt tanalarini oqlash, qishlovchi hasharotlarga qarshi erta profilaktika va yerga organik o'g'it berish tartibi.",
    articleContent: `Kuz mavsumi — kelasi yilgi mo'l hosilning garovidir. Aynan shu davrda daraxt po'stlog'i ostida va tuproqning yuqori qatlamida minglab zararkunanda qurtlar qishlashga kirishadi.

- Po'stloqni tozalash va ohak bilan oqlash.
- Temir yoki mis kuporosi bilan 3% li profilaktik purkash.
- Tomorqaga chirigan go'ng va fosfor-kaliyli o'g'itlarni kiritish.`,
    articleCategory: ArticleCategory.YANGILIKLAR,
    articleStatus: ArticleStatus.ACTIVE,
    articleImage: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80",
    articleViews: 940,
    articleLikes: 54,
    author: "Agrivia Tahririyati",
    readingTime: "3 daqiqa",
    recommendedProducts: [],
    createdAt: "2026-10-25T11:00:00.000Z",
    updatedAt: "2026-10-25T11:00:00.000Z",
  },
];

