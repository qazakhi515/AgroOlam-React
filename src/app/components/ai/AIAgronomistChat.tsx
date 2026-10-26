import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  TextField,
  CircularProgress,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import PlantDoctorModal from "./PlantDoctorModal";
import axios from "axios";
import { serverApi } from "../../../lib/config";
import { CartItem } from "../../../lib/types/search";
import { Product } from "../../../lib/types/product";
import { getSavedLanguage, translations, Language } from "../../../lib/i18n";

interface AIAgronomistChatProps {
  onAdd: (item: CartItem) => void;
}

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  recommendedProducts?: Product[];
  disclaimer?: string;
}

export default function AIAgronomistChat({ onAdd }: AIAgronomistChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState<Language>(getSavedLanguage());
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDoctorOpen, setIsDoctorOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const t = translations[lang].aiChat;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      sender: "bot",
      text:
        lang === "ko"
          ? "안녕하세요! Agrivia 스마트 아그로노미스트입니다. 작물의 증상(잎 마름, 변색, 병해충)을 말씀해 주시면 적절한 방제법과 약제를 추천해 드립니다. (한국어, English, O'zbekcha 모두 지원)"
          : lang === "uz"
          ? "Assalomu alaykum! Men Agrivia AI Agronomiman. Ekinlaringizdagi kasallik, sarg'ayish yoki zararkunandalar haqida yozing, to'g'ri dori va o'g'itlarni tavsiya qilaman. (O'zbekcha, 한국어, English)"
          : "Hello! I am the Agrivia AI Agronomist. Describe your crop symptoms, leaf discoloration, or pest issues, and I will diagnose and recommend certified treatments. (Supports English, 한국어, O'zbekcha, Русский)",
      disclaimer:
        lang === "ko"
          ? "⚠️ 알림: AI 처방은 참고용이며, 약제 살포 전 라벨 지침을 반드시 확인하세요."
          : lang === "uz"
          ? "⚠️ Eslatma: Ushbu AI tavsiyasi ma'lumot uchun berilgan. Qo'llashdan oldin yo'riqnomani tekshiring."
          : "⚠️ Advisory: AI diagnosis is for guidance. Always verify official chemical application labels.",
    },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsgId = Date.now().toString();
    const newMessages: ChatMessage[] = [
      ...messages,
      { id: userMsgId, sender: "user", text },
    ];
    setMessages(newMessages);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${serverApi}/ai/chat`,
        { message: text, language: lang },
        { timeout: 4000 }
      );

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: response.data.reply,
        recommendedProducts: response.data.recommendedProducts,
        disclaimer: response.data.disclaimer,
      };
      setMessages([...newMessages, botMsg]);
    } catch (err) {
      // Fallback local diagnosis response
      let fallbackReply = "";
      if (text.includes("잎") || text.includes("leaf") || text.includes("barg")) {
        fallbackReply =
          lang === "ko"
            ? "잎의 증상으로 보아 흰가루병 또는 영양 결핍일 가능성이 있습니다. 적정 살균제(Topas) 살포 및 환기를 개선해 주십시오."
            : lang === "uz"
            ? "Bargdagi o'zgarishlar Un-shudring yoki oziqlanish yetishmovchiligi alomatidir. Penkonazol (Topas) purkash va issiqxonani shamollatish tavsiya etiladi."
            : "Leaf discoloration suggests either Powdery Mildew or micronutrient deficiency. Apply targeted systemic fungicide (Topas) and ensure proper ventilation.";
      } else {
        fallbackReply =
          lang === "ko"
            ? "작물 보호 및 처방에 관해 문의해 주셨습니다. 상세 증상(반점 색상, 잎 표면 상태)을 알려주시면 더욱 정확한 진단이 가능합니다."
            : lang === "uz"
            ? "Ekinlarni himoya qilish bo'yicha so'rovingiz qabul qilindi. Zararlangan qismning rangi va holatini aniqroq yozsangiz, yanada aniq dori tavsiya qilaman."
            : "Thank you for consulting. Please specify plant type and visible spotting patterns for a precise prescription.";
      }

      setMessages([
        ...newMessages,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: fallbackReply,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    const cartItem: CartItem = {
      _id: product._id,
      quantity: 1,
      name: product.productName,
      price: product.productPrice,
      image: product.productImages[0] || "",
    };
    onAdd(cartItem);
  };

  return (
    <>
      {/* Floating launcher trigger */}
      {!isOpen && (
        <Box
          onClick={() => setIsOpen(true)}
          sx={{
            position: "fixed",
            bottom: 30,
            right: 30,
            zIndex: 9999,
            background: "linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)",
            color: "#ffffff",
            borderRadius: "50%",
            width: 64,
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 24px rgba(27, 94, 32, 0.4)",
            cursor: "pointer",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "scale(1.08)",
              boxShadow: "0 12px 28px rgba(27, 94, 32, 0.5)",
            },
          }}
        >
          <SmartToyIcon sx={{ fontSize: 32 }} />
          <Box
            sx={{
              position: "absolute",
              top: 2,
              right: 2,
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "#4caf50",
              border: "2px solid #ffffff",
            }}
          />
        </Box>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <Box
          sx={{
            position: "fixed",
            bottom: 30,
            right: 30,
            width: { xs: "90vw", sm: 420 },
            height: 580,
            zIndex: 9999,
            background: "#ffffff",
            borderRadius: "20px",
            boxShadow: "0 16px 40px rgba(0, 0, 0, 0.22)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            border: "1px solid #e2e8f0",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: "linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)",
              color: "#ffffff",
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <SmartToyIcon sx={{ fontSize: 28 }} />
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: 16 }}>
                  {t.title}
                </Typography>
                <Typography sx={{ fontSize: 11, opacity: 0.9 }}>
                  🇰🇷 KO • 🇺🇸 EN • 🇺🇿 UZ • 🇷🇺 RU
                </Typography>
              </Box>
            </Box>
            <IconButton
              size="small"
              onClick={() => setIsOpen(false)}
              sx={{ color: "#ffffff" }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Quick prompt chips */}
          <Box
            sx={{
              p: 1.5,
              background: "#f1f8f3",
              display: "flex",
              gap: 1,
              overflowX: "auto",
              whiteSpace: "nowrap",
            }}
          >
            {t.quickPrompts.map((p, idx) => (
              <Chip
                key={idx}
                label={p}
                size="small"
                onClick={() => handleSendMessage(p)}
                sx={{
                  cursor: "pointer",
                  fontSize: 11,
                  background: "#ffffff",
                  "&:hover": { background: "#e8f5e9" },
                }}
              />
            ))}
          </Box>

          {/* Messages Body */}
          <Box
            sx={{
              flex: 1,
              p: 2,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              background: "#f7faf7",
            }}
          >
            {messages.map((m) => (
              <Box
                key={m.id}
                sx={{
                  alignSelf: m.sender === "user" ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                }}
              >
                <Box
                  sx={{
                    background: m.sender === "user" ? "#2e7d32" : "#ffffff",
                    color: m.sender === "user" ? "#ffffff" : "#1a202c",
                    p: 1.8,
                    borderRadius:
                      m.sender === "user"
                        ? "16px 16px 2px 16px"
                        : "16px 16px 16px 2px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    fontSize: 14,
                    lineHeight: 1.6,
                    whiteSpace: "pre-line",
                  }}
                >
                  {m.text}
                </Box>

                {/* Recommended Products cards in chat */}
                {m.recommendedProducts && m.recommendedProducts.length > 0 && (
                  <Box sx={{ mt: 1.5, display: "flex", flexDirection: "column", gap: 1 }}>
                    <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#2e7d32" }}>
                      🌿 {lang === "ko" ? "추천 농자재 및 약제:" : lang === "uz" ? "Tavsiya etilgan preparatlar:" : "Recommended Agro Products:"}
                    </Typography>
                    {m.recommendedProducts.map((p) => {
                      const img = p.productImages && p.productImages[0]
                        ? `${serverApi}/${p.productImages[0]}`
                        : "/img/fresh.webp";
                      return (
                        <Box
                          key={p._id}
                          sx={{
                            background: "#ffffff",
                            p: 1.2,
                            borderRadius: "10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                            border: "1px solid #e2e8f0",
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <img
                              src={img}
                              alt={p.productName}
                              style={{ width: 40, height: 40, borderRadius: 6, objectFit: "cover" }}
                            />
                            <Box>
                              <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                                {p.productName}
                              </Typography>
                              <Typography sx={{ fontSize: 12, color: "#2e7d32", fontWeight: 700 }}>
                                ${p.productPrice}
                              </Typography>
                            </Box>
                          </Box>
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            startIcon={<ShoppingCartIcon sx={{ fontSize: 14 }} />}
                            onClick={() => handleAddToCart(p)}
                            sx={{ textTransform: "none", fontSize: 11, py: 0.5, px: 1.2 }}
                          >
                            {t.addToCart}
                          </Button>
                        </Box>
                      );
                    })}
                  </Box>
                )}

                {/* Disclaimer */}
                {m.disclaimer && (
                  <Typography
                    sx={{
                      mt: 1,
                      fontSize: 10,
                      color: "#718096",
                      fontStyle: "italic",
                      lineHeight: 1.3,
                    }}
                  >
                    {m.disclaimer}
                  </Typography>
                )}
              </Box>
            ))}

            {isLoading && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 1 }}>
                <CircularProgress size={18} sx={{ color: "#2e7d32" }} />
                <Typography sx={{ fontSize: 12, color: "#718096" }}>
                  {lang === "ko" ? "아그로노미스트가 진단 중입니다..." : lang === "uz" ? "AI tashxis qo'ymoqda..." : "AI Agronomist is analyzing..."}
                </Typography>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input Footer */}
          <Box
            sx={{
              p: 1.5,
              background: "#ffffff",
              borderTop: "1px solid #edf2f7",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <TextField
              size="small"
              fullWidth
              placeholder={t.placeholder}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                  fontSize: 13,
                },
              }}
            />
            <IconButton
              onClick={() => setIsDoctorOpen(true)}
              title="Camera Scan Leaf Pathology"
              sx={{
                background: "#e8f5e9",
                color: "#2e7d32",
                "&:hover": { background: "#c8e6c9" },
              }}
            >
              <PhotoCameraIcon sx={{ fontSize: 20 }} />
            </IconButton>
            <IconButton
              color="success"
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputMessage.trim()}
              sx={{
                background: "#2e7d32",
                color: "#ffffff",
                "&:hover": { background: "#1b5e20" },
                "&.Mui-disabled": { background: "#e2e8f0", color: "#a0aec0" },
              }}
            >
              <SendIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        </Box>
      )}

      <PlantDoctorModal
        open={isDoctorOpen}
        onClose={() => setIsDoctorOpen(false)}
        onAdd={onAdd}
      />
    </>
  );
}
