import React, { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  TextField,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import TelegramIcon from "@mui/icons-material/Telegram";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloseIcon from "@mui/icons-material/Close";
import TelegramService, { TelegramStatusResponse } from "../../services/TelegramService";
import { useGlobals } from "../hooks/useGlobals";
import { getSavedLanguage, Language } from "../../../lib/i18n";
import { sweetErrorHandling, sweetTopSuccessAlert } from "../../../lib/sweetAlert";

export default function TelegramAlertCard() {
  const { authMember } = useGlobals();
  const [lang] = useState<Language>(getSavedLanguage());
  const [loading, setLoading] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<TelegramStatusResponse | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [manualChatId, setManualChatId] = useState<string>("");
  const [manualUsername, setManualUsername] = useState<string>("");

  const telegramService = new TelegramService();

  const fetchStatus = async () => {
    if (!authMember) return;
    try {
      setLoading(true);
      const res = await telegramService.getStatus();
      setStatus(res);
      if (res.telegramChatId) {
        setManualChatId(res.telegramChatId);
      }
      if (res.telegramUsername) {
        setManualUsername(res.telegramUsername);
      }
    } catch (err) {
      console.log("Error loading telegram status:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authMember]);

  const handleLink = async () => {
    if (!manualChatId.trim()) {
      sweetErrorHandling(
        lang === "uz"
          ? "Telegram Chat ID kiritilishi shart!"
          : lang === "ko"
          ? "텔레그램 Chat ID를 입력해주세요!"
          : "Telegram Chat ID is required!"
      );
      return;
    }

    try {
      setActionLoading(true);
      const res = await telegramService.linkTelegram(
        manualChatId.trim(),
        manualUsername.trim()
      );
      await sweetTopSuccessAlert(res.message || "Telegram connected!", 1200);
      setDialogOpen(false);
      await fetchStatus();
    } catch (err: any) {
      sweetErrorHandling(err.response?.data?.message || "Telegram linking failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendTest = async () => {
    try {
      setActionLoading(true);
      const res = await telegramService.sendTestAlert();
      await sweetTopSuccessAlert(
        res.message ||
          (lang === "uz"
            ? "Sinov eslatmasi Telegramga yuborildi!"
            : "Test alert sent to your Telegram!"),
        1500
      );
    } catch (err: any) {
      sweetErrorHandling(
        err.response?.data?.message || "Failed to deliver test reminder"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const botName = status?.botUsername || "AgroPlantBot";
  const startDeepLink = authMember
    ? `https://t.me/${botName}?start=${authMember._id}`
    : `https://t.me/${botName}`;

  if (!authMember) return null;

  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        p: 2.5,
        mt: 2,
        boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        border: "1px solid #e2e8f0",
      }}
    >
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 1.5 }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: "10px",
              bgcolor: "#0088cc15",
              color: "#0088cc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TelegramIcon fontSize="medium" />
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" color="#1e293b">
              {lang === "uz"
                ? "Telegram Agro-Eslatuvchi"
                : lang === "ko"
                ? "텔레그램 방제 알림봇"
                : "Telegram Agro-Reminder"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {lang === "uz"
                ? "Dorilash & Oziqlantirish signallari"
                : lang === "ko"
                ? "재방제 (9일차) 및 시비 (14일차) 푸시알림"
                : "Post-purchase 2nd spray & feeding alerts"}
            </Typography>
          </Box>
        </Stack>

        <IconButton size="small" onClick={fetchStatus} disabled={loading}>
          <RefreshIcon
            fontSize="small"
            sx={{
              transform: loading ? "rotate(180deg)" : "none",
              transition: "transform 0.5s",
            }}
          />
        </IconButton>
      </Stack>

      {/* Status Badge */}
      <Box sx={{ mb: 2 }}>
        {status?.isConnected ? (
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              icon={<CheckCircleOutlineIcon />}
              label={
                lang === "uz"
                  ? "Bot Ulangan (Faol)"
                  : lang === "ko"
                  ? "봇 연동 완료 (활성)"
                  : "Connected & Active"
              }
              color="success"
              size="small"
              sx={{ fontWeight: "bold" }}
            />
            {status.telegramUsername && (
              <Chip
                label={`@${status.telegramUsername.replace("@", "")}`}
                size="small"
                variant="outlined"
              />
            )}
          </Stack>
        ) : (
          <Chip
            label={
              lang === "uz"
                ? "Bot Hali Ulanmagan"
                : lang === "ko"
                ? "텔레그램 미연동 상태"
                : "Not Connected"
            }
            color="warning"
            size="small"
            sx={{ fontWeight: "medium" }}
          />
        )}
      </Box>

      {/* Feature explanation pills */}
      <Stack spacing={1} sx={{ mb: 2.5 }}>
        <Box
          sx={{
            p: 1.2,
            borderRadius: "8px",
            bgcolor: "#f0fdf4",
            border: "1px solid #bbf7d0",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <span style={{ fontSize: "16px" }}>🌿</span>
          <Typography variant="caption" color="#166534" fontWeight="500">
            {lang === "uz"
              ? "9-kuni: Kasallikka qarshi 2-marta profilaktik purkash vaqti eslatiladi."
              : lang === "ko"
              ? "구매 후 9일차: 병해충 재감염 방지 2차 살포 알림"
              : "Day 9: Automatic 2nd spray reminder to prevent re-infection"}
          </Typography>
        </Box>

        <Box
          sx={{
            p: 1.2,
            borderRadius: "8px",
            bgcolor: "#eff6ff",
            border: "1px solid #bfdbfe",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <span style={{ fontSize: "16px" }}>🌾</span>
          <Typography variant="caption" color="#1e40af" fontWeight="500">
            {lang === "uz"
              ? "14-kuni: Ildiz va bargdan minerallar bilan oziqlantirish tavsiyasi."
              : lang === "ko"
              ? "구매 후 14일차: 영양제 및 복합비료 토양 관주 시기 안내"
              : "Day 14: Soil & foliar nutrient feeding advisory"}
          </Typography>
        </Box>
      </Stack>

      {/* Action Buttons */}
      <Stack spacing={1}>
        <Button
          variant="contained"
          fullWidth
          href={startDeepLink}
          target="_blank"
          rel="noopener noreferrer"
          startIcon={<TelegramIcon />}
          sx={{
            bgcolor: "#0088cc",
            "&:hover": { bgcolor: "#0077b5" },
            textTransform: "none",
            fontWeight: "bold",
            borderRadius: "10px",
            py: 1,
          }}
        >
          {lang === "uz"
            ? "📲 Telegram Botni Ochish (@" + botName + ")"
            : lang === "ko"
            ? "📲 텔레그램 봇 열기 (@" + botName + ")"
            : "📲 Open Telegram Bot (@" + botName + ")"}
        </Button>

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => setDialogOpen(true)}
            sx={{
              textTransform: "none",
              borderRadius: "10px",
              borderColor: "#cbd5e1",
              color: "#334155",
              fontSize: "12px",
            }}
          >
            {lang === "uz"
              ? "Chat ID orqali ulash"
              : lang === "ko"
              ? "Chat ID 직접 등록"
              : "Connect by Chat ID"}
          </Button>

          {status?.isConnected && (
            <Button
              variant="outlined"
              color="success"
              fullWidth
              disabled={actionLoading}
              onClick={handleSendTest}
              startIcon={
                actionLoading ? (
                  <CircularProgress size={16} />
                ) : (
                  <NotificationsActiveIcon fontSize="small" />
                )
              }
              sx={{
                textTransform: "none",
                borderRadius: "10px",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              {lang === "uz"
                ? "Sinov xabari"
                : lang === "ko"
                ? "테스트 발송"
                : "Test Alert"}
            </Button>
          )}
        </Stack>
      </Stack>

      {/* Manual Chat ID Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px", p: 1 } }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pb: 1,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <TelegramIcon sx={{ color: "#0088cc" }} />
            <Typography variant="h6" fontWeight="bold">
              {lang === "uz"
                ? "Telegram Chat ID Ulash"
                : lang === "ko"
                ? "텔레그램 Chat ID 연동"
                : "Connect Telegram Chat ID"}
            </Typography>
          </Stack>
          <IconButton size="small" onClick={() => setDialogOpen(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {lang === "uz"
              ? "Telegram'da @userinfobot ga /start deb yozing va berilgan raqamli Chat ID'ni bu yerga kiriting:"
              : lang === "ko"
              ? "텔레그램 @userinfobot에 /start를 입력하여 발급된 숫자 Chat ID를 입력하세요:"
              : "Send /start to @userinfobot on Telegram to get your numeric Chat ID and enter it below:"}
          </Typography>

          <TextField
            fullWidth
            label="Telegram Chat ID"
            placeholder="masalan: 123456789"
            value={manualChatId}
            onChange={(e) => setManualChatId(e.target.value)}
            size="small"
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label={lang === "uz" ? "Telegram Username (ixtiyoriy)" : "Username (optional)"}
            placeholder="@farmer_uz"
            value={manualUsername}
            onChange={(e) => setManualUsername(e.target.value)}
            size="small"
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setDialogOpen(false)}
            sx={{ textTransform: "none", color: "#64748b" }}
          >
            {lang === "uz" ? "Bekor qilish" : "Cancel"}
          </Button>
          <Button
            variant="contained"
            onClick={handleLink}
            disabled={actionLoading}
            sx={{
              bgcolor: "#0088cc",
              "&:hover": { bgcolor: "#0077b5" },
              textTransform: "none",
              borderRadius: "8px",
              px: 3,
            }}
          >
            {actionLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : lang === "uz" ? (
              "Saqlash & Ulash"
            ) : (
              "Save & Connect"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
