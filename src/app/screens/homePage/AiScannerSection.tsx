import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Stack,
  Button,
  Chip,
  IconButton,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import OpacityIcon from "@mui/icons-material/Opacity";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { motion, AnimatePresence } from "framer-motion";
import { CartItem } from "../../../lib/types/search";
import { getSavedLanguage } from "../../../lib/i18n";
import { MOCK_DIAGNOSIS_SAMPLES } from "../../components/ai/PlantDoctorModal";

interface AiScannerSectionProps {
  onAdd: (item: CartItem) => void;
}

export default function AiScannerSection({ onAdd }: AiScannerSectionProps) {
  const lang = getSavedLanguage();
  const [activeKey, setActiveKey] = useState<"tomato" | "cucumber" | "pepper">("tomato");
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [customImage, setCustomImage] = useState<string | null>(null);

  const currentData = MOCK_DIAGNOSIS_SAMPLES[activeKey];
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleSelectSample = (key: "tomato" | "cucumber" | "pepper") => {
    setActiveKey(key);
    setCustomImage(null);
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 1100);
  };

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCustomImage(URL.createObjectURL(file));
      setIsScanning(true);
      setTimeout(() => {
        setIsScanning(false);
      }, 1200);
    }
  };

  const retriggerScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 1000);
  };

  return (
    <Box
      id="ai-scanner-section"
      sx={{
        py: { xs: 8, md: 11 },
        bgcolor: "#fcfdf9",
        position: "relative",
        borderTop: "1px solid #e1efe7",
        borderBottom: "1px solid #e1efe7",
      }}
    >
      <Container maxWidth="lg">
        {/* Section Title Header */}
        <Box sx={{ textAlign: "center", maxWidth: "700px", mx: "auto", mb: { xs: 5, md: 7 } }}>
          <Chip
            label="AgroOlam Vision AI 4.1 • Jonli Skaner"
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
            {lang === "uz"
              ? "Ekinlardagi kasalliklarni AI orqali aniqlang"
              : lang === "ko"
              ? "AI 비전 기반 농작물 병해충 원격 진단"
              : "Diagnose Crop Pathologies Instantly with AI Vision"}
          </Typography>
          <Typography variant="body1" sx={{ color: "#4D6657", fontSize: { xs: "14px", md: "16px" } }}>
            {lang === "uz"
              ? "Quyidagi barg namunalaridan birini tanlang yoki o'z ekin rasmingizni yuklang. Skanerlash tugagach, aniq tashxis, xavf indeksi va zarur dorilar ko'rsatiladi."
              : "Select a sample leaf or upload your farm photo. Our neural model detects lesions and recommends certified treatments."}
          </Typography>
        </Box>

        {/* Diagnostic Card Workbench */}
        <Box
          sx={{
            bgcolor: "#ffffff",
            borderRadius: "28px",
            border: "1px solid rgba(45,106,79,0.15)",
            boxShadow: "0 20px 50px rgba(14,39,29,0.08)",
            p: { xs: 2.5, sm: 4, md: 5 },
          }}
        >
          <Grid container spacing={{ xs: 4, md: 5 }}>
            {/* Left Column: Sample Selectors & Scanning Viewport */}
            <Grid item xs={12} md={5}>
              <Stack spacing={2.5}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="caption" sx={{ fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>
                    Namuna bargni tanlang:
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<UploadFileIcon sx={{ fontSize: 16 }} />}
                    onClick={() => fileInputRef.current?.click()}
                    sx={{ color: "#2D6A4F", fontWeight: 700, textTransform: "none", fontSize: "12px" }}
                  >
                    Rasm yuklash
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleCustomUpload}
                  />
                </Stack>

                {/* 3 Sample Pill Buttons: Pomidor, Bodring, Balgar */}
                <Grid container spacing={1.5}>
                  <Grid item xs={4}>
                    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                      <Button
                        fullWidth
                        onClick={() => handleSelectSample("tomato")}
                        variant={activeKey === "tomato" && !customImage ? "contained" : "outlined"}
                        sx={{
                          py: 1,
                          fontSize: "12px",
                          fontWeight: 700,
                          borderRadius: "12px",
                          textTransform: "none",
                          borderColor: activeKey === "tomato" ? "#dc2626" : "#cbd5e1",
                          bgcolor: activeKey === "tomato" && !customImage ? "#dc2626" : "#f8fafc",
                          color: activeKey === "tomato" && !customImage ? "#fff" : "#334155",
                          "&:hover": { bgcolor: activeKey === "tomato" ? "#b91c1c" : "#fee2e2" },
                        }}
                      >
                        🍅 Pomidor
                      </Button>
                    </motion.div>
                  </Grid>

                  <Grid item xs={4}>
                    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                      <Button
                        fullWidth
                        onClick={() => handleSelectSample("cucumber")}
                        variant={activeKey === "cucumber" && !customImage ? "contained" : "outlined"}
                        sx={{
                          py: 1,
                          fontSize: "12px",
                          fontWeight: 700,
                          borderRadius: "12px",
                          textTransform: "none",
                          borderColor: activeKey === "cucumber" ? "#059669" : "#cbd5e1",
                          bgcolor: activeKey === "cucumber" && !customImage ? "#059669" : "#f8fafc",
                          color: activeKey === "cucumber" && !customImage ? "#fff" : "#334155",
                          "&:hover": { bgcolor: activeKey === "cucumber" ? "#047857" : "#d1fae5" },
                        }}
                      >
                        🥒 Bodring
                      </Button>
                    </motion.div>
                  </Grid>

                  <Grid item xs={4}>
                    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                      <Button
                        fullWidth
                        onClick={() => handleSelectSample("pepper")}
                        variant={activeKey === "pepper" && !customImage ? "contained" : "outlined"}
                        sx={{
                          py: 1,
                          fontSize: "12px",
                          fontWeight: 700,
                          borderRadius: "12px",
                          textTransform: "none",
                          borderColor: activeKey === "pepper" ? "#d97706" : "#cbd5e1",
                          bgcolor: activeKey === "pepper" && !customImage ? "#d97706" : "#f8fafc",
                          color: activeKey === "pepper" && !customImage ? "#fff" : "#334155",
                          "&:hover": { bgcolor: activeKey === "pepper" ? "#b45309" : "#fef3c7" },
                        }}
                      >
                        🫑 Balgar
                      </Button>
                    </motion.div>
                  </Grid>
                </Grid>

                {/* Laser Scanning Viewport */}
                <Box
                  sx={{
                    position: "relative",
                    borderRadius: "20px",
                    overflow: "hidden",
                    border: "2px solid #2D6A4F",
                    bgcolor: "#000",
                    height: { xs: "260px", sm: "320px" },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "inset 0 0 20px rgba(0,0,0,0.8)",
                  }}
                >
                  <img
                    src={customImage || currentData.imageUrl}
                    alt={currentData.crop}
                    style={{
                      maxHeight: "100%",
                      maxWidth: "100%",
                      objectFit: "contain",
                      transition: "opacity 0.3s ease",
                      opacity: isScanning ? 0.75 : 1,
                    }}
                  />

                  {/* Laser Sweeping Line */}
                  <div className="laser-scanner-line" />

                  {/* Spectral HUD Elements */}
                  <Box
                    className="hud-grid-overlay"
                    sx={{
                      position: "absolute",
                      inset: 0,
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      pointerEvents: "none",
                      select: "none",
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box
                        sx={{
                          bgcolor: "rgba(0,0,0,0.7)",
                          backdropFilter: "blur(4px)",
                          color: "#4ade80",
                          fontFamily: "monospace",
                          fontSize: "10px",
                          px: 1.5,
                          py: 0.5,
                          borderRadius: "6px",
                          border: "1px solid rgba(74,222,128,0.3)",
                          display: "flex",
                          alignItems: "center",
                          gap: 0.8,
                        }}
                      >
                        <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#4ade80", display: "inline-block" }} />
                        <span>AI_VISION_SPECTRAL: ACTIVE</span>
                      </Box>
                      <Box
                        sx={{
                          bgcolor: "rgba(0,0,0,0.7)",
                          color: isScanning ? "#fbbf24" : "#4ade80",
                          fontFamily: "monospace",
                          fontSize: "10px",
                          px: 1.5,
                          py: 0.5,
                          borderRadius: "6px",
                          fontWeight: 700,
                        }}
                      >
                        {isScanning ? "SCANNING..." : "STATUS: ANALYZED"}
                      </Box>
                    </Stack>

                    {/* Bounding Box HUD */}
                    <Box
                      sx={{
                        mx: "auto",
                        border: "2px dashed #4ade80",
                        borderRadius: "14px",
                        p: 1.8,
                        bgcolor: "rgba(0,0,0,0.45)",
                        backdropFilter: "blur(3px)",
                        color: "#86efac",
                        fontFamily: "monospace",
                        fontSize: "10px",
                        textAlign: "center",
                        maxWidth: "260px",
                      }}
                    >
                      <div>{currentData.hudDetails?.nekroz || "Barg to'qimasi nekrozi aniqlandi"}</div>
                    </Box>

                    <Stack direction="row" justifyContent="space-between" sx={{ color: "rgba(255,255,255,0.75)", fontFamily: "monospace", fontSize: "10px" }}>
                      <span>SPECTRUM: 680-750nm (Chlorophyll)</span>
                      <span>CONFIDENCE: {currentData.confidence}%</span>
                    </Stack>
                  </Box>
                </Box>

                <Button
                  fullWidth
                  onClick={retriggerScan}
                  startIcon={<RefreshIcon sx={{ fontSize: 16 }} />}
                  sx={{
                    py: 1.2,
                    borderRadius: "14px",
                    border: "1px solid rgba(45,106,79,0.3)",
                    color: "#1B4332",
                    fontWeight: 700,
                    fontSize: "12px",
                    textTransform: "none",
                    "&:hover": { bgcolor: "#f2f8f4" },
                  }}
                >
                  Qaytadan Skanerlash Simulyatsiyasi
                </Button>
              </Stack>
            </Grid>

            {/* Right Column: Diagnostic Results & Recommended Store Medicines */}
            <Grid item xs={12} md={7}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeKey + (customImage || "")}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box
                    sx={{
                      bgcolor: "#fcfdf9",
                      borderRadius: "20px",
                      p: { xs: 2.5, sm: 3.5 },
                      border: "1px solid #e1efe7",
                      spaceY: 2.5,
                    }}
                  >
                    {/* Result Title & Severity Badge */}
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      justifyContent="space-between"
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      spacing={1.5}
                      sx={{ borderBottom: "1px solid #e2e8f0", pb: 2, mb: 2 }}
                    >
                      <div>
                        <Typography variant="h5" fontWeight={800} color="#0E271D" sx={{ fontSize: { xs: "18px", sm: "22px" } }}>
                          {currentData.diseaseName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#2D6A4F", fontWeight: 700 }}>
                          Toifa: {currentData.pathogen}
                        </Typography>
                      </div>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip
                          icon={<CheckCircleIcon sx={{ fontSize: "14px !important" }} />}
                          label={`Aniqlik: ${currentData.confidence}%`}
                          sx={{ bgcolor: "#d1fae5", color: "#065f46", fontWeight: 800, fontSize: "11px" }}
                        />
                      </Stack>
                    </Stack>

                    {/* Description */}
                    <Typography variant="body2" sx={{ color: "#334155", lineHeight: 1.6, mb: 2.5 }}>
                      {currentData.symptoms}
                    </Typography>

                    {/* Climate / Agronomic Advice Grid */}
                    <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
                      <Grid item xs={12} sm={4}>
                        <Box sx={{ p: 1.5, borderRadius: "12px", bgcolor: "#fff", border: "1px solid #e2e8f0" }}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <ThermostatIcon sx={{ color: "#16a34a", fontSize: 20 }} />
                            <div>
                              <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700, display: "block" }}>
                                Harorat Tavsiyasi
                              </Typography>
                              <Typography variant="subtitle2" fontWeight={800} color="#0f172a">
                                {currentData.tempAdvice || "+24°C...+26°C"}
                              </Typography>
                            </div>
                          </Stack>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <Box sx={{ p: 1.5, borderRadius: "12px", bgcolor: "#fff", border: "1px solid #e2e8f0" }}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <WaterDropIcon sx={{ color: "#2563eb", fontSize: 20 }} />
                            <div>
                              <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700, display: "block" }}>
                                Optimal Namlik
                              </Typography>
                              <Typography variant="subtitle2" fontWeight={800} color="#0f172a">
                                {currentData.humidityAdvice || "60% - 65%"}
                              </Typography>
                            </div>
                          </Stack>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <Box sx={{ p: 1.5, borderRadius: "12px", bgcolor: "#fff", border: "1px solid #e2e8f0" }}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <OpacityIcon sx={{ color: "#059669", fontSize: 20 }} />
                            <div>
                              <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700, display: "block" }}>
                                Sug'orish Rejimi
                              </Typography>
                              <Typography variant="subtitle2" fontWeight={800} color="#0f172a">
                                Tomchilatib sug'orish
                              </Typography>
                            </div>
                          </Stack>
                        </Box>
                      </Grid>
                    </Grid>

                    {/* Treatments Text */}
                    <Box sx={{ p: 2, borderRadius: "14px", bgcolor: "#fffbeb", border: "1px solid #fde68a", mb: 3 }}>
                      <Typography variant="caption" fontWeight={800} color="#92400e" sx={{ textTransform: "uppercase", display: "block", mb: 0.5 }}>
                        Tavsiya etiladigan agrotexnik choralar:
                      </Typography>
                      <Typography variant="body2" color="#78350f" sx={{ lineHeight: 1.5 }}>
                        {currentData.treatment}
                      </Typography>
                    </Box>

                    {/* Instant Order Medicines from Store */}
                    <div>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                        <Typography variant="subtitle2" fontWeight={800} color="#0E271D" sx={{ textTransform: "uppercase" }}>
                          🛒 Do'konda mavjud dori vositalari:
                        </Typography>
                      </Stack>

                      <Grid container spacing={2}>
                        {currentData.recommendedProducts.map((prod) => (
                          <Grid item xs={12} sm={6} key={prod._id}>
                            <Box
                              sx={{
                                p: 1.8,
                                borderRadius: "14px",
                                bgcolor: "#ffffff",
                                border: "1px solid #c2dfce",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 1.5,
                                boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                              }}
                            >
                              <Stack direction="row" spacing={1.5} alignItems="center">
                                <img
                                  src={prod.productImages[0]}
                                  alt={prod.productName}
                                  style={{ width: 48, height: 48, borderRadius: "8px", objectFit: "cover" }}
                                />
                                <div>
                                  <Typography variant="subtitle2" fontWeight={800} color="#0f172a" sx={{ fontSize: "13px" }}>
                                    {prod.productName}
                                  </Typography>
                                  <Typography variant="caption" fontWeight={800} color="#2D6A4F">
                                    {prod.productPrice.toLocaleString()} UZS
                                  </Typography>
                                </div>
                              </Stack>

                              <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}>
                                <IconButton
                                  onClick={() =>
                                    onAdd({
                                      _id: prod._id,
                                      quantity: 1,
                                      name: prod.productName,
                                      price: prod.productPrice,
                                      image: prod.productImages[0],
                                    })
                                  }
                                  sx={{
                                    bgcolor: "#2D6A4F",
                                    color: "#fff",
                                    "&:hover": { bgcolor: "#1B4332" },
                                    width: 36,
                                    height: 36,
                                  }}
                                >
                                  <ShoppingCartIcon sx={{ fontSize: 18 }} />
                                </IconButton>
                              </motion.div>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </div>
                  </Box>
                </motion.div>
              </AnimatePresence>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

