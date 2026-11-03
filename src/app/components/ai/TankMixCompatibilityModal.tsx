import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Chip,
  Button,
  Grid,
  Divider,
  Alert,
  AlertTitle,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ScienceIcon from "@mui/icons-material/Science";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import DangerousIcon from "@mui/icons-material/Dangerous";
import SendIcon from "@mui/icons-material/Send";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { motion, AnimatePresence } from "framer-motion";

import {
  TANK_MIX_CHEMICALS,
  TANK_MIX_PRESETS,
  evaluateTankMix,
} from "../../../lib/data/tankMixDatabase";
import { getSavedLanguage, translations } from "../../../lib/i18n";

interface TankMixCompatibilityModalProps {
  open: boolean;
  onClose: () => void;
  initialChemicalIds?: string[];
  onAdd?: (product: any) => void;
}

export default function TankMixCompatibilityModal({
  open,
  onClose,
  initialChemicalIds = ["ridomil_gold", "ampligo"],
  onAdd,
}: TankMixCompatibilityModalProps) {
  const lang = getSavedLanguage();
  const t = translations[lang].tankMix;

  const [selectedIds, setSelectedIds] = useState<string[]>(initialChemicalIds);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [showJarTest, setShowJarTest] = useState<boolean>(false);

  // Sync if initial chemicals change and modal opens
  React.useEffect(() => {
    if (open && initialChemicalIds.length > 0) {
      setSelectedIds(initialChemicalIds);
    }
  }, [open, initialChemicalIds]);

  // All chemical items as array
  const allChemicals = useMemo(() => Object.values(TANK_MIX_CHEMICALS), []);

  // Filtered by category tab
  const filteredChemicals = useMemo(() => {
    if (activeCategory === "all") return allChemicals;
    return allChemicals.filter((c) => c.category === activeCategory);
  }, [allChemicals, activeCategory]);

  // Toggle selection
  const handleToggleChemical = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      if (selectedIds.length >= 4) {
        return; // max 4
      }
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSelectPreset = (presetChemicals: string[]) => {
    setSelectedIds(presetChemicals);
  };

  const handleClear = () => {
    setSelectedIds([]);
  };

  // Evaluation result
  const result = useMemo(() => {
    return evaluateTankMix(selectedIds, lang);
  }, [selectedIds, lang]);

  // Telegram dispatch text
  const handleShareTelegram = () => {
    const chemNames = result.selectedChemicals.map((c) => c.name).join(" + ");
    const statusText =
      result.overallStatus === "compatible"
        ? "✅ XAVFSIZ MOS KELADI"
        : result.overallStatus === "caution"
        ? "⚠️ SHARTLI MOSLIK"
        : "🚫 QAT'IYAN MAN ETILADI";

    const msg = `🌿 AgroOlam Tank-Mix 4.1 Retsept Tahlili:
Dorilar: ${chemNames}
Xulosa: ${statusText}
Tafsilot: ${result.summary}
Tavsiya pH: ${result.recommendedWaterPH}
Sayt: https://agroolam.tech`;

    const url = `https://t.me/share/url?url=${encodeURIComponent(
      "https://agroolam.tech"
    )}&text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  const categoryChips: { key: string; label: string }[] = [
    { key: "all", label: t.categories.all },
    { key: "fungicide", label: t.categories.fungicide },
    { key: "insecticide", label: t.categories.insecticide },
    { key: "fertilizer", label: t.categories.fertilizer },
    { key: "bio", label: t.categories.bio },
    { key: "oil", label: t.categories.oil },
  ];

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
          boxShadow: "0 24px 64px rgba(10, 40, 20, 0.28)",
          overflow: "hidden",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #092c18 0%, #154d2e 60%, #1b6339 100%)",
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
            "&:hover": { color: "#ffffff", backgroundColor: "rgba(255, 255, 255, 0.12)" },
          }}
        >
          <CloseIcon />
        </IconButton>

        <StackHorizontal>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "14px",
              background: "rgba(255, 255, 255, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255, 255, 255, 0.25)",
              mr: 2,
            }}
          >
            <ScienceIcon sx={{ fontSize: 28, color: "#81c784" }} />
          </Box>
          <Box>
            <Chip
              label={t.badge}
              size="small"
              sx={{
                background: "rgba(129, 199, 132, 0.2)",
                color: "#a5d6a7",
                border: "1px solid rgba(129, 199, 132, 0.35)",
                fontWeight: 700,
                fontSize: "0.75rem",
                mb: 0.5,
              }}
            />
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: "-0.02em" }}>
              {t.title}
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.75)", fontSize: "0.85rem" }}>
              {t.subtitle}
            </Typography>
          </Box>
        </StackHorizontal>
      </Box>

      {/* Main Dialog Content */}
      <DialogContent sx={{ p: { xs: 2, md: 3 }, backgroundColor: "#f9fbf9" }}>
        {/* Preset Quick Actions */}
        <Box sx={{ mb: 2.5 }}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 800,
              textTransform: "uppercase",
              color: "#4a6b57",
              letterSpacing: "0.06em",
              display: "block",
              mb: 1,
            }}
          >
            {t.popularPresets}
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {TANK_MIX_PRESETS.map((preset) => {
              const isSelected =
                preset.chemicals.length === selectedIds.length &&
                preset.chemicals.every((c) => selectedIds.includes(c));

              const isDanger = preset.expectedStatus === "incompatible";

              return (
                <Chip
                  key={preset.id}
                  label={
                    lang === "uz"
                      ? preset.titleUz
                      : lang === "ko"
                      ? preset.titleKo
                      : preset.titleEn
                  }
                  onClick={() => handleSelectPreset(preset.chemicals)}
                  icon={
                    isDanger ? (
                      <DangerousIcon sx={{ fontSize: 16, color: isDanger ? "#d32f2f !important" : undefined }} />
                    ) : (
                      <CheckCircleOutlineIcon
                        sx={{ fontSize: 16, color: "#2e7d32 !important" }}
                      />
                    )
                  }
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.78rem",
                    cursor: "pointer",
                    backgroundColor: isSelected
                      ? isDanger
                        ? "#ffebee"
                        : "#e8f5e9"
                      : "#ffffff",
                    borderColor: isSelected
                      ? isDanger
                        ? "#e53935"
                        : "#2e7d32"
                      : "#d4ded6",
                    borderWidth: "1px",
                    borderStyle: "solid",
                    color: isDanger ? "#c62828" : "#1b5e20",
                    "&:hover": {
                      backgroundColor: isDanger ? "#ffebee" : "#e8f5e9",
                    },
                  }}
                />
              );
            })}
          </Box>
        </Box>

        {/* Category Tabs */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8, mb: 2 }}>
          {categoryChips.map((c) => (
            <Chip
              key={c.key}
              label={c.label}
              size="small"
              onClick={() => setActiveCategory(c.key)}
              sx={{
                fontWeight: 600,
                fontSize: "0.8rem",
                backgroundColor: activeCategory === c.key ? "#1b5e20" : "#ffffff",
                color: activeCategory === c.key ? "#ffffff" : "#4a5b50",
                border: "1px solid",
                borderColor: activeCategory === c.key ? "#1b5e20" : "#d8e2da",
                "&:hover": {
                  backgroundColor: activeCategory === c.key ? "#154d2e" : "#eef4ef",
                },
              }}
            />
          ))}

          {selectedIds.length > 0 && (
            <Button
              size="small"
              onClick={handleClear}
              startIcon={<RestartAltIcon />}
              sx={{
                ml: "auto",
                textTransform: "none",
                fontSize: "0.78rem",
                color: "#757575",
                fontWeight: 600,
              }}
            >
              {t.clearAll} ({selectedIds.length})
            </Button>
          )}
        </Box>

        {/* Chemical Grid (Available to Pick) */}
        <Grid container spacing={1.2} sx={{ mb: 3 }}>
          {filteredChemicals.map((chem) => {
            const isPicked = selectedIds.includes(chem.id);
            const badgeColor =
              chem.category === "fungicide"
                ? "#2e7d32"
                : chem.category === "insecticide"
                ? "#e65100"
                : chem.category === "fertilizer"
                ? "#0277bd"
                : chem.category === "bio"
                ? "#558b2f"
                : "#455a64";

            return (
              <Grid item xs={12} sm={6} md={4} key={chem.id}>
                <Box
                  onClick={() => handleToggleChemical(chem.id)}
                  sx={{
                    p: 1.5,
                    borderRadius: "14px",
                    cursor: "pointer",
                    backgroundColor: isPicked ? "#e8f5e9" : "#ffffff",
                    border: "2px solid",
                    borderColor: isPicked ? "#2e7d32" : "#e1e8e2",
                    boxShadow: isPicked
                      ? "0 4px 12px rgba(46, 125, 50, 0.15)"
                      : "0 1px 3px rgba(0, 0, 0, 0.04)",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      borderColor: isPicked ? "#1b5e20" : "#81c784",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                    <Chip
                      label={chem.formulation.split(" ")[0]}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: "0.68rem",
                        fontWeight: 800,
                        backgroundColor: `${badgeColor}15`,
                        color: badgeColor,
                      }}
                    />
                    <Chip
                      label={`WALES: [${chem.walesStep}]`}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        backgroundColor: "#f0f4f1",
                        color: "#37474f",
                      }}
                    />
                  </Box>

                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 800,
                      color: isPicked ? "#1b5e20" : "#263238",
                      fontSize: "0.88rem",
                      lineHeight: 1.3,
                      mb: 0.3,
                    }}
                  >
                    {chem.name}
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      color: "#607d8b",
                      fontSize: "0.74rem",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {chem.brand} • {chem.activeSubstance}
                  </Typography>
                </Box>
              </Grid>
            );
          })}
        </Grid>

        <Divider sx={{ my: 2.5 }} />

        {/* Assessment Verdict Section */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIds.join("-")}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {selectedIds.length < 2 ? (
              <Box
                sx={{
                  textAlign: "center",
                  py: 4,
                  px: 2,
                  borderRadius: "18px",
                  background: "#f0f5f1",
                  border: "2px dashed #c8d8cc",
                }}
              >
                <ScienceIcon sx={{ fontSize: 44, color: "#81c784", mb: 1 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#2e5239" }}>
                  {t.selectPlaceholder}
                </Typography>
                <Typography variant="body2" sx={{ color: "#617d69", maxWidth: 440, mx: "auto", mt: 0.5 }}>
                  {t.subtitle}
                </Typography>
              </Box>
            ) : (
              <Box>
                {/* Overall Verdict Banner */}
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: "18px",
                    background:
                      result.overallStatus === "compatible"
                        ? "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)"
                        : result.overallStatus === "caution"
                        ? "linear-gradient(135deg, #fffde7 0%, #fff9c4 100%)"
                        : "linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)",
                    border: "2px solid",
                    borderColor:
                      result.overallStatus === "compatible"
                        ? "#4caf50"
                        : result.overallStatus === "caution"
                        ? "#fbc02d"
                        : "#e53935",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
                    mb: 3,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                    {result.overallStatus === "compatible" && (
                      <CheckCircleOutlineIcon sx={{ fontSize: 36, color: "#2e7d32", mt: 0.3 }} />
                    )}
                    {result.overallStatus === "caution" && (
                      <WarningAmberIcon sx={{ fontSize: 36, color: "#f57f17", mt: 0.3 }} />
                    )}
                    {result.overallStatus === "incompatible" && (
                      <DangerousIcon sx={{ fontSize: 36, color: "#c62828", mt: 0.3 }} />
                    )}

                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 800,
                            color:
                              result.overallStatus === "compatible"
                                ? "#1b5e20"
                                : result.overallStatus === "caution"
                                ? "#e65100"
                                : "#b71c1c",
                          }}
                        >
                          {result.title}
                        </Typography>

                        <Chip
                          label={`Sinergiya: ${result.statusScore}%`}
                          size="small"
                          sx={{
                            fontWeight: 800,
                            backgroundColor:
                              result.overallStatus === "compatible"
                                ? "#2e7d32"
                                : result.overallStatus === "caution"
                                ? "#f57f17"
                                : "#c62828",
                            color: "#ffffff",
                          }}
                        />
                      </Box>

                      <Typography
                        variant="body2"
                        sx={{
                          mt: 1,
                          color: "#37474f",
                          fontSize: "0.9rem",
                          lineHeight: 1.5,
                        }}
                      >
                        {result.summary}
                      </Typography>

                      <Box sx={{ display: "flex", gap: 2, alignItems: "center", mt: 1.5, flexWrap: "wrap" }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: "#546e7a" }}>
                          💧 {t.phRecommendation}: <strong>{result.recommendedWaterPH}</strong>
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: "#546e7a" }}>
                          📦 {t.selectedCount}: <strong>{selectedIds.length} ta</strong>
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>

                {/* Specific Conflicts List (if any) */}
                {result.conflicts.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 800,
                        color: "#c62828",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        mb: 1.2,
                      }}
                    >
                      ⚠️ {t.scientificAnalysis} ({result.conflicts.length} ta xavfli to'qnashuv)
                    </Typography>

                    {result.conflicts.map((rule, idx) => (
                      <Alert
                        key={idx}
                        severity="error"
                        icon={<DangerousIcon />}
                        sx={{
                          mb: 1.5,
                          borderRadius: "14px",
                          border: "1px solid #ef9a9a",
                          "& .MuiAlert-message": { width: "100%" },
                        }}
                      >
                        <AlertTitle sx={{ fontWeight: 800, fontSize: "0.95rem" }}>
                          {lang === "uz" ? rule.titleUz : lang === "ko" ? rule.titleKo : rule.titleEn}
                        </AlertTitle>
                        <Typography variant="body2" sx={{ fontSize: "0.85rem", mb: 0.5 }}>
                          {lang === "uz" ? rule.reasonUz : lang === "ko" ? rule.reasonKo : rule.reasonEn}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            display: "block",
                            color: "#b71c1c",
                            fontStyle: "italic",
                            fontWeight: 600,
                          }}
                        >
                          🔬 Ilmiy asos:{" "}
                          {lang === "uz"
                            ? rule.scientificDetailUz
                            : lang === "ko"
                            ? rule.scientificDetailKo
                            : rule.scientificDetailEn}
                        </Typography>
                      </Alert>
                    ))}
                  </Box>
                )}

                {/* Specific Synergies List (if any) */}
                {result.synergies.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 800,
                        color: "#2e7d32",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        mb: 1.2,
                      }}
                    >
                      🌿 Tasdiqlangan Ijobiy Sinergiyalar ({result.synergies.length} ta)
                    </Typography>

                    {result.synergies.map((rule, idx) => (
                      <Alert
                        key={idx}
                        severity="success"
                        icon={<CheckCircleOutlineIcon />}
                        sx={{
                          mb: 1.5,
                          borderRadius: "14px",
                          border: "1px solid #a5d6a7",
                          "& .MuiAlert-message": { width: "100%" },
                        }}
                      >
                        <AlertTitle sx={{ fontWeight: 800, fontSize: "0.95rem" }}>
                          {lang === "uz" ? rule.titleUz : lang === "ko" ? rule.titleKo : rule.titleEn}
                        </AlertTitle>
                        <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
                          {lang === "uz" ? rule.reasonUz : lang === "ko" ? rule.reasonKo : rule.reasonEn}
                        </Typography>
                      </Alert>
                    ))}
                  </Box>
                )}

                {/* The WALES Mixing Protocol (Order of Addition) */}
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: "18px",
                    background: "#ffffff",
                    border: "1px solid #dce7df",
                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.03)",
                    mb: 3,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 800,
                      color: "#1b5e20",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1.5,
                    }}
                  >
                    <WaterDropIcon sx={{ color: "#0288d1" }} />
                    {t.mixingOrderTitle}
                  </Typography>

                  <Typography variant="caption" sx={{ color: "#607d8b", display: "block", mb: 2 }}>
                    Dori formulyatsiyalari cho'kma bermasligi uchun aralashtirish ketma-ketligiga (W-A-L-E-S) qat'iy amal qiling:
                  </Typography>

                  {/* Step 1: Base Water */}
                  <MixingStepCard
                    number={1}
                    title="💧 1-Qadam: Suvning 50-60% qismi"
                    instruction={t.waterFirst}
                    tag="Asosiy Suv"
                    color="#0288d1"
                  />

                  {/* Step 2..N: WALES sorted chemicals */}
                  {result.walesStepOrder.map((item, idx) => (
                    <MixingStepCard
                      key={item.chemical.id}
                      number={idx + 2}
                      title={`${item.chemical.name} [WALES: ${item.step}]`}
                      instruction={item.instruction}
                      tag={item.chemical.formulation}
                      color="#2e7d32"
                    />
                  ))}

                  {/* Step Final: Top up water */}
                  <MixingStepCard
                    number={result.walesStepOrder.length + 2}
                    title="💧 Yakuniy Qadam: Suvni to'ldirish va aralashtirish"
                    instruction={t.waterLast}
                    tag="100% Hajm"
                    color="#00897b"
                  />
                </Box>

                {/* Jar Test Mini Accordion Guide */}
                <Box
                  sx={{
                    p: 2,
                    borderRadius: "14px",
                    backgroundColor: "#f5f9f6",
                    border: "1px solid #e0eae2",
                    mb: 2,
                  }}
                >
                  <Box
                    onClick={() => setShowJarTest(!showJarTest)}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 700, color: "#2e5239", display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <HelpOutlineIcon sx={{ fontSize: 18, color: "#4caf50" }} />
                      {t.jarTestTitle}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#2e7d32", fontWeight: 700 }}>
                      {showJarTest ? "Yashirish ▲" : "Ko'rish ▼"}
                    </Typography>
                  </Box>

                  {showJarTest && (
                    <Box sx={{ mt: 1.5, pt: 1.5, borderTop: "1px dashed #d0ded3" }}>
                      <Typography variant="body2" sx={{ fontSize: "0.82rem", color: "#37474f", mb: 0.8 }}>
                        {result.jarTestGuide.step1}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: "0.82rem", color: "#37474f", mb: 0.8 }}>
                        {result.jarTestGuide.step2}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: "0.82rem", color: "#37474f" }}>
                        {result.jarTestGuide.step3}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer Actions */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1.5,
            pt: 2,
            borderTop: "1px solid #e0eae2",
          }}
        >
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              textTransform: "none",
              borderRadius: "12px",
              borderColor: "#cfd8dc",
              color: "#546e7a",
              fontWeight: 700,
            }}
          >
            {t.close}
          </Button>

          <Box sx={{ display: "flex", gap: 1.5 }}>
            {selectedIds.length >= 2 && (
              <Button
                variant="contained"
                onClick={handleShareTelegram}
                startIcon={<SendIcon />}
                sx={{
                  textTransform: "none",
                  borderRadius: "12px",
                  backgroundColor: "#0088cc",
                  fontWeight: 700,
                  "&:hover": { backgroundColor: "#0077b5" },
                }}
              >
                {t.sendTelegram}
              </Button>
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

function StackHorizontal({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      {children}
    </Box>
  );
}

interface MixingStepCardProps {
  number: number;
  title: string;
  instruction: string;
  tag: string;
  color: string;
}

function MixingStepCard({ number, title, instruction, tag, color }: MixingStepCardProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 1.5,
        p: 1.5,
        borderRadius: "12px",
        backgroundColor: "#f9fcf9",
        border: "1px solid #e5ede7",
        mb: 1.2,
      }}
    >
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          backgroundColor: color,
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 800,
          fontSize: "0.85rem",
          flexShrink: 0,
        }}
      >
        {number}
      </Box>

      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: "0.88rem", color: "#1c3123" }}>
            {title}
          </Typography>
          <Chip
            label={tag}
            size="small"
            sx={{
              height: 20,
              fontSize: "0.68rem",
              fontWeight: 700,
              backgroundColor: "#edf4ef",
              color: "#37474f",
            }}
          />
        </Box>
        <Typography variant="body2" sx={{ fontSize: "0.82rem", color: "#546e7a", lineHeight: 1.4 }}>
          {instruction}
        </Typography>
      </Box>
    </Box>
  );
}
