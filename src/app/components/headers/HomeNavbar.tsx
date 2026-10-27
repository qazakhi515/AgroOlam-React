import { Box, Button, Container, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { serverApi } from "../../../lib/config";
import { CartItem } from "../../../lib/types/search";
import { useGlobals } from "../hooks/useGlobals";
import Basket from "./Basket";
import LanguageSelector from "./LanguageSelector";
import { getSavedLanguage, translations } from "../../../lib/i18n";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Logout from "@mui/icons-material/Logout";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import PlantDoctorModal from "../ai/PlantDoctorModal";

interface HomeNavbarProps {
  cartItems: CartItem[];
  onAdd: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
  onDeleteAll: () => void;
  setSignupOpen: (isOpen: boolean) => void;
  setLoginOpen: (isOpen: boolean) => void;
  handleLogoutClick: (e: React.MouseEvent<HTMLElement>) => void;
  anchorEl: HTMLElement | null;
  handleCloseLogout: () => void;
  handleLogoutRequest: () => void;
}

export default function HomeNavbar(props: HomeNavbarProps) {
  const {
    cartItems,
    onAdd,
    onRemove,
    onDelete,
    onDeleteAll,
    setLoginOpen,
    setSignupOpen,
    handleLogoutClick,
    anchorEl,
    handleCloseLogout,
    handleLogoutRequest,
  } = props;
  const { authMember } = useGlobals();
  const lang = getSavedLanguage();
  const t = translations[lang].nav;
  const [isDoctorOpen, setIsDoctorOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="home-navbar">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`navbar-sticky-bar ${isScrolled ? "scrolled" : ""}`}
      >
        <Container maxWidth="xl" className="navbar-top-container">
          <Stack className="menu">
            {/* 1. Brand Logo */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <NavLink to="/" className="brand-logo-wrapper">
                <img className="brand-logo" src="/icons/agrivia-logo.svg" alt="Agrivia" />
              </NavLink>
            </motion.div>

            {/* 2. Center Navigation Links (Balanced Gaps) */}
            <Stack direction="row" className="nav-center-links" spacing={{ xs: 1.5, md: 3 }}>
              <Box className="hover-line">
                <NavLink to="/" exact activeClassName="underline">
                  {t.home}
                </NavLink>
              </Box>
              <Box className="hover-line">
                <NavLink to="/products" activeClassName="underline">
                  {t.products}
                </NavLink>
              </Box>
              <Box className="hover-line">
                <NavLink to="/news" activeClassName="underline">
                  {t.news}
                </NavLink>
              </Box>
              {authMember && (
                <Box className="hover-line">
                  <NavLink to="/orders" activeClassName="underline">
                    {t.orders}
                  </NavLink>
                </Box>
              )}
              {authMember && (
                <Box className="hover-line">
                  <NavLink to="/member-page" activeClassName="underline">
                    {t.myPage}
                  </NavLink>
                </Box>
              )}
              <Box className="hover-line">
                <NavLink to="/help" activeClassName="underline">
                  {t.help}
                </NavLink>
              </Box>
            </Stack>

            {/* 3. Action Group: Plant Doctor, Basket, Lang & Auth */}
            <Stack direction="row" className="nav-actions-group" spacing={1.8} alignItems="center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="small"
                  className="plant-doctor-btn"
                  startIcon={<PhotoCameraIcon sx={{ fontSize: 16 }} />}
                  onClick={() => setIsDoctorOpen(true)}
                >
                  {lang === "ko" ? "AI 닥터" : lang === "uz" ? "AI Shifokor" : "Plant Doctor"}
                </Button>
              </motion.div>

              <PlantDoctorModal
                open={isDoctorOpen}
                onClose={() => setIsDoctorOpen(false)}
                onAdd={onAdd}
              />

              <Basket
                cartItems={cartItems}
                onAdd={onAdd}
                onRemove={onRemove}
                onDelete={onDelete}
                onDeleteAll={onDeleteAll}
              />

              <LanguageSelector />

              {!authMember ? (
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <Button
                    variant="contained"
                    className="login-button"
                    onClick={() => setLoginOpen(true)}
                  >
                    {t.login}
                  </Button>
                </motion.div>
              ) : (
                <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}>
                  <img
                    className="user-avatar"
                    src={
                      authMember?.memberImage
                        ? `${serverApi}/${authMember?.memberImage}`
                        : "/icons/default-user.svg"
                    }
                    alt="User Profile"
                    onClick={handleLogoutClick}
                  />
                </motion.div>
              )}

              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={Boolean(anchorEl)}
                onClose={handleCloseLogout}
                onClick={handleCloseLogout}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 4px 16px rgba(0,0,0,0.35))",
                    mt: 1.5,
                    borderRadius: "14px",
                    bgcolor: "rgba(13, 56, 30, 0.95)",
                    backdropFilter: "blur(12px)",
                    color: "#fff",
                    border: "1px solid rgba(74, 222, 128, 0.2)",
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&:before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "rgba(13, 56, 30, 0.95)",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem onClick={handleLogoutRequest} sx={{ color: "#f87171", fontWeight: 600 }}>
                  <ListItemIcon>
                    <Logout fontSize="small" sx={{ color: "#f87171" }} />
                  </ListItemIcon>
                  {t.logout}
                </MenuItem>
              </Menu>
            </Stack>
          </Stack>
        </Container>
      </motion.div>

      <Container className="navbar-container">
        <Stack className={"header-frame"}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Stack className={"detail"}>
              <Box className={"head-main-txt"}>
                Smart Agriculture & Plant Vision AI
              </Box>
              <Box className={"wel-txt"}>
                {lang === "uz"
                  ? "Sog'lom ekinlar, mo'l hosil va xavfsiz o'simlik parvarishi"
                  : lang === "ko"
                  ? "스마트 농업 & AI 식물 병해충 원격 진단 플랫폼"
                  : "Smart Plant Health, Disease Diagnosis & Certified Farm Supplies"}
              </Box>
              <Box className={"service-txt"}>
                {lang === "uz"
                  ? "🌿 24/7 AI Agronom tashxisi va 9-kunlik takroriy dori eslatmalari"
                  : lang === "ko"
                  ? "🌿 24시간 AI 병해충 처방 및 텔레그램 재방제 알림"
                  : "🌿 24/7 AI Agronomy Advisory & Automated Spray Alerts"}
              </Box>
              <Stack direction="row" spacing={2} sx={{ mt: 3.5, flexWrap: "wrap", gap: 1.5 }}>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <Button
                    variant="contained"
                    onClick={() => setIsDoctorOpen(true)}
                    startIcon={<PhotoCameraIcon />}
                    sx={{
                      bgcolor: "#2e7d32",
                      color: "#fff",
                      px: 3,
                      py: 1.4,
                      borderRadius: "24px",
                      fontWeight: 700,
                      fontSize: 14,
                      textTransform: "none",
                      boxShadow: "0 6px 18px rgba(46,125,50,0.45)",
                      "&:hover": { bgcolor: "#1b5e20" },
                    }}
                  >
                    {lang === "uz"
                      ? "📷 Bargni Tashxis Qilish"
                      : lang === "ko"
                      ? "📷 잎 사진 AI 진단"
                      : "📷 Plant Vision AI Doctor"}
                  </Button>
                </motion.div>
                <NavLink to="/products" style={{ textDecoration: "none" }}>
                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                    <Button
                      variant="outlined"
                      sx={{
                        borderColor: "#fff",
                        color: "#fff",
                        borderRadius: "24px",
                        px: 3,
                        py: 1.4,
                        fontWeight: 600,
                        fontSize: 14,
                        textTransform: "none",
                        "&:hover": { borderColor: "#c8e6c9", bgcolor: "rgba(255,255,255,0.15)" },
                      }}
                    >
                      {lang === "uz"
                        ? "🌾 Mahsulotlar Katalogi"
                        : lang === "ko"
                        ? "🌾 농자재 상품 보기"
                        : "🌾 Farm Products"}
                    </Button>
                  </motion.div>
                </NavLink>
              </Stack>
            </Stack>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            whileHover={{ y: -6 }}
            style={{ width: "100%", maxWidth: 690 }}
          >
            <Box className={"logo-frame"} style={{ width: "100%", height: "100%", marginTop: 0 }}>
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "24px",
                p: 3,
                bgcolor: "rgba(255, 255, 255, 0.92)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.6)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: "12px",
                      bgcolor: "#2e7d32",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <PhotoCameraIcon />
                  </Box>
                  <Box>
                    <Box sx={{ fontWeight: 800, fontSize: 16, color: "#1b5e20" }}>
                      AgroPlant Vision AI Doctor
                    </Box>
                    <Box sx={{ fontSize: 12, color: "#666" }}>
                      Real-time Leaf Pathology Scanner
                    </Box>
                  </Box>
                </Stack>
                <Box
                  sx={{
                    bgcolor: "#e8f5e9",
                    color: "#2e7d32",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: "12px",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  99.2% Accuracy
                </Box>
              </Stack>

              <Box
                sx={{
                  bgcolor: "#f8fafc",
                  borderRadius: "16px",
                  p: 2,
                  border: "1px solid #e2e8f0",
                }}
              >
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                  <span style={{ fontWeight: 600, color: "#334155", fontSize: 13 }}>
                    Ekin: Pomidor (Lycopersicon)
                  </span>
                  <span style={{ color: "#d97706", fontWeight: 700, fontSize: 13 }}>
                    Aniqlangan kasallik: Un-shudring
                  </span>
                </Stack>
                <Box sx={{ fontSize: 12, color: "#64748b", mb: 1.5, lineHeight: 1.5 }}>
                  Barg yuzasida oq unsimon dog'lar mavjud. Zamburug'li infeksiya boshlang'ich bosqichda.
                </Box>
                <Box
                  sx={{
                    p: 1.2,
                    bgcolor: "#ecfdf5",
                    borderRadius: "10px",
                    border: "1px solid #a7f3d0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ fontSize: 12, color: "#065f46", fontWeight: 600 }}>
                    💊 Tavsiya dori: Ridomil Gold MZ (25g / 10L)
                  </Box>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => setIsDoctorOpen(true)}
                    sx={{
                      bgcolor: "#059669",
                      fontSize: 11,
                      textTransform: "none",
                      py: 0.4,
                      "&:hover": { bgcolor: "#047857" },
                    }}
                  >
                    Batafsil
                  </Button>
                </Box>
              </Box>

              <Stack direction="row" spacing={1} justifyContent="space-around">
                <Box sx={{ textAlign: "center" }}>
                  <Box sx={{ fontWeight: 800, fontSize: 18, color: "#1e293b" }}>0.8s</Box>
                  <Box sx={{ fontSize: 11, color: "#64748b" }}>Tezkor tahlil</Box>
                </Box>
                <Box sx={{ borderRight: "1px solid #e2e8f0" }} />
                <Box sx={{ textAlign: "center" }}>
                  <Box sx={{ fontWeight: 800, fontSize: 18, color: "#1e293b" }}>1,200+</Box>
                  <Box sx={{ fontSize: 11, color: "#64748b" }}>Agro mahsulot</Box>
                </Box>
                <Box sx={{ borderRight: "1px solid #e2e8f0" }} />
                <Box sx={{ textAlign: "center" }}>
                  <Box sx={{ fontWeight: 800, fontSize: 18, color: "#1e293b" }}>9-kun</Box>
                  <Box sx={{ fontSize: 11, color: "#64748b" }}>Telegram eslatma</Box>
                </Box>
              </Stack>
            </Box>
          </Box>
          </motion.div>
        </Stack>
      </Container>
    </div>
  );
}
