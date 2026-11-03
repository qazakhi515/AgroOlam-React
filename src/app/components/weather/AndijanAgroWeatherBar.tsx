import React, { useEffect, useState } from "react";
import { Box, Stack, Typography, Chip, Tooltip } from "@mui/material";
import WeatherService, { AgroWeatherData } from "../../services/WeatherService";
import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import AirIcon from "@mui/icons-material/Air";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export default function AndijanAgroWeatherBar() {
  const [weather, setWeather] = useState<AgroWeatherData | null>(null);

  useEffect(() => {
    WeatherService.getAndijanAgroWeather().then((data) => setWeather(data));
  }, []);

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

  return (
    <Box
      sx={{
        bgcolor: bannerBg,
        border: `1.5px solid ${borderColor}`,
        borderRadius: "18px",
        p: { xs: 2, sm: 2.5 },
        mb: 4,
        boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
      }}
    >
      <Stack
        direction={{ xs: "column", lg: "row" }}
        spacing={2.5}
        alignItems={{ xs: "flex-start", lg: "center" }}
        justifyContent="space-between"
      >
        {/* Left: Location & Real-Time Meteo Stats */}
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" sx={{ gap: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography sx={{ fontSize: 28, lineHeight: 1 }}>{weather.icon}</Typography>
            <div>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 900,
                  color: "#0E271D",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.8,
                  fontSize: "14px",
                }}
              >
                📍 {weather.city} Agro-Meteo
                <Chip
                  label="Jonli Ob-Havo"
                  size="small"
                  sx={{
                    bgcolor: "#10b981",
                    color: "#ffffff",
                    fontWeight: 800,
                    fontSize: "10px",
                    height: "20px",
                  }}
                />
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748b", fontSize: "11px" }}>
                {weather.region} • Soat: {weather.lastUpdated}
              </Typography>
            </div>
          </Box>

          {/* Quick Stats Pills */}
          <Stack direction="row" spacing={1} sx={{ pl: { md: 2 }, borderLeft: { md: "1px solid #e2e8f0" } }}>
            <Tooltip title="Havo harorati">
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

            <Tooltip title="Issiqxona namligi (Havo namligi)">
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
                  Namlik: {weather.humidity}%
                </Typography>
              </Box>
            </Tooltip>

            <Tooltip title="Shamol tezligi (Plyonka xavfsizligi)">
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

        {/* Right: Live Agronomic Advice */}
        <Box
          sx={{
            flex: 1,
            bgcolor: "#ffffff",
            p: 1.5,
            borderRadius: "12px",
            border: `1px solid ${borderColor}`,
            display: "flex",
            alignItems: "center",
            gap: 1.2,
            width: { xs: "100%", lg: "auto" },
          }}
        >
          <InfoOutlinedIcon sx={{ color: accentColor, fontSize: 20, flexShrink: 0 }} />
          <Typography
            variant="body2"
            sx={{
              color: "#1e293b",
              fontWeight: 600,
              fontSize: "12.5px",
              lineHeight: 1.45,
            }}
          >
            <span style={{ color: accentColor, fontWeight: 800, marginRight: "4px" }}>
              Agronom Tavsiyasi:
            </span>
            {weather.agroAdvice}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}

