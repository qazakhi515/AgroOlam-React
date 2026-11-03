import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  Chip,
  InputBase,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import { NavLink, useHistory } from "react-router-dom";
import { motion } from "framer-motion";
import { serverApi } from "../../../lib/config";
import { CartItem } from "../../../lib/types/search";
import { useGlobals } from "../hooks/useGlobals";
import Basket from "./Basket";
import LanguageSelector from "./LanguageSelector";
import { getSavedLanguage, translations } from "../../../lib/i18n";
import Logout from "@mui/icons-material/Logout";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import SearchIcon from "@mui/icons-material/Search";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PhoneIcon from "@mui/icons-material/Phone";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
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
    handleLogoutClick,
    anchorEl,
    handleCloseLogout,
    handleLogoutRequest,
  } = props;

  const history = useHistory();
  const { authMember } = useGlobals();
  const lang = getSavedLanguage();
  const t = translations[lang].nav;

  const [isDoctorOpen, setIsDoctorOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      history.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      history.push(`/products`);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="home-navbar">
      {/* ======================================================== */}
      {/* 1. TOP ANNOUNCEMENT BAR                                  */}
      {/* ======================================================== */}
      <Box
        sx={{
          bgcolor: "#0E271D",
          color: "#E1EFE7",
          py: 0.9,
          px: { xs: 2, sm: 4 },
          borderBottom: "1px solid rgba(45, 106, 79, 0.3)",
          fontSize: { xs: "11px", sm: "12px" },
        }}
      >
        <Container maxWidth="xl">
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems="center"
            spacing={1}
          >
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.6,
                  color: "#4ade80",
                  fontWeight: 700,
                }}
              >
                <AutoAwesomeIcon sx={{ fontSize: 14 }} />
                AgroOlam Vision AI 4.1 (agroolam.tech)
              </Box>
              <Box sx={{ color: "rgba(255, 255, 255, 0.4)", display: { xs: "none", md: "inline" } }}>|</Box>
              <Box sx={{ color: "rgba(255, 255, 255, 0.85)", display: { xs: "none", md: "inline" } }}>
                Issiqxona salafanlari & F1 urug'lariga bahorgi 15% chegirma!
              </Box>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2.5}>
              <a
                href="tel:+998712008800"
                style={{
                  color: "#ffffff",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontWeight: 600,
                }}
              >
                <PhoneIcon sx={{ fontSize: 13, color: "#4ade80" }} />
                +998 (71) 200-88-00
              </a>
              <Box
                sx={{
                  bgcolor: "#143527",
                  border: "1px solid #1f4e38",
                  px: 1.5,
                  py: 0.2,
                  borderRadius: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.8,
                  fontSize: "11px",
                }}
              >
                <span style={{ color: "#4ade80", fontWeight: 800 }}>Toshkent</span>
                <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>• +22°C Namlik: 64%</span>
              </Box>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* ======================================================== */}
      {/* 2. STICKY GLASSMORPHIC NAVIGATION BAR                    */}
      {/* ======================================================== */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`navbar-sticky-bar ${isScrolled ? "scrolled" : ""}`}
      >
        <Container maxWidth="xl" className="navbar-top-container">
          <Stack className="menu" direction="row" justifyContent="space-between" alignItems="center">
            {/* 1. Brand Logo */}
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <NavLink to="/" className="brand-logo-wrapper">
                <img
                  className="brand-logo"
                  src="/icons/agroolam-logo.svg"
                  alt="AgroOlam.tech"
                  style={{ height: 38 }}
                />
              </NavLink>
            </motion.div>

            {/* 2. Center Navigation Links */}
            <Stack
              direction="row"
              className="nav-center-links"
              spacing={{ xs: 1.5, md: 3 }}
              alignItems="center"
              sx={{ display: { xs: "none", lg: "flex" } }}
            >
              <Box className="hover-line">
                <NavLink to="/" exact activeClassName="underline">
                  {t.home}
                </NavLink>
              </Box>
              <Box className="hover-line">
                <Button
                  onClick={() => setIsDoctorOpen(true)}
                  sx={{
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: "14px",
                    color: "#166534",
                    p: 0,
                    minWidth: "auto",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.8,
                    "&:hover": { bgcolor: "transparent", color: "#0e381f" },
                  }}
                >
                  AI Ekin Skaner
                  <span
                    style={{
                      background: "#ef4444",
                      color: "#ffffff",
                      fontSize: "9px",
                      fontWeight: 800,
                      padding: "1px 6px",
                      borderRadius: "10px",
                      textTransform: "uppercase",
                    }}
                  >
                    Jonli
                  </span>
                </Button>
              </Box>
              <Box className="hover-line">
                <NavLink to="/products" activeClassName="underline">
                  {t.products}
                </NavLink>
              </Box>
              <Box className="hover-line">
                <a
                  href="#services"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("services");
                  }}
                  style={{ textDecoration: "none", color: "#1A2E24", fontWeight: 600, fontSize: "14px" }}
                >
                  Xizmatlar
                </a>
              </Box>
              <Box className="hover-line">
                <a
                  href="#projects"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("projects");
                  }}
                  style={{ textDecoration: "none", color: "#1A2E24", fontWeight: 600, fontSize: "14px" }}
                >
                  Global Loyihalar
                </a>
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
            </Stack>

            {/* 3. Actions: Plant Doctor Button, Basket, Consultation, Language, Auth */}
            <Stack direction="row" className="nav-actions-group" spacing={1.5} alignItems="center">
              {/* Andijan Real-time Agro Weather Chip */}
              <NavLink to="/news" style={{ textDecoration: "none" }}>
                <Box
                  sx={{
                    display: { xs: "none", sm: "flex" },
                    alignItems: "center",
                    gap: 0.6,
                    bgcolor: "rgba(16, 185, 129, 0.12)",
                    border: "1px solid rgba(16, 185, 129, 0.25)",
                    borderRadius: "20px",
                    px: 1.5,
                    py: 0.6,
                    transition: "all 0.2s ease",
                    "&:hover": { bgcolor: "rgba(16, 185, 129, 0.22)" },
                  }}
                >
                  <span style={{ fontSize: "14px" }}>🌤️</span>
                  <Typography sx={{ fontWeight: 800, fontSize: "11px", color: "#1B4332", whiteSpace: "nowrap" }}>
                    Andijon: +19°C
                  </Typography>
                </Box>
              </NavLink>

              {/* Plant Doctor AI Quick Trigger */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="small"
                  className="plant-doctor-btn"
                  startIcon={<PhotoCameraIcon sx={{ fontSize: 16 }} />}
                  onClick={() => setIsDoctorOpen(true)}
                  sx={{
                    bgcolor: "#2D6A4F",
                    color: "#ffffff",
                    borderRadius: "20px",
                    px: 2,
                    py: 0.8,
                    fontWeight: 700,
                    fontSize: "12px",
                    textTransform: "none",
                    boxShadow: "0 4px 12px rgba(45, 106, 79, 0.3)",
                    "&:hover": { bgcolor: "#1B4332" },
                  }}
                >
                  AI Tashxis
                </Button>
              </motion.div>

              <Basket
                cartItems={cartItems}
                onAdd={onAdd}
                onRemove={onRemove}
                onDelete={onDelete}
                onDeleteAll={onDeleteAll}
              />

              {/* Consultation Trigger Button */}
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <Button
                    size="small"
                    onClick={() => scrollToSection("contact")}
                    sx={{
                      bgcolor: "#1B4332",
                      color: "#ffffff",
                      px: 2.2,
                      py: 0.8,
                      borderRadius: "20px",
                      textTransform: "none",
                      fontWeight: 700,
                      fontSize: "12px",
                      "&:hover": { bgcolor: "#143527" },
                    }}
                  >
                    Konsultatsiya
                  </Button>
                </motion.div>
              </Box>

              <LanguageSelector />

              {!authMember ? (
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <Button
                    variant="outlined"
                    onClick={() => setLoginOpen(true)}
                    sx={{
                      borderColor: "#2D6A4F",
                      color: "#2D6A4F",
                      borderRadius: "20px",
                      px: 2.5,
                      py: 0.6,
                      textTransform: "none",
                      fontWeight: 700,
                      fontSize: "13px",
                      "&:hover": { bgcolor: "rgba(45, 106, 79, 0.08)", borderColor: "#1B4332" },
                    }}
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
                    filter: "drop-shadow(0px 4px 16px rgba(0,0,0,0.15))",
                    mt: 1.5,
                    borderRadius: "14px",
                    bgcolor: "#ffffff",
                    border: "1px solid #c2dfce",
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem onClick={handleLogoutRequest} sx={{ color: "#dc2626", fontWeight: 700 }}>
                  <ListItemIcon>
                    <Logout fontSize="small" sx={{ color: "#dc2626" }} />
                  </ListItemIcon>
                  {t.logout}
                </MenuItem>
              </Menu>
            </Stack>
          </Stack>
        </Container>
      </motion.div>

      {/* ======================================================== */}
      {/* 3. HERO SECTION (Asymmetrical Organic Curve Design)     */}
      {/* ======================================================== */}
      <Box
        component="section"
        id="home"
        sx={{
          position: "relative",
          pt: { xs: 4, sm: 6, md: 8 },
          pb: { xs: 8, md: 12 },
          bgcolor: "#FCFDF9",
          overflow: "hidden",
        }}
      >
        {/* Ambient Organic Background Gradients */}
        <Box
          sx={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 550,
            height: 550,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(167, 243, 208, 0.45) 0%, rgba(252, 253, 249, 0) 70%)",
            filter: "blur(50px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -50,
            left: -80,
            width: 450,
            height: 450,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(225, 239, 231, 0.5) 0%, rgba(252, 253, 249, 0) 70%)",
            filter: "blur(40px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "1.1fr 0.9fr" },
              gap: { xs: 6, lg: 8 },
              alignItems: "center",
            }}
          >
            {/* LEFT COLUMN: HEADLINE, SEARCH & CTAS */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Stack spacing={3.5}>
                {/* Pill Badge with pulse */}
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1.2,
                    px: 2,
                    py: 0.8,
                    borderRadius: "30px",
                    bgcolor: "rgba(209, 250, 229, 0.9)",
                    border: "1px solid #6ee7b7",
                    color: "#065f46",
                    fontSize: "12px",
                    fontWeight: 800,
                    width: "fit-content",
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: "#10b981",
                      display: "inline-block",
                      boxShadow: "0 0 8px #10b981",
                    }}
                  />
                  Gollandiya & Yapon Gibrid Urug'lari va Agro-Dori Ta'minoti
                </Box>

                {/* Main Headline */}
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: "34px", sm: "46px", lg: "54px" },
                    fontWeight: 900,
                    color: "#0E271D",
                    lineHeight: 1.15,
                    letterSpacing: "-1px",
                  }}
                >
                  Yuqori Hosildor Issiqxonalar va <br />
                  <span
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontStyle: "italic",
                      fontWeight: 500,
                      color: "#2D6A4F",
                    }}
                  >
                    Zamonaviy AgroTexnologiyalar
                  </span>{" "}
                  Ekosistemasi.
                </Typography>

                {/* Description */}
                <Typography
                  variant="body1"
                  sx={{
                    color: "#3E5A4B",
                    fontSize: { xs: "15px", sm: "17px" },
                    lineHeight: 1.65,
                    maxWidth: 580,
                  }}
                >
                  Issiqxonalar uchun 3 qavatli mustahkam plyonkalar, kasalliklarga chidamli F1 urug'lar,
                  tomchilatib sug'orish tizimlari va ekin patologiyalarini soniyalarda aniqlovchi{" "}
                  <strong style={{ color: "#1B4332" }}>AgroOlam Vision AI 4.1</strong> yordamchisi.
                </Typography>

                {/* Functional Agro Search Component */}
                <Box
                  component="form"
                  onSubmit={handleSearchSubmit}
                  sx={{
                    p: 0.8,
                    bgcolor: "#ffffff",
                    borderRadius: "18px",
                    border: "1px solid #c2dfce",
                    boxShadow: "0 8px 24px rgba(14, 39, 29, 0.08)",
                    maxWidth: 540,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <Box sx={{ pl: 1.5, color: "#2D6A4F", display: "flex", alignItems: "center" }}>
                    <SearchIcon sx={{ fontSize: 24 }} />
                  </Box>
                  <InputBase
                    placeholder="Masalan: F1 Pomidor urug'i, Ridomil Gold, 150mkr plyonka..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{
                      flex: 1,
                      fontSize: "14px",
                      color: "#0f172a",
                      "& input::placeholder": { color: "#94a3b8", opacity: 1 },
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      bgcolor: "#2D6A4F",
                      color: "#ffffff",
                      px: 3,
                      py: 1.2,
                      borderRadius: "14px",
                      textTransform: "none",
                      fontWeight: 800,
                      fontSize: "13px",
                      "&:hover": { bgcolor: "#1B4332" },
                      flexShrink: 0,
                    }}
                  >
                    Qidirish
                  </Button>
                </Box>

                {/* Quick Action Buttons */}
                <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ gap: 1.5, pt: 0.5 }}>
                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                    <Button
                      variant="contained"
                      onClick={() => setIsDoctorOpen(true)}
                      startIcon={<PhotoCameraIcon sx={{ color: "#bbf7d0" }} />}
                      sx={{
                        bgcolor: "#1B4332",
                        color: "#ffffff",
                        px: 3.5,
                        py: 1.5,
                        borderRadius: "30px",
                        fontWeight: 800,
                        fontSize: "14px",
                        textTransform: "none",
                        boxShadow: "0 6px 20px rgba(27, 67, 50, 0.35)",
                        "&:hover": { bgcolor: "#143527" },
                      }}
                    >
                      AI Ekinni Skanerlash
                    </Button>
                  </motion.div>

                  <NavLink to="/products" style={{ textDecoration: "none" }}>
                    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                      <Button
                        variant="outlined"
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                          borderColor: "rgba(45, 106, 79, 0.35)",
                          color: "#1B4332",
                          bgcolor: "#ffffff",
                          px: 3.5,
                          py: 1.5,
                          borderRadius: "30px",
                          fontWeight: 700,
                          fontSize: "14px",
                          textTransform: "none",
                          "&:hover": {
                            bgcolor: "#f1f5f9",
                            borderColor: "#1B4332",
                          },
                        }}
                      >
                        Do'kon Katalogi
                      </Button>
                    </motion.div>
                  </NavLink>
                </Stack>

                {/* Trust Proof Badges */}
                <Stack direction="row" spacing={3} sx={{ pt: 1, flexWrap: "wrap", gap: 2 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <VerifiedUserIcon sx={{ color: "#059669", fontSize: 20 }} />
                    <Typography variant="caption" sx={{ fontWeight: 800, color: "#1e293b", fontSize: "12px" }}>
                      100% Sertifikatlangan O'zbekiston Registri
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <LocalShippingIcon sx={{ color: "#059669", fontSize: 20 }} />
                    <Typography variant="caption" sx={{ fontWeight: 800, color: "#1e293b", fontSize: "12px" }}>
                      Respublika bo'ylab tezkor yetkazish
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            </motion.div>

            {/* RIGHT COLUMN: ASYMMETRICAL ORGANIC CURVED IMAGE & FLOATING METRICS */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            >
              <Box sx={{ position: "relative", mx: "auto", maxWidth: { xs: 440, sm: 540, lg: "100%" } }}>
                {/* Asymmetric Organic Mask Shape */}
                <Box
                  sx={{
                    position: "relative",
                    borderRadius: "48px 16px 48px 16px",
                    border: "4px solid #ffffff",
                    boxShadow: "0 25px 50px -12px rgba(14, 39, 29, 0.22)",
                    overflow: "hidden",
                    aspectRatio: { xs: "4/3", sm: "16/12" },
                    bgcolor: "#143527",
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1200&q=80"
                    alt="AgroOlam Greenhouse & Agronomist"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transform: "scale(1.02)",
                      transition: "transform 0.6s ease",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, rgba(14, 39, 29, 0.7) 0%, transparent 60%)",
                      pointerEvents: "none",
                    }}
                  />

                  {/* Inside Bottom Overlay: Greenhouse Microclimate Badge */}
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: { xs: 12, sm: 18 },
                      left: { xs: 12, sm: 18 },
                      right: { xs: 12, sm: 18 },
                      p: { xs: 1.8, sm: 2.2 },
                      borderRadius: "18px",
                      bgcolor: "rgba(255, 255, 255, 0.94)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.6)",
                      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box
                        sx={{
                          width: 42,
                          height: 42,
                          borderRadius: "12px",
                          bgcolor: "#dcfce7",
                          color: "#166534",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <ThermostatIcon sx={{ fontSize: 24 }} />
                      </Box>
                      <div>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#0f172a", fontSize: "13px" }}>
                          Issiqxona Avtomatik Mikroklimat
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#2D6A4F", fontWeight: 700, fontSize: "11px" }}>
                          T: +24.2°C • Tuproq namligi: 72%
                        </Typography>
                      </div>
                    </Stack>
                    <Chip
                      label="Optimal"
                      size="small"
                      sx={{
                        bgcolor: "#10b981",
                        color: "#ffffff",
                        fontWeight: 900,
                        fontSize: "10px",
                        letterSpacing: "0.5px",
                        textTransform: "uppercase",
                      }}
                    />
                  </Box>
                </Box>

                {/* Floating Top-Left Badge: Crop Yield Boost */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    position: "absolute",
                    top: -18,
                    left: -14,
                    zIndex: 2,
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: "rgba(255, 255, 255, 0.96)",
                      backdropFilter: "blur(10px)",
                      p: 1.8,
                      borderRadius: "18px",
                      border: "1px solid #c2dfce",
                      boxShadow: "0 12px 30px rgba(14, 39, 29, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "12px",
                        bgcolor: "#2D6A4F",
                        color: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 4px 10px rgba(45, 106, 79, 0.3)",
                      }}
                    >
                      <TrendingUpIcon sx={{ fontSize: 22 }} />
                    </Box>
                    <div>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#64748b",
                          fontWeight: 800,
                          fontSize: "10px",
                          textTransform: "uppercase",
                          display: "block",
                        }}
                      >
                        Hosildorlik O'sishi
                      </Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 900, color: "#1B4332", fontSize: "14px" }}>
                        +38% Yuqori Natija
                      </Typography>
                    </div>
                  </Box>
                </motion.div>
              </Box>
            </motion.div>
          </Box>
        </Container>
      </Box>

      {/* Embedded Doctor Modal */}
      <PlantDoctorModal
        open={isDoctorOpen}
        onClose={() => setIsDoctorOpen(false)}
        onAdd={onAdd}
      />
    </div>
  );
}
