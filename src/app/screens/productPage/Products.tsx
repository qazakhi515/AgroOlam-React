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
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BoltIcon from "@mui/icons-material/Bolt";
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
import PlantDoctorModal from "../../components/ai/PlantDoctorModal";
import WishlistService from "../../services/WishlistService";
import PaymentModal from "../../components/payment/PaymentModal";
import OrderService from "../../services/OrdersService";
import { OrderStatus } from "../../../lib/enums/order.enum";
import { Order } from "../../../lib/types/order";
import { sweetTopSuccessAlert, sweetErrorHandling } from "../../../lib/sweetAlert";
import { getSavedLanguage, translations } from "../../../lib/i18n";

const actionDispatch = (dispatch: Dispatch) => ({
  setProducts: (data: Product[]) => dispatch(setProducts(data)),
});

const productsRetriever = createSelector(retrieveProducts, (products) => ({
  products,
}));

interface ProductsProps {
  onAdd: (item: CartItem) => void;
}

// Custom SVG Greenhouse Logo for "Issiqxona Salafanlari"
export const GreenhouseLogo = () => (
  <Box
    component="span"
    sx={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 20,
      height: 20,
    }}
  >
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 21V11C3 6.5 7 3 12 3C17 3 21 6.5 21 11V21H3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 3V21" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3 12H21" stroke="currentColor" strokeWidth="1.4" />
      <path d="M7 21V12" stroke="currentColor" strokeWidth="1.2" />
      <path d="M17 21V12" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M10 18C10 16 11 15 12 15C13 15 14 16 14 18"
        stroke="#10b981"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="12" cy="14" r="1.3" fill="#10b981" />
    </svg>
  </Box>
);

// Certified Official Agro Catalog (Real products with photos from desktop/agroplantrasm)
export const CERTIFIED_AGRO_PRODUCTS: Product[] = [
  // ===============================================================
  // 1. ISSIQXONA SALAFANLARI (ProductCollection.OTHER)
  // ===============================================================
  {
    _id: "agro_salafan_4m",
    productCollection: ProductCollection.OTHER,
    productStatus: ProductStatus.PROCESS,
    productName: "4 Metrlik 3-Qavatli Termo-Diffuz Salafan (120 mkr, 4m x 100m)",
    productPrice: 1850000,
    productLeftCount: 25,
    productSize: ProductSize.NORMAL,
    productVolume: 45,
    productDesc: "3 qavatli termo-diffuz salafan. Kichik va o'rta issiqxonalar uchun qulay, quyosh nurlarini 85% teng tarqatadi va qora sovuqdan asraydi.",
    productImages: ["/img/salafan/Salafan4M.jpeg"],
    productViews: 1840,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "agro_salafan_6m",
    productCollection: ProductCollection.OTHER,
    productStatus: ProductStatus.PROCESS,
    productName: "6 Metrlik Ko'p Yillik Antikaplya Issiqxona Plyonkasi (150 mkr, 6m x 100m)",
    productPrice: 2650000,
    productLeftCount: 30,
    productSize: ProductSize.LARGE,
    productVolume: 60,
    productDesc: "Antikondensat va antitumanga qarshi qoplamali. Tomchilashni oldini olib o'simlik barglarini kuyishdan va zamburug'dan saqlaydi.",
    productImages: ["/img/salafan/Salafan6M.jpg"],
    productViews: 2420,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "agro_salafan_termo_3m",
    productCollection: ProductCollection.OTHER,
    productStatus: ProductStatus.PROCESS,
    productName: "3 Metrlik Termos Tizimi Ichki Parda Salafani (80 mkr, 3m x 100m)",
    productPrice: 950000,
    productLeftCount: 40,
    productSize: ProductSize.NORMAL,
    productVolume: 25,
    productDesc: "Issiqxona ichiga ikkinchi qatlam termos tizimi uchun maxsus yengil termo-plyonka. Sovuqda haroratni +4...+6°C oshiradi.",
    productImages: ["/img/salafan/salafanTermo3m.webp"],
    productViews: 1620,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "agro_salafan_12m",
    productCollection: ProductCollection.OTHER,
    productStatus: ProductStatus.PROCESS,
    productName: "12 Metrlik Professional Termo Issiqxona Plyonkasi (180 mkr, 12m x 50m)",
    productPrice: 3450000,
    productLeftCount: 18,
    productSize: ProductSize.LARGE,
    productVolume: 90,
    productDesc: "EVA va UV 5 yillik kafolatli plyonka. Qattiq shamol, qor bosimi va qora sovuqqa o'ta bardoshli professional salafan.",
    productImages: ["/img/salafan/salafan12M.webp"],
    productViews: 3100,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "agro_salafan_15m",
    productCollection: ProductCollection.OTHER,
    productStatus: ProductStatus.PROCESS,
    productName: "15 Metrlik Sanoat Issiqxona Plyonkasi (200 mkr, 15m x 50m)",
    productPrice: 4500000,
    productLeftCount: 12,
    productSize: ProductSize.LARGE,
    productVolume: 130,
    productDesc: "Zamonaviy baland konstruksiyali sanoat issiqxonalari uchun 3 qavatli kopolimer salafan. Maksimal yorug'lik o'tkazuvchanlik.",
    productImages: ["/img/salafan/Salafan15M.webp"],
    productViews: 1950,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // ===============================================================
  // 2. DORI VA O'G'ITLAR (ProductCollection.FERTILIZERS)
  // ===============================================================
  {
    _id: "agro_miravis_duo",
    productCollection: ProductCollection.FERTILIZERS,
    productStatus: ProductStatus.PROCESS,
    productName: "Miravis Duo Tizimli Fungitsid (Syngenta, 1 L)",
    productPrice: 420000,
    productLeftCount: 45,
    productSize: ProductSize.NORMAL,
    productVolume: 1.0,
    productDesc: "ADEPIDYN innovatsion molekulasi asosidagi eng yangi fungitsid. Alternarioz, kladosporioz va zangga qarshi jahon etaloni.",
    productImages: ["/img/products/Syngenta-Miravis-Duo.webp"],
    productViews: 3410,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "agro_ridomil_gold_real",
    productCollection: ProductCollection.FERTILIZERS,
    productStatus: ProductStatus.PROCESS,
    productName: "Ridomil Gold MZ 68 WG (Syngenta, 1 kg)",
    productPrice: 165000,
    productLeftCount: 88,
    productSize: ProductSize.NORMAL,
    productVolume: 1.0,
    productDesc: "Fitoftora, peronosporoz va soxta un-shudringga qarshi eng kuchli tizimli dori vositasi.",
    productImages: ["/img/products/ridomilgold.jpg"],
    productViews: 4120,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "agro_score_real",
    productCollection: ProductCollection.FERTILIZERS,
    productStatus: ProductStatus.PROCESS,
    productName: "Skor 250 EC Sistemali Fungitsid (Syngenta, 250 ml)",
    productPrice: 110000,
    productLeftCount: 60,
    productSize: ProductSize.NORMAL,
    productVolume: 0.25,
    productDesc: "Sabzavot va mevalardagi qo'tir, dog'lanish va un-shudringni 24 soatda bartaraf etuvchi preparat.",
    productImages: ["/img/products/score.webp"],
    productViews: 2890,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "agro_vertimec_real",
    productCollection: ProductCollection.FERTILIZERS,
    productStatus: ProductStatus.PROCESS,
    productName: "Vertimek 018 EC Insektoakaritsid (Syngenta, 250 ml)",
    productPrice: 195000,
    productLeftCount: 52,
    productSize: ProductSize.NORMAL,
    productVolume: 0.25,
    productDesc: "Issiqxonadagi o'rgimchakkana, trips va barg miner pashshalariga qarshi chuqur singuvchi original preparat.",
    productImages: ["/img/products/vertimec.webp"],
    productViews: 3200,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "agro_infinito_real",
    productCollection: ProductCollection.FERTILIZERS,
    productStatus: ProductStatus.PROCESS,
    productName: "Infinito 687.5 SC Fitoftoraga Qarshi (Bayer, 1 L)",
    productPrice: 185000,
    productLeftCount: 40,
    productSize: ProductSize.NORMAL,
    productVolume: 1.0,
    productDesc: "Bayer original nemis preparati. Pomidor va kartoshka fitoftorasiga qarshi uzoq muddatli translaminar himoya.",
    productImages: ["/img/products/bayerdori.jpg"],
    productViews: 2450,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "agro_kavach_real",
    productCollection: ProductCollection.FERTILIZERS,
    productStatus: ProductStatus.PROCESS,
    productName: "Kavach Kontaktli Fungitsid (Syngenta, 1 L)",
    productPrice: 135000,
    productLeftCount: 50,
    productSize: ProductSize.NORMAL,
    productVolume: 1.0,
    productDesc: "Bakterial dog'lanish va antraknozga qarshi yuqori chidamli himoya qatlami hosil qiluvchi dori.",
    productImages: ["/img/products/kavach.avif"],
    productViews: 1780,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "agro_plenium_real",
    productCollection: ProductCollection.FERTILIZERS,
    productStatus: ProductStatus.PROCESS,
    productName: "Plenum 50 WG Oqqanot va Shiraga Qarshi (Syngenta, 500 gr)",
    productPrice: 340000,
    productLeftCount: 35,
    productSize: ProductSize.NORMAL,
    productVolume: 0.5,
    productDesc: "Oqqanot va shira lichinkalarining oziqlanishini zudlik bilan to'xtatuvchi tizimli insektitsid.",
    productImages: ["/img/products/plenium.jpg"],
    productViews: 2190,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "agro_curacron_real",
    productCollection: ProductCollection.FERTILIZERS,
    productStatus: ProductStatus.PROCESS,
    productName: "Curacron 500 EC Kompleks Insektitsid (1 L)",
    productPrice: 160000,
    productLeftCount: 48,
    productSize: ProductSize.NORMAL,
    productVolume: 1.0,
    productDesc: "Qurtlar, ko'sak qurti va zararkunandalarga qarshi kontaktli-ichak ta'siriga ega kuchli dori.",
    productImages: ["/img/products/curacron.jpg"],
    productViews: 1820,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "agro_yaraliva_real",
    productCollection: ProductCollection.FERTILIZERS,
    productStatus: ProductStatus.PROCESS,
    productName: "YaraLiva Calcinit Kalsiy Selitrasi (Yara Norvegiya, 25 kg)",
    productPrice: 380000,
    productLeftCount: 55,
    productSize: ProductSize.LARGE,
    productVolume: 25,
    productDesc: "100% suvda eruvchan kalsiy va azot o'g'iti. Pomidorda meva uchi chirishi (apikal chirish)ni to'liq oldini oladi.",
    productImages: ["/img/products/yara1.jpeg"],
    productViews: 2950,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "agro_yaramila_real",
    productCollection: ProductCollection.FERTILIZERS,
    productStatus: ProductStatus.PROCESS,
    productName: "YaraMila Kompleks NPK Granula O'g'it (Yara, 25 kg)",
    productPrice: 490000,
    productLeftCount: 42,
    productSize: ProductSize.LARGE,
    productVolume: 25,
    productDesc: "Mikroelementlar bilan boyitilgan, ildiz zonasini baquvvatlantiruvchi premium granulalangan o'g'it.",
    productImages: ["/img/products/calsium.jpg"],
    productViews: 2600,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "agro_biogomus_real",
    productCollection: ProductCollection.FERTILIZERS,
    productStatus: ProductStatus.PROCESS,
    productName: "Konsentrlangan Suyuq Biogomus (10 L)",
    productPrice: 95000,
    productLeftCount: 75,
    productSize: ProductSize.NORMAL,
    productVolume: 10,
    productDesc: "Tabiiy organik gumus kislotalari. Tuproq mikroflorasini tiklab hosildorlikni 30% oshiradi.",
    productImages: ["/img/products/gomus.jpg"],
    productViews: 1980,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "agro_root_real",
    productCollection: ProductCollection.FERTILIZERS,
    productStatus: ProductStatus.PROCESS,
    productName: "Root Ildiz Baquvvatlantiruvchi Biostimulyator (1 L)",
    productPrice: 120000,
    productLeftCount: 65,
    productSize: ProductSize.NORMAL,
    productVolume: 1.0,
    productDesc: "Ko'chat o'tkazilganda ildiz otish foizini 98% ga yetkazuvchi, stressga qarshi aminokislotali dori.",
    productImages: ["/img/products/root.jpg"],
    productViews: 2150,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "agro_npk_ogit_real",
    productCollection: ProductCollection.FERTILIZERS,
    productStatus: ProductStatus.PROCESS,
    productName: "Kristalon 18-18-18 Maxsus NPK O'g'iti (Yara, 25 kg)",
    productPrice: 460000,
    productLeftCount: 38,
    productSize: ProductSize.LARGE,
    productVolume: 25,
    productDesc: "Gullash va meva tugish davrida tomchilatib sug'orish orqali beriladigan 100% eruvchan oziqa.",
    productImages: ["/img/products/ogit.jpg"],
    productViews: 2340,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // ===============================================================
  // 3. SUG'ORISH & USKUNALAR (ProductCollection.TOOLS)
  // ===============================================================
  {
    _id: "agro_sprayer_real",
    productCollection: ProductCollection.TOOLS,
    productStatus: ProductStatus.PROCESS,
    productName: "Professional Akkumulyatorli Bog' Purkagichi (16 L, 12V)",
    productPrice: 380000,
    productLeftCount: 35,
    productSize: ProductSize.NORMAL,
    productVolume: 16,
    productDesc: "6-8 soat zaryad ushlaydi. Zanglamas teleskopik naychali, 4 xil purkash nasadkalari bilan.",
    productImages: ["/img/products/sprayer.jpg"],
    productViews: 3850,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "agro_sugorish_real",
    productCollection: ProductCollection.TOOLS,
    productStatus: ProductStatus.PROCESS,
    productName: "Tomchilatib Sug'orish Tizimi To'plami (Lenta 1000m + Fitinglar)",
    productPrice: 720000,
    productLeftCount: 28,
    productSize: ProductSize.LARGE,
    productVolume: 30,
    productDesc: "Issiqxona uchun labirintli tiqilmaydigan tomizgichli lenta, kranlar va boshqaruv fitinglari to'plami.",
    productImages: ["/img/products/sugorish.jpg"],
    productViews: 2790,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "agro_tube_real",
    productCollection: ProductCollection.TOOLS,
    productStatus: ProductStatus.PROCESS,
    productName: "Magistral Polietilen Sug'orish Quvuri (D 32mm, 100m)",
    productPrice: 320000,
    productLeftCount: 45,
    productSize: ProductSize.LARGE,
    productVolume: 22,
    productDesc: "Yuqori bosimga chidamli qora polietilen quvur. Sovuqqa va quyosh nuriga chidamli.",
    productImages: ["/img/products/tube.jpg"],
    productViews: 1450,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "agro_connecter_real",
    productCollection: ProductCollection.TOOLS,
    productStatus: ProductStatus.PROCESS,
    productName: "Tomchilatib Sug'orish Maxsus Kranti va Fitinglari (50 dona)",
    productPrice: 115000,
    productLeftCount: 60,
    productSize: ProductSize.NORMAL,
    productVolume: 2,
    productDesc: "Rezinkali germetik krantlar va tarmoq ulagichlari to'plami.",
    productImages: ["/img/products/connecter.jpg"],
    productViews: 1220,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "agro_scissors_real",
    productCollection: ProductCollection.TOOLS,
    productStatus: ProductStatus.PROCESS,
    productName: "Professional Po'lat Bog'dorchilik Qaychisi (Sekator)",
    productPrice: 140000,
    productLeftCount: 70,
    productSize: ProductSize.NORMAL,
    productVolume: 0.3,
    productDesc: "SK-5 yapon po'lat tig'i. Novdalarni va meva bandlarini shikastlamasdan toza qirqish uchun qaychi.",
    productImages: ["/img/products/scissors.jpg"],
    productViews: 1980,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "agro_arava_real",
    productCollection: ProductCollection.TOOLS,
    productStatus: ProductStatus.PROCESS,
    productName: "Issiqxona Qalin Temirli Yuk Tashish Aravasi (250 kg)",
    productPrice: 680000,
    productLeftCount: 15,
    productSize: ProductSize.LARGE,
    productVolume: 18,
    productDesc: "Katta yuk ko'taruvchi podshipnikli pnevmo-g'ildirakli mustahkam arava.",
    productImages: ["/img/products/arava.jpg"],
    productViews: 1540,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "agro_motorsur_real",
    productCollection: ProductCollection.TOOLS,
    productStatus: ProductStatus.PROCESS,
    productName: "Benzinli Motorli Kuchli Dorilash Purkagichi (25 L)",
    productPrice: 1250000,
    productLeftCount: 10,
    productSize: ProductSize.LARGE,
    productVolume: 12,
    productDesc: "Katta maydonli issiqxona va bog'lar uchun mayda tuman hosil qilib dori purkash apparati.",
    productImages: ["/img/products/motorsur.jpg"],
    productViews: 2110,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "agro_otorar_real",
    productCollection: ProductCollection.TOOLS,
    productStatus: ProductStatus.PROCESS,
    productName: "Benzinli Ko'p Funksiyali O't O'rish Apparati (Trimmer)",
    productPrice: 890000,
    productLeftCount: 14,
    productSize: ProductSize.LARGE,
    productVolume: 8,
    productDesc: "Issiqxona atrofi va dalalardagi qalin o'tlarni tozalash uchun diskli va po'lat simli apparat.",
    productImages: ["/img/products/otorar.jpg"],
    productViews: 1670,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // ===============================================================
  // 4. URUG'LAR (ProductCollection.SEEDS - Bodring, Karam, Pomidor)
  // ===============================================================
  {
    _id: "agro_seed_cucumber_miracle",
    productCollection: ProductCollection.SEEDS,
    productStatus: ProductStatus.PROCESS,
    productName: "Miracle F1 Bodring Urug'i (Mo''jiza Hosildorlik)",
    productPrice: 340000,
    productLeftCount: 45,
    productSize: ProductSize.NORMAL,
    productVolume: 0.05,
    productDesc: "Har bir bo'g'indan 3-4 tadan meva tuguvchi guldor partenokarpik bodring gibridi. Un-shudring va viruslarga chidamli.",
    productImages: ["/img/seeds/seedMIRACLECUCUMBER.jpeg"],
    productViews: 2450,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "agro_seed_cucumber_parteno",
    productCollection: ProductCollection.SEEDS,
    productStatus: ProductStatus.PROCESS,
    productName: "Bodring Urug'i F1 (Partenokarpik Issiqxona Bodringi)",
    productPrice: 320000,
    productLeftCount: 50,
    productSize: ProductSize.NORMAL,
    productVolume: 0.05,
    productDesc: "Erta bahorgi va kuzgi issiqxonalar uchun o'ta serhosil gibrid. Kasalliklarga va sovuqqa chidamli.",
    productImages: ["/img/seeds/seedCUCUMBER.webp"],
    productViews: 2980,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "agro_seed_cucumber_long",
    productCollection: ProductCollection.SEEDS,
    productStatus: ProductStatus.PROCESS,
    productName: "Uzun Bodring Urug'i F1 (Long Cucumber, 500 dona)",
    productPrice: 380000,
    productLeftCount: 35,
    productSize: ProductSize.NORMAL,
    productVolume: 0.05,
    productDesc: "Salatbop uzun to'q yashil yaltiroq mevali bodring. Bozor talabi yuqori, transportbop va uzoq saqlanadi.",
    productImages: ["/img/seeds/seedCUCUMBERLONG.jpeg"],
    productViews: 1870,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "agro_seed_tomato_vesta",
    productCollection: ProductCollection.SEEDS,
    productStatus: ProductStatus.PROCESS,
    productName: "Vesta F1 Qizil Go'shtdor Pomidor Urug'i (1,000 dona)",
    productPrice: 420000,
    productLeftCount: 60,
    productSize: ProductSize.NORMAL,
    productVolume: 0.1,
    productDesc: "Yirik mevali (240-280 gr), zich go'shtdor to'q qizil eksportbop pomidor. Fitoftora va nematodaga chidamli.",
    productImages: ["/img/seeds/seedVESTATOMATO.jpeg"],
    productViews: 3120,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "agro_seed_tomato_onix",
    productCollection: ProductCollection.SEEDS,
    productStatus: ProductStatus.PROCESS,
    productName: "Onix F1 Pushti Pomidor Urug'i (1,000 dona)",
    productPrice: 450000,
    productLeftCount: 55,
    productSize: ProductSize.NORMAL,
    productVolume: 0.1,
    productDesc: "Andijon va Toshkent issiqxonalarida eng ko'p ekiladigan elita pushti go'shtdor pomidor duragayi.",
    productImages: ["/img/seeds/seedONIXF1TOMATO.jpeg"],
    productViews: 3560,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "agro_seed_cabbage_mirage",
    productCollection: ProductCollection.SEEDS,
    productStatus: ProductStatus.PROCESS,
    productName: "Mirage F1 Oqbosh Karam Urug'i (2,500 dona)",
    productPrice: 220000,
    productLeftCount: 40,
    productSize: ProductSize.NORMAL,
    productVolume: 0.05,
    productDesc: "Zich, qat-qat oq mag'izli, yorilishga chidamli erta-o'rtapishar bosh karam gibridi.",
    productImages: ["/img/seeds/seedMIRAGECABBAGE.jpeg"],
    productViews: 1940,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "agro_seed_cabbage_korean",
    productCollection: ProductCollection.SEEDS,
    productStatus: ProductStatus.PROCESS,
    productName: "Pekin Karami Urug'i F1 (Koreyscha Kimchi Karami)",
    productPrice: 260000,
    productLeftCount: 42,
    productSize: ProductSize.NORMAL,
    productVolume: 0.05,
    productDesc: "Barglari mayin, shirali va tez pishar Pekin karami. Issiqxona va ochiq dalada 50-55 kunda hosil beradi.",
    productImages: ["/img/seeds/seedKABBAGEKOREAN.jpeg"],
    productViews: 2180,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function Products(props: ProductsProps) {
  const { onAdd } = props;
  const history = useHistory();
  const location = useLocation();
  const lang = getSavedLanguage();
  const t = translations[lang].products;
  const { setProducts } = actionDispatch(useDispatch());
  const { products: storeProducts } = useSelector(productsRetriever);

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

  // Like & Wishlist Persistence
  const [likedProductIds, setLikedProductIds] = useState<string[]>(() =>
    WishlistService.getLikedIds()
  );

  // Direct 1-Click Purchase Payment Modal
  const [directPaymentOpen, setDirectPaymentOpen] = useState<boolean>(false);
  const [directPaymentOrder, setDirectPaymentOrder] = useState<Order | null>(null);

  useEffect(() => {
    const handleWishlistChange = () => {
      setLikedProductIds(WishlistService.getLikedIds());
    };
    window.addEventListener("agroolam_wishlist_updated", handleWishlistChange);
    return () => {
      window.removeEventListener("agroolam_wishlist_updated", handleWishlistChange);
    };
  }, []);

  const handleToggleLike = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const { isLiked } = WishlistService.toggleLike(product._id);
    setLikedProductIds(WishlistService.getLikedIds());
    sweetTopSuccessAlert(
      isLiked ? "❤️ Sevimlilar ro'yxatiga qo'shildi!" : "🤍 Sevimlilardan olib tashlandi"
    );
  };

  const handleDirectBuy = async (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const orderSvc = new OrderService();
      const normalizedPrice =
        product.productPrice < 1000
          ? product.productPrice * 12850
          : product.productPrice;
      const order = await orderSvc.createOrder([
        {
          _id: product._id,
          quantity: 1,
          name: product.productName,
          price: normalizedPrice,
          image: product.productImages[0],
        },
      ]);
      setDirectPaymentOrder(order);
      setDirectPaymentOpen(true);
    } catch (err) {
      console.log("Error in handleDirectBuy:", err);
      sweetErrorHandling(err).then();
    }
  };

  const handleDirectPaymentSuccess = async (orderId: string) => {
    try {
      const orderSvc = new OrderService();
      await orderSvc.updateOrder({ orderId, orderStatus: OrderStatus.PROCESS });
      sweetTopSuccessAlert("To'lov muvaffaqiyatli qabul qilindi!");
    } catch (err) {
      sweetErrorHandling(err).then();
    }
  };

  // Sync with URL query param if user arrived via Hero Search
  useEffect(() => {
    if (urlSearchQuery && urlSearchQuery !== productSearch.search) {
      setSearchText(urlSearchQuery);
      setProductSearch((prev) => ({ ...prev, search: urlSearchQuery, page: 1 }));
    }
  }, [urlSearchQuery]);

  // Request backend products, merge with rich certified agro dataset so user always sees full catalog
  useEffect(() => {
    const productService = new ProductService();
    productService
      .getProducts(productSearch)
      .then((data) => {
        let combined: Product[] = [];
        if (data && data.length > 0) {
          combined = [...data];
        }
        // Merge certified products with real images
        for (const cp of CERTIFIED_AGRO_PRODUCTS) {
          const exists = combined.some(
            (item) =>
              item._id === cp._id ||
              item.productName.toLowerCase().trim() === cp.productName.toLowerCase().trim()
          );
          if (!exists) {
            combined.push(cp);
          }
        }

        let filtered = combined;
        if (productSearch.productCollection) {
          filtered = filtered.filter((p) => p.productCollection === productSearch.productCollection);
        }
        if (productSearch.search && productSearch.search.trim().length > 0) {
          const q = productSearch.search.trim().toLowerCase();
          filtered = filtered.filter(
            (p) =>
              p.productName.toLowerCase().includes(q) ||
              (p.productDesc && p.productDesc.toLowerCase().includes(q))
          );
        }
        setProducts(filtered);
      })
      .catch((err) => {
        console.warn("Backend unavailable, loading offline certified agro catalog:", err);
        let filtered = [...CERTIFIED_AGRO_PRODUCTS];
        if (productSearch.productCollection) {
          filtered = filtered.filter((p) => p.productCollection === productSearch.productCollection);
        }
        if (productSearch.search && productSearch.search.trim().length > 0) {
          const q = productSearch.search.trim().toLowerCase();
          filtered = filtered.filter(
            (p) =>
              p.productName.toLowerCase().includes(q) ||
              (p.productDesc && p.productDesc.toLowerCase().includes(q))
          );
        }
        setProducts(filtered);
      });
  }, [productSearch.productCollection, productSearch.search, productSearch.order]);

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

  // 9 products per page (3 columns x 3 rows grid)
  const PAGE_SIZE = 9;
  const totalPages = Math.max(1, Math.ceil(displayedProducts.length / PAGE_SIZE));
  const currentPage = Math.min(productSearch.page, totalPages);
  const paginatedProducts = displayedProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

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
    const normalizedPrice =
      product.productPrice < 1000
        ? product.productPrice * 12850
        : product.productPrice;
    onAdd({
      _id: product._id,
      quantity: 1,
      name: product.productName,
      price: normalizedPrice,
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

  const categoriesList: {
    key: ProductCollection | undefined;
    label: string;
    icon: React.ReactNode;
    count: number;
  }[] = [
    { key: undefined, label: t.catAll, icon: "🌿", count: CERTIFIED_AGRO_PRODUCTS.length },
    { key: ProductCollection.OTHER, label: t.catGreenhouse, icon: <GreenhouseLogo />, count: 5 },
    { key: ProductCollection.FERTILIZERS, label: t.catFertilizers, icon: "💊", count: 13 },
    { key: ProductCollection.TOOLS, label: t.catIrrigation, icon: "💧", count: 8 },
    { key: ProductCollection.SEEDS, label: t.catSeeds, icon: "🌱", count: 7 },
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
                {t.breadcrumbHome}
              </span>
              <span style={{ color: "rgba(255,255,255,0.4)" }}>/</span>
              <span style={{ color: "#ffffff", fontSize: "13px", fontWeight: 700 }}>
                {t.breadcrumbTitle}
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
              {t.heroTitle}
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
              {t.heroSubtitle}
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
                placeholder={t.searchPlaceholder}
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
                {t.searchBtn}
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
                {t.aiSearchBtn}
              </Button>
            </Box>



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
                          <Box
                            component="span"
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              fontSize: "16px",
                              color: isSelected ? "#fff" : "#1B4332",
                            }}
                          >
                            {cat.icon}
                          </Box>
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
                {paginatedProducts.map((product) => {
                  const imagePath =
                    product.productImages[0].startsWith("http") ||
                    product.productImages[0].startsWith("/")
                      ? product.productImages[0]
                      : `${serverApi}/${product.productImages[0]}`;

                  const uzsPrice =
                    product.productPrice < 1000
                      ? product.productPrice * 12850
                      : product.productPrice;
                  const usdPrice =
                    product.productPrice < 1000
                      ? product.productPrice
                      : Math.round((product.productPrice / 12850) * 10) / 10;
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
                                ? "Smart Drip"
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

                          {/* Heart Like / Wishlist Button */}
                          <IconButton
                            size="small"
                            onClick={(e) => handleToggleLike(product, e)}
                            title={likedProductIds.includes(product._id) ? "Sevimlilardan o'chirish" : "Sevimlilarga qo'shish"}
                            sx={{
                              position: "absolute",
                              top: 10,
                              right: 68,
                              bgcolor: "rgba(255, 255, 255, 0.95)",
                              backdropFilter: "blur(6px)",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                              zIndex: 3,
                              width: 28,
                              height: 28,
                              transition: "all 0.2s ease",
                              "&:hover": { bgcolor: "#ffffff", transform: "scale(1.15)" },
                            }}
                          >
                            {likedProductIds.includes(product._id) ? (
                              <FavoriteIcon sx={{ color: "#ef4444", fontSize: 16 }} />
                            ) : (
                              <FavoriteBorderIcon sx={{ color: "#64748b", fontSize: 16 }} />
                            )}
                          </IconButton>

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
                                {uzsPrice.toLocaleString()}{" "}
                                <span style={{ fontSize: "12px", fontWeight: 700 }}>UZS</span>
                              </Typography>
                              <Typography variant="caption" sx={{ color: "#64748b", fontSize: "11px", fontWeight: 600 }}>
                                ≈ ${usdPrice} USD
                              </Typography>
                            </div>

                            <Stack direction="row" spacing={0.8} alignItems="center">
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={(e) => handleAddToCart(product, e)}
                                  startIcon={<AddShoppingCartIcon sx={{ fontSize: 14 }} />}
                                  sx={{
                                    borderColor: "#2D6A4F",
                                    color: "#2D6A4F",
                                    px: 1.2,
                                    py: 0.7,
                                    borderRadius: "10px",
                                    textTransform: "none",
                                    fontWeight: 700,
                                    fontSize: "11px",
                                    lineHeight: 1.2,
                                    "&:hover": { borderColor: "#1B4332", bgcolor: "#f0fdf4" },
                                  }}
                                >
                                  Savatga
                                </Button>
                              </motion.div>
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                  variant="contained"
                                  size="small"
                                  onClick={(e) => handleDirectBuy(product, e)}
                                  startIcon={<BoltIcon sx={{ fontSize: 15, color: "#fef08a" }} />}
                                  sx={{
                                    bgcolor: "#1B4332",
                                    color: "#ffffff",
                                    px: 1.4,
                                    py: 0.7,
                                    borderRadius: "10px",
                                    textTransform: "none",
                                    fontWeight: 800,
                                    fontSize: "11px",
                                    lineHeight: 1.2,
                                    boxShadow: "0 3px 10px rgba(27, 67, 50, 0.25)",
                                    "&:hover": { bgcolor: "#0E271D" },
                                  }}
                                >
                                  Xarid
                                </Button>
                              </motion.div>
                            </Stack>
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
                  {t.emptyTitle}
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748b", maxWidth: 450, mx: "auto", mb: 3 }}>
                  {t.emptyDesc}
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
            {totalPages > 1 && (
              <Box
                sx={{
                  mt: 7,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(_, page) => {
                    setProductSearch((prev) => ({ ...prev, page }));
                    window.scrollTo({ top: 380, behavior: "smooth" });
                  }}
                  showFirstButton
                  showLastButton
                  size="large"
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
                <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600 }}>
                  Jami {displayedProducts.length} ta mahsulot • Sahifa {currentPage} / {totalPages}
                </Typography>
              </Box>
            )}
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

      {/* Standalone Direct Buy Payment Gateway */}
      <PaymentModal
        open={directPaymentOpen}
        order={directPaymentOrder}
        onClose={() => {
          setDirectPaymentOpen(false);
          setDirectPaymentOrder(null);
        }}
        onPaymentSuccess={handleDirectPaymentSuccess}
      />
    </Box>
  );
}
