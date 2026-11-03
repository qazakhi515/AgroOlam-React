import { ArticleCategory, ArticleStatus } from "../enums/article.enum";
import { Article } from "../types/article";

export const initialArticles: Article[] = [
  {
    _id: "art-news-001",
    articleTitle: "Issiqxonalar uchun tabiiy gaz va ko'mir ta'minoti bo'yicha yangi imtiyozli tariflar va davlat kompensatsiyasi tasdiqlandi",
    articleBrief:
      "Vazirlar Mahkamasining issiqxona xo'jaliklarini qishki mavsumda qo'llab-quvvatlash bo'yicha yangi qarori: ko'mir sotib olish uchun imtiyozli kreditlar va energiya kompensatsiyasi mexanizmi.",
    articleContent: `O'zbekiston Respublikasi Qishloq xo'jaligi vazirligi hamda Energetika vazirligi tomonidan 2026-2027 yillar qishki mavsumida issiqxona xo'jaliklarining uzluksiz ishlashini ta'minlash bo'yicha maxsus chora-tadbirlar dasturi tasdiqlandi.

### Asosiy yengilliklar va imtiyozlar:
1. **Ko'mir yoqilg'isiga o'tgan issiqxonalar:**
   - Har bir sotix issiqxona maydoni uchun talab etiladigan ko'mir xarajatining 20 foizgacha bo'lgan qismi davlat byudjeti tomonidan kompensatsiya qilinadi.
   - Sifatli ko'mir yoqilg'isini to'g'ridan-to'g'ri konlardan yetkazib berish bo'yicha hududiy omborlar faoliyati yo'lga qo'yildi.

2. **Gaz ta'minotiga ulangan issiqxonalar:**
   - Hosil pishib yetilish davrida (noyabr-fevral) tabiiy gaz bosimini barqaror saqlash bo'yicha mas'ul dispetcherlik guruhi tuzildi.
   - To'lovlarni oldindan 100% to'lash talabi bekor qilinib, 50% bo'lib to'lash tizimi joriy etildi.

3. **Imtiyozli kredit liniyalari:**
   - Tijorat banklari orqali issiqxona jihozlari, zamonaviy isitish qozonlari va 3 qavatli termo-diffuz plyonkalar sotib olish uchun yillik 14 foizlik 3 yillik imtiyozli kreditlar ajratilmoqda.

Ushbu qaror Farg'ona vodiysi, Samarqand, Toshkent va Buxoro viloyatlaridagi 3,000 dan ziyod issiqxona xo'jaliklarining hosildorligini sovuq urishidan saqlashga xizmat qiladi.`,
    articleCategory: ArticleCategory.YANGILIKLAR,
    articleStatus: ArticleStatus.ACTIVE,
    articleImage: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80",
    articleViews: 4120,
    articleLikes: 342,
    author: "Qishloq xo'jaligi vazirligi (Agro.uz)",
    source: "🏛️ Agro.uz Rasmiy Axborot",
    sourceUrl: "https://agro.uz",
    tag: "Davlat Imtiyozlari",
    readingTime: "5 daqiqa",
    recommendedProducts: [
      {
        _id: "prod_greenhouse_film_3layer",
        productName: "3 Qavatli Termo-Diffuz Plyonka 150 mkr",
        productPrice: 3450000,
        productImage: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80",
      },
    ],
    createdAt: "2026-10-28T09:00:00.000Z",
    updatedAt: "2026-10-28T09:00:00.000Z",
  },
  {
    _id: "art-news-002",
    articleTitle: "EastFruit: O'zbekiston pomidor va bodring eksporti bo'yicha yangi bozorlarga chiqmoqda — Narxlar tahlili",
    articleBrief:
      "Farg'ona vodiysi va Andijon issiqxonalarida yetishtirilgan sifatli pomidorlar Dubay, Qatar va Yevropa bozorlariga avia-yuk orqali yetkazib berila boshlandi.",
    articleContent: `Xalqaro meva-sabzavot tahliliy agentligi EastFruit ma'lumotlariga ko'ra, O'zbekistonda yetishtirilgan issiqxona pomidori va bodringlarining eksport geografiyasi sezilarli darajada kengaydi.

### Bozor tahlili va narxlar:
- **Ichki bozor narxlari:** Andijon va Asaka ulgurji bozorlarida 1-navli pushti pomidor narxi 14,000 - 18,000 so'm oralig'ida barqarorlashgan.
- **Tashqi talab:** Fors ko'rfazi mamlakatlarida O'zbekistonning pushti va to'q qizil go'shtdor navlariga talab 40% ga oshgan.
- **Sifat talablari:** Eksportyorlar uchun pestitsid qoldiqlari bo'yicha qat'iy xalqaro GlobalG.A.P sertifikati talab etilmoqda. AgroOlam AI skaneri va organik preparatlardan foydalanayotgan fermerlar bu talablarni oson bajaryaptilar.`,
    articleCategory: ArticleCategory.YANGILIKLAR,
    articleStatus: ArticleStatus.ACTIVE,
    articleImage: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80",
    articleViews: 3280,
    articleLikes: 215,
    author: "EastFruit Uzbekistan",
    source: "📊 EastFruit Tahlil",
    sourceUrl: "https://east-fruit.com",
    tag: "Eksport & Narxlar",
    readingTime: "4 daqiqa",
    recommendedProducts: [],
    createdAt: "2026-10-27T14:30:00.000Z",
    updatedAt: "2026-10-27T14:30:00.000Z",
  },
  {
    _id: "art-news-003",
    articleTitle: "O'simliklar karantini agentligi: Issiqxonalarda Janubiy Amerika pomidor kuyasi (Tuta Absoluta)ga qarshi favqulodda biologik kurash choralari",
    articleBrief:
      "Tuta Absoluta zararkunandasi tarqalishining oldini olish uchun feromon tutqichlar o'rnatish, biologik entomofaglarni qo'llash va samarali insektitsidlar ro'yxati.",
    articleContent: `O'simliklar karantini va himoyasi agentligi issiqxona egalarini Janubiy Amerika pomidor kuyasi (Tuta Absoluta) xavfidan ogohlantiradi. Zararkunanda vaqtida to'xtatilmasa, 10-15 kunda hosilning 80-100% qismini nobud qilishi mumkin.

### Kurashishning kompleks choralari:
1. **Feromon tutqichlar:** Har 5 sotix maydonga kamida 2-3 dona suvli yoki yelimli feromon tutqichlar o'rnatilishi shart.
2. **Biologik usul:** Triagramma va Gabrobrakon kabi foydali hasharotlarni har 10-12 kunda issiqxonaga chiqarish lichinkalarni 70% gacha qiradi.
3. **Kimyoviy himoya:** Koragen (Xlorantraniliprol), Prokleym (Emamektin benzoat) yoki Ampligo kabi vositalarni o'zaro almashtirib sepish tavsiya etiladi. Ketma-ket bir xil dori sepish rezistentlikni (o'rganib qolishni) keltirib chiqaradi!`,
    articleCategory: ArticleCategory.KASALLIKLAR,
    articleStatus: ArticleStatus.ACTIVE,
    articleImage: "/img/disease.jpg",
    articleViews: 5410,
    articleLikes: 462,
    author: "O'simliklar karantini va himoyasi agentligi",
    source: "🛡️ Karantin.uz Rasmiy",
    sourceUrl: "https://karantin.uz",
    tag: "Favqulodda Ogohlantirish",
    readingTime: "6 daqiqa",
    recommendedProducts: [
      {
        _id: "agro_actara_4",
        productName: "Aktara 25 WG Insektitsid (Syngenta)",
        productPrice: 38000,
        productImage: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=600&q=80",
      },
    ],
    createdAt: "2026-10-26T11:20:00.000Z",
    updatedAt: "2026-10-26T11:20:00.000Z",
  },
  {
    _id: "art-news-004",
    articleTitle: "Tomchilatib sug'orish va suv tejovchi aqlli tizimlarni joriy etgan fermerlarga 50% gacha davlat subsidiyasi ajratilmoqda",
    articleBrief:
      "Suv resurslaridan samarali foydalanish maqsadida tomchilatib sug'orish uskunalarini o'rnatgan agrofirmalarga davlat tomonidan beriladigan to'lovlar tartibi.",
    articleContent: `O'zbekistonda suv taqchilligining oldini olish maqsadida tomchilatib va yomg'irlatib sug'orish uskunalarini joriy qilgan dehqon va fermerlarga subsidiyalar to'lash soddalashtirildi.

### Subsidiya miqdorlari va talablar:
- 1 gektar issiqxona uchun tomchilatib sug'orish uskunalarini sotib olish xarajatining 8 mln so'mgacha bo'lgan qismi qoplanadi.
- Avtomatik o'g'itlash va namlik datchiklari o'rnatilganda qo'shimcha 30% subsidiya beriladi.
- Arizalar "Agro-Subsidiya" yagona portali orqali elektron qabul qilinadi va 10 kun ichida fermerning hisob raqamiga o'tkaziladi.`,
    articleCategory: ArticleCategory.YANGILIKLAR,
    articleStatus: ArticleStatus.ACTIVE,
    articleImage: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=800&q=80",
    articleViews: 2890,
    articleLikes: 198,
    author: "«Agro-Islohot» Axborot markazi",
    source: "🏛️ Davlat Subsidiyasi",
    tag: "Suv Tejash",
    readingTime: "4 daqiqa",
    recommendedProducts: [
      {
        _id: "prod_smart_sensor_iot",
        productName: "Smart Issiqxona Termo-Gidrometr Sensori (IoT Wi-Fi)",
        productPrice: 450000,
        productImage: "/img/products/smart_sensor.jpg",
      },
    ],
    createdAt: "2026-10-25T16:00:00.000Z",
    updatedAt: "2026-10-25T16:00:00.000Z",
  },
  {
    _id: "art-news-005",
    articleTitle: "2026-yilda O'zbekistonda qo'llashga ruxsat etilgan yangi xalqaro fungitsid va insektitsidlar ro'yxati (Bayer, Syngenta, IFODA)",
    articleBrief:
      "Qishloq xo'jaligi kimyoviy preparatlar komissiyasi tomonidan tasdiqlangan yangi avlod preparatlari, kutish muddatlari (PHI) va qo'llash normalari.",
    articleContent: `Zararkunanda va kasalliklarning eski dorilarga o'rganib qolishi (rezistentlik) tufayli O'zbekiston Respublikasi Kimyoviy preparatlar davlat komissiyasi yangi avlod vositalarini ro'yxatdan o'tkazdi.

### Eng samarali yangi preparatlar:
1. **Ridomil Gold R:** Pomidor va bodringda fitoftora va peronosporozga qarshi mis va mefenoksam uyg'unligi. Kutish muddati: 14 kun.
2. **Topas 100 EC:** Un-shudringga qarshi eng tez ta'sir qiluvchi tizimli fungitsid. Ichki to'qimalarga 2 soatda singib, 14 kunlik himoya yaratadi.
3. **Previkur Enerji:** Ildiz chirishi va qora oyoqqa qarshi urug' unib chiqish davrida tomchilatib yuboriladigan eng xavfsiz vosita.`,
    articleCategory: ArticleCategory.AGRO_TAVSIYALAR,
    articleStatus: ArticleStatus.ACTIVE,
    articleImage: "/img/agrolab.jpg",
    articleViews: 4890,
    articleLikes: 380,
    author: "Bosh Agro-Farmatsevt Usmonov",
    source: "🔬 Agro-Kimyo Tahlili",
    tag: "Rasmiy Ro'yxat",
    readingTime: "5 daqiqa",
    recommendedProducts: [
      {
        _id: "agro_ridomil_gold_5",
        productName: "Ridomil Gold MZ Fungitsid (Syngenta, 1 kg)",
        productPrice: 145000,
        productImage: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=600&q=80",
      },
    ],
    createdAt: "2026-10-24T10:15:00.000Z",
    updatedAt: "2026-10-24T10:15:00.000Z",
  },
  {
    _id: "art-news-006",
    articleTitle: "Kuzgi va qishki tayyorgarlik: Issiqxona salafanlarini qora sovuq va kuchli shamoldan himoyalash",
    articleBrief:
      "Plyonkalarning tarangligi, kondensatga qarshi Antifog qoplamasi va qor bosishiga qarshi qo'shimcha tirgovichlar o'rnatish qoidalari.",
    articleContent: `Qishki davrda issiqxona plyonkalari sovuq shamol va qor yuki ta'sirida eng ko'p shikastlanadi. 150-200 mikronli plyonkani bir necha yil xizmat qildirishi uchun quyidagi qoidalarga amal qilish shart:

### 4 ta asosiy qoida:
- **Taranglikni tekshirish:** Havo sovishi bilan plyonka qisqaradi, shuning uchun juda qattiq tortilgan salafan qishda darz ketishi mumkin. Optimal tortish kerak.
- **Antifog effekti:** Ichki tomonda suv tomchilari barglarga tushmasligi uchun maxsus termo-diffuz 3 qavatli salafanlardan foydalaning.
- **Qor tushirish mexanizmi:** Qor qalin yog'ganda issiqxona tepasida qolib ketmasligi uchun konstruksiya burchagi kamida 25-30 daraja bo'lishi lozim.`,
    articleCategory: ArticleCategory.YANGILIKLAR,
    articleStatus: ArticleStatus.ACTIVE,
    articleImage: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80",
    articleViews: 3100,
    articleLikes: 245,
    author: "Issiqxona Muhandislari Uyushmasi",
    source: "🏗️ Issiqxona Texnologiyalari",
    tag: "Qishga Tayyorgarlik",
    readingTime: "4 daqiqa",
    recommendedProducts: [],
    createdAt: "2026-10-23T15:00:00.000Z",
    updatedAt: "2026-10-23T15:00:00.000Z",
  },
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
    articleImage: "/img/disease.jpg",
    articleViews: 1420,
    articleLikes: 89,
    author: "AgroOlam Vision AI Patologiya Guruhi",
    source: "🔬 AgroOlam AI Tadqiqot",
    tag: "Kasallik Tashxisi",
    readingTime: "4 daqiqa",
    recommendedProducts: [
      {
        _id: "prod-topas",
        productName: "Topas 100 EC Fungitsid",
        productPrice: 45000,
        productImage: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=600&q=80",
      },
    ],
    createdAt: "2026-10-22T10:00:00.000Z",
    updatedAt: "2026-10-22T10:00:00.000Z",
  },
  {
    _id: "art-002",
    articleTitle: "Issiqxona uchun serhosil bodring va pomidor urug'larini to'g'ri tanlash (F1 gibridlar tahlili)",
    articleBrief:
      "Gibrid F1 urug'larning afzalliklari, kasalliklarga chidamlilik ko'rsatkichlari va unuvchanlikni oshirish sirlari.",
    articleContent: `Urug' — bo'lajak hosilning poydevori. Noto'g'ri tanlangan urug' har qancha mehnat va dori sarflanmasin, kutilgan natijani bermaydi.

### Tanlashda nimalarga e'tibor berish lozim?
1. **Partenokarpik navlar:** Issiqxona sharoitida changlatuvchi hasharotlarsiz hosil beruvchi o'z-o'zidan changlanuvchi duragaylarni tanlang (masalan, Severin F1).
2. **Kasalliklarga immunitet:** To'plamda TmVF (Tamaki mozaikasi, Vertitsillyoz, Fuzarioz) ga chidamli belgisi borligini tekshiring.
3. **Ekologik moslashuvchanlik:** Mintaqangizning iqlimiga va tuproq sho'rlanishiga chidamli golland va mahalliy sara navlar eng yaxshi natijani ko'rsatadi.`,
    articleCategory: ArticleCategory.URUG_VA_HOSIL,
    articleStatus: ArticleStatus.ACTIVE,
    articleImage: "/img/harvest.jpg",
    articleViews: 2150,
    articleLikes: 142,
    author: "Seleksioner Mutaxassis",
    source: "🌱 Urug'chilik Klasteri",
    tag: "F1 Gibridlar",
    readingTime: "5 daqiqa",
    recommendedProducts: [
      {
        _id: "agro_severin_cucumber_2",
        productName: "Severin F1 Partenokarpik Bodring Urug'i (Enza Zaden)",
        productPrice: 390000,
        productImage: "https://images.unsplash.com/photo-1449339854873-750e6913301b?auto=format&fit=crop&w=600&q=80",
      },
    ],
    createdAt: "2026-10-21T14:30:00.000Z",
    updatedAt: "2026-10-21T14:30:00.000Z",
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
    articleImage: "/img/agrolab.jpg",
    articleViews: 3890,
    articleLikes: 278,
    author: "Agro-Kimyogar Usmonov",
    source: "🧪 Kimyoviy Himoya",
    tag: "Dori Mosligi",
    readingTime: "6 daqiqa",
    recommendedProducts: [],
    createdAt: "2026-10-20T09:15:00.000Z",
    updatedAt: "2026-10-20T09:15:00.000Z",
  },
  {
    _id: "art-004",
    articleTitle: "Farg'ona vodiysi va Andijonda intensiv ko'chatchilik: Payvandlangan pomidor ko'chatlarining afzalliklari",
    articleBrief:
      "Yovvoyi ildizpoyaga payvandlangan pomidor va bodring ko'chatlari kasalliklarga 3 barobar chidamli bo'lib, hosilni 45% ga oshiradi.",
    articleContent: `Andijon (Asaka va Shahrixon) tumanlaridagi ixtisoslashgan ko'chatchilik issiqxonalarida payvandlash (grafting) usuli keng qo'llanilmoqda.

### Nega payvand ko'chat ekish foydali?
- **Fuzarioz va nematodaga immunitet:** Yovvoyi pomidor ildizi tuproqdagi har qanday nematoda va zamburug'larga mutlaqo chidamli bo'ladi.
- **Suv va o'g'itni kuchli so'rish:** Payvandlangan tupning ildiz tizimi 2 barobar chuqur va keng tarqaladi.
- **Kamroq dori sarfi:** O'simlikning tabiiy immuniteti kuchli bo'lgani sababli, kimyoviy fungitsid sarfi 35% ga qisqaradi.`,
    articleCategory: ArticleCategory.URUG_VA_HOSIL,
    articleStatus: ArticleStatus.ACTIVE,
    articleImage: "/img/harvest.jpg",
    articleViews: 1940,
    articleLikes: 154,
    author: "Andijon Intensiv Ko'chatchilik Klasteri",
    source: "🌱 Agro-Innovatsiya",
    tag: "Payvand Ko'chat",
    readingTime: "4 daqiqa",
    recommendedProducts: [],
    createdAt: "2026-10-19T11:00:00.000Z",
    updatedAt: "2026-10-19T11:00:00.000Z",
  },
];
