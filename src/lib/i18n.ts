export type Language = "en" | "ko" | "uz";

export const translations = {
  en: {
    nav: {
      home: "Home",
      products: "Products",
      news: "News & Advisory",
      orders: "Orders",
      myPage: "My Page",
      help: "Help & FAQ",
      login: "Login",
      logout: "Logout",
    },
    categories: {
      all: "All Products",
      plants: "Plants & Seedlings",
      seeds: "Hybrid Seeds",
      fertilizers: "Fertilizers & Care",
      tools: "Smart Tools",
      other: "Farm Supplies",
    },
    home: {
      popularTitle: "Popular Agro Products",
      newTitle: "New Arrivals",
      stats: {
        stores: "Agro Stores",
        experience: "Years Experience",
        products: "Agro Products",
        farmers: "Active Farmers",
      },
    },
    footer: {
      desc: "AgroOlam — Leading smart agricultural ecosystem delivering greenhouse films, hybrid seed technology, certified plant medicines, agro-chemicals, and AI diagnostics. Your trusted partner in high-yield farming.",
      sectionsTitle: "Sections",
      home: "Home",
      products: "Products",
      news: "News & Advisory",
      orders: "Orders",
      help: "Help & FAQ",
      contactTitle: "Contact Us",
      location: "Tashkent, Uzbekistan",
      phone: "+998 (71) 200-88-00",
      email: "support@agroolam.tech",
      hours: "Everyday: 08:00 - 20:00",
      copyright: "© 2026 AgroOlam. All rights reserved.",
    },
    aiChat: {
      title: "AgroOlam AI Agronomist",
      subtitle: "Instant disease diagnosis & treatment (KO / EN / UZ / RU)",
      placeholder: "Ask in Korean, English, Uzbek or Russian...",
      send: "Send",
      quickPrompts: [
        "Tomato leaves turning yellow",
        "Best cucumber seeds for greenhouse",
        "Powdery mildew chemical treatment",
      ],
      addToCart: "Add to Cart",
      viewProduct: "View Details",
    },
  },
  ko: {
    nav: {
      home: "홈",
      products: "상품 목록",
      news: "영농 소식 & 자문",
      orders: "주문 내역",
      myPage: "마이페이지",
      help: "고객지원 & FAQ",
      login: "로그인",
      logout: "로그아웃",
    },
    categories: {
      all: "전체 상품",
      plants: "모종 및 식물",
      seeds: "다수확 종자",
      fertilizers: "비료 및 작물보호제",
      tools: "스마트 농기구",
      other: "농자재",
    },
    home: {
      popularTitle: "인기 농자재 및 작물",
      newTitle: "신규 입고 상품",
      stats: {
        stores: "전문 농자재점",
        experience: "년간의 전문성",
        products: "인증 농자재",
        farmers: "활동 농가 회원",
      },
    },
    footer: {
      desc: "AgroOlam — 첨단 온실 필름, 다수확 종자, 정품 작물보호제 및 AI 병해충 원격 진단을 제공하는 스마트 농업 선도 플랫폼입니다.",
      sectionsTitle: "바로가기",
      home: "홈",
      products: "상품 목록",
      news: "영농 소식 & 자문",
      orders: "주문 내역",
      help: "고객지원 & FAQ",
      contactTitle: "문의하기",
      location: "타슈켄트, 우즈베키스탄",
      phone: "+998 (71) 200-88-00",
      email: "support@agroolam.tech",
      hours: "연중무휴: 08:00 - 20:00",
      copyright: "© 2026 AgroOlam. All rights reserved.",
    },
    aiChat: {
      title: "AgroOlam AI 스마트 아그로노미스트",
      subtitle: "실시간 병해충 진단 및 농약 처방 (한국어 / EN / UZ / RU)",
      placeholder: "한국어, 영어, 우즈벡어로 증상을 입력하세요...",
      send: "전송",
      quickPrompts: [
        "토마토 잎이 누렇게 변해요 (질병 진단)",
        "온실용 다수확 오이 종자 추천",
        "흰가루병 방제 살균제 추천",
      ],
      addToCart: "장바구니 담기",
      viewProduct: "상세보기",
    },
  },
  uz: {
    nav: {
      home: "Bosh sahifa",
      products: "Mahsulotlar",
      news: "Yangiliklar & Maslahat",
      orders: "Buyurtmalar",
      myPage: "Mening sahifam",
      help: "Yordam & FAQ",
      login: "Kirish",
      logout: "Chiqish",
    },
    categories: {
      all: "Barcha mahsulotlar",
      plants: "Ko'chatlar & O'simliklar",
      seeds: "Sara urug'lar",
      fertilizers: "O'g'it & Agro-kimyo",
      tools: "Agro asboblar",
      other: "Boshqa ta'minot",
    },
    home: {
      popularTitle: "Ommabop Agro Mahsulotlar",
      newTitle: "Yangi Kelgan Mahsulotlar",
      stats: {
        stores: "Agro Do'konlar",
        experience: "Yillik Tajriba",
        products: "Agro Mahsulotlar",
        farmers: "Fermer & Bog'bonlar",
      },
    },
    footer: {
      desc: "AgroOlam — Issiqxonalar, zamonaviy urug'chilik, agro-kimyo, sertifikatlangan dorilar va AI diagnostikasini yetkazib beruvchi yetakchi agro-platforma. Dehqon va fermerlarning ishonchli hamrohi.",
      sectionsTitle: "Bo'limlar",
      home: "Bosh sahifa",
      products: "Mahsulotlar",
      news: "Yangiliklar & Maslahatlar",
      orders: "Buyurtmalar",
      help: "Yordam & FAQ",
      contactTitle: "Bog'lanish",
      location: "Toshkent shahri, O'zbekiston",
      phone: "+998 (71) 200-88-00",
      email: "support@agroolam.tech",
      hours: "Har kuni: 08:00 - 20:00",
      copyright: "© 2026 AgroOlam. Barcha huquqlar himoyalangan.",
    },
    aiChat: {
      title: "AgroOlam AI Agronom Maslahatchi",
      subtitle: "Barg kasalliklari tashxisi va davolash (UZ / KO / EN / RU)",
      placeholder: "O'zbekcha, koreyscha yoki inglizcha yozing...",
      send: "Yuborish",
      quickPrompts: [
        "Pomidor barglari sarg'ayyapti",
        "Issiqxona uchun serhosil bodring urug'i",
        "Un-shudringga qarshi eng yaxshi dori",
      ],
      addToCart: "Savatga qo'shish",
      viewProduct: "Batafsil",
    },
  },
};

export const getSavedLanguage = (): Language => {
  const saved = localStorage.getItem("agrivia_lang") as Language;
  if (saved && (saved === "en" || saved === "ko" || saved === "uz")) {
    return saved;
  }
  return "uz"; // Default is now Uzbek (Uzbekistan farmer primary)
};

export const setSavedLanguage = (lang: Language): void => {
  localStorage.setItem("agrivia_lang", lang);
};
