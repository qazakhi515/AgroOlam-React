import React, { useEffect, useState } from "react";
import { Box, Stack, Typography, Chip, Tooltip, Button } from "@mui/material";
import WeatherService, { AgroWeatherData } from "../../services/WeatherService";
import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import AirIcon from "@mui/icons-material/Air";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import BoltIcon from "@mui/icons-material/Bolt";
import AgroWeatherOutbreakModal from "./AgroWeatherOutbreakModal";
import { getSavedLanguage } from "../../../lib/i18n";
import { CartItem } from "../../../lib/types/search";

interface AndijanAgroWeatherBarProps {
  onAdd?: (item: CartItem) => void;
  defaultRegion?: string;
}

export default function AndijanAgroWeatherBar({
  onAdd,
  defaultRegion = "andijan",
}: AndijanAgroWeatherBarProps) {
  const lang = getSavedLanguage();
  const [weather, setWeather] = useState<AgroWeatherData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    WeatherService.getRegionalAgroWeather(defaultRegion).then((data) => setWeather(data));
  }, [defaultRegion]);

  if (!weather) return null;

  const isWarning = weather.statusLevel === "warning";
  const isCaution = weather.statusLevel === "caution";

  const bannerBg = isWarning
    ? "#fffbeb"
    : isCaution
    ? "#fef2f2"
    : "#f0fdf4";

  const borderColor = isWarning
    ? "#fde68a"
    : isCaution
    ? "#fecaca"
    : "#bbf7d0";

  const accentColor = isWarning
    ? "#b45309"
    : isCaution
    ? "#b91c1c"
    : "#15803d";

  const topAlert = weather.outbreakAlerts && weather.outbreakAlerts.length > 0 ? weather.outbreakAlerts[0] : null;

  return (
    <>
      <Box
        sx={{
          bgcolor: bannerBg,
          border: `1.5px solid ${borderColor}`,
          borderRadius: "18px",
          p: { xs: 2, sm: 2.2 },
          mb: 3.5,
          boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
          overflow: "hidden",
          maxWidth: "100%",
        }}
      >
        <Stack
          direction={{ xs: "column", lg: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", lg: "center" }}
          justifyContent="space-between"
        >
          {/* Left: Location & Real-Time Meteo Stats */}
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" sx={{ gap: 1.5, maxWidth: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, minWidth: 0, maxWidth: "100%" }}>
              <Typography sx={{ fontSize: 28, lineHeight: 1, flexShrink: 0, mt: 0.3 }}>{weather.icon}</Typography>
              <Box sx={{ minWidth: 0, maxWidth: "100%" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 0.8,
                    mb: 0.5,
                  }}
                >
                  <Typography
                    component="span"
                    sx={{
                      fontWeight: 900,
                      color: "#0E271D",
                      fontSize: "14px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    📍 {weather.city} Agro-Meteo
                  </Typography>
                  <Chip
                    label={lang === "ko" ? "실시간 기상" : lang === "uz" ? "Jonli Ob-Havo" : "Live Weather"}
                    size="small"
                    sx={{
                      bgcolor: "#10b981",
                      color: "#ffffff",
                      fontWeight: 800,
                      fontSize: "10px",
                      height: "20px",
                    }}
                  />
                  {topAlert && (
                    <Chip
                      label={`⚡ ${lang === "uz" ? topAlert.diseaseNameUz : lang === "ko" ? topAlert.diseaseNameKo : topAlert.diseaseNameEn}: ${topAlert.riskScore}%`}
                      size="small"
                      sx={{
                        bgcolor: topAlert.riskLevel === "high" ? "#dc2626" : "#d97706",
                        color: "#ffffff",
                        fontWeight: 800,
                        fontSize: "10px",
                        height: "auto",
                        minHeight: "20px",
                        py: 0.2,
                        maxWidth: "100%",
                        "& .MuiChip-label": {
                          whiteSpace: { xs: "normal", sm: "nowrap" },
                          textOverflow: "ellipsis",
                          lineHeight: 1.25,
                          px: 1,
                        },
                      }}
                    />
                  )}
                </Box>
                <Typography variant="caption" sx={{ color: "#64748b", fontSize: "11px", display: "block" }}>
                  {weather.region} • Soat: {weather.lastUpdated}
                </Typography>
              </Box>
            </Box>

            {/* Quick Stats Pills */}
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1, pl: { md: 2 }, borderLeft: { md: "1px solid #e2e8f0" } }}>
              <Tooltip title={lang === "uz" ? "Havo harorati" : lang === "ko" ? "기온" : "Temperature"}>
                <Box
                  sx={{
                    bgcolor: "#ffffff",
                    px: 1.5,
                    py: 0.6,
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <DeviceThermostatIcon sx={{ fontSize: 16, color: "#f97316" }} />
                  <Typography sx={{ fontWeight: 800, fontSize: "13px", color: "#1e293b" }}>
                    {weather.temperature > 0 ? `+${weather.temperature}` : weather.temperature}°C
                  </Typography>
                </Box>
              </Tooltip>

              <Tooltip title={lang === "uz" ? "Nisbiy namlik" : lang === "ko" ? "상대 습도" : "Humidity"}>
                <Box
                  sx={{
                    bgcolor: "#ffffff",
                    px: 1.5,
                    py: 0.6,
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <WaterDropIcon sx={{ fontSize: 16, color: "#0284c7" }} />
                  <Typography sx={{ fontWeight: 800, fontSize: "13px", color: "#1e293b" }}>
                    {weather.humidity}%
                  </Typography>
                </Box>
              </Tooltip>

              <Tooltip title={lang === "uz" ? "Shamol tezligi" : lang === "ko" ? "풍속" : "Wind Speed"}>
                <Box
                  sx={{
                    bgcolor: "#ffffff",
                    px: 1.5,
                    py: 0.6,
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <AirIcon sx={{ fontSize: 16, color: "#64748b" }} />
                  <Typography sx={{ fontWeight: 800, fontSize: "13px", color: "#1e293b" }}>
                    {weather.windSpeed} m/s
                  </Typography>
                </Box>
              </Tooltip>
            </Stack>
          </Stack>

          {/* Right: Live Agronomic Advice & Trigger Button */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems="center" sx={{ width: { xs: "100%", lg: "auto" } }}>
            <Box
              sx={{
                flex: 1,
                bgcolor: "#ffffff",
                p: 1.2,
                borderRadius: "12px",
                border: `1px solid ${borderColor}`,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <InfoOutlinedIcon sx={{ color: accentColor, fontSize: 18, flexShrink: 0 }} />
              <Typography
                variant="body2"
                sx={{
                  color: "#1e293b",
                  fontWeight: 600,
                  fontSize: "12px",
                  lineHeight: 1.4,
                }}
              >
                <span style={{ color: accentColor, fontWeight: 800, marginRight: "4px" }}>
                  {lang === "uz" ? "Agronom Tavsiyasi:" : lang === "ko" ? "전문가 조언:" : "Advisory:"}
                </span>
                {weather.agroAdvice}
              </Typography>
            </Box>

            <Button
              variant="contained"
              size="small"
              onClick={() => setIsModalOpen(true)}
              startIcon={<BoltIcon sx={{ fontSize: 16 }} />}
              sx={{
                bgcolor: "#059669",
                color: "#ffffff",
                fontWeight: 800,
                fontSize: "11px",
                borderRadius: "10px",
                textTransform: "none",
                px: 2,
                py: 1,
                whiteSpace: "nowrap",
                "&:hover": { bgcolor: "#047857" },
                boxShadow: "0 2px 8px rgba(5, 150, 105, 0.25)",
              }}
            >
              {lang === "ko" ? "발병 레이더" : lang === "uz" ? "Kasallik Radari" : "Outbreak Radar"}
            </Button>
          </Stack>
        </Stack>
      </Box>

      {/* Outbreak Modal */}
      <AgroWeatherOutbreakModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={onAdd}
        initialRegionId={defaultRegion}
      />
    </>
  );
}
