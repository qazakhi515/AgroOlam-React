import React, { useState } from "react";
import { Box, Container, Typography, Stack, Grid, Chip } from "@mui/material";
import PublicIcon from "@mui/icons-material/Public";
import { motion, AnimatePresence } from "framer-motion";

interface HubInfo {
  id: string;
  country: string;
  city: string;
  titleUz: string;
  detailUz: string;
  metric: string;
  x: string;
  y: string;
}

export default function GlobalProjectsMap() {
  const hubs: HubInfo[] = [
    {
      id: "uz",
      country: "O'zbekiston",
      city: "Toshkent",
      titleUz: "Toshkent Bosh Hab",
      detailUz: "450 Gektar Zamonaviy Issiqxona Majmuasi va AI Diagnostika Markazi",
      metric: "450 ga",
      x: "64%",
      y: "34%",
    },
    {
      id: "nl",
      country: "Niderlandiya",
      city: "Westland",
      titleUz: "Westland R&D Hab",
      detailUz: "Gibrid urug'lar genetikasi va mikroklimat avtomatizatsiyasi laboratoriyasi",
      metric: "R&D Seeds",
      x: "51%",
      y: "24%",
    },
    {
      id: "kr",
      country: "Janubiy Koreya",
      city: "Jeonbuk",
      titleUz: "Jeonbuk Smart Farm",
      detailUz: "Vertikal qulupnay yetishtirish va IoT sensor monitoring tarmog'i",
      metric: "Vertical IoT",
      x: "82%",
      y: "35%",
    },
    {
      id: "es",
      country: "Ispaniya",
      city: "Almeria",
      titleUz: "Almeria Diffuz Qoplama",
      detailUz: "Yevropaning eng yirik quyoshli issiqxonalar zonasi diffuz plyonkalar ta'minoti",
      metric: "Solar Film",
      x: "48%",
      y: "32%",
    },
    {
      id: "ae",
      country: "BAA",
      city: "Dubay",
      titleUz: "Dubay Cho'l Gidroponikasi",
      detailUz: "Cho'l iqlimida suv tejovchi aeroponika va mikroklimat sovutish tizimlari",
      metric: "Desert Aero",
      x: "62%",
      y: "41%",
    },
  ];

  const [activeHub, setActiveHub] = useState<HubInfo>(hubs[0]);

  const stats = [
    { num: "27+", labelUz: "Davlatlar", subUz: "Eksport va agromuhandislik" },
    { num: "2.9M+", labelUz: "Gektar Maydon", subUz: "Avtomatlashgan issiqxona maydoni" },
    { num: "87K+", labelUz: "Fermerlar", subUz: "Doimiy qoniqqan mijozlar" },
    { num: "99.4%", labelUz: "Unuvchanlik", subUz: "Hosil sifati va unuvchanlik kafolati" },
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
            label="Xalqaro Agromuhandislik Loyihalari"
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
            International Hydroponic Cultivation Projects
          </Typography>
          <Typography variant="body1" sx={{ color: "#4D6657", fontSize: { xs: "14px", md: "16px" } }}>
            AgroOlam (agroolam.tech) texnologiyalari O'zbekistondan tortib Yevropa va Osiyo agro-parklarigacha muvaffaqiyatli tatbiq etilmoqda. Xaritadagi faol hablar ustiga bosing.
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
                onClick={() => setActiveHub(hub)}
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
                      {activeHub.city}, {activeHub.country}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#475569", display: "block", lineHeight: 1.4 }}>
                      {activeHub.detailUz}
                    </Typography>
                  </div>
                </Stack>
                <Chip
                  label={activeHub.metric}
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
                    {s.labelUz}
                  </Typography>
                  <Typography variant="caption" color="#64748b" sx={{ display: "block", mt: 0.5, fontSize: "11px" }}>
                    {s.subUz}
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

