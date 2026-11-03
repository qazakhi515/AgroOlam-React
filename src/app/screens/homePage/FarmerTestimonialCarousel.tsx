import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  IconButton,
  Rating,
  Stack,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { motion, AnimatePresence } from "framer-motion";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  quote: string;
  rating: number;
  ratingLabel: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    name: "SARAH HOHN",
    role: "Issiqxona Rahbari, Andijon",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    quote:
      "AgroOlam Vision AI 4.1 barg skaneri orqali pomidordagi fitoftorani erta bosqichda aniqlab, 15 sotix hosilimizni to'liq saqlab qoldik. Tavsiya qilingan dori 2 kunda yetib keldi!",
    rating: 5,
    ratingLabel: "(A'lo Hosil)",
  },
  {
    id: "test-2",
    name: "EMMA SUSAH",
    role: "Agronom Mutaxassis, Samarqand",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    quote:
      "150 mkr 3 qavatli termo-diffuz plyonka va F1 gibrid bodring urug'lari qattiq qora sovuqda ham ichki haroratni ushlab berdi. Mahsulotlar sertifikatlangan, dori vositalari 100% original.",
    rating: 5,
    ratingLabel: "(Best Design)",
  },
  {
    id: "test-3",
    name: "LENA JAKSON",
    role: "Bog'dorchilik Ustasi, Farg'ona",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    quote:
      "Dori ziddiyatlari kalkulyatori orqali xato aralashmalardan qutuldik. Avvallari dorilarni noto'g'ri aralashtirib barg kuydirar edik, endi har bir purkash ilmiy hisob-kitob asosida qilinadi.",
    rating: 5,
    ratingLabel: "(Yuqori Hosil)",
  },
  {
    id: "test-4",
    name: "AKMALBEK SAIDOV",
    role: "Intensiv Dehqon, Namangan",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    quote:
      "Un-shudringga qarshi Syngenta va Bayer preparatlarini to'g'ridan-to'g'ri AgroOlam platformasidan buyurtma qildim. 1 kunda yetkazib berishdi, to'lovni Payme orqali bir zumda qildim.",
    rating: 5,
    ratingLabel: "(Tezkor Xizmat)",
  },
  {
    id: "test-5",
    name: "BAHODIR RAHMATULLAYEV",
    role: "«Agro-Gold» Rahbari, Buxoro",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    quote:
      "Salafan qalinligi va dori dozasini sotix bo'yicha hisoblab beruvchi kalkulyator dehqonlar uchun ayni muddao. Bir mavsumda o'g'it xarajatlaridan 12% tejab, unumdorlikni oshirdik.",
    rating: 5,
    ratingLabel: "(Ilmiy Yondashuv)",
  },
];

export default function FarmerTestimonialCarousel() {
  const [activeIndex, setActiveIndex] = useState<number>(1);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const total = TESTIMONIALS.length;

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, 7000);
    return () => clearInterval(interval);
  }, [isHovered, total]);

  const prevIndex = (activeIndex - 1 + total) % total;
  const nextIndex = (activeIndex + 1) % total;

  const activeItem = TESTIMONIALS[activeIndex];
  const prevItem = TESTIMONIALS[prevIndex];
  const nextItem = TESTIMONIALS[nextIndex];

  // Helper renderer for consistent 2-column card layout matching user's design
  const renderCardContent = (item: Testimonial, isCenter: boolean = false) => (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column-reverse", sm: "row" },
        alignItems: "center",
        justifyContent: "space-between",
        gap: { xs: 2.5, sm: 3.5 },
        height: "100%",
      }}
    >
      {/* Left Column: Quote Icon, Text, Rating */}
      <Box sx={{ flex: 1, minWidth: 0, textAlign: "left" }}>
        {/* Double quotation symbol matching screenshot */}
        <Typography
          component="div"
          sx={{
            fontFamily: "Georgia, serif",
            fontSize: { xs: "36px", sm: "44px" },
            lineHeight: 0.8,
            color: "#94A3B8",
            fontWeight: 700,
            mb: 1.5,
            userSelect: "none",
          }}
        >
          “
        </Typography>

        <Typography
          variant="body2"
          sx={{
            fontStyle: "italic",
            color: isCenter ? "#4B5563" : "#64748B",
            fontSize: { xs: "13px", sm: "14px" },
            lineHeight: 1.6,
            mb: 2,
            minHeight: { sm: 66 },
            display: "-webkit-box",
            WebkitLineClamp: isCenter ? 4 : 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {item.quote}
        </Typography>

        {/* Star Rating + Label */}
        <Stack direction="row" spacing={0.8} alignItems="center">
          <Rating
            value={item.rating}
            readOnly
            size="small"
            sx={{
              color: "#3B82F6",
              fontSize: { xs: "15px", sm: "16px" },
            }}
          />
          <Typography
            variant="caption"
            sx={{
              color: "#6B7280",
              fontSize: "12px",
              fontWeight: 500,
            }}
          >
            {item.ratingLabel}
          </Typography>
        </Stack>
      </Box>

      {/* Right Column: Avatar with outer ring, Uppercase Name, Role */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          flexShrink: 0,
          minWidth: { xs: 130, sm: 155 },
        }}
      >
        {/* Outer Circular Ring with Padding matching screenshot */}
        <Box
          sx={{
            p: "5px",
            borderRadius: "50%",
            border: "1.5px solid #BFDBFE",
            bgcolor: "#FFFFFF",
            display: "inline-block",
            mb: 1.2,
            boxShadow: isCenter ? "0 4px 14px rgba(59, 130, 246, 0.15)" : "none",
            transition: "all 0.3s ease",
          }}
        >
          <Box
            component="img"
            src={item.avatar}
            alt={item.name}
            sx={{
              width: { xs: 70, sm: 84 },
              height: { xs: 70, sm: 84 },
              borderRadius: "50%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </Box>

        {/* Customer Name in Uppercase Primary Blue */}
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 800,
            color: "#3B82F6",
            fontSize: "13.5px",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
            lineHeight: 1.2,
            mb: 0.4,
          }}
        >
          {item.name}
        </Typography>

        {/* Role / Title */}
        <Typography
          variant="caption"
          sx={{
            color: "#9CA3AF",
            fontSize: "11.5px",
            fontWeight: 500,
            lineHeight: 1.2,
          }}
        >
          {item.role}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        py: { xs: 7, md: 9 },
        bgcolor: "#F8FAFC",
        borderTop: "1px solid #E2E8F0",
        borderBottom: "1px solid #E2E8F0",
        overflow: "hidden",
        position: "relative",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Container maxWidth="lg">
        {/* Header matching user's exact design */}
        <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: "#1E293B",
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: { xs: "28px", sm: "36px", md: "40px" },
              letterSpacing: "-0.5px",
              mb: 1.2,
            }}
          >
            Trust Our Costumer
          </Typography>

          {/* Line with Dot & Subtitle: — • Dont take Our word For it */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={1}
            sx={{ mb: 1 }}
          >
            <Box
              sx={{
                width: 32,
                height: "2px",
                bgcolor: "#3B82F6",
                borderRadius: "2px",
              }}
            />
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                bgcolor: "#3B82F6",
              }}
            />
            <Typography
              variant="body2"
              sx={{
                color: "#64748B",
                fontSize: { xs: "13px", sm: "14px" },
                fontWeight: 500,
              }}
            >
              Dont take Our word For it • Fermerlarimiz erishgan real natijalarga ishoning
            </Typography>
          </Stack>
        </Box>

        {/* 3-Card Carousel Stage with Left & Right Arrows */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            minHeight: { xs: 360, sm: 260 },
          }}
        >
          {/* 1. Left Peeking Card (Visible on tablet & desktop) */}
          <Box
            onClick={handlePrev}
            sx={{
              display: { xs: "none", md: "block" },
              width: 440,
              bgcolor: "#FFFFFF",
              borderRadius: "20px",
              p: 3,
              boxShadow: "0 6px 20px rgba(0,0,0,0.04)",
              border: "1px solid #E2E8F0",
              opacity: 0.45,
              transform: "scale(0.88)",
              cursor: "pointer",
              transition: "all 0.3s ease",
              flexShrink: 0,
              mr: -5,
              zIndex: 1,
              userSelect: "none",
              "&:hover": { opacity: 0.7, transform: "scale(0.91)" },
            }}
          >
            {renderCardContent(prevItem, false)}
          </Box>

          {/* 2. Left Arrow Button (Blue arrow matching screenshot) */}
          <IconButton
            onClick={handlePrev}
            aria-label="Previous testimonial"
            sx={{
              color: "#3B82F6",
              bgcolor: "#FFFFFF",
              boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
              border: "1px solid #E2E8F0",
              zIndex: 4,
              mx: { xs: 0.5, sm: 1.5 },
              width: 40,
              height: 40,
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: "#EFF6FF",
                color: "#1D4ED8",
                transform: "scale(1.1)",
              },
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 20 }} />
          </IconButton>

          {/* 3. Center Active Highlighted Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeItem.id}
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{
                zIndex: 3,
                maxWidth: 620,
                width: "100%",
              }}
            >
              <Box
                sx={{
                  bgcolor: "#FFFFFF",
                  borderRadius: "22px",
                  p: { xs: 3, sm: 3.8 },
                  boxShadow:
                    "0 18px 45px rgba(0, 0, 0, 0.07), 0 2px 10px rgba(0, 0, 0, 0.03)",
                  border: "1px solid #E5E7EB",
                }}
              >
                {renderCardContent(activeItem, true)}
              </Box>
            </motion.div>
          </AnimatePresence>

          {/* 4. Right Arrow Button (Dark arrow matching screenshot) */}
          <IconButton
            onClick={handleNext}
            aria-label="Next testimonial"
            sx={{
              color: "#1E293B",
              bgcolor: "#FFFFFF",
              boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
              border: "1px solid #E2E8F0",
              zIndex: 4,
              mx: { xs: 0.5, sm: 1.5 },
              width: 40,
              height: 40,
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: "#F1F5F9",
                color: "#0F172A",
                transform: "scale(1.1)",
              },
            }}
          >
            <ArrowForwardIcon sx={{ fontSize: 20 }} />
          </IconButton>

          {/* 5. Right Peeking Card (Visible on tablet & desktop) */}
          <Box
            onClick={handleNext}
            sx={{
              display: { xs: "none", md: "block" },
              width: 440,
              bgcolor: "#FFFFFF",
              borderRadius: "20px",
              p: 3,
              boxShadow: "0 6px 20px rgba(0,0,0,0.04)",
              border: "1px solid #E2E8F0",
              opacity: 0.45,
              transform: "scale(0.88)",
              cursor: "pointer",
              transition: "all 0.3s ease",
              flexShrink: 0,
              ml: -5,
              zIndex: 1,
              userSelect: "none",
              "&:hover": { opacity: 0.7, transform: "scale(0.91)" },
            }}
          >
            {renderCardContent(nextItem, false)}
          </Box>
        </Box>

        {/* Carousel Dots Indicator */}
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={1}
          sx={{ mt: 4 }}
        >
          {TESTIMONIALS.map((_, idx) => (
            <Box
              key={idx}
              onClick={() => setActiveIndex(idx)}
              sx={{
                width: activeIndex === idx ? 24 : 8,
                height: 8,
                borderRadius: "4px",
                bgcolor: activeIndex === idx ? "#3B82F6" : "#CBD5E1",
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": { bgcolor: "#2563EB" },
              }}
            />
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
