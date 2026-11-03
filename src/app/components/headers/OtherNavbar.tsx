import { Logout } from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { serverApi } from "../../../lib/config";
import { CartItem } from "../../../lib/types/search";
import { useGlobals } from "../hooks/useGlobals";
import Basket from "./Basket";
import LanguageSelector from "./LanguageSelector";
import PlantDoctorModal from "../ai/PlantDoctorModal";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { getSavedLanguage, translations } from "../../../lib/i18n";

interface OtherNavbarProps {
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

export default function OtherNavbar(props: OtherNavbarProps) {
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
    <div className="other-navbar">
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
              <NavLink
                to="/"
                className="brand-logo-wrapper"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  marginRight: "48px",
                  textDecoration: "none",
                }}
              >
                <img
                  className="brand-logo"
                  src="/icons/agroolam-emblem-white.png"
                  alt="AgroOlam"
                  style={{ height: 48, width: "auto", objectFit: "contain" }}
                />
                <Box sx={{ display: { xs: "none", sm: "block" } }}>
                  <Typography
                    sx={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 900,
                      fontSize: "20px",
                      color: "#ffffff",
                      lineHeight: 1.1,
                      letterSpacing: "-0.5px",
                    }}
                  >
                    Agro<span style={{ color: "#4ade80" }}>Olam</span>
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 700,
                      fontSize: "9.5px",
                      color: "#a7f3d0",
                      letterSpacing: "1.2px",
                      textTransform: "uppercase",
                    }}
                  >
                    2024 • AgroTech
                  </Typography>
                </Box>
              </NavLink>
            </motion.div>

            {/* 2. Center Navigation Links */}
            <Stack
              direction="row"
              className="nav-center-links"
              spacing={{ xs: 2, md: 3.5 }}
              sx={{ mr: { lg: 4, xl: 6 } }}
            >
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

            {/* 3. Action Group */}
            <Stack
              direction="row"
              className="nav-actions-group"
              spacing={1.5}
              alignItems="center"
              sx={{ ml: { lg: 3, xl: 5 } }}
            >
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
                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: "11px",
                      color: "#1B4332",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Andijon: +19°C
                  </Typography>
                </Box>
              </NavLink>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="small"
                  className="plant-doctor-btn"
                  startIcon={<PhotoCameraIcon sx={{ fontSize: 16 }} />}
                  onClick={() => setIsDoctorOpen(true)}
                >
                  {lang === "ko"
                    ? "AI 닥터"
                    : lang === "uz"
                      ? "AI Shifokor"
                      : "Plant Doctor"}
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
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <Button
                    variant="contained"
                    className="login-button"
                    onClick={() => setLoginOpen(true)}
                  >
                    {t.login}
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                >
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
                <MenuItem
                  onClick={handleLogoutRequest}
                  sx={{ color: "#f87171", fontWeight: 600 }}
                >
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
    </div>
  );
}
