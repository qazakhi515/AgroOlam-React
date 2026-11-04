import React, { useState } from "react";
import { Box, Container, Typography, Stack, Grid, Chip } from "@mui/material";
import PublicIcon from "@mui/icons-material/Public";
import { motion, AnimatePresence } from "framer-motion";
import { getSavedLanguage, translations } from "../../../lib/i18n";

interface HubInfo {
  id: string;
  country: { uz: string; en: string; ko: string };
  city: { uz: string; en: string; ko: string };
  title: { uz: string; en: string; ko: string };
  detail: { uz: string; en: string; ko: string };
  metric: string;
  x: string;
  y: string;
}

export default function GlobalProjectsMap() {
  const lang = getSavedLanguage();
  const tGlobal = translations[lang].globalProjects;

  const hubs: HubInfo[] = [
    {
      id: "uz",
      country: { uz: "O'zbekiston", en: "Uzbekistan", ko: "우즈베키스탄" },
      city: { uz: "Toshkent", en: "Tashkent", ko: "타슈켄트" },
      title: { uz: "Toshkent Bosh Hab", en: "Tashkent Central Hub", ko: "타슈켄트 중앙 허브" },
      detail: {
        uz: "450 Gektar Zamonaviy Issiqxona Majmuasi va AI Diagnostika Markazi",
        en: "450-Hectare Smart Greenhouse Complex & AI Diagnostic Center",
        ko: "450헥타르 첨단 스마트 온실 단지 및 AI 원격 진단 센터",
      },
      metric: "450 ga",
      x: "64%",
      y: "34%",
    },
    {
      id: "nl",
      country: { uz: "Niderlandiya", en: "Netherlands", ko: "네덜란드" },
      city: { uz: "Westland", en: "Westland", ko: "웨스트랜드" },
      title: { uz: "Westland R&D Hab", en: "Westland R&D Hub", ko: "웨스트랜드 R&D 허브" },
      detail: {
        uz: "Gibrid urug'lar genetikasi va mikroklimat avtomatizatsiyasi laboratoriyasi",
        en: "Hybrid seed genetics and greenhouse microclimate automation laboratory",
        ko: "하이브리드 종자 유전 육종 및 온실 마이크로기후 자동화 연구소",
      },
      metric: "R&D Seeds",
      x: "51%",
      y: "24%",
    },
    {
      id: "kr",
      country: { uz: "Janubiy Koreya", en: "South Korea", ko: "대한민국" },
      city: { uz: "Jeonbuk", en: "Jeonbuk", ko: "전북" },
      title: { uz: "Jeonbuk Smart Farm", en: "Jeonbuk Smart Farm", ko: "전북 스마트팜" },
      detail: {
        uz: "Vertikal qulupnay yetishtirish va IoT sensor monitoring tarmog'i",
        en: "Vertical strawberry hydroponics and IoT sensor monitoring network",
        ko: "수직 밀폐형 딸기 수경재배 및 첨단 IoT 센서 통합 제어망",
      },
      metric: "Vertical IoT",
      x: "82%",
      y: "35%",
    },
    {
      id: "es",
      country: { uz: "Ispaniya", en: "Spain", ko: "스페인" },
      city: { uz: "Almeria", en: "Almeria", ko: "알메리아" },
      title: { uz: "Almeria Diffuz Qoplama", en: "Almeria Diffuse Coating", ko: "알메리아 산란광 코팅" },
      detail: {
        uz: "Yevropaning eng yirik quyoshli issiqxonalar zonasi diffuz plyonkalar ta'minoti",
        en: "3-layer thermal diffuse film supply for Europe's largest solar greenhouse basin",
        ko: "유럽 최대 온실 단지 전용 3중 산란광 보온 필름 공급",
      },
      metric: "Solar Film",
      x: "48%",
      y: "32%",
    },
    {
      id: "ae",
      country: { uz: "BAA", en: "UAE", ko: "아랍에미리트" },
      city: { uz: "Dubay", en: "Dubai", ko: "두바이" },
      title: { uz: "Dubay Cho'l Gidroponikasi", en: "Dubai Desert Hydroponics", ko: "두바이 사막 수경재배" },
      detail: {
        uz: "Cho'l iqlimida suv tejovchi aeroponika va mikroklimat sovutish tizimlari",
        en: "Desert-grade water-saving aeroponics and evaporative micro-cooling",
        ko: "사막 기후 맞춤 절수형 에어로포닉스 및 초미립자 냉각 제어",
      },
      metric: "Desert Aero",
      x: "62%",
      y: "41%",
    },
  ];

  const [activeHubId, setActiveHubId] = useState<string>("uz");
  const activeHub = hubs.find((h) => h.id === activeHubId) || hubs[0];

  const stats = [
    { num: "27+", label: tGlobal.statCountries, sub: tGlobal.statCountriesSub },
    { num: "2.9M+", label: tGlobal.statHectares, sub: tGlobal.statHectaresSub },
    { num: "87K+", label: tGlobal.statFarmers, sub: tGlobal.statFarmersSub },
    { num: "99.4%", label: tGlobal.statYield, sub: tGlobal.statYieldSub },
  ];

  return (
    <Box
      id="global-projects"
      sx={{
        py: { xs: 8, md: 11 },
        bgcolor: "#ffffff",
        borderBottom: "1px solid #e1efe7",
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: "center", maxWidth: "700px", mx: "auto", mb: { xs: 5, md: 7 } }}>
          <Chip
            label={tGlobal.badge}
            sx={{
              bgcolor: "#d1fae5",
              color: "#065f46",
              fontWeight: 800,
              fontSize: "12px",
              mb: 1.5,
              border: "1px solid #a7f3d0",
            }}
          />
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              fontSize: { xs: "28px", sm: "36px", md: "42px" },
              color: "#0E271D",
              lineHeight: 1.2,
              mb: 1.5,
            }}
          >
            {tGlobal.title}
          </Typography>
          <Typography variant="body1" sx={{ color: "#4D6657", fontSize: { xs: "14px", md: "16px" } }}>
            {tGlobal.desc}
          </Typography>
        </Box>

        {/* World Map Container */}
        <Box
          sx={{
            position: "relative",
            borderRadius: "28px",
            bgcolor: "#F6FAF5",
            border: "1px solid rgba(45,106,79,0.18)",
            p: { xs: 2, sm: 4, md: 6 },
            minHeight: { xs: "320px", sm: "420px" },
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Scalable World Map SVG */}
          <svg
            viewBox="0 0 1000 500"
            style={{ width: "100%", height: "auto", maxHeight: "400px", userSelect: "none" }}
          >
            {/* North America */}
            <path d="M120,80 Q210,60 260,110 Q280,180 230,220 Q160,250 110,180 Z" fill="#78B993" opacity="0.45" />
            {/* South America */}
            <path d="M220,240 Q280,270 270,390 Q220,440 180,350 Q170,270 220,240 Z" fill="#58A577" opacity="0.55" />
            {/* Europe */}
            <path d="M470,80 Q560,50 590,100 Q580,160 510,160 Q450,140 470,80 Z" fill="#3D855E" opacity="0.65" />
            {/* Africa */}
            <path d="M480,180 Q570,180 570,300 Q500,380 460,280 Q440,210 480,180 Z" fill="#4B956C" opacity="0.6" />
            {/* Asia & Central Asia */}
            <path d="M590,80 Q760,50 850,120 Q870,240 760,240 Q660,200 590,80 Z" fill="#2D6A4F" opacity="0.8" />
            {/* Australia */}
            <path d="M740,290 Q830,270 850,360 Q780,410 720,350 Z" fill="#62AB80" opacity="0.5" />
          </svg>

          {/* Interactive Hub Pins */}
          {hubs.map((hub) => {
            const isSelected = activeHub.id === hub.id;
            return (
              <Box
                key={hub.id}
                onClick={() => setActiveHubId(hub.id)}
                sx={{
                  position: "absolute",
                  left: hub.x,
                  top: hub.y,
                  transform: "translate(-50%, -50%)",
                  cursor: "pointer",
                  zIndex: 20,
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.3 }}
                  animate={isSelected ? { scale: [1, 1.25, 1] } : {}}
                  transition={{ repeat: isSelected ? Infinity : 0, duration: 1.6 }}
                >
                  <Box
                    sx={{
                      width: isSelected ? 32 : 24,
                      height: isSelected ? 32 : 24,
                      borderRadius: "50%",
                      bgcolor: isSelected ? "#10b981" : "#2D6A4F",
                      color: "#fff",
                      border: "2px solid #ffffff",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "11px",
                      fontWeight: 800,
                    }}
                  >
                    {hub.id.toUpperCase()}
                  </Box>
                </motion.div>
              </Box>
            );
          })}

          {/* Active Hub Info Bottom Overlay */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeHub.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.25 }}
              style={{
                position: "absolute",
                bottom: "16px",
                left: "16px",
                right: "16px",
                maxWidth: "500px",
                zIndex: 30,
              }}
            >
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: "18px",
                  bgcolor: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid #c2dfce",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: "12px",
                      bgcolor: "#e1efe7",
                      color: "#2D6A4F",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <PublicIcon />
                  </Box>
                  <div>
                    <Typography variant="subtitle2" fontWeight={800} color="#0E271D">
                      {activeHub.city[lang]}, {activeHub.country[lang]}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#475569", display: "block", lineHeight: 1.4 }}>
                      {activeHub.detail[lang]}
                    </Typography>
                  </div>
                </Stack>
                <Chip
                  label={lang === "uz" ? activeHub.metric : activeHub.metric.replace("ga", "ha")}
                  size="small"
                  sx={{ bgcolor: "#2D6A4F", color: "#fff", fontWeight: 800, fontSize: "11px", flexShrink: 0 }}
                />
              </Box>
            </motion.div>
          </AnimatePresence>
        </Box>

        {/* 4 Statistics Cards: 27+, 2.9M+, 87K+, 99.4% */}
        <Grid container spacing={3} sx={{ mt: { xs: 4, md: 5 } }}>
          {stats.map((s, index) => (
            <Grid item xs={6} md={3} key={index}>
              <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: "20px",
                    bgcolor: "#fcfdf9",
                    border: "1px solid #e1efe7",
                    textAlign: "center",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.02)",
                  }}
                >
                  <Typography variant="h3" fontWeight={900} color="#2D6A4F" sx={{ fontSize: { xs: "28px", sm: "36px" } }}>
                    {s.num}
                  </Typography>
                  <Typography variant="subtitle2" fontWeight={800} color="#0E271D" sx={{ mt: 0.5 }}>
                    {s.label}
                  </Typography>
                  <Typography variant="caption" color="#64748b" sx={{ display: "block", mt: 0.5, fontSize: "11px" }}>
                    {s.sub}
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

