import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Divider,
  Chip,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PrintIcon from "@mui/icons-material/Print";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import axios from "axios";
import { serverApi } from "../../../lib/config";
import { CartItem } from "../../../lib/types/search";
import { Product } from "../../../lib/types/product";
import { getSavedLanguage } from "../../../lib/i18n";

interface PlantDoctorModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (item: CartItem) => void;
}

interface DiagnosisResult {
  crop: string;
  diseaseName: string;
  pathogen: string;
  confidence: number;
  stage: string;
  symptoms: string;
  activeIngredients: string[];
  treatment: string;
  nextSprayDays: number;
  imageUrl: string;
  recommendedProducts: Product[];
  safetyWarning?: string;
  disclaimer: string;
}

export default function PlantDoctorModal({
  open,
  onClose,
  onAdd,
}: PlantDoctorModalProps) {
  const lang = getSavedLanguage();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [cropHint, setCropHint] = useState<string>("tomato");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setDiagnosis(null);
      setErrorMsg(null);
    }
  };

  const handleDiagnose = async () => {
    if (!selectedFile) {
      setErrorMsg("Please select or capture a plant leaf image first.");
      return;
    }
    setIsAnalyzing(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("crop", cropHint);
    formData.append("lang", lang);

    try {
      const res = await axios.post(`${serverApi}/ai/diagnose`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setDiagnosis(res.data);
    } catch (err: any) {
      console.error("Diagnosis error:", err);
      setErrorMsg(
        err.response?.data?.message || "Failed to analyze image. Please try again."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setDiagnosis(null);
    setErrorMsg(null);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: "18px", p: 1 },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "#f1f8e9",
          borderRadius: "12px",
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <LocalHospitalIcon sx={{ color: "#2e7d32", fontSize: 30 }} />
          <div>
            <Typography variant="h6" fontWeight={800} color="#1b5e20">
              {lang === "ko"
                ? "AgroPlant AI 영상 병해충 닥터 (Plant Doctor)"
                : lang === "uz"
                ? "AgroPlant AI Jonli O'simlik Shifokori (Plant Doctor)"
                : "AgroPlant Plant Doctor & Vision Diagnosis"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {lang === "ko"
                ? "카메라로 병든 잎을 비추면 전문의 수준의 진단과 처방을 제공합니다."
                : lang === "uz"
                ? "Kamera orqali bargdagi kasallikni ko'rsating — AI agronom aniq tashxis va retsept beradi."
                : "Point camera or upload infected leaf for instant clinical diagnosis and certified treatments."}
            </Typography>
          </div>
        </Stack>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        {/* INPUT STAGE: Camera Capture & Crop Selection */}
        {!diagnosis && (
          <Stack spacing={2.5}>
            {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
              <FormControl size="small" sx={{ minWidth: 200, width: { xs: "100%", sm: "auto" } }}>
                <InputLabel id="crop-select-label">Crop Type (Ekin turi)</InputLabel>
                <Select
                  labelId="crop-select-label"
                  value={cropHint}
                  label="Crop Type (Ekin turi)"
                  onChange={(e) => setCropHint(e.target.value)}
                >
                  <MenuItem value="tomato">🍅 Tomato (Pomidor / 토마토)</MenuItem>
                  <MenuItem value="cucumber">🥒 Cucumber (Bodring / 오이)</MenuItem>
                  <MenuItem value="pepper">🫑 Bell Pepper (Qalampir / 고추)</MenuItem>
                  <MenuItem value="grape">🍇 Grape / Fruit (Uzum / Mevali)</MenuItem>
                </Select>
              </FormControl>

              {/* Native Mobile Camera Trigger */}
              <input
                type="file"
                accept="image/*"
                capture="environment"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileSelect}
              />

              <Button
                variant="contained"
                startIcon={<PhotoCameraIcon />}
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  bgcolor: "#2e7d32",
                  "&:hover": { bgcolor: "#1b5e20" },
                  py: 1.2,
                  px: 3,
                  fontWeight: 700,
                  borderRadius: "24px",
                  boxShadow: "0 4px 14px rgba(46,125,50,0.3)",
                }}
              >
                {lang === "ko" ? "📷 카메라 열기 / 사진 촬영" : lang === "uz" ? "📷 Kamerani Ochish / Rasm Olish" : "📷 Open Camera / Snap Leaf"}
              </Button>
            </Stack>

            {/* PREVIEW CONTAINER */}
            {previewUrl ? (
              <Box
                sx={{
                  position: "relative",
                  borderRadius: "16px",
                  overflow: "hidden",
                  border: "2px solid #81c784",
                  textAlign: "center",
                  bgcolor: "#000",
                  maxHeight: "360px",
                }}
              >
                <img
                  src={previewUrl}
                  alt="Captured leaf"
                  style={{ maxHeight: "360px", width: "auto", objectFit: "contain" }}
                />

                {isAnalyzing && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      bgcolor: "rgba(0,0,0,0.65)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                    }}
                  >
                    <CircularProgress size={48} sx={{ color: "#81c784", mb: 2 }} />
                    <Typography variant="h6" fontWeight={700}>
                      {lang === "ko" ? "AI 잎 조직 및 병원균 분석 중..." : "AI Agronomist Analyzing Pathology..."}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#a5d6a7" }}>
                      Cross-referencing PlantVillage & EPPO diagnostic matrix
                    </Typography>
                  </Box>
                )}
              </Box>
            ) : (
              <Box
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  p: 4,
                  border: "2px dashed #a5d6a7",
                  borderRadius: "16px",
                  textAlign: "center",
                  bgcolor: "#f9fbe7",
                  cursor: "pointer",
                  "&:hover": { bgcolor: "#f1f8e9" },
                }}
              >
                <PhotoCameraIcon sx={{ fontSize: 48, color: "#2e7d32", mb: 1 }} />
                <Typography variant="subtitle1" fontWeight={700} color="#1b5e20">
                  {lang === "ko" ? "이곳을 눌러 카메라로 잎을 비추거나 사진을 올리세요" : "Tap here to capture infected leaf or upload photo"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Supports smartphones, tablets, and store pharmacy kiosks
                </Typography>
              </Box>
            )}

            {previewUrl && !isAnalyzing && (
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5 }}>
                <Button variant="outlined" onClick={handleReset} startIcon={<RestartAltIcon />}>
                  Retake
                </Button>
                <Button
                  variant="contained"
                  onClick={handleDiagnose}
                  startIcon={<LocalHospitalIcon />}
                  sx={{ bgcolor: "#2e7d32", "&:hover": { bgcolor: "#1b5e20" }, px: 3, fontWeight: 700 }}
                >
                  Start Clinical Diagnosis
                </Button>
              </Box>
            )}
          </Stack>
        )}

        {/* OUTPUT STAGE: MASTER DOCTOR PRESCRIPTION */}
        {diagnosis && (
          <Stack spacing={2}>
            {/* Header with confidence */}
            <Box
              sx={{
                p: 2,
                borderRadius: "12px",
                bgcolor: "#e8f5e9",
                border: "1px solid #a5d6a7",
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                gap: 1,
              }}
            >
              <div>
                <Typography variant="h5" fontWeight={800} color="#1b5e20">
                  {diagnosis.diseaseName}
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: "italic", color: "#388e3c" }}>
                  Pathogen: {diagnosis.pathogen}
                </Typography>
              </div>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  icon={<CheckCircleIcon />}
                  label={`Confidence: ${diagnosis.confidence}%`}
                  color="success"
                  sx={{ fontWeight: 800 }}
                />
                <Chip label={`Crop: ${diagnosis.crop}`} variant="outlined" sx={{ fontWeight: 700 }} />
              </Stack>
            </Box>

            {/* Stage & Symptoms */}
            <Box sx={{ p: 2, bgcolor: "#fafafa", borderRadius: "10px", border: "1px solid #eee" }}>
              <Typography variant="subtitle2" fontWeight={700} color="text.primary">
                🔍 {lang === "ko" ? "발병 단계 및 증상 관찰" : lang === "uz" ? "Rivojlanish bosqichi va belgilar" : "Severity Stage & Symptoms"}:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                <strong>Stage:</strong> {diagnosis.stage}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {diagnosis.symptoms}
              </Typography>
            </Box>

            {/* Treatment Protocol */}
            <Box sx={{ p: 2, bgcolor: "#fffde7", borderRadius: "10px", border: "1px solid #fff59d" }}>
              <Typography variant="subtitle2" fontWeight={800} color="#f57f17">
                💊 {lang === "ko" ? "전문 아그로노미스트 처방 및 방제 요령" : lang === "uz" ? "Master Agronom Retsepti va Qo'llash Qoidasi" : "Clinical Treatment Protocol"}:
              </Typography>
              <Typography variant="body2" color="#333" sx={{ mt: 0.5, lineHeight: 1.5 }}>
                {diagnosis.treatment}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
                <Typography variant="caption" fontWeight={700} color="#e65100">
                  Active Ingredients Needed:
                </Typography>
                {diagnosis.activeIngredients.map((ing, idx) => (
                  <Chip key={idx} label={ing} size="small" sx={{ bgcolor: "#fff", fontWeight: 700 }} />
                ))}
              </Stack>
              <Typography variant="caption" sx={{ display: "block", mt: 1, color: "#1565c0", fontWeight: 700 }}>
                ⏳ 2nd Preventive Spray Cycle: Due in {diagnosis.nextSprayDays} days.
              </Typography>
            </Box>

            {/* Chemical Incompatibility Safety Alert */}
            {diagnosis.safetyWarning && (
              <Alert severity="warning" icon={<WarningAmberIcon />} sx={{ fontSize: "12px" }}>
                <strong>Agro Safety Rule:</strong> {diagnosis.safetyWarning}
              </Alert>
            )}

            {/* Direct Store Medicines (Savdo / Conversion) */}
            <div>
              <Typography variant="subtitle1" fontWeight={800} color="#1b5e20" sx={{ mb: 1 }}>
                🛒 {lang === "ko" ? "추천 공인 약제 (즉시 장바구니 담기)" : lang === "uz" ? "Tavsiya Etilgan Sertifikatlangan Dorilar (Sotib Olish)" : "Certified Treatment Products (Available in Store)"}:
              </Typography>
              <Stack spacing={1}>
                {diagnosis.recommendedProducts.map((prod) => (
                  <Box
                    key={prod._id}
                    sx={{
                      p: 1.5,
                      borderRadius: "10px",
                      bgcolor: "#fff",
                      border: "1px solid #c8e6c9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 2,
                    }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <img
                        src={`${serverApi}/${prod.productImages[0]}`}
                        alt={prod.productName}
                        style={{ width: 48, height: 48, objectFit: "cover", borderRadius: "8px" }}
                      />
                      <div>
                        <Typography variant="subtitle2" fontWeight={700}>
                          {prod.productName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {prod.productVolume ? `${prod.productVolume} kg/L` : prod.productSize} • Stock: {prod.productLeftCount}
                        </Typography>
                      </div>
                    </Stack>

                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography variant="subtitle1" fontWeight={800} color="#2e7d32">
                        ${prod.productPrice}
                      </Typography>
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<ShoppingCartIcon />}
                        onClick={() =>
                          onAdd({
                            _id: prod._id,
                            quantity: 1,
                            name: prod.productName,
                            price: prod.productPrice,
                            image: prod.productImages[0],
                          })
                        }
                        sx={{ bgcolor: "#2e7d32", "&:hover": { bgcolor: "#1b5e20" }, textTransform: "none", fontWeight: 700 }}
                      >
                        Add to Cart
                      </Button>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </div>

            <Typography variant="caption" color="text.secondary" sx={{ display: "block", textAlign: "center", mt: 1 }}>
              {diagnosis.disclaimer}
            </Typography>
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
        {diagnosis ? (
          <>
            <Button variant="outlined" startIcon={<RestartAltIcon />} onClick={handleReset}>
              Scan Another Leaf
            </Button>
            <Stack direction="row" spacing={1.5}>
              <Button variant="outlined" startIcon={<PrintIcon />} onClick={handlePrint} sx={{ color: "#333" }}>
                Print Prescription (Kiosk)
              </Button>
              <Button variant="contained" onClick={onClose} sx={{ bgcolor: "#2e7d32", "&:hover": { bgcolor: "#1b5e20" } }}>
                Done
              </Button>
            </Stack>
          </>
        ) : (
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
