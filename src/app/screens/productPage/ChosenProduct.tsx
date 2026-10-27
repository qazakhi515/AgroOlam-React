import React, { useEffect, useState } from "react";
import {
  Container,
  Stack,
  Box,
  Typography,
  Grid,
  Button,
  Rating,
  Chip,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Alert,
  IconButton,
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { Navigation, Thumbs } from "swiper";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import VerifiedIcon from "@mui/icons-material/Verified";
import CalculateIcon from "@mui/icons-material/Calculate";
import SecurityIcon from "@mui/icons-material/Security";
import ScienceIcon from "@mui/icons-material/Science";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { motion } from "framer-motion";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, createSelector } from "@reduxjs/toolkit";
import { Product } from "../../../lib/types/product";
import { setChosenProduct, setRestaurant } from "./slice";
import { retrieveChosenProduct, retrieveRestaurant } from "./selector";
import ProductService from "../../services/ProductService";
import MemberService from "../../services/memberService";
import { Member } from "../../../lib/types/member";
import { serverApi } from "../../../lib/config";
import { CartItem } from "../../../lib/types/search";
import { getSavedLanguage } from "../../../lib/i18n";
import PlantDoctorModal from "../../components/ai/PlantDoctorModal";

const actionDispatch = (dispatch: Dispatch) => ({
  setRestaurant: (data: Member) => dispatch(setRestaurant(data)),
  setChosenProduct: (data: Product) => dispatch(setChosenProduct(data)),
});

const chosenProductRetriever = createSelector(
  retrieveChosenProduct,
  (chosenProduct) => ({ chosenProduct })
);

const restaurantRetriever = createSelector(
  retrieveRestaurant,
  (restaurant) => ({ restaurant })
);

interface ChosenProductProps {
  onAdd: (item: CartItem) => void;
}

export default function ChosenProduct(props: ChosenProductProps) {
  const { onAdd } = props;
  const { productId } = useParams<{ productId: string }>();
  const history = useHistory();
  const lang = getSavedLanguage();

  const { setRestaurant, setChosenProduct } = actionDispatch(useDispatch());
  const { chosenProduct } = useSelector(chosenProductRetriever);
  const { restaurant } = useSelector(restaurantRetriever);

  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [areaInput, setAreaInput] = useState<number>(10); // default 10 sotix
  const [selectedThickness, setSelectedThickness] = useState<string>("150 mkr");
  const [selectedWidth, setSelectedWidth] = useState<string>("12 metr");
  const [isDoctorOpen, setIsDoctorOpen] = useState<boolean>(false);

  useEffect(() => {
    const product = new ProductService();
    product
      .getProduct(productId)
      .then((data) => setChosenProduct(data))
      .catch((err) => console.log(err));

    const member = new MemberService();
    member
      .getRestaurant()
      .then((data) => setRestaurant(data))
      .catch((err) => console.log(err));
  }, [productId]);

  if (!chosenProduct) {
    return (
      <Box sx={{ py: 12, textAlign: "center", bgcolor: "#fcfdf9" }}>
        <Typography variant="h6" color="#2D6A4F" fontWeight={700}>
          Mahsulot ma'lumotlari yuklanmoqda...
        </Typography>
      </Box>
    );
  }

  // Calculator logic: 1 sotix ~ 25g powder & 10L water
  const calculatedMedicineGrams = Math.round(areaInput * 25);
  const calculatedWaterLiters = Math.round(areaInput * 10);

  const isFilmProduct =
    chosenProduct.productName.toLowerCase().includes("plyonka") ||
    chosenProduct.productName.toLowerCase().includes("salafan") ||
    chosenProduct.productName.toLowerCase().includes("film");

  return (
    <Box sx={{ bgcolor: "#fcfdf9", py: { xs: 4, md: 7 }, minHeight: "85vh" }}>
      <Container maxWidth="lg">
        {/* Breadcrumb / Back button */}
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => history.push("/products")}
            sx={{
              color: "#2D6A4F",
              fontWeight: 700,
              textTransform: "none",
              borderRadius: "12px",
              "&:hover": { bgcolor: "#e1efe7" },
            }}
          >
            Mahsulotlar katalogiga qaytish
          </Button>
          <Typography variant="body2" sx={{ color: "#94a3b8" }}>
            /
          </Typography>
          <Typography variant="body2" sx={{ color: "#475569", fontWeight: 600 }}>
            {chosenProduct.productName}
          </Typography>
        </Stack>

        {/* Top Showcase: Images & Product Info Card */}
        <Grid container spacing={{ xs: 3, md: 5 }}>
          {/* Left Column: Image Gallery Slider */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                borderRadius: "24px",
                overflow: "hidden",
                bgcolor: "#ffffff",
                border: "1px solid #e1efe7",
                boxShadow: "0 15px 40px rgba(14,39,29,0.06)",
                p: { xs: 2, sm: 3 },
              }}
            >
              <Swiper
                loop={chosenProduct.productImages.length > 1}
                spaceBetween={12}
                navigation={true}
                modules={[Navigation, Thumbs]}
                style={{ width: "100%", height: "380px", borderRadius: "18px" }}
              >
                {chosenProduct.productImages.map((img: string, idx: number) => {
                  const imageSrc = img.startsWith("http") ? img : `${serverApi}/${img}`;
                  return (
                    <SwiperSlide key={idx} style={{ textAlign: "center", backgroundColor: "#f8fafc" }}>
                      <img
                        src={imageSrc}
                        alt={chosenProduct.productName}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          borderRadius: "18px",
                        }}
                      />
                    </SwiperSlide>
                  );
                })}
              </Swiper>

              {/* Trust & Quality Badges Under Image */}
              <Stack direction="row" spacing={1.5} sx={{ mt: 3, flexWrap: "wrap", gap: 1 }}>
                <Chip
                  icon={<VerifiedIcon sx={{ color: "#10b981 !important" }} />}
                  label="100% Sertifikatlangan"
                  sx={{ bgcolor: "#d1fae5", color: "#065f46", fontWeight: 700, fontSize: "12px" }}
                />
                <Chip
                  icon={<SecurityIcon sx={{ color: "#0284c7 !important" }} />}
                  label="Xavflilik sinfi: III (Kam xavfli)"
                  sx={{ bgcolor: "#e0f2fe", color: "#0369a1", fontWeight: 700, fontSize: "12px" }}
                />
                <Chip
                  label={`Omborda: ${chosenProduct.productLeftCount} dona`}
                  variant="outlined"
                  sx={{ borderColor: "#2D6A4F", color: "#2D6A4F", fontWeight: 700, fontSize: "12px" }}
                />
              </Stack>
            </Box>
          </Grid>

          {/* Right Column: Title, Specs & Purchasing Actions */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                bgcolor: "#ffffff",
                borderRadius: "24px",
                p: { xs: 3, sm: 4 },
                border: "1px solid #e1efe7",
                boxShadow: "0 15px 40px rgba(14,39,29,0.06)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
              }}
            >
              <div>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    color: "#2D6A4F",
                    display: "block",
                    mb: 0.5,
                  }}
                >
                  {chosenProduct.productCollection} • Rasmiy Distribyutsiya
                </Typography>

                <Typography
                  variant="h4"
                  fontWeight={900}
                  color="#0E271D"
                  sx={{ fontSize: { xs: "24px", sm: "30px" }, lineHeight: 1.25, mb: 1.5 }}
                >
                  {chosenProduct.productName}
                </Typography>

                {/* Rating, Views & Supplier */}
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}>
                  <Rating value={4.9} precision={0.1} readOnly size="small" sx={{ color: "#fbbf24" }} />
                  <Typography variant="caption" sx={{ fontWeight: 700, color: "#334155" }}>
                    4.9 (128 ta baho)
                  </Typography>
                  <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: "#64748b" }}>
                    <RemoveRedEyeIcon sx={{ fontSize: 16 }} />
                    <Typography variant="caption">{chosenProduct.productViews} marta ko'rildi</Typography>
                  </Stack>
                </Stack>

                {/* Supplier Badge */}
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: "14px",
                    bgcolor: "#f2f8f4",
                    border: "1px solid #c2dfce",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2.5,
                  }}
                >
                  <div>
                    <Typography variant="caption" sx={{ color: "#475569", display: "block" }}>
                      Yetkazib beruvchi do'kon:
                    </Typography>
                    <Typography variant="subtitle2" fontWeight={800} color="#1B4332">
                      {restaurant?.memberNick || "AgroOlam Official Supply Center (agroolam.tech)"}
                    </Typography>
                  </div>
                  <Chip
                    label="Tekshirilgan Hamkor"
                    size="small"
                    sx={{ bgcolor: "#2D6A4F", color: "#fff", fontWeight: 700, fontSize: "11px" }}
                  />
                </Box>

                {/* Price Display */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
                    Narxi (QQS bilan):
                  </Typography>
                  <Stack direction="row" spacing={1.5} alignItems="baseline">
                    <Typography variant="h3" fontWeight={900} color="#2D6A4F" sx={{ fontSize: { xs: "28px", sm: "36px" } }}>
                      {chosenProduct.productPrice.toLocaleString()} UZS
                    </Typography>
                    <Typography variant="subtitle1" sx={{ color: "#64748b", fontWeight: 600 }}>
                      (~${(chosenProduct.productPrice / 12600).toFixed(1)})
                    </Typography>
                  </Stack>
                </Box>

                {/* Film & Technical Options (If Greenhouse Film) */}
                {isFilmProduct && (
                  <Box sx={{ mb: 3, p: 2, borderRadius: "14px", bgcolor: "#f8fafc", border: "1px solid #e2e8f0" }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: "#334155", display: "block", mb: 1 }}>
                      Plyonka Qalinligi:
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
                      {["120 mkr", "150 mkr", "200 mkr"].map((th) => (
                        <Button
                          key={th}
                          size="small"
                          variant={selectedThickness === th ? "contained" : "outlined"}
                          onClick={() => setSelectedThickness(th)}
                          sx={{
                            borderRadius: "10px",
                            fontWeight: 700,
                            fontSize: "12px",
                            textTransform: "none",
                            bgcolor: selectedThickness === th ? "#2D6A4F" : "transparent",
                            color: selectedThickness === th ? "#fff" : "#334155",
                          }}
                        >
                          {th}
                        </Button>
                      ))}
                    </Stack>

                    <Typography variant="caption" sx={{ fontWeight: 800, color: "#334155", display: "block", mb: 1 }}>
                      Eni (Kengligi):
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      {["8 metr", "10 metr", "12 metr", "14 metr"].map((w) => (
                        <Button
                          key={w}
                          size="small"
                          variant={selectedWidth === w ? "contained" : "outlined"}
                          onClick={() => setSelectedWidth(w)}
                          sx={{
                            borderRadius: "10px",
                            fontWeight: 700,
                            fontSize: "12px",
                            textTransform: "none",
                            bgcolor: selectedWidth === w ? "#2D6A4F" : "transparent",
                            color: selectedWidth === w ? "#fff" : "#334155",
                          }}
                        >
                          {w}
                        </Button>
                      ))}
                    </Stack>
                  </Box>
                )}

                {/* Key Agro Specs Pill Grid */}
                <Grid container spacing={1.5} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <Box sx={{ p: 1.5, borderRadius: "12px", bgcolor: "#fcfdf9", border: "1px solid #e1efe7" }}>
                      <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
                        Qadoq / Hajm:
                      </Typography>
                      <Typography variant="subtitle2" fontWeight={800} color="#0E271D">
                        {chosenProduct.productSize} • {chosenProduct.productVolume ? `${chosenProduct.productVolume} kg/L` : "Standart"}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ p: 1.5, borderRadius: "12px", bgcolor: "#fcfdf9", border: "1px solid #e1efe7" }}>
                      <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
                        Kutish muddati (PHI):
                      </Typography>
                      <Typography variant="subtitle2" fontWeight={800} color="#0E271D">
                        14 kun (Standart karantin)
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </div>

              {/* Quantity Selector & Add To Cart Button */}
              <Box sx={{ pt: 2, borderTop: "1px solid #e2e8f0" }}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
                  {/* Quantity Counter */}
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{
                      p: 0.5,
                      borderRadius: "14px",
                      border: "1px solid #cbd5e1",
                      bgcolor: "#f8fafc",
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      sx={{ bgcolor: "#fff" }}
                    >
                      <RemoveIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                    <Typography sx={{ px: 2, fontWeight: 800, fontSize: "15px" }}>
                      {quantity}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => setQuantity(quantity + 1)}
                      sx={{ bgcolor: "#fff" }}
                    >
                      <AddIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Stack>

                  {/* Add To Cart Primary CTA */}
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{ flex: 1, width: "100%" }}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      startIcon={<ShoppingCartIcon />}
                      onClick={() =>
                        onAdd({
                          _id: chosenProduct._id,
                          quantity: quantity,
                          name: chosenProduct.productName,
                          price: chosenProduct.productPrice,
                          image: chosenProduct.productImages[0],
                        })
                      }
                      sx={{
                        bgcolor: "#2D6A4F",
                        color: "#fff",
                        py: 1.4,
                        fontWeight: 800,
                        fontSize: "15px",
                        borderRadius: "14px",
                        textTransform: "none",
                        boxShadow: "0 6px 20px rgba(45,106,79,0.35)",
                        "&:hover": { bgcolor: "#1B4332" },
                      }}
                    >
                      Savatga Qo'shish ({((chosenProduct.productPrice * quantity)).toLocaleString()} UZS)
                    </Button>
                  </motion.div>
                </Stack>

                {/* Secondary AI Camera Diagnostic CTA */}
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<PhotoCameraIcon sx={{ color: "#2D6A4F" }} />}
                  onClick={() => setIsDoctorOpen(true)}
                  sx={{
                    mt: 1.5,
                    borderRadius: "14px",
                    borderColor: "rgba(45,106,79,0.3)",
                    color: "#1B4332",
                    fontWeight: 700,
                    fontSize: "13px",
                    textTransform: "none",
                    py: 1,
                    "&:hover": { bgcolor: "#f2f8f4", borderColor: "#2D6A4F" },
                  }}
                >
                  📷 AI Skaner orqali ekin bargini tekshirish
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Bottom Multi-Tab Section: Specifications & Dosage Calculator */}
        <Box
          sx={{
            mt: 6,
            bgcolor: "#ffffff",
            borderRadius: "24px",
            p: { xs: 2.5, sm: 4 },
            border: "1px solid #e1efe7",
            boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              borderBottom: "1px solid #e2e8f0",
              mb: 3,
              "& .MuiTab-root": {
                fontWeight: 700,
                fontSize: "14px",
                textTransform: "none",
                minHeight: 48,
              },
              "& .Mui-selected": {
                color: "#2D6A4F !important",
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#2D6A4F",
                height: 3,
                borderRadius: "3px 3px 0 0",
              },
            }}
          >
            <Tab label="Ta'rif & Qamrov" />
            <Tab icon={<CalculateIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Dozalash & Sarf Kalkulyatori" />
            <Tab icon={<ScienceIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Kimyoviy Xususiyatlari & Xavfsizlik" />
          </Tabs>

          {/* TAB 0: DESCRIPTION & TARGETS */}
          {activeTab === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <Typography variant="body1" sx={{ color: "#334155", lineHeight: 1.8, mb: 3 }}>
                {chosenProduct.productDesc ||
                  "Ushbu preparat zamonaviy agrotexnika va issiqxona xo'jaliklarida ekinlarni xavfli zamburug'li va bakterial kasalliklardan yuqori darajada himoya qilish uchun maxsus ishlab chiqilgan. O'simlik to'qimalariga tezkor singib, ob-havo injiqliklariga qaramay uzoq muddatli barqaror immunitetni ta'minlaydi."}
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 2.5, borderRadius: "16px", bgcolor: "#f8fafc", border: "1px solid #e2e8f0" }}>
                    <Typography variant="subtitle2" fontWeight={800} color="#0E271D" sx={{ mb: 1.5 }}>
                      🌱 Mos keluvchi ekinlar:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                      {["Issiqxona Pomidori", "Bodring", "Bolgar Qalampiri", "Baqlajon", "Kartoshka", "Gidroponika Qulupnay"].map((crop) => (
                        <Chip key={crop} label={crop} size="small" sx={{ bgcolor: "#e1efe7", color: "#1B4332", fontWeight: 700 }} />
                      ))}
                    </Stack>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 2.5, borderRadius: "16px", bgcolor: "#f8fafc", border: "1px solid #e2e8f0" }}>
                    <Typography variant="subtitle2" fontWeight={800} color="#0E271D" sx={{ mb: 1.5 }}>
                      🦠 Davolaydigan kasalliklar:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                      {["Fitoftora (Late Blight)", "Un-shudring (Powdery Mildew)", "Alternarioz", "Bakterial dog'lanish", "Ildiz chirishi"].map((dis) => (
                        <Chip key={dis} label={dis} size="small" sx={{ bgcolor: "#fee2e2", color: "#991b1b", fontWeight: 700 }} />
                      ))}
                    </Stack>
                  </Box>
                </Grid>
              </Grid>
            </motion.div>
          )}

          {/* TAB 1: INTERACTIVE DOSAGE CALCULATOR */}
          {activeTab === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <Box sx={{ p: { xs: 2, sm: 3.5 }, borderRadius: "18px", bgcolor: "#f2f8f4", border: "1px solid #c2dfce" }}>
                <Typography variant="h6" fontWeight={800} color="#1B4332" sx={{ mb: 1 }}>
                  📐 Fermer Maydoni Bo'yicha Aniq Sarf Kalkulyatori
                </Typography>
                <Typography variant="body2" sx={{ color: "#4D6657", mb: 3 }}>
                  Issiqxona yoki ochiq dala maydoningiz o'lchamini kiriting — tizim zarur dori miqdori va suv hajmini avtomatik hisoblab beradi.
                </Typography>

                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} sm={5}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Ekin maydoni (Sotix hisobida)"
                      value={areaInput}
                      onChange={(e) => setAreaInput(Math.max(1, Number(e.target.value)))}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">sotix</InputAdornment>,
                      }}
                      sx={{ bgcolor: "#fff" }}
                    />
                    <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                      {[5, 10, 20, 50, 100].map((quickVal) => (
                        <Chip
                          key={quickVal}
                          label={`${quickVal} sotix`}
                          clickable
                          onClick={() => setAreaInput(quickVal)}
                          sx={{
                            fontWeight: 700,
                            bgcolor: areaInput === quickVal ? "#2D6A4F" : "#fff",
                            color: areaInput === quickVal ? "#fff" : "#334155",
                          }}
                        />
                      ))}
                    </Stack>
                  </Grid>

                  <Grid item xs={12} sm={7}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box sx={{ p: 2, borderRadius: "14px", bgcolor: "#fff", border: "1px solid #bbf7d0" }}>
                          <Typography variant="caption" sx={{ color: "#166534", fontWeight: 700 }}>
                            Zarur Dori Miqdori:
                          </Typography>
                          <Typography variant="h5" fontWeight={900} color="#15803d" sx={{ mt: 0.5 }}>
                            {calculatedMedicineGrams} gramm (yoki ml)
                          </Typography>
                          <Typography variant="caption" sx={{ color: "#64748b" }}>
                            (~{(calculatedMedicineGrams / 1000).toFixed(2)} kg)
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={6}>
                        <Box sx={{ p: 2, borderRadius: "14px", bgcolor: "#fff", border: "1px solid #bfdbfe" }}>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <WaterDropIcon sx={{ fontSize: 16, color: "#2563eb" }} />
                            <Typography variant="caption" sx={{ color: "#1e40af", fontWeight: 700 }}>
                              Zarur Toza Suv:
                            </Typography>
                          </Stack>
                          <Typography variant="h5" fontWeight={900} color="#1d4ed8" sx={{ mt: 0.5 }}>
                            {calculatedWaterLiters} litr suv
                          </Typography>
                          <Typography variant="caption" sx={{ color: "#64748b" }}>
                            (1 sotixga ~10L purkash me'yori)
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                <Alert severity="info" sx={{ mt: 3, borderRadius: "12px", fontSize: "13px" }}>
                  <strong>Agronom tavsiyasi:</strong> Preparatni purkashni ertalab soat 08:00 gacha yoki quyosh botgach kechki salqinda amalga oshiring. Havo harorati +28°C dan oshganda purkash taqiqlanadi!
                </Alert>
              </Box>
            </motion.div>
          )}

          {/* TAB 2: CHEMICAL SPECS & SAFETY */}
          {activeTab === 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 2.5, borderRadius: "16px", bgcolor: "#f8fafc", border: "1px solid #e2e8f0" }}>
                    <Typography variant="subtitle2" fontWeight={800} color="#0E271D" sx={{ mb: 1.5 }}>
                      🧪 Ta'sir Etuvchi Modda & Preparat Shakli:
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#334155", mb: 1 }}>
                      <strong>Faol moddasi:</strong> Mefenoksam 40 g/kg + Mankotseb 640 g/kg (yoki Mis xloroksid 90%)
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#334155", mb: 1 }}>
                      <strong>Preparat shakli:</strong> Suvda eruvchan quruq granulalar (WDG / WP)
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#334155" }}>
                      <strong>Kimyoviy guruhi:</strong> Fenilamidlar + Ditiokarbamatlar
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 2.5, borderRadius: "16px", bgcolor: "#fffbeb", border: "1px solid #fde68a" }}>
                    <Typography variant="subtitle2" fontWeight={800} color="#92400e" sx={{ mb: 1.5 }}>
                      ⚠️ Mehnat Xavfsizligi Standartlari:
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#78350f", mb: 1 }}>
                      • Ishlov berish vaqtida shaxsiy himoya vositalari (kombinezon, respirator va qo'lqop) majburiydir.
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#78350f", mb: 1 }}>
                      • Asalarilar uchun xavfsizlik chegarasi: 2-3 km (4-5 soat cheklov).
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#78350f" }}>
                      • Qadoqni ochgach, quruq va salqin joyda, bolalardan xoli saqlang.
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </motion.div>
          )}
        </Box>
      </Container>

      {/* Embedded Plant Doctor Modal Trigger */}
      <PlantDoctorModal
        open={isDoctorOpen}
        onClose={() => setIsDoctorOpen(false)}
        onAdd={onAdd}
      />
    </Box>
  );
}
