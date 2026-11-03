import { Box, Container, Stack, Chip, Button } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TelegramIcon from "@mui/icons-material/Telegram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import VerifiedIcon from "@mui/icons-material/Verified";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { Settings } from "./Settings";
import { useGlobals } from "../../components/hooks/useGlobals";
import { useHistory } from "react-router-dom";
import { MemberType } from "../../../lib/enums/member.enum";
import { getMemberImageSrc } from "../../../lib/config";
import TelegramAlertCard from "../../components/telegram/TelegramAlertCard";
import { getSavedLanguage, translations } from "../../../lib/i18n";
import "../../../css/userPage.css";

export default function UserPage() {
  const history = useHistory();
  const { authMember } = useGlobals();
  const lang = getSavedLanguage();
  const t = translations[lang].member;
  const ordersT = translations[lang].orders;

  if (!authMember) {
    history.push("/");
    return null;
  }

  const memberImg = getMemberImageSrc(authMember.memberImage);

  return (
    <div className="user-page">
      <Container>
        <Stack className="my-page-frame">
          {/* LEFT: SETTINGS FORM */}
          <Stack className="my-page-left">
            <Box className="menu-name">
              <span>🌱 {t.title}</span>
            </Box>
            <Box className="menu-content">
              <Settings />
            </Box>
          </Stack>

          {/* RIGHT: FARMER CARD & ACTIONS */}
          <Stack className="my-page-right">
            <Box className="order-info-box">
              <div className="order-user-img">
                <img
                  src={memberImg}
                  alt="Farmer"
                  className="order-user-avatar"
                  onError={(e: any) => {
                    e.target.src = "/icons/default-user.svg";
                  }}
                />
                <div className="order-user-icon-box">
                  <VerifiedIcon sx={{ fontSize: 16, color: "#ffffff" }} />
                </div>
              </div>

              <span className="order-user-name">
                {authMember.memberNick || "Fermer xo'jaligi"}
              </span>

              <Chip
                label={authMember.memberType === MemberType.RESTAURANT ? ordersT.supplier : ordersT.certifiedFarmer}
                size="small"
                sx={{
                  mt: 0.8,
                  bgcolor: "#ECFDF5",
                  color: "#065F46",
                  fontWeight: 700,
                  fontSize: 11,
                  border: "1px solid #A7F3D0",
                }}
              />

              <Box sx={{ width: "100%", mt: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5, color: "#64748b", fontSize: 13 }}>
                <LocationOnIcon sx={{ fontSize: 18, color: "#059669" }} />
                <span>{authMember.memberAddress || "O'zbekiston"}</span>
              </Box>

              <div className="user-desc">
                {authMember.memberDesc || "Issiqxona va ekinlar haqida ma'lumotlar bu yerda aks etadi."}
              </div>

              {/* Quick Action Navigation */}
              <Stack spacing={1} sx={{ width: "100%", mt: 2.5 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  size="small"
                  startIcon={<DocumentScannerIcon sx={{ fontSize: 18 }} />}
                  onClick={() => history.push("/#ai-scanner")}
                  sx={{
                    borderColor: "#1B4332",
                    color: "#1B4332",
                    fontWeight: 700,
                    textTransform: "none",
                    borderRadius: "10px",
                    "&:hover": { bgcolor: "#ecfdf5", borderColor: "#1B4332" },
                  }}
                >
                  Barg Patologiyasi Skaneri (AI)
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  size="small"
                  startIcon={<ShoppingBagOutlinedIcon sx={{ fontSize: 18 }} />}
                  onClick={() => history.push("/orders")}
                  sx={{
                    borderColor: "#cbd5e1",
                    color: "#475569",
                    fontWeight: 700,
                    textTransform: "none",
                    borderRadius: "10px",
                    "&:hover": { bgcolor: "#f8fafc", borderColor: "#94a3b8" },
                  }}
                >
                  Buyurtmalar tarixi
                </Button>
              </Stack>

              <Box className="user-media-box">
                <FacebookIcon />
                <InstagramIcon />
                <TelegramIcon onClick={() => window.open("https://t.me/agroolam_uz", "_blank")} />
                <YouTubeIcon />
              </Box>
            </Box>

            {/* Telegram Agro-Alerts Card */}
            <Box sx={{ mt: 2.5 }}>
              <TelegramAlertCard />
            </Box>
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
