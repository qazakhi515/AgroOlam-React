import React, { useState } from "react";
import { Container, Stack, Box, Typography, Button, Grid, Chip } from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import VerifiedIcon from "@mui/icons-material/Verified";
import TelegramIcon from "@mui/icons-material/Telegram";
import SecurityIcon from "@mui/icons-material/Security";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PlantDoctorModal from "../../components/ai/PlantDoctorModal";
import { useHistory } from "react-router-dom";
import { getSavedLanguage } from "../../../lib/i18n";

export default function Advertisement() {
  const history = useHistory();
  const [isDoctorOpen, setIsDoctorOpen] = useState(false);
  const lang = getSavedLanguage();

  return (
    <Box
      sx={{
        width: "100%",
        py: { xs: 6, md: 8 },
        background: "linear-gradient(135deg, #0d381e 0%, #1a4d2e 50%, #276738 100%)",
        color: "#ffffff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Decorative Rings */}
      <Box
        sx={{
          position: "absolute",
          top: "-20%",
          right: "-10%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(74,222,128,0.12) 0%, rgba(0,0,0,0) 70%)",
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          {/* Left Column: Text & CTA */}
          <Grid item xs={12} md={7}>
            <Chip
              icon={<VerifiedIcon sx={{ color: "#4ade80 !important" }} />}
              label={
                lang === "uz"
                  ? "AgroPlant Vision AI 2.0 • Jonli Tashxis"
                  : lang === "ko"
                  ? "AgroPlant Vision AI 2.0 • 병해충 원격진단"
                  : "AgroPlant Vision AI 2.0 • Live Diagnostics"
              }
              sx={{
                bgcolor: "rgba(255,255,255,0.12)",
                color: "#e2e8f0",
                fontWeight: 600,
                fontSize: 13,
                mb: 2.5,
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            />

            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "28px", sm: "36px", md: "42px" },
                lineHeight: 1.25,
                mb: 2,
                color: "#f8fafc",
              }}
            >
              {lang === "uz"
                ? "Bargdagi Kasallikni Kamera Orqali Bir Zumda Aniqlang"
                : lang === "ko"
                ? "카메라로 잎을 비추면 AI가 병해충을 즉시 진단합니다"
                : "Diagnose Plant Diseases Instantly with AI Camera"}
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "#cbd5e1",
                fontSize: { xs: "15px", md: "17px" },
                lineHeight: 1.6,
                mb: 4,
                maxWidth: 580,
              }}
            >
              {lang === "uz"
                ? "Fermer dalada yurib bargdagi un-shudring, fitoftora yoki qora dog'ni telefon kamerasiga oladi. Sun'iy intellekt 0.8 soniyada patologiyani aniqlaydi va sertifikatlangan dorini to'g'ridan-to'g'ri yetkazib beradi."
                : lang === "ko"
                ? "스마트폰 카메라로 농작물 잎의 흰가루병, 역병, 탄저병을 촬영하세요. 인공지능이 0.8초 만에 원인균을 분석하고 정품 방제 약제를 원클릭으로 추천합니다."
                : "Snap a leaf photo in your farm. Our deep vision model detects powdery mildew, blight, and pests in 0.8 seconds and prescribes certified treatment medicines."}
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button
                variant="contained"
                size="large"
                startIcon={<PhotoCameraIcon />}
                onClick={() => setIsDoctorOpen(true)}
                sx={{
                  bgcolor: "#22c55e",
                  color: "#0f172a",
                  fontWeight: 800,
                  fontSize: 15,
                  px: 3.5,
                  py: 1.4,
                  borderRadius: "14px",
                  textTransform: "none",
                  boxShadow: "0 10px 25px rgba(34,197,94,0.4)",
                  "&:hover": { bgcolor: "#16a34a", color: "#fff" },
                }}
              >
                {lang === "uz"
                  ? "📷 Jonli Kamera Tashxisi"
                  : lang === "ko"
                  ? "📷 실시간 카메라 진단"
                  : "📷 Live Camera Diagnosis"}
              </Button>

              <Button
                variant="outlined"
                size="large"
                endIcon={<ArrowForwardIcon />}
                onClick={() => history.push("/products")}
                sx={{
                  borderColor: "rgba(255,255,255,0.4)",
                  color: "#ffffff",
                  fontWeight: 600,
                  fontSize: 15,
                  px: 3,
                  py: 1.4,
                  borderRadius: "14px",
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "#ffffff",
                    bgcolor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                {lang === "uz"
                  ? "Dorilar Katalogi"
                  : lang === "ko"
                  ? "농자재 둘러보기"
                  : "Explore Farm Supplies"}
              </Button>
            </Stack>
          </Grid>

          {/* Right Column: Visual Feature Grid */}
          <Grid item xs={12} md={5}>
            <Stack spacing={2}>
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: "18px",
                  bgcolor: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "12px",
                      bgcolor: "rgba(74,222,128,0.2)",
                      color: "#4ade80",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 24,
                    }}
                  >
                    🔬
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {lang === "uz"
                        ? "99.2% Patologik Aniqlik"
                        : "99.2% Diagnostic Precision"}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#cbd5e1" }}>
                      {lang === "uz"
                        ? "Pomidor, bodring, bulg'or va boshqa issiqxona ekinlari uchun moslashtirilgan."
                        : "Deep learning pathology optimized for greenhouse crops and orchards."}
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              <Box
                sx={{
                  p: 2.5,
                  borderRadius: "18px",
                  bgcolor: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "12px",
                      bgcolor: "rgba(59,130,246,0.2)",
                      color: "#60a5fa",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <TelegramIcon fontSize="medium" />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {lang === "uz"
                        ? "Telegram 9-Kunlik Eslatmalar"
                        : "Automated Telegram Reminders"}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#cbd5e1" }}>
                      {lang === "uz"
                        ? "Xariddan so'ng 9-kuni 2-marta profilaktik dori purkash eslatmasi yuboriladi."
                        : "Day-9 follow-up notifications sent to your Telegram automatically."}
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              <Box
                sx={{
                  p: 2.5,
                  borderRadius: "18px",
                  bgcolor: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "12px",
                      bgcolor: "rgba(234,179,8,0.2)",
                      color: "#facc15",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <SecurityIcon fontSize="medium" />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {lang === "uz"
                        ? "Kimyoviy Toksiklikdan Himoya"
                        : "Chemical Compatibility Guard"}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#cbd5e1" }}>
                      {lang === "uz"
                        ? "Bargni kuydiruvchi nojo'ya aralashmalarning (Oltingugurt + Mis) oldini oladi."
                        : "Automated safeguards against phytotoxic pesticide tank mixes."}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      {/* Plant Doctor Modal */}
      <PlantDoctorModal
        open={isDoctorOpen}
        onClose={() => setIsDoctorOpen(false)}
        onAdd={() => {
          setIsDoctorOpen(false);
          history.push("/products");
        }}
      />
    </Box>
  );
}
