import { Box, Button, Container, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
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

  return (
    <div className="home-navbar">
      <Container className="navbar-container">
        <Stack className="menu">
          <Box>
            <NavLink to="/">
              <img className="brand-logo" src="/icons/agrivia-logo.svg" alt="Agrivia" />
            </NavLink>
          </Box>
          <Stack className="links">
            <Box className={"hover-line"}>
              <NavLink to="/" activeClassName={"underline"}>
                {t.home}
              </NavLink>
            </Box>
            <Box className={"hover-line"}>
              <NavLink to="/products" activeClassName={"underline"}>
                {t.products}
              </NavLink>
            </Box>
            <Box className={"hover-line"}>
              <NavLink to="/news" activeClassName={"underline"}>
                {t.news}
              </NavLink>
            </Box>
            {authMember ? (
              <Box className={"hover-line"}>
                <NavLink to="/orders" activeClassName={"underline"}>
                  {t.orders}
                </NavLink>
              </Box>
            ) : null}
            {authMember ? (
              <Box className={"hover-line"}>
                <NavLink to="/member-page" activeClassName={"underline"}>
                  {t.myPage}
                </NavLink>
              </Box>
            ) : null}
            <Box className={"hover-line"}>
              <NavLink to="/help" activeClassName={"underline"}>
                {t.help}
              </NavLink>
            </Box>
            <Button
              size="small"
              startIcon={<PhotoCameraIcon sx={{ fontSize: 16 }} />}
              onClick={() => setIsDoctorOpen(true)}
              sx={{
                bgcolor: "#2e7d32",
                color: "#fff",
                borderRadius: "20px",
                px: 1.6,
                py: 0.5,
                fontWeight: 700,
                fontSize: 12,
                textTransform: "none",
                boxShadow: "0 2px 8px rgba(46,125,50,0.3)",
                "&:hover": { bgcolor: "#1b5e20" },
              }}
            >
              {lang === "ko" ? "AI 닥터" : lang === "uz" ? "AI Shifokor" : "Plant Doctor"}
            </Button>

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
              <Box>
                <Button
                  variant="contained"
                  className="login-button"
                  onClick={() => setLoginOpen(true)}
                >
                  {t.login}
                </Button>
              </Box>
            ) : (
              <img
                className="user-avatar"
                src={
                  authMember?.memberImage
                    ? `${serverApi}/${authMember?.memberImage}`
                    : "/icons/default-user.svg"
                }
                aria-haspopup={"true"}
                onClick={handleLogoutClick}
              />
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
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
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
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={handleLogoutRequest}>
                <ListItemIcon>
                  <Logout fontSize="small" style={{ color: "blue" }} />
                </ListItemIcon>
                {t.logout}
              </MenuItem>
            </Menu>
          </Stack>
        </Stack>
        <Stack className={"header-frame"}>
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
              <NavLink to="/products" style={{ textDecoration: "none" }}>
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
              </NavLink>
            </Stack>
          </Stack>
          <Box className={"logo-frame"}>
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
        </Stack>
      </Container>
    </div>
  );
}
