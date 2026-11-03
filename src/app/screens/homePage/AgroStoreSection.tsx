import React, { useState, useEffect } from "react";
import { Container, Stack, Box, Typography, Button, Chip, IconButton } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import StarIcon from "@mui/icons-material/Star";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import VerifiedIcon from "@mui/icons-material/Verified";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BoltIcon from "@mui/icons-material/Bolt";
import { NavLink } from "react-router-dom";
import { CartItem } from "../../../lib/types/search";
import WishlistService from "../../services/WishlistService";
import PaymentModal from "../../components/payment/PaymentModal";
import OrderService from "../../services/OrdersService";
import { OrderStatus } from "../../../lib/enums/order.enum";
import { Order } from "../../../lib/types/order";
import { sweetTopSuccessAlert, sweetErrorHandling } from "../../../lib/sweetAlert";
import { getSavedLanguage, translations } from "../../../lib/i18n";

interface AgroStoreSectionProps {
  onAdd: (item: CartItem) => void;
}

interface DemoAgroProduct {
  _id: string;
  name: string;
  category: "all" | "seeds" | "medicine" | "film" | "tools";
  categoryLabel: string;
  badge: string;
  rating: number;
  priceUzs: number;
  oldPriceUzs?: number;
  priceUsd: number;
  image: string;
  desc: string;
}

const AGRO_PRODUCTS_CATALOG: DemoAgroProduct[] = [
  {
    _id: "prod_vesta_tomato_1",
    name: "Vesta F1 Qizil Pomidor Urug'i (1,000 dona)",
    category: "seeds",
    categoryLabel: "Gibrid Pomidor Urug'i",
    badge: "Vesta F1",
    rating: 4.9,
    priceUzs: 420000,
    oldPriceUzs: 480000,
    priceUsd: 33.3,
    image: "/img/seeds/seedVESTATOMATO.jpeg",
    desc: "Virus va fitoftoraga yuqori chidamli, go'shtdor yirik pomidor.",
  },
  {
    _id: "prod_greenhouse_film_3layer",
    name: "6 Metrlik Ko'p Yillik Antikaplya Salafan (150 mkr, 6m x 100m)",
    category: "film",
    categoryLabel: "Issiqxona Salafani",
    badge: "Antikaplya Termo",
    rating: 5.0,
    priceUzs: 2650000,
    oldPriceUzs: 2900000,
    priceUsd: 206.2,
    image: "/img/salafan/Salafan6M.jpg",
    desc: "Antikondensat va yorug'likni teng tarqatuvchi EVA qoplamali mustahkam plyonka.",
  },
  {
    _id: "prod_ridomil_gold_mz",
    name: "Ridomil Gold MZ 68 WG (Syngenta, 1 kg)",
    category: "medicine",
    categoryLabel: "Fungitsid Himoya",
    badge: "Original Syngenta",
    rating: 4.8,
    priceUzs: 165000,
    oldPriceUzs: 185000,
    priceUsd: 12.8,
    image: "/img/products/ridomilgold.jpg",
    desc: "Fitoftora va peronosporozga qarshi O'zbekistondagi 1-raqamli tizimli fungitsid.",
  },
  {
    _id: "prod_drip_tape_israel",
    name: "Avtomatik Tomchilatib Sug'orish Lenta (1000m, 20cm oraliq)",
    category: "tools",
    categoryLabel: "Sug'orish Tizimlari",
    badge: "Tiqilmas Labirint",
    rating: 4.9,
    priceUzs: 720000,
    oldPriceUzs: 780000,
    priceUsd: 56.0,
    image: "/img/products/sugorish.jpg",
    desc: "Labirintli tiqilmaydigan tomizgichlar, suv sarfini 60% gacha tejaydi.",
  },
  {
    _id: "prod_miracle_cucumber",
    name: "Miracle F1 Bodring Urug'i (Mo''jiza Hosildorlik)",
    category: "seeds",
    categoryLabel: "Bodring Urug'i",
    badge: "Miracle F1",
    rating: 4.9,
    priceUzs: 340000,
    oldPriceUzs: 380000,
    priceUsd: 26.5,
    image: "/img/seeds/seedMIRACLECUCUMBER.jpeg",
    desc: "Har bir bo'g'indan 3-4 tadan meva tuguvchi guldor partenokarpik bodring gibridi.",
  },
  {
    _id: "prod_topas_100_ec",
    name: "Topas 100 EC Tizimli Fungitsid (Syngenta, 1 L)",
    category: "medicine",
    categoryLabel: "Un-Shudringga Qarshi",
    badge: "Syngenta",
    rating: 4.7,
    priceUzs: 210000,
    priceUsd: 16.6,
    image: "/img/products/score.webp",
    desc: "Un-shudring va zang kasalliklarini 24 soat ichida to'xtatuvchi jahon etaloni.",
  },
  {
    _id: "prod_entofito_super_ifoda",
    name: "Ento-Fito Super Mis Asosli Fungitsid (IFODA Agro, 1 kg)",
    category: "medicine",
    categoryLabel: "Mahalliy Himoya",
    badge: "IFODA Agro",
    rating: 4.8,
    priceUzs: 85000,
    priceUsd: 6.7,
    image: "/img/products/fungisit.jpg",
    desc: "Bakterial kuyish va dog'lanishlarga qarshi arzon va samarali misli dori.",
  },
  {
    _id: "prod_smart_sensor_iot",
    name: "Smart Issiqxona Termo-Gidrometr Sensori (IoT Wi-Fi)",
    category: "tools",
    categoryLabel: "Aqlli Fermerlik",
    badge: "IoT Smart",
    rating: 4.9,
    priceUzs: 450000,
    oldPriceUzs: 520000,
    priceUsd: 35.7,
    image: "/img/products/smart_sensor.jpg",
    desc: "Harorat va namlikni real vaqtda o'lchab, Telegramga ogohlantirish yuboradi.",
  },
];

export default function AgroStoreSection({ onAdd }: AgroStoreSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [likedIds, setLikedIds] = useState<string[]>(() => WishlistService.getLikedIds());
  const [directPaymentOpen, setDirectPaymentOpen] = useState<boolean>(false);
  const [directPaymentOrder, setDirectPaymentOrder] = useState<Order | null>(null);

  useEffect(() => {
    const handleWishlistChange = () => {
      setLikedIds(WishlistService.getLikedIds());
    };
    window.addEventListener("agroolam_wishlist_updated", handleWishlistChange);
    return () => {
      window.removeEventListener("agroolam_wishlist_updated", handleWishlistChange);
    };
  }, []);

  const handleToggleLike = (prodId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const { isLiked } = WishlistService.toggleLike(prodId);
    setLikedIds(WishlistService.getLikedIds());
    sweetTopSuccessAlert(
      isLiked ? "❤️ Sevimlilar ro'yxatiga qo'shildi!" : "🤍 Sevimlilardan olib tashlandi"
    );
  };

  const handleDirectBuy = async (prod: DemoAgroProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const orderSvc = new OrderService();
      const order = await orderSvc.createOrder([
        {
          _id: prod._id,
          quantity: 1,
          name: prod.name,
          price: prod.priceUzs,
          image: prod.image,
        },
      ]);
      setDirectPaymentOrder(order);
      setDirectPaymentOpen(true);
    } catch (err) {
      console.log("Direct buy error:", err);
      sweetErrorHandling(err).then();
    }
  };

  const handlePaymentSuccess = async (orderId: string) => {
    try {
      const orderSvc = new OrderService();
      await orderSvc.updateOrder({ orderId, orderStatus: OrderStatus.PROCESS });
      sweetTopSuccessAlert("To'lov muvaffaqiyatli qabul qilindi!");
    } catch (err) {
      sweetErrorHandling(err).then();
    }
  };

  const lang = getSavedLanguage();
  const tStore = translations[lang].storeSection;

  const filteredProducts =
    activeCategory === "all"
      ? AGRO_PRODUCTS_CATALOG
      : AGRO_PRODUCTS_CATALOG.filter((p) => p.category === activeCategory);

  const filterTabs = [
    { key: "all", label: tStore.catAll },
    { key: "seeds", label: tStore.catSeeds },
    { key: "medicine", label: tStore.catMedicine },
    { key: "film", label: tStore.catFilm },
    { key: "tools", label: tStore.catTools },
  ];

  return (
    <Box
      id="store"
      component="section"
      sx={{
        py: { xs: 8, md: 10 },
        bgcolor: "#F4F6F0",
        borderTop: "1px solid #E1E8DE",
        borderBottom: "1px solid #E1E8DE",
      }}
    >
      <Container maxWidth="xl">
        {/* HEADER & FILTER BAR */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "flex-end" }}
          spacing={3}
          sx={{ mb: 6 }}
        >
          <div>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 800,
                color: "#2D6A4F",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <VerifiedIcon sx={{ fontSize: 16 }} />
              {tStore.badge}
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                color: "#0E271D",
                fontSize: { xs: "28px", md: "38px" },
                letterSpacing: "-0.5px",
                mt: 1,
              }}
            >
              {tStore.title}
            </Typography>
          </div>

          {/* FILTER PILLS */}
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
            {filterTabs.map((tab) => {
              const isActive = activeCategory === tab.key;
              return (
                <Button
                  key={tab.key}
                  size="small"
                  onClick={() => setActiveCategory(tab.key)}
                  sx={{
                    borderRadius: "30px",
                    px: 2.5,
                    py: 1,
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: "13px",
                    bgcolor: isActive ? "#2D6A4F" : "#ffffff",
                    color: isActive ? "#ffffff" : "#4A5568",
                    border: isActive ? "1px solid #2D6A4F" : "1px solid #E2E8F0",
                    boxShadow: isActive ? "0 4px 12px rgba(45, 106, 79, 0.25)" : "none",
                    "&:hover": {
                      bgcolor: isActive ? "#1B4332" : "#f1f5f9",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  {tab.label}
                </Button>
              );
            })}
          </Stack>
        </Stack>

        {/* PRODUCTS GRID */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 3.5,
          }}
        >
          <AnimatePresence>
            {filteredProducts.map((prod) => (
              <motion.div
                key={prod._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -6 }}
                style={{ height: "100%" }}
              >
                <Box
                  sx={{
                    bgcolor: "#ffffff",
                    borderRadius: "20px",
                    overflow: "hidden",
                    border: "1px solid rgba(194, 223, 206, 0.8)",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "box-shadow 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 12px 30px rgba(27, 67, 50, 0.12)",
                    },
                  }}
                >
                  {/* Top Image & Badges */}
                  <Box sx={{ position: "relative", width: "100%", pt: "66%", bgcolor: "#f1f5f9", overflow: "hidden" }}>
                    <img
                      src={prod.image}
                      alt={prod.name}
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
                    <Chip
                      label={prod.badge}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        bgcolor: "#1B4332",
                        color: "#ffffff",
                        fontWeight: 800,
                        fontSize: "11px",
                        letterSpacing: "0.5px",
                        textTransform: "uppercase",
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        bgcolor: "rgba(255, 255, 255, 0.92)",
                        backdropFilter: "blur(6px)",
                        px: 1,
                        py: 0.3,
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        fontSize: "12px",
                        fontWeight: 800,
                        color: "#1e293b",
                      }}
                    >
                      <StarIcon sx={{ fontSize: 15, color: "#f59e0b" }} />
                      {prod.rating.toFixed(1)}
                    </Box>

                    {/* Heart Like / Wishlist Button */}
                    <IconButton
                      size="small"
                      onClick={(e) => handleToggleLike(prod._id, e)}
                      title={likedIds.includes(prod._id) ? "Sevimlilardan o'chirish" : "Sevimlilarga qo'shish"}
                      sx={{
                        position: "absolute",
                        top: 12,
                        right: 70,
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
                      {likedIds.includes(prod._id) ? (
                        <FavoriteIcon sx={{ color: "#ef4444", fontSize: 16 }} />
                      ) : (
                        <FavoriteBorderIcon sx={{ color: "#64748b", fontSize: 16 }} />
                      )}
                    </IconButton>
                  </Box>

                  {/* Body Details */}
                  <Box sx={{ p: 2.5, flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 800,
                          color: "#2D6A4F",
                          textTransform: "uppercase",
                          fontSize: "10.5px",
                          letterSpacing: "0.5px",
                        }}
                      >
                        {prod.categoryLabel}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 800,
                          color: "#0f172a",
                          lineHeight: 1.3,
                          mt: 0.5,
                          fontSize: "15px",
                          minHeight: "40px",
                        }}
                      >
                        {prod.name}
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
                        {prod.desc}
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
                        {prod.oldPriceUzs && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: "#94a3b8",
                              textDecoration: "line-through",
                              display: "block",
                              fontSize: "11px",
                              lineHeight: 1,
                            }}
                          >
                            {prod.oldPriceUzs.toLocaleString()} UZS
                          </Typography>
                        )}
                        <Typography variant="subtitle1" sx={{ fontWeight: 900, color: "#1B4332", fontSize: "16px" }}>
                          {prod.priceUzs.toLocaleString()}{" "}
                          <span style={{ fontSize: "12px", fontWeight: 700 }}>UZS</span>
                          <span style={{ fontSize: "11px", color: "#64748b", fontWeight: 500, marginLeft: "4px" }}>
                            (${prod.priceUsd})
                          </span>
                        </Typography>
                      </div>

                      <Stack direction="row" spacing={0.8} alignItems="center">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => {
                              onAdd({
                                _id: prod._id,
                                quantity: 1,
                                name: prod.name,
                                price: prod.priceUzs,
                                image: prod.image,
                              });
                              sweetTopSuccessAlert(tStore.addedToCart);
                            }}
                            sx={{
                              borderColor: "#2D6A4F",
                              color: "#2D6A4F",
                              minWidth: "36px",
                              p: 0.8,
                              borderRadius: "10px",
                              "&:hover": { borderColor: "#1B4332", bgcolor: "#f0fdf4" },
                            }}
                            title={tStore.buyNow}
                          >
                            <AddIcon sx={{ fontSize: 18 }} />
                          </Button>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={(e) => handleDirectBuy(prod, e)}
                            startIcon={<BoltIcon sx={{ fontSize: 15, color: "#fef08a" }} />}
                            sx={{
                              bgcolor: "#1B4332",
                              color: "#ffffff",
                              px: 1.4,
                              py: 0.8,
                              borderRadius: "10px",
                              textTransform: "none",
                              fontWeight: 800,
                              fontSize: "11px",
                              boxShadow: "0 3px 10px rgba(27, 67, 50, 0.25)",
                              "&:hover": { bgcolor: "#0E271D" },
                            }}
                          >
                            {tStore.buyNow}
                          </Button>
                        </motion.div>
                      </Stack>
                    </Box>
                  </Box>
                </Box>
              </motion.div>
            ))}
          </AnimatePresence>
        </Box>

        {/* BOTTOM CTA: VIEW FULL CATALOG */}
        <Box sx={{ mt: 7, textAlign: "center" }}>
          <NavLink to="/products" style={{ textDecoration: "none" }}>
            <motion.div style={{ display: "inline-block" }} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Button
                variant="outlined"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  color: "#1B4332",
                  borderColor: "#2D6A4F",
                  borderRadius: "30px",
                  px: 4,
                  py: 1.4,
                  fontWeight: 800,
                  fontSize: "14px",
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "#1B4332",
                    bgcolor: "rgba(45, 106, 79, 0.08)",
                  },
                }}
              >
                {tStore.viewFullCatalog}
              </Button>
            </motion.div>
          </NavLink>
        </Box>
      </Container>

      {/* Standalone Direct Buy Payment Gateway */}
      <PaymentModal
        open={directPaymentOpen}
        order={directPaymentOrder}
        onClose={() => {
          setDirectPaymentOpen(false);
          setDirectPaymentOrder(null);
        }}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </Box>
  );
}
