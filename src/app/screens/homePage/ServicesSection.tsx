import React from "react";
import { Box, Container, Grid, Typography, Stack, Button, Chip } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import VerifiedIcon from "@mui/icons-material/Verified";
import { motion } from "framer-motion";
import { useHistory } from "react-router-dom";
import { getSavedLanguage } from "../../../lib/i18n";

export default function ServicesSection() {
  const history = useHistory();
  const lang = getSavedLanguage();

  const services = [
    {
      badgeUz: "Audit & Analitika",
      badgeEn: "Audit & Diagnostics",
      titleUz: "Agronomic Consultancy",
      titleEn: "Agronomic Consultancy",
      tagUz: "Agro Diagnostika",
      descUz:
        "Issiqxona tuprog'i, sug'orish suvi va barg to'qimalarini zamonaviy laboratoriya tahlillari orqali to'liq tekshirish va oziqlantirish xaritasi.",
      descEn:
        "Comprehensive soil, irrigation water, and foliar tissue lab audit to formulate precision fertigation protocols.",
      image: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=700&q=80",
      certUz: "AgroOlam Cert",
    },
    {
      badgeUz: "Hosildorlik & Biznes",
      badgeEn: "Yield & Strategy",
      titleUz: "Strategic Greenhouse Advice",
      titleEn: "Strategic Greenhouse Advice",
      tagUz: "Strategik Rejalashtirish",
      descUz:
        "Ekin mavsumini to'g'ri tanlash, eksportbop pomidor va qulupnay navlarini kiritish orqali xarajatlarni 25% gacha qisqartirish.",
      descEn:
        "Optimizing crop season scheduling, introducing export-grade hybrid varieties, and slashing operational costs by up to 25%.",
      image: "https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=700&q=80",
      certUz: "B2B Yechim",
    },
    {
      badgeUz: "Tuproqsiz Texnologiya",
      badgeEn: "Soilless Cultivation",
      titleUz: "Hydroponic Setup & Substrates",
      titleEn: "Hydroponic Setup & Substrates",
      tagUz: "Gidroponika & NFT",
      descUz:
        "Kokos substrati, NFT novlari va avtomatik ozuqa erituvchi kompyuterlashgan bloklarni noldan 'kalit topshirish' tarzida o'rnatish.",
      descEn:
        "Turnkey installation of coco-coir slabs, NFT gullies, and computerized doser units with 70% water savings.",
      image: "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=700&q=80",
      certUz: "70% Suv Tejami",
    },
    {
      badgeUz: "O'simliklar Himoyasi",
      badgeEn: "Crop Protection",
      titleUz: "Plant Disease Treatment",
      titleEn: "Plant Disease Treatment",
      tagUz: "Bio & Kimyoviy Kurash",
      descUz:
        "Zamburug', bakterial kuya va hasharotlarga qarshi litsenziyalangan preparatlar va bio-entomofaglar yordamida kompleks himoya.",
      descEn:
        "Licensed fungicide treatments, biological predator mites, and organic IPM systems for zero-residue production.",
      image: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=700&q=80",
      certUz: "100% Xavfsiz",
    },
    {
      badgeUz: "Avtomatlashtirish",
      badgeEn: "IoT Automation",
      titleUz: "Smart Climate Automation",
      titleEn: "Smart Climate Automation",
      tagUz: "IoT Datchiklar",
      descUz:
        "Issiqxona darchalari, pardalash (shading), tuman hosil qilish va isitish qozonlarini havo haroratiga qarab avtomatik boshqarish.",
      descEn:
        "Automated vent actuators, thermal screen motors, fogging pumps, and boiler microclimate regulation via mobile app.",
      image: "https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?auto=format&fit=crop&w=700&q=80",
      certUz: "Mobil Nazorat",
    },
    {
      badgeUz: "Tuproq Tahlili",
      badgeEn: "Soil Analysis",
      titleUz: "Soil & Nutrition Analysis",
      titleEn: "Soil & Nutrition Analysis",
      tagUz: "Mineral Balans",
      descUz:
        "Sho'rlanish darajasi, kation almashinuvi, mikro va makro elementlar yetishmovchiligini aniqlash va o'g'it me'yori tavsiyasi.",
      descEn:
        "EC/pH salinity scans, cation exchange capacity testing, and micro/macro nutrient balancing for maximal yield.",
      image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=700&q=80",
      certUz: "Aniq Dozalash",
    },
  ];

  return (
    <Box
      id="services-section"
      sx={{
        py: { xs: 8, md: 11 },
        bgcolor: "#f4f6f0",
        borderBottom: "1px solid #e1efe7",
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "flex-end" }}
          spacing={2}
          sx={{ mb: { xs: 5, md: 7 } }}
        >
          <div>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: "#2D6A4F",
                display: "block",
                mb: 0.5,
              }}
            >
              Professional Agronomik Yondashuv
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                fontSize: { xs: "28px", sm: "36px", md: "40px" },
                color: "#0E271D",
                lineHeight: 1.2,
              }}
            >
              Xizmatlar & Muhandislik Loyihalari
            </Typography>
          </div>
          <Typography variant="body2" sx={{ color: "#4D6657", maxWidth: "460px", lineHeight: 1.6 }}>
            Oddiy dehqonchilikdan sanoat darajasidagi yuqori rentabelli issiqxona majmualarigacha bo'lgan to'liq texnik yechimlar.
          </Typography>
        </Stack>

        {/* 6 Services Grid */}
        <Grid container spacing={3.5}>
          {services.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.25 }}
                style={{ height: "100%" }}
              >
                <Box
                  sx={{
                    bgcolor: "#ffffff",
                    borderRadius: "24px",
                    overflow: "hidden",
                    border: "1px solid rgba(45,106,79,0.15)",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                    transition: "box-shadow 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 20px 40px rgba(45,106,79,0.12)",
                    },
                  }}
                >
                  {/* Image container */}
                  <Box sx={{ position: "relative", height: 200, overflow: "hidden" }}>
                    <img
                      src={item.image}
                      alt={item.titleUz}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.5s ease",
                      }}
                    />
                    <Chip
                      label={lang === "uz" ? item.badgeUz : item.badgeEn}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 14,
                        left: 14,
                        bgcolor: "rgba(14, 39, 29, 0.85)",
                        backdropFilter: "blur(6px)",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: "11px",
                      }}
                    />
                  </Box>

                  {/* Body content */}
                  <Box sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <Typography variant="caption" sx={{ fontWeight: 800, textTransform: "uppercase", color: "#2D6A4F", display: "block" }}>
                        {item.tagUz}
                      </Typography>
                      <Typography variant="h6" fontWeight={800} color="#0E271D" sx={{ mt: 0.5, mb: 1.5, fontSize: "17px" }}>
                        {lang === "uz" ? item.titleUz : item.titleEn}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#475569", lineHeight: 1.6, fontSize: "13px" }}>
                        {lang === "uz" ? item.descUz : item.descEn}
                      </Typography>
                    </div>

                    {/* Footer CTA */}
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mt: 3, pt: 2, borderTop: "1px solid #f1f5f9" }}
                    >
                      <Button
                        size="small"
                        onClick={() => history.push("/help")}
                        endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
                        sx={{
                          bgcolor: "#2D6A4F",
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: "12px",
                          borderRadius: "20px",
                          px: 2,
                          py: 0.6,
                          textTransform: "none",
                          "&:hover": { bgcolor: "#1B4332" },
                        }}
                      >
                        Batafsil
                      </Button>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <VerifiedIcon sx={{ fontSize: 14, color: "#10b981" }} />
                        <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700 }}>
                          {item.certUz}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

