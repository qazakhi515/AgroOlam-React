import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Chip,
  Button,
  Grid,
  TextField,
  MenuItem,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import EventRepeatIcon from "@mui/icons-material/EventRepeat";
import SendIcon from "@mui/icons-material/Send";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";

import TreatmentReminderService, {
  TreatmentReminder,
} from "../../services/TreatmentReminderService";
import { getSavedLanguage } from "../../../lib/i18n";
import { sweetTopSmallSuccessAlert } from "../../../lib/sweetAlert";

interface TreatmentReminderModalProps {
  open: boolean;
  onClose: () => void;
  orderId?: string;
  defaultProductName?: string;
  defaultCropName?: string;
}

const COMMON_CROPS = [
  "🍅 Pomidor (Tomato)",
  "🥒 Bodring (Cucumber)",
  "🥔 Kartoshka (Potato)",
  "🍎 Olma & Meva Bog'i (Apple)",
  "🍇 Uzum (Grape)",
  "🫑 Balgar Qalampiri (Pepper)",
  "🍓 Qulupnay (Strawberry)",
];

export default function TreatmentReminderModal({
  open,
  onClose,
  orderId,
  defaultProductName = "Ridomil Gold MZ 68 WG",
  defaultCropName = "Pomidor",
}: TreatmentReminderModalProps) {
  const lang = getSavedLanguage();

  const [customerName, setCustomerName] = useState<string>("Akbar Dehqon");
  const [customerPhone, setCustomerPhone] = useState<string>("+998 90 123 45 67");
  const [cropName, setCropName] = useState<string>(defaultCropName);
  const [productName, setProductName] = useState<string>(defaultProductName);
  const [intervalDays, setIntervalDays] = useState<number>(7);
  const [quarantineDays, setQuarantineDays] = useState<number>(14);
  const [channel] = useState<"SMS" | "TELEGRAM">("SMS");

  const [scheduledList, setScheduledList] = useState<TreatmentReminder[]>([]);

  // Sync defaults
  useEffect(() => {
    if (open) {
      if (defaultProductName) {
        setProductName(defaultProductName);
        const rule = TreatmentReminderService.getRuleForProduct(defaultProductName);
        setIntervalDays(rule.intervalDays);
        setQuarantineDays(rule.quarantineDays);
      }
      if (defaultCropName) {
        setCropName(defaultCropName);
      }
      loadReminders();
    }
  }, [open, defaultProductName, defaultCropName]);

  const loadReminders = () => {
    if (orderId) {
      setScheduledList(TreatmentReminderService.getRemindersForOrder(orderId));
    } else {
      setScheduledList(TreatmentReminderService.getAllReminders().slice(0, 4));
    }
  };

  const handleProductChange = (name: string) => {
    setProductName(name);
    const rule = TreatmentReminderService.getRuleForProduct(name);
    setIntervalDays(rule.intervalDays);
    setQuarantineDays(rule.quarantineDays);
  };

  const handleSchedule = () => {
    TreatmentReminderService.scheduleReminder({
      orderId,
      customerName,
      customerPhone,
      cropName,
      productName,
      intervalDays,
      quarantineDays,
      channel,
      lang,
    });

    loadReminders();
    sweetTopSmallSuccessAlert(
      lang === "ko"
        ? "치료 및 수확 안전 알림이 예약되었습니다!"
        : lang === "uz"
        ? "Eslatma muvaffaqiyatli rejalashtirildi!"
        : "Treatment & Quarantine reminder scheduled!",
      2000
    );
  };

  const handleDelete = (id: string) => {
    TreatmentReminderService.deleteReminder(id);
    loadReminders();
  };

  const handleShareTelegram = (reminder?: TreatmentReminder) => {
    const textToShare = reminder
      ? `${reminder.messageSpraying}\n\n${reminder.messageQuarantine}`
      : `🌿 AgroOlam Eslatmasi: ${customerName}, ${intervalDays} kun oldin olingan "${productName}" preparatini ${cropName} ekiniga 2-bosqich purkash vaqti keldi! (Karantin muddati: ${quarantineDays} kun).\nhttps://agroolam.tech`;

    const url = `https://t.me/share/url?url=${encodeURIComponent(
      "https://agroolam.tech"
    )}&text=${encodeURIComponent(textToShare)}`;
    window.open(url, "_blank");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "22px",
          background: "#ffffff",
          boxShadow: "0 24px 60px rgba(10, 40, 20, 0.25)",
          overflow: "hidden",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #14532d 0%, #166534 60%, #15803d 100%)",
          color: "#ffffff",
          p: 2.5,
          position: "relative",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            color: "rgba(255, 255, 255, 0.8)",
            "&:hover": { color: "#ffffff", backgroundColor: "rgba(255, 255, 255, 0.15)" },
          }}
        >
          <CloseIcon />
        </IconButton>

        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: "14px",
              background: "rgba(255, 255, 255, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <NotificationsActiveIcon sx={{ fontSize: 26, color: "#86efac" }} />
          </Box>
          <div>
            <Chip
              label="BullMQ Delayed Notification Engine"
              size="small"
              sx={{
                bgcolor: "rgba(134, 239, 172, 0.2)",
                color: "#bbf7d0",
                fontWeight: 800,
                fontSize: "10.5px",
                height: 20,
                mb: 0.3,
              }}
            />
            <Typography variant="h6" sx={{ fontWeight: 800, fontSize: "1.1rem" }}>
              {lang === "ko"
                ? "약제 2차 살포 및 수확 안전(PHI) 자동 알림"
                : lang === "uz"
                ? "2-Bosqich Purkash & Karantin Eslatmasi"
                : "Post-Purchase Treatment & Quarantine Reminder"}
            </Typography>
          </div>
        </Stack>
      </Box>

      {/* Main Content */}
      <DialogContent sx={{ p: 2.5, backgroundColor: "#f9fbf9" }}>
        {/* Form Inputs */}
        <Stack spacing={2} sx={{ mb: 3 }}>
          <Grid container spacing={1.5}>
            <Grid item xs={12} sm={6}>
              <TextField
                label={lang === "uz" ? "Dehqon ismi" : lang === "ko" ? "성명" : "Customer Name"}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label={lang === "uz" ? "Telefon raqami (SMS)" : lang === "ko" ? "연락처" : "Phone Number"}
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                size="small"
                fullWidth
              />
            </Grid>
          </Grid>

          <Grid container spacing={1.5}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label={lang === "uz" ? "Ekin turi" : lang === "ko" ? "작물 종류" : "Crop"}
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                size="small"
                fullWidth
              >
                {COMMON_CROPS.map((c, i) => (
                  <MenuItem key={i} value={c.split(" ")[1] || c}>
                    {c}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label={lang === "uz" ? "Dori vositasi" : lang === "ko" ? "약제명" : "Medicine"}
                value={productName}
                onChange={(e) => handleProductChange(e.target.value)}
                size="small"
                fullWidth
              />
            </Grid>
          </Grid>

          {/* Timing Chips */}
          <Box sx={{ p: 1.8, borderRadius: "14px", bgcolor: "#f0fdf4", border: "1px solid #bbf7d0" }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: "#166534", display: "block", mb: 1 }}>
              ⏰ {lang === "ko" ? "알림 주기 및 안전 기준:" : lang === "uz" ? "Takroriy ishlov va kutish davri:" : "Interval & Safety Schedule:"}
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="caption" sx={{ color: "#4b5563" }}>
                  {lang === "uz" ? "2-purkash muddati:" : lang === "ko" ? "2차 살포 주기:" : "2nd Spraying in:"}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                  {[7, 10, 14].map((days) => (
                    <Chip
                      key={days}
                      label={`${days} ${lang === "uz" ? "kun" : lang === "ko" ? "일" : "d"}`}
                      size="small"
                      onClick={() => setIntervalDays(days)}
                      sx={{
                        fontWeight: 800,
                        cursor: "pointer",
                        bgcolor: intervalDays === days ? "#166534" : "#ffffff",
                        color: intervalDays === days ? "#ffffff" : "#166534",
                        border: "1px solid #166534",
                      }}
                    />
                  ))}
                </Stack>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="caption" sx={{ color: "#4b5563" }}>
                  {lang === "uz" ? "Karantin (Kutish) davri:" : lang === "ko" ? "수확 안전(PHI):" : "Pre-Harvest (PHI):"}
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#991b1b", mt: 0.5 }}>
                  🛡️ {quarantineDays} {lang === "uz" ? "kun (hosil terishgacha)" : lang === "ko" ? "일간 수확 금지" : "days quarantine"}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Stack>

        {/* AI Message Preview */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" sx={{ fontWeight: 800, color: "#4b5563", textTransform: "uppercase", display: "block", mb: 1 }}>
            📱 {lang === "ko" ? "발송될 알림 메시지 미리보기:" : lang === "uz" ? "Mijozga boruvchi SMS matnlari:" : "Scheduled Message Previews:"}
          </Typography>

          <Box sx={{ p: 1.5, borderRadius: "12px", bgcolor: "#f8fafc", border: "1px solid #e2e8f0", mb: 1.5 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
              <EventRepeatIcon sx={{ fontSize: 16, color: "#059669" }} />
              <Typography variant="caption" sx={{ fontWeight: 800, color: "#065f46" }}>
                1-XABAR ({intervalDays} kundan so'ng): 2-Bosqich Purkash Eslatmasi
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ fontSize: "0.82rem", color: "#334155", lineHeight: 1.45 }}>
              Assalomu alaykum, {customerName}! {intervalDays} kun oldin olingan "{productName}" dorisini {cropName} ekiniga 2-marta sepish vaqti keldi. Barglardagi zang yoki dog'lar to'xtaganini tekshiring.
            </Typography>
          </Box>

          <Box sx={{ p: 1.5, borderRadius: "12px", bgcolor: "#fffbeb", border: "1px solid #fde68a" }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
              <ShieldOutlinedIcon sx={{ fontSize: 16, color: "#d97706" }} />
              <Typography variant="caption" sx={{ fontWeight: 800, color: "#92400e" }}>
                2-XABAR ({quarantineDays} kundan so'ng): Karantin Tugashi & Xavfsiz Hosil
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ fontSize: "0.82rem", color: "#78350f", lineHeight: 1.45 }}>
              {customerName}, "{productName}" dori vositasining {quarantineDays} kunlik karantin muddati tugadi. {cropName} hosilini xavfsiz terib, bozorga chiqarishingiz mumkin!
            </Typography>
          </Box>
        </Box>

        {/* Existing Scheduled Reminders List */}
        {scheduledList.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: "#166534", display: "block", mb: 1 }}>
              📋 {lang === "uz" ? "Faol Eslatmalar Ro'yxati" : lang === "ko" ? "예약된 알림 목록" : "Active Scheduled Reminders"} ({scheduledList.length} ta)
            </Typography>

            <Stack spacing={1}>
              {scheduledList.map((rem) => (
                <Box
                  key={rem.id}
                  sx={{
                    p: 1.2,
                    borderRadius: "10px",
                    bgcolor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: "12px", color: "#0f172a" }}>
                      {rem.productName} • {rem.cropName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#64748b" }}>
                      2-purkash: <strong>{rem.secondSprayingDate}</strong> | Hosil: <strong>{rem.harvestSafeDate}</strong>
                    </Typography>
                  </div>

                  <Stack direction="row" spacing={0.5}>
                    <IconButton size="small" onClick={() => handleShareTelegram(rem)} sx={{ color: "#0088cc" }}>
                      <SendIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(rem.id)} sx={{ color: "#ef4444" }}>
                      <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Box>
        )}

        {/* Action Button */}
        <Button
          fullWidth
          variant="contained"
          onClick={handleSchedule}
          startIcon={<NotificationsActiveIcon />}
          sx={{
            py: 1.3,
            borderRadius: "12px",
            bgcolor: "#166534",
            color: "#ffffff",
            fontWeight: 800,
            textTransform: "none",
            fontSize: "13px",
            boxShadow: "0 4px 14px rgba(22, 101, 52, 0.3)",
            "&:hover": { bgcolor: "#14532d" },
          }}
        >
          {lang === "ko"
            ? "⏰ 자동 알림 스케줄링 (BullMQ 큐 등록)"
            : lang === "uz"
            ? "⏰ Eslatmani Yoqish (Avtomatik SMS & Telegram)"
            : "⏰ Activate Automated Reminder (Queue Job)"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
