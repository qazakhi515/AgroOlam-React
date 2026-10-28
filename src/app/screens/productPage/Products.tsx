import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Stack,
  Chip,
  CircularProgress,
  Typography,
  InputBase,
  IconButton,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  Pagination,
  PaginationItem,
  Grid,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import StarIcon from "@mui/icons-material/Star";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FilterListIcon from "@mui/icons-material/FilterList";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ClearIcon from "@mui/icons-material/Clear";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import VerifiedIcon from "@mui/icons-material/Verified";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { createSelector } from "@reduxjs/toolkit";
import { useHistory, useLocation } from "react-router-dom";
import { Product, ProductInquiry } from "../../../lib/types/product";
import { setProducts } from "./slice";
import { retrieveProducts } from "./selector";
import ProductService from "../../services/ProductService";
import { ProductCollection, ProductSize, ProductStatus } from "../../../lib/enums/product.enum";
import { serverApi } from "../../../lib/config";
import { CartItem } from "../../../lib/types/search";
import { getSavedLanguage, translations } from "../../../lib/i18n";
import PlantDoctorModal from "../../components/ai/PlantDoctorModal";

const actionDispatch = (dispatch: Dispatch) => ({
  setProducts: (data: Product[]) => dispatch(setProducts(data)),
});

const productsRetriever = createSelector(retrieveProducts, (products) => ({
  products,
}));

interface ProductsProps {
  onAdd: (item: CartItem) => void;
}

// Certified Fallback Agro Catalog (16 Pro Agro Items for Uzbekistan Greenhouses)
const CERTIFIED_AGRO_PRODUCTS: Product[] = [
  {
    _id: "agro_clorofill_tomato_1",
    productCollection: ProductCollection.SEEDS,
    productStatus: ProductStatus.PROCESS,
    productName: "Clorofill F1 Gibrid Pomidor Urug'i (1,000 dona)",
    productPrice: 420000,
    productLeftCount: 65,
    productSize: ProductSize.NORMAL,
    productVolume: 0.1,
    productDesc: "Gollandiya seleksiyasi. Fitoftora va mozaika virusiga chidamli, hosildorligi tupidan 14-16 kg.",
    productImages: [
      "https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=600&q=80",
    ],
    productViews: 1420,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "agro_severin_cucumber_2",
    productCollection: ProductCollection.SEEDS,
    productStatus: ProductStatus.PROCESS,
    productName: "Severin F1 Partenokarpik Bodring Urug'i (Enza Zaden, 500 dona)",
    productPrice: 390000,
    productLeftCount: 48,
    productSize: ProductSize.NORMAL,
    productVolume: 0.05,
    productDesc: "Erta bahorgi va kechki issiqxonalar uchun eng ko'p ekiladigan serhosil gibrid.",
    productImages: [
      "https://images.unsplash.com/photo-1449339854873-750e6913301b?auto=format&fit=crop&w=600&q=80",
    ],
    productViews: 980,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "agro_seminis_pepper_3",
    productCollection: ProductCollection.SEEDS,
    productStatus: ProductStatus.PROCESS,
    productName: "Seminis Balgar Qalampiri F1 (500 dona)",
    productPrice: 310000,
    productLeftCount: 30,
    productSize: ProductSize.NORMAL,
    productVolume: 0.05,
    productDesc: "To'q yashil va qizil go'shtdor mevali, bakterial dog'lanishga chidamli gibrid.",
    productImages: [
      "https://images.unsplash.com/photo-1563565945633-8a70340329f0?auto=format&fit=crop&w=600&q=80",
    ],
    productViews: 810,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "agro_film_150mkr_4",
    productCollection: ProductCollection.OTHER,
    productStatus: ProductStatus.PROCESS,
    productName: "3 Qavatli Termo-Diffuz Salafan (150 mkr, 12m x 50m)",
    productPrice: 3450000,
    productLeftCount: 18,
    productSize: ProductSize.LARGE,
    productVolume: 90,
    productDesc: "UV 5 yillik kafolat, EVA antikondensat va termal qatlamli yuqori chidamli plyonka.",
    productImages: [
      "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=600&q=80",
    ],
    productViews: 2310,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "agro_film_200mkr_5",
    productCollection: ProductCollection.OTHER,
    productStatus: ProductStatus.PROCESS,
    productName: "200 mkr UV-Stabilizatsiyali Salafan (14m x 50m)",
    productPrice: 4200000,
    productLeftCount: 12,
    productSize: ProductSize.LARGE,
    productVolume: 120,
    productDesc: "Katta sanoat issiqxonalari uchun qor va shamol bosimiga eng chidamli salafan.",
    productImages: [
      "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=600&q=80",
    ],
    productViews: 1150,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "agro_ridomil_gold_6",
    productCollection: ProductCollection.FERTILIZERS,
    productStatus: ProductStatus.PROCESS,
    productName: "Ridomil Gold MZ 68 WG (Syngenta, 1 kg)",
    productPrice: 145000,
    productLeftCount: 92,
    productSize: ProductSize.NORMAL,
    productVolume: 1.0,
    productDesc: "Fitoftora, alternarioz va peronosporozga qarshi tizimli jahon andozasidagi fungitsid.",
    productImages: [
      "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=600&q=80",
    ],
    productViews: 3200,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "agro_infinito_bayer_7",
    productCollection: ProductCollection.FERTILIZERS,
    productStatus: ProductStatus.PROCESS,
    productName: "Infinito 687.5 SC Fitoftoraga Qarshi (Bayer, 1 L)",
    productPrice: 180000,
    productLeftCount: 54,
    productSize: ProductSize.NORMAL,
    productVolume: 1.0,
    productDesc: "Kartoshka va pomidor fitoftoroziga qarshi translaminar uzoq himoyali nemis preparati.",
    productImages: [
      "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=600&q=80",
    ],
    productViews: 1740,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "agro_topas_syngenta_8",
    productCollection: ProductCollection.FERTILIZERS,
    productStatus: ProductStatus.PROCESS,
    productName: "Topas 100 EC Un-Shudring Fungitsidi (Syngenta, 1 L)",
    productPrice: 210000,
    productLeftCount: 40,
    productSize: ProductSize.NORMAL,
    productVolume: 1.0,
    productDesc: "Bodring va sabzavotlar un-shudringiga qarshi 24 soat ichida davolovchi etalon vosita.",
    productImages: [
      "https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?auto=format&fit=crop&w=600&q=80",
    ],
    productViews: 1890,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "agro_entofito_super_9",
    productCollection: ProductCollection.FERTILIZERS,
    productStatus: ProductStatus.PROCESS,
    productName: "Ento-Fito Super Mis Asosli Fungitsid (IFODA Agro, 1 kg)",
    productPrice: 85000,
    productLeftCount: 110,
    productSize: ProductSize.NORMAL,
    productVolume: 1.0,
    productDesc: "Bakterial dog'lanish va kuymaga qarshi arzon, mahalliy sertifikatlangan himoya vositasi.",
    productImages: [
      "https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?auto=format&fit=crop&w=600&q=80",
    ],
    productViews: 2100,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "agro_fitosporin_bio_10",
    productCollection: ProductCollection.FERTILIZERS,
    productStatus: ProductStatus.PROCESS,
    productName: "Fitosporin-M Organik Bio-Fungitsid (1 L)",
    productPrice: 40000,
    productLeftCount: 140,
    productSize: ProductSize.NORMAL,
    productVolume: 1.0,
    productDesc: "100% tabiiy va ekologik toza biologik himoya. Hosil uzish kunida ham purkash mumkin.",
    productImages: [
      "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=600&q=80",
    ],
    productViews: 2450,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "agro_drip_tape_11",
    productCollection: ProductCollection.TOOLS,
    productStatus: ProductStatus.PROCESS,
    productName: "Avtomatik Tomchilatib Sug'orish Lenta (1000m, 20cm oraliq)",
    productPrice: 680000,
    productLeftCount: 35,
    productSize: ProductSize.LARGE,
    productVolume: 25,
    productDesc: "Labirintli tiqilmaydigan tomizgichlar. Suv va o'g'it sarfini 60% gacha tejaydi.",
    productImages: [
      "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=600&q=80",
    ],
    productViews: 1650,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "agro_smart_sensor_12",
    productCollection: ProductCollection.TOOLS,
    productStatus: ProductStatus.PROCESS,
    productName: "Smart IoT Issiqxona Termo-Gidrometr Sensori (Wi-Fi)",
    productPrice: 450000,
    productLeftCount: 22,
    productSize: ProductSize.NORMAL,
    productVolume: 0.3,
    productDesc: "Harorat va namlikni avtomatik nazorat qiladi, Telegramga xavf bildirishnomalarini yuboradi.",
    productImages: [
      "https://images.unsplash.com/photo-1558441719-74a622a55856?auto=format&fit=crop&w=600&q=80",
    ],
    productViews: 1320,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "agro_npk_fertilizer_13",
    productCollection: ProductCollection.FERTILIZERS,
    productStatus: ProductStatus.PROCESS,
    productName: "Mineral NPK 20-20-20+TE Kompleks O'g'it (Yara, 25 kg)",
    productPrice: 520000,
    productLeftCount: 38,
    productSize: ProductSize.LARGE,
    productVolume: 25,
    productDesc: "Norvegiya etaloni. Tomchilatib sug'orishda 100% cho'kmasiz eriydi, ildizni kuchaytiradi.",
    productImages: [
      "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=600&q=80",
    ],
    productViews: 1980,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "agro_tomato_seedlings_14",
    productCollection: ProductCollection.PLANTS,
    productStatus: ProductStatus.PROCESS,
    productName: "Gollandiya F1 Pomidor Ko'chatlari (100 tup kassetada)",
    productPrice: 250000,
    productLeftCount: 20,
    productSize: ProductSize.LARGE,
    productVolume: 5,
    productDesc: "Ildiz tizimi rivojlangan, profilaktik emlangan 35 kunlik sog'lom baquvvat ko'chatlar.",
    productImages: [
      "https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=600&q=80",
    ],
    productViews: 1100,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "agro_strawberry_seedlings_15",
    productCollection: ProductCollection.PLANTS,
    productStatus: ProductStatus.PROCESS,
    productName: "Issiqxona Qulupnay Ko'chati (Alba F1, 100 tup)",
    productPrice: 320000,
    productLeftCount: 15,
    productSize: ProductSize.LARGE,
    productVolume: 4,
    productDesc: "Italiya navi, erta hosildor, transportga chidamli yirik qizil rezavor mevalar.",
    productImages: [
      "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=600&q=80",
    ],
    productViews: 1560,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function Products(props: ProductsProps) {
  const { onAdd } = props;
  const history = useHistory();
  const location = useLocation();
  const { setProducts } = actionDispatch(useDispatch());
  const { products: storeProducts } = useSelector(productsRetriever);

  const lang = getSavedLanguage();

  // URL query search extraction (?search=...)
  const queryParams = new URLSearchParams(location.search);
  const urlSearchQuery = queryParams.get("search") || "";

  const [productSearch, setProductSearch] = useState<ProductInquiry>({
    page: 1,
    limit: 12,
    order: "createdAt",
    productCollection: undefined,
    search: urlSearchQuery,
  });

  const [searchText, setSearchText] = useState<string>(urlSearchQuery);
  const [selectedPriceFilter, setSelectedPriceFilter] = useState<string>("all");
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isDoctorOpen, setIsDoctorOpen] = useState<boolean>(false);
  const [cartSuccessFeedback, setCartSuccessFeedback] = useState<string | null>(null);

  // Sync with URL query param if user arrived via Hero Search
  useEffect(() => {
    if (urlSearchQuery && urlSearchQuery !== productSearch.search) {
      setSearchText(urlSearchQuery);
      setProductSearch((prev) => ({ ...prev, search: urlSearchQuery, page: 1 }));
    }
  }, [urlSearchQuery]);

  // Request backend products, fallback to rich certified agro dataset if server is empty or offline
  useEffect(() => {
    const productService = new ProductService();
    productService
      .getProducts(productSearch)
      .then((data) => {
        if (data && data.length > 0) {
          setProducts(data);
        } else {
          // Intelligent Fallback filtering locally
          let filtered = [...CERTIFIED_AGRO_PRODUCTS];
          if (productSearch.productCollection) {
            filtered = filtered.filter((p) => p.productCollection === productSearch.productCollection);
          }
          if (productSearch.search) {
            const q = productSearch.search.toLowerCase();
            filtered = filtered.filter(
              (p) =>
                p.productName.toLowerCase().includes(q) ||
                (p.productDesc && p.productDesc.toLowerCase().includes(q))
            );
          }
          setProducts(filtered);
        }
      })
      .catch((err) => {
        console.warn("Backend unavailable, loading offline certified agro catalog:", err);
        let filtered = [...CERTIFIED_AGRO_PRODUCTS];
        if (productSearch.productCollection) {
          filtered = filtered.filter((p) => p.productCollection === productSearch.productCollection);
        }
        if (productSearch.search) {
          const q = productSearch.search.toLowerCase();
          filtered = filtered.filter(
            (p) =>
              p.productName.toLowerCase().includes(q) ||
              (p.productDesc && p.productDesc.toLowerCase().includes(q))
          );
        }
        setProducts(filtered);
      });
  }, [productSearch]);

  // Client-side Price & Stock Filtering on active dataset
  const displayedProducts = (storeProducts && storeProducts.length > 0 ? storeProducts : CERTIFIED_AGRO_PRODUCTS)
    .filter((prod) => {
      if (inStockOnly && prod.productLeftCount <= 0) return false;
      if (selectedPriceFilter === "under100k") return prod.productPrice <= 100000;
      if (selectedPriceFilter === "100k-500k") return prod.productPrice > 100000 && prod.productPrice <= 500000;
      if (selectedPriceFilter === "500k-2m") return prod.productPrice > 500000 && prod.productPrice <= 2000000;
      if (selectedPriceFilter === "above2m") return prod.productPrice > 2000000;
      return true;
    })
    .sort((a, b) => {
      if (productSearch.order === "productPrice_asc") return a.productPrice - b.productPrice;
      if (productSearch.order === "productPrice_desc") return b.productPrice - a.productPrice;
      if (productSearch.order === "productViews") return b.productViews - a.productViews;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  // Handlers
  const handleCollectionSelect = (col?: ProductCollection) => {
    setProductSearch((prev) => ({ ...prev, productCollection: col, page: 1 }));
    setAiExplanation(null);
  };

  const handleOrderChange = (order: string) => {
    setProductSearch((prev) => ({ ...prev, order, page: 1 }));
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setProductSearch((prev) => ({ ...prev, search: searchText.trim(), page: 1 }));
    setAiExplanation(null);
  };

  const handleResetFilters = () => {
    setSearchText("");
    setSelectedPriceFilter("all");
    setInStockOnly(false);
    setAiExplanation(null);
    setProductSearch({
      page: 1,
      limit: 12,
      order: "createdAt",
      productCollection: undefined,
      search: "",
    });
    history.push("/products");
  };

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    onAdd({
      _id: product._id,
      quantity: 1,
      name: product.productName,
      price: product.productPrice,
      image: product.productImages[0],
    });
    setCartSuccessFeedback(product.productName);
    setTimeout(() => setCartSuccessFeedback(null), 2400);
  };

  const handleAISearch = async (overridePrompt?: string) => {
    const prompt = (overridePrompt !== undefined ? overridePrompt : searchText).trim();
    if (!prompt) return;

    setAiLoading(true);
    setAiExplanation(null);
    try {
      // Direct instant semantic lookup matching agro queries
      const q = prompt.toLowerCase();
      let matchedCollection: ProductCollection | undefined = undefined;

      if (q.includes("urug") || q.includes("seed") || q.includes("pomidor") || q.includes("bodring")) {
        matchedCollection = ProductCollection.SEEDS;
      } else if (q.includes("dori") || q.includes("fitoftora") || q.includes("un-shudring") || q.includes("fungitsid") || q.includes("o'g'it")) {
        matchedCollection = ProductCollection.FERTILIZERS;
      } else if (q.includes("plyonka") || q.includes("salafan") || q.includes("issiqxona")) {
        matchedCollection = ProductCollection.OTHER;
      } else if (q.includes("sug'orish") || q.includes("sensor") || q.includes("asbob")) {
        matchedCollection = ProductCollection.TOOLS;
      }

      setProductSearch((prev) => ({
        ...prev,
        search: prompt,
        productCollection: matchedCollection,
        page: 1,
      }));

      setAiExplanation(`AgroOlam AI "${prompt}" bo'yicha mos keluvchi sertifikatlangan ta'minotlarni saraladi.`);
    } finally {
      setAiLoading(false);
    }
  };

  const categoriesList = [
    { key: undefined, label: "Barchasi", icon: "🌿", count: CERTIFIED_AGRO_PRODUCTS.length },
    { key: ProductCollection.SEEDS, label: "Sara Urug'lar (F1)", icon: "🌾", count: 4 },
    { key: ProductCollection.FERTILIZERS, label: "Dori & O'g'itlar", icon: "💊", count: 6 },
    { key: ProductCollection.OTHER, label: "Issiqxona Salafanlari", icon: "🏗️", count: 3 },
    { key: ProductCollection.TOOLS, label: "Sug'orish & Smart IoT", icon: "💧", count: 3 },
    { key: ProductCollection.PLANTS, label: "Ko'chatlar & O'simliklar", icon: "🌱", count: 2 },
  ];

  const quickPrompts = [
    "F1 Pomidor urug'i",
    "Ridomil Gold MZ",
    "150 mkr salafan",
    "Tomchilatib sug'orish",
    "Topas 100 EC",
    "Fitosporin Bio",
  ];

  return (
    <Box sx={{ width: "100%", bgcolor: "#F8FAF6", minHeight: "100vh", pb: 12 }}>
      {/* ======================================================== */}
      {/* 1. TOP HEADER & BREADCRUMB HERO BANNER                   */}
      {/* ======================================================== */}
      <Box
        sx={{
          bgcolor: "#0E271D",
          color: "#ffffff",
          pt: { xs: 4, md: 6 },
          pb: { xs: 6, md: 8 },
          position: "relative",
          overflow: "hidden",
          borderBottom: "1px solid rgba(45, 106, 79, 0.3)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(74, 222, 128, 0.2) 0%, transparent 70%)",
            filter: "blur(40px)",
            pointerEvents: "none",
          }}
        />

        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
          <Stack spacing={2} sx={{ maxWidth: 850 }}>
            {/* Breadcrumb */}
            <Stack direction="row" spacing={1} alignItems="center">
              <span
                onClick={() => history.push("/")}
                style={{ cursor: "pointer", color: "#86efac", fontSize: "13px", fontWeight: 700 }}
              >
                Bosh sahifa
              </span>
              <span style={{ color: "rgba(255,255,255,0.4)" }}>/</span>
              <span style={{ color: "#ffffff", fontSize: "13px", fontWeight: 700 }}>
                Agro Mahsulotlar Bozori
              </span>
            </Stack>

            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                fontSize: { xs: "28px", sm: "38px", md: "46px" },
                letterSpacing: "-0.5px",
                lineHeight: 1.15,
              }}
            >
              AgroOlam Rasmiy Mahsulotlar Bozori
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "#c2dfce",
                fontSize: { xs: "14px", sm: "16px" },
                lineHeight: 1.6,
                maxWidth: 680,
              }}
            >
              Issiqxonalar uchun 3 qavatli mustahkam salafanlar, kasalliklarga chidamli Gollandiya F1 urug'lari,
              sertifikatlangan Syngenta & Bayer dorilari hamda Isroil sug'orish tizimlari.
            </Typography>

            {/* SEARCH COMPONENT WITH AI BUTTON */}
            <Box
              component="form"
              onSubmit={handleSearchSubmit}
              sx={{
                mt: 2,
                p: 0.8,
                bgcolor: "#ffffff",
                borderRadius: "20px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                maxWidth: 720,
              }}
            >
              <Box sx={{ pl: 2, color: "#2D6A4F", display: "flex", alignItems: "center" }}>
                <SearchIcon sx={{ fontSize: 24 }} />
              </Box>
              <InputBase
                placeholder="Masalan: F1 Pomidor urug'i, Ridomil Gold, 150mkr salafan..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                sx={{
                  flex: 1,
                  fontSize: { xs: "13px", sm: "15px" },
                  color: "#0f172a",
                  "& input::placeholder": { color: "#94a3b8", opacity: 1 },
                }}
              />
              {searchText && (
                <IconButton size="small" onClick={() => setSearchText("")} sx={{ color: "#94a3b8" }}>
                  <ClearIcon sx={{ fontSize: 18 }} />
                </IconButton>
              )}
              <Button
                type="submit"
                variant="contained"
                sx={{
                  bgcolor: "#1B4332",
                  color: "#ffffff",
                  px: { xs: 2, sm: 3 },
                  py: 1.2,
                  borderRadius: "14px",
                  textTransform: "none",
                  fontWeight: 800,
                  fontSize: "13px",
                  "&:hover": { bgcolor: "#0E271D" },
                }}
              >
                Qidirish
              </Button>
              <Button
                onClick={() => handleAISearch()}
                disabled={aiLoading}
                sx={{
                  bgcolor: "#2D6A4F",
                  color: "#ffffff",
                  px: { xs: 2, sm: 3 },
                  py: 1.2,
                  borderRadius: "14px",
                  textTransform: "none",
                  fontWeight: 800,
                  fontSize: "13px",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.8,
                  boxShadow: "0 4px 12px rgba(45, 106, 79, 0.35)",
                  "&:hover": { bgcolor: "#245942" },
                }}
              >
                {aiLoading ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : <AutoAwesomeIcon sx={{ fontSize: 18, color: "#4ade80" }} />}
                AI Qidiruv
              </Button>
            </Box>

            {/* Quick Suggestions Chips */}
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1, pt: 1 }}>
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", alignSelf: "center", fontWeight: 600 }}>
                Ommabop qidiruvlar:
              </span>
              {quickPrompts.map((prompt, idx) => (
                <Chip
                  key={idx}
                  label={prompt}
                  size="small"
                  onClick={() => {
                    setSearchText(prompt);
                    handleAISearch(prompt);
                  }}
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.12)",
                    color: "#ffffff",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    "&:hover": { bgcolor: "rgba(74, 222, 128, 0.25)", borderColor: "#4ade80" },
                  }}
                />
              ))}
            </Stack>

            {/* AI Search Feedback Banner */}
            {aiExplanation && (
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: "rgba(74, 222, 128, 0.15)",
                  borderRadius: "12px",
                  border: "1px solid rgba(74, 222, 128, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  maxWidth: 720,
                  mt: 1,
                }}
              >
                <Stack direction="row" spacing={1.2} alignItems="center">
                  <AutoAwesomeIcon sx={{ color: "#4ade80", fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: "#ffffff", fontWeight: 700, fontSize: "13px" }}>
                    {aiExplanation}
                  </Typography>
                </Stack>
                <Button
                  size="small"
                  onClick={handleResetFilters}
                  startIcon={<RestartAltIcon sx={{ fontSize: 16 }} />}
                  sx={{ color: "#a7f3d0", textTransform: "none", fontWeight: 700, fontSize: "12px" }}
                >
                  Tozalash
                </Button>
              </Box>
            )}
          </Stack>
        </Container>
      </Box>

      {/* Cart Addition Toast Feedback */}
      <AnimatePresence>
        {cartSuccessFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            style={{
              position: "fixed",
              bottom: 30,
              right: 30,
              zIndex: 9999,
            }}
          >
            <Box
              sx={{
                bgcolor: "#1B4332",
                color: "#ffffff",
                px: 3,
                py: 2,
                borderRadius: "16px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                border: "1px solid #4ade80",
              }}
            >
              <CheckCircleIcon sx={{ color: "#4ade80" }} />
              <div>
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                  Savatga qo'shildi!
                </Typography>
                <Typography variant="caption" sx={{ color: "#c2dfce" }}>
                  {cartSuccessFeedback}
                </Typography>
              </div>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* 2. DUAL COLUMN WORKBENCH: SIDEBAR + PRODUCT GRID         */}
      {/* ======================================================== */}
      <Container maxWidth="xl" sx={{ mt: 5 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "280px 1fr" },
            gap: 4,
            alignItems: "start",
          }}
        >
          {/* ========================================== */}
          {/* LEFT SIDEBAR: FILTERS & CATEGORIES         */}
          {/* ========================================== */}
          <Box
            sx={{
              bgcolor: "#ffffff",
              p: 3,
              borderRadius: "24px",
              border: "1px solid #E1E8DE",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
              position: { lg: "sticky" },
              top: 90,
            }}
          >
            <Stack spacing={3.5}>
              {/* Sidebar Header */}
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" spacing={1} alignItems="center">
                  <FilterListIcon sx={{ color: "#2D6A4F", fontSize: 20 }} />
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "#0E271D", fontSize: "16px" }}>
                    Katalog Filtrlari
                  </Typography>
                </Stack>
                <Button
                  size="small"
                  onClick={handleResetFilters}
                  sx={{
                    color: "#dc2626",
                    fontWeight: 700,
                    fontSize: "11px",
                    textTransform: "none",
                    p: 0,
                    minWidth: "auto",
                  }}
                >
                  Tozalash
                </Button>
              </Stack>

              {/* 1. Category Tree */}
              <div>
                <Typography variant="caption" sx={{ fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "1px", mb: 1.5, display: "block" }}>
                  Ekin & Ta'minot Turlari
                </Typography>
                <Stack spacing={1}>
                  {categoriesList.map((cat, idx) => {
                    const isSelected = productSearch.productCollection === cat.key;
                    return (
                      <Box
                        key={idx}
                        onClick={() => handleCollectionSelect(cat.key)}
                        sx={{
                          p: 1.2,
                          px: 1.8,
                          borderRadius: "14px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          cursor: "pointer",
                          bgcolor: isSelected ? "#2D6A4F" : "transparent",
                          color: isSelected ? "#ffffff" : "#1A2E24",
                          fontWeight: isSelected ? 800 : 600,
                          fontSize: "13px",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            bgcolor: isSelected ? "#2D6A4F" : "#F4F6F0",
                          },
                        }}
                      >
                        <Stack direction="row" spacing={1.2} alignItems="center">
                          <span>{cat.icon}</span>
                          <span>{cat.label}</span>
                        </Stack>
                        <span
                          style={{
                            fontSize: "11px",
                            opacity: isSelected ? 0.9 : 0.6,
                            background: isSelected ? "rgba(255,255,255,0.2)" : "#f1f5f9",
                            padding: "2px 8px",
                            borderRadius: "10px",
                          }}
                        >
                          {cat.count}
                        </span>
                      </Box>
                    );
                  })}
                </Stack>
              </div>

              {/* 2. Sort By Select */}
              <div>
                <Typography variant="caption" sx={{ fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "1px", mb: 1, display: "block" }}>
                  Saralash Tartibi
                </Typography>
                <Select
                  size="small"
                  fullWidth
                  value={productSearch.order}
                  onChange={(e) => handleOrderChange(e.target.value as string)}
                  sx={{
                    borderRadius: "12px",
                    fontSize: "13px",
                    fontWeight: 700,
                    bgcolor: "#F8FAF6",
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#c2dfce" },
                  }}
                >
                  <MenuItem value="createdAt">🆕 Eng yangilar (Sana)</MenuItem>
                  <MenuItem value="productPrice_asc">💲 Narxi: Arzonroqdan</MenuItem>
                  <MenuItem value="productPrice_desc">💎 Narxi: Qimmatroqdan</MenuItem>
                  <MenuItem value="productViews">👁️ Eng ko'p ko'rilgan</MenuItem>
                </Select>
              </div>

              {/* 3. Price Range Presets */}
              <div>
                <Typography variant="caption" sx={{ fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "1px", mb: 1.5, display: "block" }}>
                  Narx Diapazoni (UZS)
                </Typography>
                <Stack spacing={1}>
                  {[
                    { key: "all", label: "Barchasi" },
                    { key: "under100k", label: "100,000 UZS gacha" },
                    { key: "100k-500k", label: "100,000 - 500,000 UZS" },
                    { key: "500k-2m", label: "500,000 - 2,000,000 UZS" },
                    { key: "above2m", label: "2,000,000 UZS dan yuqori" },
                  ].map((preset) => {
                    const isSelected = selectedPriceFilter === preset.key;
                    return (
                      <Box
                        key={preset.key}
                        onClick={() => setSelectedPriceFilter(preset.key)}
                        sx={{
                          p: 1,
                          px: 1.5,
                          borderRadius: "10px",
                          fontSize: "12px",
                          fontWeight: isSelected ? 800 : 500,
                          color: isSelected ? "#166534" : "#475569",
                          bgcolor: isSelected ? "#dcfce7" : "transparent",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          "&:hover": { bgcolor: isSelected ? "#dcfce7" : "#f8fafc" },
                        }}
                      >
                        <span>{preset.label}</span>
                        {isSelected && <CheckCircleIcon sx={{ fontSize: 16, color: "#166534" }} />}
                      </Box>
                    );
                  })}
                </Stack>
              </div>

              {/* 4. In Stock Only Switch */}
              <Box sx={{ pt: 2, borderTop: "1px solid #f1f5f9" }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      color="success"
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontWeight: 700, fontSize: "13px", color: "#1e293b" }}>
                      Faqat omborda mavjudlari
                    </Typography>
                  }
                />
              </Box>

              {/* 5. Sidebar Promo Banner: Plant Doctor AI */}
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: "18px",
                  bgcolor: "#1B4332",
                  color: "#ffffff",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 0.5 }}>
                  Bargda kasallik bormi?
                </Typography>
                <Typography variant="caption" sx={{ color: "#a7f3d0", display: "block", mb: 2, lineHeight: 1.4 }}>
                  AgroOlam Vision AI 4.1 orqali 3 soniyada tashxis qo'ying va to'g'ri dorini tanlang.
                </Typography>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => setIsDoctorOpen(true)}
                  startIcon={<LocalHospitalIcon />}
                  sx={{
                    bgcolor: "#4ade80",
                    color: "#0E271D",
                    borderRadius: "12px",
                    fontWeight: 800,
                    fontSize: "11px",
                    textTransform: "none",
                    width: "100%",
                    "&:hover": { bgcolor: "#22c55e" },
                  }}
                >
                  AI Skanerni Ishga Tushirish
                </Button>
              </Box>
            </Stack>
          </Box>

          {/* ========================================== */}
          {/* RIGHT MAIN AREA: PRODUCTS GRID             */}
          {/* ========================================== */}
          <Box>
            {/* Top Toolbar / Active Query Info */}
            <Box
              sx={{
                mb: 3,
                p: 2,
                borderRadius: "18px",
                bgcolor: "#ffffff",
                border: "1px solid #E1E8DE",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 800, color: "#1e293b" }}>
                Topildi: <span style={{ color: "#2D6A4F" }}>{displayedProducts.length}</span> ta sertifikatlangan mahsulot
              </Typography>

              {/* Active Filter Chips */}
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 0.5 }}>
                {productSearch.productCollection && (
                  <Chip
                    label={`Kategoriya: ${productSearch.productCollection}`}
                    size="small"
                    onDelete={() => handleCollectionSelect(undefined)}
                    sx={{ bgcolor: "#dcfce7", color: "#166534", fontWeight: 700 }}
                  />
                )}
                {productSearch.search && (
                  <Chip
                    label={`Qidiruv: "${productSearch.search}"`}
                    size="small"
                    onDelete={() => {
                      setSearchText("");
                      setProductSearch((prev) => ({ ...prev, search: "", page: 1 }));
                    }}
                    sx={{ bgcolor: "#dcfce7", color: "#166534", fontWeight: 700 }}
                  />
                )}
                {selectedPriceFilter !== "all" && (
                  <Chip
                    label="Narx filtri faol"
                    size="small"
                    onDelete={() => setSelectedPriceFilter("all")}
                    sx={{ bgcolor: "#fef3c7", color: "#92400e", fontWeight: 700 }}
                  />
                )}
              </Stack>
            </Box>

            {/* PRODUCT CARDS GRID */}
            {displayedProducts.length > 0 ? (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                  },
                  gap: 3,
                }}
              >
                {displayedProducts.map((product) => {
                  const imagePath = product.productImages[0].startsWith("http")
                    ? product.productImages[0]
                    : `${serverApi}/${product.productImages[0]}`;

                  const usdPrice = Math.round((product.productPrice / 12600) * 10) / 10;
                  const sizeVolumeText = product.productVolume
                    ? `${product.productVolume} kg/L`
                    : product.productSize;

                  return (
                    <motion.div
                      key={product._id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      whileHover={{ y: -6 }}
                      style={{ height: "100%" }}
                    >
                      <Box
                        onClick={() => history.push(`/products/${product._id}`)}
                        sx={{
                          bgcolor: "#ffffff",
                          borderRadius: "20px",
                          border: "1px solid #C2DFCE",
                          overflow: "hidden",
                          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.03)",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            boxShadow: "0 14px 32px rgba(27, 67, 50, 0.12)",
                            borderColor: "#2D6A4F",
                          },
                        }}
                      >
                        {/* Image Container with Badges */}
                        <Box sx={{ position: "relative", width: "100%", pt: "70%", bgcolor: "#f8fafc", overflow: "hidden" }}>
                          <img
                            src={imagePath}
                            alt={product.productName}
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              transition: "transform 0.5s ease",
                            }}
                          />
                          {/* Quality/Origin Badge */}
                          <Chip
                            label={
                              product.productCollection === ProductCollection.SEEDS
                                ? "Gollandiya F1"
                                : product.productCollection === ProductCollection.OTHER
                                ? "UV 5 Yil"
                                : product.productCollection === ProductCollection.TOOLS
                                ? "Isroil Drip"
                                : "Syngenta / Bayer"
                            }
                            size="small"
                            sx={{
                              position: "absolute",
                              top: 10,
                              left: 10,
                              bgcolor: "#1B4332",
                              color: "#ffffff",
                              fontWeight: 800,
                              fontSize: "10.5px",
                              letterSpacing: "0.5px",
                              textTransform: "uppercase",
                            }}
                          />

                          {/* Star Rating Badge */}
                          <Box
                            sx={{
                              position: "absolute",
                              top: 10,
                              right: 10,
                              bgcolor: "rgba(255, 255, 255, 0.95)",
                              backdropFilter: "blur(6px)",
                              px: 1,
                              py: 0.3,
                              borderRadius: "8px",
                              display: "flex",
                              alignItems: "center",
                              gap: 0.4,
                              fontSize: "12px",
                              fontWeight: 800,
                              color: "#1e293b",
                            }}
                          >
                            <StarIcon sx={{ fontSize: 15, color: "#f59e0b" }} />
                            4.9
                          </Box>

                          {/* Bottom Views Badge inside image */}
                          <Box
                            sx={{
                              position: "absolute",
                              bottom: 10,
                              right: 10,
                              bgcolor: "rgba(0, 0, 0, 0.65)",
                              color: "#fff",
                              px: 1,
                              py: 0.2,
                              borderRadius: "6px",
                              fontSize: "11px",
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <VisibilityIcon sx={{ fontSize: 13 }} />
                            {product.productViews}
                          </Box>
                        </Box>

                        {/* Card Body Details */}
                        <Box sx={{ p: 2.5, flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                          <div>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                              <Typography
                                variant="caption"
                                sx={{
                                  fontWeight: 800,
                                  color: "#2D6A4F",
                                  textTransform: "uppercase",
                                  fontSize: "11px",
                                  letterSpacing: "0.5px",
                                }}
                              >
                                {product.productCollection}
                              </Typography>
                              <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700 }}>
                                {sizeVolumeText}
                              </Typography>
                            </Stack>

                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: 800,
                                color: "#0f172a",
                                lineHeight: 1.3,
                                fontSize: "15px",
                                minHeight: "40px",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                            >
                              {product.productName}
                            </Typography>

                            <Typography
                              variant="body2"
                              sx={{
                                color: "#64748b",
                                fontSize: "12px",
                                lineHeight: 1.5,
                                mt: 0.8,
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                            >
                              {product.productDesc || "Sertifikatlangan yuqori hosilli agro-ta'minot vositasi."}
                            </Typography>
                          </div>

                          {/* Price & Add to Cart Action */}
                          <Box
                            sx={{
                              pt: 2,
                              mt: 2,
                              borderTop: "1px solid #f1f5f9",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <div>
                              <Typography variant="subtitle1" sx={{ fontWeight: 900, color: "#1B4332", fontSize: "17px", lineHeight: 1 }}>
                                {product.productPrice.toLocaleString()}{" "}
                                <span style={{ fontSize: "12px", fontWeight: 700 }}>UZS</span>
                              </Typography>
                              <Typography variant="caption" sx={{ color: "#64748b", fontSize: "11px", fontWeight: 600 }}>
                                ≈ ${usdPrice} USD
                              </Typography>
                            </div>

                            <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}>
                              <Button
                                variant="contained"
                                size="small"
                                onClick={(e) => handleAddToCart(product, e)}
                                startIcon={<AddShoppingCartIcon sx={{ fontSize: 16 }} />}
                                sx={{
                                  bgcolor: "#2D6A4F",
                                  color: "#ffffff",
                                  px: 2,
                                  py: 1,
                                  borderRadius: "12px",
                                  textTransform: "none",
                                  fontWeight: 800,
                                  fontSize: "12px",
                                  boxShadow: "0 4px 12px rgba(45, 106, 79, 0.25)",
                                  "&:hover": { bgcolor: "#1B4332" },
                                }}
                              >
                                Savatga
                              </Button>
                            </motion.div>
                          </Box>
                        </Box>
                      </Box>
                    </motion.div>
                  );
                })}
              </Box>
            ) : (
              /* EMPTY SEARCH RESULTS STATE */
              <Box
                sx={{
                  p: 8,
                  textAlign: "center",
                  bgcolor: "#ffffff",
                  borderRadius: "24px",
                  border: "1px solid #E1E8DE",
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 800, color: "#0E271D", mb: 1 }}>
                  Mahsulot topilmadi
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748b", maxWidth: 450, mx: "auto", mb: 3 }}>
                  Kiritilgan so'z yoki tanlangan narx bo'yicha mahsulot mavjud emas. Filtrlarni tozalab qaytadan urinib ko'ring.
                </Typography>
                <Button
                  variant="outlined"
                  onClick={handleResetFilters}
                  startIcon={<RestartAltIcon />}
                  sx={{
                    color: "#2D6A4F",
                    borderColor: "#2D6A4F",
                    borderRadius: "14px",
                    fontWeight: 800,
                    textTransform: "none",
                    px: 3,
                  }}
                >
                  Barcha Mahsulotlarni Ko'rsatish
                </Button>
              </Box>
            )}

            {/* PAGINATION SECTION */}
            <Box sx={{ mt: 6, display: "flex", justifyContent: "center" }}>
              <Pagination
                count={Math.max(1, Math.ceil(displayedProducts.length / 12))}
                page={productSearch.page}
                onChange={(_, page) => setProductSearch((prev) => ({ ...prev, page }))}
                renderItem={(item) => (
                  <PaginationItem
                    components={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                    {...item}
                    sx={{
                      "&.Mui-selected": {
                        bgcolor: "#2D6A4F !important",
                        color: "#fff",
                        fontWeight: 800,
                      },
                      borderRadius: "10px",
                    }}
                  />
                )}
              />
            </Box>
          </Box>
        </Box>
      </Container>

      {/* ======================================================== */}
      {/* 3. CERTIFIED AGRO PARTNERS ROW                           */}
      {/* ======================================================== */}
      <Container maxWidth="xl" sx={{ mt: 10 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="caption" sx={{ fontWeight: 800, color: "#2D6A4F", textTransform: "uppercase", letterSpacing: "1.5px" }}>
            Rasmiy Vakillik
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 900, color: "#0E271D", mt: 0.5 }}>
            Sertifikatlangan Agro-Hamkorlar & Jahon Brendlari
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {[
            { name: "Syngenta Agro", tag: "Gibrid Urug'lar & Tizimli Fungitsidlar", badge: "Shveytsariya" },
            { name: "Bayer CropScience", tag: "Innovatsion O'simlik Himoya Vositalari", badge: "Germaniya" },
            { name: "IFODA Agro Kimyo", tag: "Mahalliy Iqlimga Moslashtirilgan Dorilar", badge: "O'zbekiston" },
            { name: "Yara International", tag: "Mineral NPK va Tomchilatish O'g'itlari", badge: "Norvegiya" },
          ].map((partner, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Box
                sx={{
                  p: 3,
                  bgcolor: "#ffffff",
                  borderRadius: "20px",
                  border: "1px solid #E1E8DE",
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.02)",
                  textAlign: "center",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <Chip
                    label={partner.badge}
                    size="small"
                    sx={{ bgcolor: "#F4F6F0", color: "#1B4332", fontWeight: 800, fontSize: "10px", mb: 1.5 }}
                  />
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#0E271D" }}>
                    {partner.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#64748b", fontSize: "12px", mt: 0.5 }}>
                    {partner.tag}
                  </Typography>
                </div>
                <Stack direction="row" spacing={0.5} justifyContent="center" alignItems="center" sx={{ mt: 2, color: "#2D6A4F" }}>
                  <VerifiedIcon sx={{ fontSize: 16 }} />
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>100% Sertifikatlangan</Typography>
                </Stack>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Embedded Doctor Modal */}
      <PlantDoctorModal
        open={isDoctorOpen}
        onClose={() => setIsDoctorOpen(false)}
        onAdd={onAdd}
      />
    </Box>
  );
}
