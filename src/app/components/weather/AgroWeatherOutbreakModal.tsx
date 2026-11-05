import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Chip,
  Button,
  Grid,
  Stack,
  Alert,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import AirIcon from "@mui/icons-material/Air";
import UmbrellaIcon from "@mui/icons-material/Umbrella";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import DangerousIcon from "@mui/icons-material/Dangerous";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SendIcon from "@mui/icons-material/Send";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import WeatherService, {
  AgroWeatherData,
  UZBEKISTAN_AGRO_REGIONS,
} from "../../services/WeatherService";
import { getSavedLanguage } from "../../../lib/i18n";
import { CartItem } from "../../../lib/types/search";

interface AgroWeatherOutbreakModalProps {
  open: boolean;
  onClose: () => void;
  onAdd?: (item: CartItem) => void;
  initialRegionId?: string;
}

export default function AgroWeatherOutbreakModal({
  open,
  onClose,
  onAdd,
  initialRegionId = "andijan",
}: AgroWeatherOutbreakModalProps) {
  const lang = getSavedLanguage();
  const [selectedRegion, setSelectedRegion] = useState<string>(initialRegionId);
  const [weatherData, setWeatherData] = useState<AgroWeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch weather and outbreak risk whenever modal opens or region changes
  useEffect(() => {
    if (open) {
      setIsLoading(true);
      WeatherService.getRegionalAgroWeather(selectedRegion)
        .then((data) => {
          setWeatherData(data);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [open, selectedRegion]);

  const handleShareTelegram = () => {
    if (!weatherData) return;
    const highAlerts = weatherData.outbreakAlerts.filter((a) => a.riskLevel === "high");
    const topAlert = highAlerts.length > 0 ? highAlerts[0] : weatherData.outbreakAlerts[0];

    const alertText = topAlert
      ? `⚠️ XAVF: ${topAlert.diseaseNameUz} (${topAlert.riskScore}% ehtimol)\n💊 Tavsiya: ${topAlert.recommendedMedicines.map((m) => m.name).join(", ")}`
      : "✅ Hozircha ob-havo barqaror va patologiya xavfi past.";

    const msg = `📍 AgroOlam Meteo-Vision 4.1: ${weatherData.city}
Harorat: ${weatherData.temperature > 0 ? `+${weatherData.temperature}` : weatherData.temperature}°C | Namlik: ${weatherData.humidity}% | Shamol: ${weatherData.windSpeed} m/s

${alertText}

📋 Agronom maslahati: ${weatherData.agroAdvice}
Batafsil: https://agroolam.tech`;

    const url = `https://t.me/share/url?url=${encodeURIComponent(
      "https://agroolam.tech"
    )}&text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  const regionsList = Object.values(UZBEKISTAN_AGRO_REGIONS);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "24px",
          background: "#ffffff",
          boxShadow: "0 25px 65px rgba(10, 40, 20, 0.28)",
          overflow: "hidden",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #064e3b 0%, #047857 55%, #059669 100%)",
          color: "#ffffff",
          p: { xs: 2.5, md: 3 },
          position: "relative",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 14,
            right: 14,
            color: "rgba(255, 255, 255, 0.8)",
            "&:hover": { color: "#ffffff", backgroundColor: "rgba(255, 255, 255, 0.15)" },
          }}
        >
          <CloseIcon />
        </IconButton>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
          <Chip
            icon={<LocationOnIcon sx={{ fontSize: "14px !important", color: "#a7f3d0 !important" }} />}
            label="Meteo-Vision AI 4.1"
            size="small"
            sx={{
              background: "rgba(167, 243, 208, 0.2)",
              color: "#a7f3d0",
              fontWeight: 800,
              fontSize: "11px",
              border: "1px solid rgba(167, 243, 208, 0.3)",
            }}
          />
          <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.8)", fontWeight: 700 }}>
            {lang === "ko" ? "실시간 기상 및 병해충 발병 예측" : lang === "uz" ? "Jonli Agro-Meteo & Kasalliklar Radari" : "Live Weather & Outbreak Predictor"}
          </Typography>
        </Box>

        <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: "-0.02em" }}>
          {lang === "ko"
            ? "기상 연계 농작물 병해충 사전 경보 시스템"
            : lang === "uz"
            ? "Ob-havoga Bog'liq Ekin Kasalliklari Xavfi Radari"
            : "Weather-Driven Crop Pathology Outbreak Radar"}
        </Typography>

        <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.85rem", mt: 0.5, maxWidth: 600 }}>
          {lang === "ko"
            ? "온도, 습도, 강우 확률 데이터를 실시간 분석하여 역병, 흰가루병, 해충 발생 위험을 5~7일 전 선제 예측합니다."
            : lang === "uz"
            ? "Harorat, nisbiy namlik va yog'in ma'lumotlarini tahlil qilib, fitoftoroz, un-shudring va zararkunandalar xavfini 5-7 kun oldin ogohlantiramiz."
            : "Predicting blight, powdery mildew, and pest proliferation risks 5-7 days ahead using microclimate analytics."}
        </Typography>

        {/* Region Selector Pills */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2.2 }}>
          {regionsList.map((r) => {
            const isSelected = selectedRegion === r.id;
            return (
              <Chip
                key={r.id}
                label={lang === "uz" ? r.nameUz : lang === "ko" ? r.nameKo : r.nameEn}
                onClick={() => setSelectedRegion(r.id)}
                sx={{
                  fontWeight: 800,
                  fontSize: "12px",
                  cursor: "pointer",
                  backgroundColor: isSelected ? "#ffffff" : "rgba(255, 255, 255, 0.15)",
                  color: isSelected ? "#064e3b" : "#ffffff",
                  border: isSelected ? "2px solid #ffffff" : "1px solid rgba(255, 255, 255, 0.25)",
                  "&:hover": {
                    backgroundColor: isSelected ? "#ffffff" : "rgba(255, 255, 255, 0.25)",
                  },
                }}
              />
            );
          })}
        </Box>
      </Box>

      {/* Main Content */}
      <DialogContent sx={{ p: { xs: 2, md: 3 }, backgroundColor: "#f9fbf9" }}>
        {isLoading || !weatherData ? (
          <Box sx={{ py: 8, textAlign: "center" }}>
            <CircularProgress sx={{ color: "#059669", mb: 2 }} />
            <Typography variant="body2" sx={{ color: "#4b5563", fontWeight: 700 }}>
              {lang === "ko" ? "기상청 위성 데이터 및 발병 모델 분석 중..." : lang === "uz" ? "Meteo ma'lumotlar va patologiya tahlil qilinmoqda..." : "Analyzing meteorological data & pathology risk..."}
            </Typography>
          </Box>
        ) : (
          <Box>
            {/* Live Weather Status Strip */}
            <Box
              sx={{
                p: 2,
                borderRadius: "18px",
                background: "#ffffff",
                border: "1px solid #d1fae5",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.03)",
                mb: 3,
              }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={4}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Typography sx={{ fontSize: 40, lineHeight: 1 }}>{weatherData.icon}</Typography>
                    <div>
                      <Typography variant="h5" sx={{ fontWeight: 900, color: "#064e3b" }}>
                        {weatherData.temperature > 0 ? `+${weatherData.temperature}` : weatherData.temperature}°C
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 700 }}>
                        {lang === "ko" ? (weatherData.conditionKo || weatherData.condition) : lang === "en" ? (weatherData.conditionEn || weatherData.condition) : weatherData.conditionUz || weatherData.condition} • {weatherData.lastUpdated}
                      </Typography>
                    </div>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={8}>
                  <Stack direction="row" spacing={1.5} justifyContent={{ xs: "flex-start", sm: "flex-end" }} flexWrap="wrap">
                    <MeteoMetric
                      icon={<WaterDropIcon sx={{ color: "#0284c7", fontSize: 18 }} />}
                      label={lang === "uz" ? "Namlik" : lang === "ko" ? "습도" : "Humidity"}
                      value={`${weatherData.humidity}%`}
                      highlight={weatherData.humidity >= 78}
                    />
                    <MeteoMetric
                      icon={<AirIcon sx={{ color: "#6b7280", fontSize: 18 }} />}
                      label={lang === "uz" ? "Shamol" : lang === "ko" ? "풍속" : "Wind"}
                      value={`${weatherData.windSpeed} m/s`}
                      highlight={weatherData.windSpeed >= 9}
                    />
                    <MeteoMetric
                      icon={<UmbrellaIcon sx={{ color: "#2563eb", fontSize: 18 }} />}
                      label={lang === "uz" ? "Yog'in" : lang === "ko" ? "강우확률" : "Rain Prob"}
                      value={`${weatherData.rainProb}%`}
                      highlight={weatherData.rainProb >= 50}
                    />
                  </Stack>
                </Grid>
              </Grid>

              {/* Agronomic Live Advice Box */}
              <Box
                sx={{
                  mt: 1.8,
                  p: 1.5,
                  borderRadius: "12px",
                  bgcolor: weatherData.statusLevel === "warning" ? "#fffbeb" : "#f0fdf4",
                  border: `1px solid ${weatherData.statusLevel === "warning" ? "#fde68a" : "#bbf7d0"}`,
                }}
              >
                <Typography variant="body2" sx={{ fontSize: "0.85rem", color: "#1f2937", lineHeight: 1.45 }}>
                  <strong style={{ color: weatherData.statusLevel === "warning" ? "#b45309" : "#15803d" }}>
                    🌱 {lang === "ko" ? "스마트 농업 가이드:" : lang === "uz" ? "Agronom Tavsiyasi:" : "Agronomic Advisory:"}
                  </strong>{" "}
                  {lang === "ko" ? (weatherData.agroAdviceKo || weatherData.agroAdvice) : lang === "en" ? (weatherData.agroAdviceEn || weatherData.agroAdvice) : weatherData.agroAdviceUz || weatherData.agroAdvice}
                </Typography>
              </Box>
            </Box>

            {/* Outbreak Radar Alerts */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 900,
                  textTransform: "uppercase",
                  color: "#064e3b",
                  letterSpacing: "0.05em",
                  mb: 1.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                ⚡ {lang === "ko" ? "발병 예측 레이더 경보" : lang === "uz" ? "Hozirgi Patologiya Xavfi Radari" : "Active Pathology Risk Radar"}
              </Typography>

              {weatherData.outbreakAlerts.length === 0 ? (
                <Alert severity="success" icon={<CheckCircleOutlineIcon />} sx={{ borderRadius: "14px" }}>
                  {lang === "uz"
                    ? "Ob-havo sharoiti barqaror. Xavfli zamburug' yoki zararkunanda tarqalish xavfi past darajada."
                    : lang === "ko"
                    ? "기상 조건이 양호합니다. 치명적 병해충 발병 위험이 낮습니다."
                    : "Optimal microclimate. No acute disease proliferation triggers detected."}
                </Alert>
              ) : (
                <Stack spacing={2}>
                  {weatherData.outbreakAlerts.map((alert, idx) => {
                    const isHigh = alert.riskLevel === "high";

                    return (
                      <Box
                        key={idx}
                        sx={{
                          p: 2.2,
                          borderRadius: "18px",
                          background: isHigh ? "#fff5f5" : "#fffbeb",
                          border: `1.5px solid ${isHigh ? "#fca5a5" : "#fde68a"}`,
                          boxShadow: "0 4px 14px rgba(0,0,0,0.03)",
                        }}
                      >
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 1, mb: 1 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            {isHigh ? (
                              <DangerousIcon sx={{ color: "#dc2626", fontSize: 24 }} />
                            ) : (
                              <WarningAmberIcon sx={{ color: "#d97706", fontSize: 24 }} />
                            )}
                            <div>
                              <Typography variant="subtitle1" sx={{ fontWeight: 900, color: isHigh ? "#991b1b" : "#92400e" }}>
                                {lang === "uz" ? alert.diseaseNameUz : lang === "ko" ? alert.diseaseNameKo : alert.diseaseNameEn}
                              </Typography>
                              <Typography variant="caption" sx={{ color: "#6b7280", fontStyle: "italic" }}>
                                {alert.pathogen}
                              </Typography>
                            </div>
                          </Box>

                          <Box sx={{ textAlign: "right" }}>
                            <Chip
                              label={`${lang === "uz" ? "Xavf" : lang === "ko" ? "위험도" : "Risk"}: ${alert.riskScore}%`}
                              size="small"
                              sx={{
                                fontWeight: 900,
                                bgcolor: isHigh ? "#dc2626" : "#d97706",
                                color: "#ffffff",
                                height: 24,
                              }}
                            />
                          </Box>
                        </Box>

                        <Typography variant="body2" sx={{ color: "#374151", fontSize: "0.85rem", mb: 1, lineHeight: 1.5 }}>
                          {lang === "uz" ? alert.urgencyAdviceUz : lang === "ko" ? alert.urgencyAdviceKo : alert.urgencyAdviceEn}
                        </Typography>

                        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 1.5 }}>
                          <Typography variant="caption" sx={{ color: "#4b5563" }}>
                            🎯 <strong>{lang === "uz" ? "Xavf ostida" : lang === "ko" ? "취약 작물" : "Affected"}:</strong>{" "}
                            {lang === "uz" ? alert.affectedCropsUz : lang === "ko" ? alert.affectedCropsKo : alert.affectedCropsEn}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "#4b5563" }}>
                            🌡️ <strong>{lang === "uz" ? "Qo'zg'atuvchi" : lang === "ko" ? "유발 요인" : "Trigger"}:</strong>{" "}
                            {lang === "uz" ? alert.conditionTriggerUz : lang === "ko" ? alert.conditionTriggerKo : alert.conditionTriggerEn}
                          </Typography>
                        </Box>

                        {/* Recommended Store Medicines for Instant Defense */}
                        {alert.recommendedMedicines.length > 0 && (
                          <Box sx={{ pt: 1.5, borderTop: `1px dashed ${isHigh ? "#fecaca" : "#fed7aa"}` }}>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: "#1f2937", display: "block", mb: 1 }}>
                              🛒 {lang === "ko" ? "선제 방제 추천 약제:" : lang === "uz" ? "Tavsiya etilgan himoya vositalari:" : "Recommended Preventive Agrochemicals:"}
                            </Typography>
                            <Grid container spacing={1.5}>
                              {alert.recommendedMedicines.map((med, mIdx) => (
                                <Grid item xs={12} sm={6} key={mIdx}>
                                  <Box
                                    sx={{
                                      p: 1.2,
                                      borderRadius: "12px",
                                      bgcolor: "#ffffff",
                                      border: "1px solid #e5e7eb",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <div>
                                      <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: "12.5px", color: "#111827" }}>
                                        {med.name}
                                      </Typography>
                                      <Typography variant="caption" sx={{ color: "#6b7280" }}>
                                        {med.brand} • {med.dosage}
                                      </Typography>
                                      <Typography variant="caption" sx={{ display: "block", color: "#059669", fontWeight: 800 }}>
                                        {med.priceUzs.toLocaleString()} UZS
                                      </Typography>
                                    </div>

                                    {onAdd && (
                                      <Button
                                        size="small"
                                        variant="outlined"
                                        onClick={() =>
                                          onAdd({
                                            _id: `weather_med_${mIdx}`,
                                            quantity: 1,
                                            name: med.name,
                                            price: med.priceUzs,
                                            image: med.image,
                                          })
                                        }
                                        startIcon={<ShoppingCartIcon sx={{ fontSize: 14 }} />}
                                        sx={{
                                          textTransform: "none",
                                          fontSize: "11px",
                                          fontWeight: 800,
                                          borderRadius: "8px",
                                          borderColor: "#059669",
                                          color: "#059669",
                                        }}
                                      >
                                        {lang === "uz" ? "Savatga" : lang === "ko" ? "담기" : "Add"}
                                      </Button>
                                    )}
                                  </Box>
                                </Grid>
                              ))}
                            </Grid>
                          </Box>
                        )}
                      </Box>
                    );
                  })}
                </Stack>
              )}
            </Box>

            {/* 7-Day Outbreak Forecast Grid */}
            <Box
              sx={{
                p: 2.2,
                borderRadius: "18px",
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.02)",
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 900,
                  color: "#064e3b",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  mb: 1.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <CalendarMonthIcon sx={{ fontSize: 18, color: "#059669" }} />
                {lang === "ko" ? "7일간 농업 기상 및 병해충 위험 예보" : lang === "uz" ? "7 Kunlik Agro-Prognoz & Patologiya Xavfi" : "7-Day Agro-Pathology Forecast"}
              </Typography>

              <Grid container spacing={1}>
                {weatherData.sevenDayForecast.map((day, dIdx) => {
                  const isHighRisk = day.riskLevel === "high";
                  const isMedRisk = day.riskLevel === "medium";

                  return (
                    <Grid item xs={6} sm={4} md={1.71} key={dIdx}>
                      <Box
                        sx={{
                          p: 1.2,
                          borderRadius: "12px",
                          textAlign: "center",
                          bgcolor: isHighRisk ? "#fef2f2" : isMedRisk ? "#fffbeb" : "#f0fdf4",
                          border: `1px solid ${isHighRisk ? "#fecaca" : isMedRisk ? "#fde68a" : "#bbf7d0"}`,
                        }}
                      >
                        <Typography variant="caption" sx={{ fontWeight: 800, color: "#374151", display: "block" }}>
                          {lang === "uz" ? day.dayNameUz : lang === "ko" ? day.dayNameKo : day.dayNameEn}
                        </Typography>
                        <Typography sx={{ fontSize: 22, my: 0.5 }}>{day.icon}</Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 900, color: "#111827", fontSize: "12px" }}>
                          +{day.maxTemp}° / +{day.minTemp}°
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#6b7280", display: "block", fontSize: "10.5px" }}>
                          💧 {day.humidity}%
                        </Typography>

                        <Chip
                          label={lang === "uz" ? day.primaryRiskUz : lang === "ko" ? day.primaryRiskKo : day.primaryRiskEn}
                          size="small"
                          sx={{
                            mt: 0.8,
                            fontSize: "9px",
                            height: 18,
                            fontWeight: 800,
                            bgcolor: isHighRisk ? "#ef4444" : isMedRisk ? "#f59e0b" : "#10b981",
                            color: "#ffffff",
                          }}
                        />
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          </Box>
        )}

        {/* Footer Actions */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1.5,
            pt: 2.5,
            mt: 3,
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              textTransform: "none",
              borderRadius: "12px",
              borderColor: "#d1d5db",
              color: "#4b5563",
              fontWeight: 700,
            }}
          >
            {lang === "uz" ? "Yopish" : lang === "ko" ? "닫기" : "Close"}
          </Button>

          <Button
            variant="contained"
            onClick={handleShareTelegram}
            startIcon={<SendIcon />}
            sx={{
              textTransform: "none",
              borderRadius: "12px",
              backgroundColor: "#0088cc",
              fontWeight: 800,
              px: 2.5,
              "&:hover": { backgroundColor: "#0077b5" },
            }}
          >
            {lang === "uz"
              ? "Telegram orqali Dehqonlarga Ogohlantirish Jo'natish"
              : lang === "ko"
              ? "텔레그램 농가 긴급 경보 전송"
              : "Broadcast Alert via Telegram"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

function MeteoMetric({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.8,
        px: 1.2,
        py: 0.6,
        borderRadius: "10px",
        bgcolor: highlight ? "#fef2f2" : "#f9fafb",
        border: `1px solid ${highlight ? "#fca5a5" : "#e5e7eb"}`,
      }}
    >
      {icon}
      <div>
        <Typography variant="caption" sx={{ color: "#6b7280", fontSize: "10px", display: "block", lineHeight: 1 }}>
          {label}
        </Typography>
        <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: "12px", color: highlight ? "#dc2626" : "#111827" }}>
          {value}
        </Typography>
      </div>
    </Box>
  );
}
