import React from "react";
import { Box, Container, Grid, Typography, Stack } from "@mui/material";
import GrassIcon from "@mui/icons-material/Grass";
import LayersIcon from "@mui/icons-material/Layers";
import SensorsIcon from "@mui/icons-material/Sensors";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { motion } from "framer-motion";
import { useHistory } from "react-router-dom";
import { getSavedLanguage } from "../../../lib/i18n";

export default function QuickServicesStrip() {
  const history = useHistory();
  const lang = getSavedLanguage();

  const services = [
    {
      icon: <GrassIcon sx={{ fontSize: 24, color: "#4ade80" }} />,
      titleUz: "Urug' & Preparatlar",
      titleKo: "종자 & 바이오 방제제",
      titleEn: "Seeds & Bio-Care",
      descUz: "Gibrid urug'lar va himoya",
      descKo: "F1 하이브리드 종자 & 비료",
      descEn: "F1 Hybrids & Fertilizers",
      action: () => history.push("/products"),
    },
    {
      icon: <LayersIcon sx={{ fontSize: 24, color: "#4ade80" }} />,
      titleUz: "Issiqxona Salafani",
      titleKo: "온실 특수 다층필름",
      titleEn: "Greenhouse Film",
      descUz: "3 qavatli UV 5 yil kafolat",
      descKo: "산란광 보온 무적필름",
      descEn: "3-Layer UV 5-Year Warranty",
      action: () => history.push("/products"),
    },
    {
      icon: <SensorsIcon sx={{ fontSize: 24, color: "#4ade80" }} />,
      titleUz: "Aqlli Sensor & IoT",
      titleKo: "스마트 온실 IoT 센서",
      titleEn: "Smart Sensor & IoT",
      descUz: "Avtomatik sug'orish tizimi",
      descKo: "원격 환경 및 관수 제어",
      descEn: "Automated Climate Control",
      action: () => history.push("/help"),
    },
    {
      icon: <SupportAgentIcon sx={{ fontSize: 24, color: "#4ade80" }} />,
      titleUz: "Agronom Yordami",
      titleKo: "전문 농업 컨설팅",
      titleEn: "Agronomist Advisory",
      descUz: "Joyiga borib laborator tahlil",
      descKo: "토양 및 병해충 방문 진단",
      descEn: "On-site Soil & Tissue Audit",
      action: () => history.push("/help"),
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        overflow: "hidden",
        bgcolor: "#0E271D",
        color: "#fff",
        py: 3.5,
        borderTop: "1px solid rgba(74, 222, 128, 0.2)",
        borderBottom: "1px solid rgba(74, 222, 128, 0.2)",
        boxShadow: "inset 0 2px 8px rgba(0,0,0,0.4)",
      }}
    >
      <Container maxWidth="lg" sx={{ overflow: "hidden" }}>
        <Grid container spacing={2}>
          {services.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                onClick={item.action}
                style={{ cursor: "pointer", height: "100%" }}
              >
                <Box
                  sx={{
                    p: 2,
                    borderRadius: "16px",
                    bgcolor: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    backdropFilter: "blur(6px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    height: "100%",
                    transition: "all 0.25s ease",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.1)",
                      borderColor: "rgba(74, 222, 128, 0.4)",
                      boxShadow: "0 6px 18px rgba(0,0,0,0.3)",
                    },
                  }}
                >
                  <Stack direction="row" spacing={1.8} alignItems="center">
                    <Box
                      sx={{
                        width: 46,
                        height: 46,
                        borderRadius: "12px",
                        bgcolor: "#1B4332",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid rgba(74, 222, 128, 0.3)",
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </Box>
                    <div>
                      <Typography variant="subtitle2" fontWeight={800} color="#f8fafc" sx={{ fontSize: "14px" }}>
                        {lang === "uz" ? item.titleUz : lang === "ko" ? item.titleKo : item.titleEn}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.65)", fontSize: "11px" }}>
                        {lang === "uz" ? item.descUz : lang === "ko" ? item.descKo : item.descEn}
                      </Typography>
                    </div>
                  </Stack>
                  <ArrowForwardIosIcon sx={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }} />
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

