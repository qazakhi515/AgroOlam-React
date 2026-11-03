import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  TextField,
  MenuItem,
  Rating,
  Alert,
  Chip,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { motion } from "framer-motion";

export default function FarmerConsultationSection() {

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "Gidroponika & NFT loyihalash",
    area: "",
    comment: "",
  });
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setSubmitted(true);
    setTimeout(() => {
      setFormData({
        name: "",
        phone: "",
        service: "Gidroponika & NFT loyihalash",
        area: "",
        comment: "",
      });
      setSubmitted(false);
    }, 6000);
  };

  return (
    <Box
      id="consultation-section"
      sx={{
        py: { xs: 8, md: 11 },
        bgcolor: "#fcfdf9",
        borderTop: "1px solid #e1efe7",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
          {/* Left: Farmer Testimonial Visual Card */}
          <Grid item xs={12} md={5}>
            <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
              <Box
                sx={{
                  position: "relative",
                  borderRadius: "28px",
                  overflow: "hidden",
                  boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
                  border: "4px solid #ffffff",
                  height: { xs: "380px", sm: "480px" },
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80"
                  alt="Farmer Bahodir Rahmatullayev"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(7, 23, 16, 0.95) 0%, rgba(7, 23, 16, 0.4) 60%, transparent 100%)",
                  }}
                />

                <Box
                  sx={{
                    position: "absolute",
                    bottom: 24,
                    left: 24,
                    right: 24,
                    color: "#fff",
                  }}
                >
                  <Rating value={5} readOnly size="small" sx={{ color: "#fbbf24", mb: 1.5 }} />
                  <Typography
                    variant="body2"
                    sx={{
                      fontStyle: "italic",
                      color: "#e2e8f0",
                      lineHeight: 1.6,
                      fontSize: { xs: "13px", sm: "14px" },
                      mb: 2,
                    }}
                  >
                    "AgroOlam (agroolam.tech) bergan 150 mkr termo-diffuz plyonka va F1 urug'lar tufayli qattiq sovuqda ham ekinimiz zararlanmadi. AI skaner esa zararkunandani vaqtida to'xtatishga yordam berdi!"
                  </Typography>
                  <Box sx={{ pt: 1.5, borderTop: "1px solid rgba(255,255,255,0.2)" }}>
                    <Typography variant="subtitle2" fontWeight={800} color="#fff">
                      Bahodir Rahmatullayev
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#4ade80", fontWeight: 600 }}>
                      "Samarqand Agro-Gold" Issiqxona Majmuasi Rahbari
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </motion.div>
          </Grid>

          {/* Right: Expert Consultation Request Form */}
          <Grid item xs={12} md={7}>
            <Box
              sx={{
                bgcolor: "#ffffff",
                borderRadius: "28px",
                p: { xs: 3, sm: 5 },
                border: "1px solid rgba(45,106,79,0.18)",
                boxShadow: "0 15px 40px rgba(0,0,0,0.06)",
              }}
            >
              <Chip
                label="Bog'lanish & Bepul Konsultatsiya"
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
                variant="h4"
                fontWeight={900}
                color="#0E271D"
                sx={{ fontSize: { xs: "22px", sm: "28px" }, lineHeight: 1.25, mb: 1 }}
              >
                Issiqxonangiz holati bo'yicha bepul agronom tavsiyasini oling
              </Typography>
              <Typography variant="body2" color="#4D6657" sx={{ mb: 3.5, lineHeight: 1.6 }}>
                Mutaxassisimiz 15 daqiqa ichida siz bilan bog'lanib, ekin maydoni va suv tarkibiga mos urug', dori hamda salafan hajmini bepul hisoblab beradi.
              </Typography>

              {submitted && (
                <Alert
                  icon={<CheckCircleOutlineIcon fontSize="inherit" />}
                  severity="success"
                  sx={{ mb: 3, borderRadius: "14px" }}
                >
                  Arizangiz muvaffaqiyatli qabul qilindi! Agronomlarimiz tez orada sizga qo'ng'iroq qilishadi.
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="Ism va familiyangiz"
                      size="small"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      sx={{ bgcolor: "#fcfdf9" }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="Telefon raqamingiz"
                      placeholder="+998 (90) 123-45-67"
                      size="small"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      sx={{ bgcolor: "#fcfdf9" }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      label="Qiziqtirayotgan xizmat"
                      size="small"
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      sx={{ bgcolor: "#fcfdf9" }}
                    >
                      <MenuItem value="Gidroponika & NFT loyihalash">Gidroponika & NFT loyihalash</MenuItem>
                      <MenuItem value="Kasallikka qarshi dori tanlash">Kasallikka qarshi dori tanlash</MenuItem>
                      <MenuItem value="Gibrid urug'lar ulgurji buyurtmasi">Gibrid urug'lar ulgurji buyurtmasi</MenuItem>
                      <MenuItem value="Issiqxona salafani hisoblash">Issiqxona salafani (plyonka) hisoblash</MenuItem>
                      <MenuItem value="Tuproq va suv laborator tahlili">Tuproq va suv laboratoriya tahlili</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Maydon o'lchami"
                      placeholder="Masalan: 30 sotix yoki 2 gektar"
                      size="small"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      sx={{ bgcolor: "#fcfdf9" }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Qo'shimcha izoh yoki savol"
                      placeholder="Ekin turi, mavjud muammo yoki ehtiyojingizni qisqacha yozing..."
                      value={formData.comment}
                      onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                      sx={{ bgcolor: "#fcfdf9" }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        endIcon={<SendIcon sx={{ fontSize: 16 }} />}
                        sx={{
                          py: 1.5,
                          borderRadius: "14px",
                          bgcolor: "#2D6A4F",
                          fontWeight: 800,
                          fontSize: "14px",
                          textTransform: "none",
                          boxShadow: "0 6px 20px rgba(45,106,79,0.35)",
                          "&:hover": { bgcolor: "#1B4332" },
                        }}
                      >
                        Arizani Yuborish & Bepul Hisoblash
                      </Button>
                    </motion.div>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

