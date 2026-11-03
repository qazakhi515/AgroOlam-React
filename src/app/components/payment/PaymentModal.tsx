import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Box,
  Typography,
  CircularProgress,
  Tabs,
  Tab,
  IconButton,
  Divider,
  Chip,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LockIcon from "@mui/icons-material/Lock";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PaymentIcon from "@mui/icons-material/Payment";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { Order } from "../../../lib/types/order";
import { getSavedLanguage } from "../../../lib/i18n";

interface PaymentModalProps {
  open: boolean;
  order: Order | null;
  onClose: () => void;
  onPaymentSuccess: (orderId: string) => Promise<void>;
}

const USD_TO_UZS_RATE = 12850;

export default function PaymentModal({
  open,
  order,
  onClose,
  onPaymentSuccess,
}: PaymentModalProps) {
  const lang = getSavedLanguage();
  const [tabIndex, setTabIndex] = useState(0);

  // International / Korea Card state
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardHolder, setCardHolder] = useState("");

  // Uzbekistan Payme / Click Card state
  const [uzCardNumber, setUzCardNumber] = useState("");
  const [uzCardExpiry, setUzCardExpiry] = useState("");
  const [uzCardPhone, setUzCardPhone] = useState("+998 ");
  const [smsCode, setSmsCode] = useState("");
  const [smsSent, setSmsSent] = useState(false);

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<"TOSS" | "PAYME" | "CLICK" | "BANK">("TOSS");

  // Detect card type for Uzbekistan cards (8600 -> Uzcard, 9860 -> Humo)
  const uzCardType = useMemo(() => {
    const clean = uzCardNumber.replace(/\s/g, "");
    if (clean.startsWith("8600")) return "UZCARD";
    if (clean.startsWith("9860")) return "HUMO";
    return null;
  }, [uzCardNumber]);

  if (!order) return null;

  const totalUZS = (order.orderTotal * USD_TO_UZS_RATE).toLocaleString("uz-UZ");

  // Format international card number with spaces (4-4-4-4)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 16);
    val = val.replace(/(.{4})/g, "$1 ").trim();
    setCardNumber(val);
  };

  // Format Uzcard/Humo number
  const handleUzCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 16);
    val = val.replace(/(.{4})/g, "$1 ").trim();
    setUzCardNumber(val);
  };

  // Format expiry date (MM/YY)
  const handleExpiryChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (val.length >= 2) {
      val = val.slice(0, 2) + "/" + val.slice(2);
    }
    setter(val);
  };

  const handleSendSms = () => {
    setSmsSent(true);
    setSmsCode("7891"); // Simulated SMS OTP
  };

  const handlePay = async (provider: "TOSS" | "PAYME" | "CLICK" | "BANK") => {
    setSelectedProvider(provider);
    setIsProcessing(true);
    setTimeout(async () => {
      try {
        const prefix = provider === "TOSS" ? "TOSS-" : provider === "PAYME" ? "PAYME-" : "AGRO-";
        const txId = prefix + Math.random().toString(36).substring(2, 9).toUpperCase();
        setTransactionId(txId);
        await onPaymentSuccess(order._id);
        setIsProcessing(false);
        setIsSuccess(true);
      } catch (err) {
        setIsProcessing(false);
      }
    }, 1200);
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setCardNumber("");
    setCardExpiry("");
    setCardCvv("");
    setCardHolder("");
    setUzCardNumber("");
    setUzCardExpiry("");
    setSmsSent(false);
    setSmsCode("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleResetAndClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: "16px", p: 1 },
      }}
    >
      {!isSuccess ? (
        <>
          <DialogTitle sx={{ m: 0, p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <CreditCardIcon sx={{ color: "#2e7d32", fontSize: 28 }} />
              <Typography variant="h6" fontWeight={700}>
                {lang === "ko" ? "하이브리드 안전 결제 (Hybrid Gateway)" : lang === "uz" ? "Xavfsiz Gibrid To'lov (Hybrid Gateway)" : "Secure Hybrid Checkout"}
              </Typography>
            </Stack>
            <IconButton onClick={handleResetAndClose}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent dividers sx={{ p: 2.5 }}>
            {/* Order Summary Box with Dual Currency */}
            <Box
              sx={{
                p: 2,
                mb: 2.5,
                bgcolor: "#f1f8e9",
                border: "1px solid #c8e6c9",
                borderRadius: "10px",
              }}
            >
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                <Typography variant="body2" color="text.secondary">
                  {lang === "ko" ? "주문 번호" : lang === "uz" ? "Buyurtma ID" : "Order ID"}:
                </Typography>
                <Typography variant="body2" fontWeight={700}>
                  #{order._id.slice(-8).toUpperCase()}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                <Typography variant="body2" color="text.secondary">
                  {lang === "ko" ? "배송비" : lang === "uz" ? "Yetkazib berish" : "Delivery fee"}:
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  ${order.orderDelivery || 0}
                </Typography>
              </Stack>
              <Divider sx={{ my: 1 }} />
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <div>
                  <Typography variant="subtitle2" fontWeight={700} color="#1b5e20">
                    {lang === "ko" ? "총 결제 금액 (USD)" : lang === "uz" ? "Jami summa (USD)" : "Total (USD)"}:
                  </Typography>
                  <Typography variant="h5" fontWeight={800} color="#2e7d32">
                    ${order.orderTotal}
                  </Typography>
                </div>
                <div style={{ textAlign: "right" }}>
                  <Typography variant="caption" color="text.secondary">
                    {lang === "uz" ? "So'mda (UZS ekvivalenti):" : "In UZS (Approx):"}
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={700} color="#e65100">
                    {totalUZS} UZS
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                    (1 USD ≈ 12,850 UZS)
                  </Typography>
                </div>
              </Stack>
            </Box>

            {/* Hybrid Gateway Tabs */}
            <Tabs
              value={tabIndex}
              onChange={(e, val) => setTabIndex(val)}
              variant="fullWidth"
              sx={{ mb: 2, "& .MuiTab-root": { textTransform: "none", fontWeight: 700 } }}
            >
              <Tab
                icon={<PaymentIcon />}
                label={lang === "ko" ? "🇰🇷 토스 / 글로벌 카드" : "🇰🇷 Toss / Global ($)"}
              />
              <Tab
                icon={<CreditCardIcon />}
                label={lang === "uz" ? "🇺🇿 Payme / Click (UZS)" : "🇺🇿 Payme / Click (UZS)"}
              />
              <Tab
                icon={<AccountBalanceIcon />}
                label={lang === "ko" ? "계좌이체 / Paynet" : "Bank / Paynet"}
              />
            </Tabs>

            {/* TAB 0: TOSS PAYMENTS & GLOBAL CARDS */}
            {tabIndex === 0 && (
              <Stack spacing={2}>
                <Box sx={{ p: 1.5, bgcolor: "#e3f2fd", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip label="TOSS" size="small" sx={{ bgcolor: "#0064FF", color: "#fff", fontWeight: 800 }} />
                    <Typography variant="body2" fontWeight={600} color="#0d47a1">
                      Toss Payments Sandbox (Korea & Global)
                    </Typography>
                  </Stack>
                  <Typography variant="caption" color="text.secondary">Visa / Master / Shinhan</Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 1 }}>
                  <Chip
                    label="⚡ Test Visa (4000...)"
                    size="small"
                    clickable
                    onClick={() => {
                      setCardNumber("4000 1234 5678 9010");
                      setCardExpiry("12/28");
                      setCardCvv("789");
                      setCardHolder("AKHMADJON USMONOV");
                    }}
                    sx={{ bgcolor: "#E0E7FF", color: "#4338CA", fontWeight: 700, fontSize: 11 }}
                  />
                </Box>

                <TextField
                  label="Card Number"
                  placeholder="4000 1234 5678 9010"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  fullWidth
                  size="small"
                  InputProps={{
                    startAdornment: <CreditCardIcon sx={{ mr: 1, color: "text.secondary" }} />,
                  }}
                />
                <Stack direction="row" spacing={2}>
                  <TextField
                    label="Expiry Date"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={handleExpiryChange(setCardExpiry)}
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label="CVV / CVC"
                    placeholder="123"
                    type="password"
                    inputProps={{ maxLength: 4 }}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                    fullWidth
                    size="small"
                  />
                </Stack>
                <TextField
                  label="Cardholder Name"
                  placeholder="HONG GILDONG"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                  fullWidth
                  size="small"
                />
              </Stack>
            )}

            {/* TAB 1: UZBEKISTAN PAYME / CLICK (UZS) */}
            {tabIndex === 1 && (
              <Stack spacing={2}>
                <Box sx={{ p: 1.5, bgcolor: "#e8f5e9", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip label="PAYME" size="small" sx={{ bgcolor: "#00CCCC", color: "#fff", fontWeight: 800 }} />
                    <Chip label="CLICK" size="small" sx={{ bgcolor: "#007AFF", color: "#fff", fontWeight: 800 }} />
                    <Typography variant="body2" fontWeight={600} color="#1b5e20">
                      O'zbekiston Milliy To'lov Tizimi
                    </Typography>
                  </Stack>
                  {uzCardType && (
                    <Chip
                      label={uzCardType}
                      color={uzCardType === "UZCARD" ? "primary" : "secondary"}
                      size="small"
                      sx={{ fontWeight: 800 }}
                    />
                  )}
                </Box>

                <Stack direction="row" spacing={1}>
                  <Chip
                    label="⚡ Test Uzcard (8600...)"
                    size="small"
                    clickable
                    onClick={() => {
                      setUzCardNumber("8600 4512 8890 1234");
                      setUzCardExpiry("12/28");
                      setUzCardPhone("+998 90 123 45 67");
                      setSmsSent(true);
                      setSmsCode("7891");
                    }}
                    sx={{ bgcolor: "#E0F2FE", color: "#0369A1", fontWeight: 700, fontSize: 11 }}
                  />
                  <Chip
                    label="⚡ Test Humo (9860...)"
                    size="small"
                    clickable
                    onClick={() => {
                      setUzCardNumber("9860 1200 4589 7712");
                      setUzCardExpiry("08/29");
                      setUzCardPhone("+998 93 987 65 43");
                      setSmsSent(true);
                      setSmsCode("7891");
                    }}
                    sx={{ bgcolor: "#FCE7F3", color: "#BE185D", fontWeight: 700, fontSize: 11 }}
                  />
                </Stack>

                <TextField
                  label="Uzcard yoki Humo karta raqami"
                  placeholder="8600 0000 0000 0000 yoki 9860 ..."
                  value={uzCardNumber}
                  onChange={handleUzCardNumberChange}
                  fullWidth
                  size="small"
                  helperText="8600 (Uzcard) yoki 9860 (Humo)"
                />

                <Stack direction="row" spacing={2}>
                  <TextField
                    label="Amal qilish muddati"
                    placeholder="MM/YY"
                    value={uzCardExpiry}
                    onChange={handleExpiryChange(setUzCardExpiry)}
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label="Bog'langan telefon"
                    value={uzCardPhone}
                    onChange={(e) => setUzCardPhone(e.target.value)}
                    fullWidth
                    size="small"
                  />
                </Stack>

                {!smsSent ? (
                  <Button
                    variant="outlined"
                    onClick={handleSendSms}
                    disabled={uzCardNumber.replace(/\s/g, "").length < 16}
                    sx={{ textTransform: "none", fontWeight: 700, borderColor: "#2e7d32", color: "#2e7d32" }}
                  >
                    📲 SMS Tasdiqlash Kodini Olish (Simulyatsiya)
                  </Button>
                ) : (
                  <Box sx={{ p: 1.5, bgcolor: "#fffde7", border: "1px dashed #fbc02d", borderRadius: "8px" }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                      Telefoningizga SMS kod yuborildi: <strong>7891</strong> (Avtomatik to'ldirildi)
                    </Typography>
                    <TextField
                      label="SMS Tasdiqlash Kodi"
                      value={smsCode}
                      onChange={(e) => setSmsCode(e.target.value)}
                      size="small"
                      fullWidth
                    />
                  </Box>
                )}
              </Stack>
            )}

            {/* TAB 2: BANK TRANSFER & PAYNET KIOSK */}
            {tabIndex === 2 && (
              <Box sx={{ p: 2, bgcolor: "#fafafa", borderRadius: "8px" }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                  Bank orqali to'lov yoki Paynet Terminal:
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  🇰🇷 <strong>Korea</strong>: Shinhan Bank: <code>110-345-678901</code> (AgroOlam Global Inc.)
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  🇺🇿 <strong>Uzbekistan</strong>: Agrobank: <code>2020 8000 9005 1234 5001</code> (AgroOlam MCHJ)
                </Typography>
                <Alert severity="info" sx={{ fontSize: "12px" }}>
                  Dorixonadagi Paynet kioskida <strong>AgroOlam</strong> xizmatini tanlab, buyurtma ID raqamingizni kiriting.
                </Alert>
              </Box>
            )}

            <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" sx={{ mt: 2.5 }}>
              <LockIcon sx={{ fontSize: 16, color: "#4caf50" }} />
              <Typography variant="caption" color="text.secondary">
                256-Bit SSL Encrypted & PCI-DSS Certified Hybrid Payment Gateway
              </Typography>
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleResetAndClose} color="inherit">
              {lang === "ko" ? "취소" : lang === "uz" ? "Bekor qilish" : "Cancel"}
            </Button>
            <Button
              variant="contained"
              onClick={() => handlePay(tabIndex === 0 ? "TOSS" : tabIndex === 1 ? "PAYME" : "BANK")}
              disabled={isProcessing}
              sx={{
                bgcolor: "#2e7d32",
                "&:hover": { bgcolor: "#1b5e20" },
                px: 3,
                fontWeight: 700,
              }}
            >
              {isProcessing ? (
                <CircularProgress size={22} sx={{ color: "#fff" }} />
              ) : tabIndex === 1 ? (
                `To'lash: ${totalUZS} UZS`
              ) : (
                `Pay $${order.orderTotal} USD`
              )}
            </Button>
          </DialogActions>
        </>
      ) : (
        /* Success Receipt Dialog with Full Invoice */
        <Box sx={{ p: 4, textAlign: "center" }}>
          <CheckCircleOutlineIcon sx={{ fontSize: 64, color: "#2e7d32", mb: 1.5 }} />
          <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>
            {lang === "ko" ? "결제가 성공적으로 완료되었습니다!" : lang === "uz" ? "To'lov Muvaffaqiyatli Amalga Oshirildi!" : "Payment Successful!"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {selectedProvider === "TOSS" ? "Toss Payments (Korea & Global)" : selectedProvider === "PAYME" ? "Payme / Uzcard (Uzbekistan)" : "AgroBank Electronic Wire"} orqali tasdiqlandi.
          </Typography>

          {/* Printable Invoice Card */}
          <Box
            sx={{
              p: 2.5,
              mb: 3,
              bgcolor: "#f9fbe7",
              border: "1px dashed #9e9d24",
              borderRadius: "10px",
              textAlign: "left",
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
              <ReceiptIcon sx={{ color: "#558b2f", fontSize: 20 }} />
              <Typography variant="subtitle2" fontWeight={800} color="#33691e">
                AgroOlam (agroolam.tech) Official E-Receipt / Invoice
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary">Transaction ID:</Typography>
              <Typography variant="caption" fontWeight={700} sx={{ fontFamily: "monospace" }}>{transactionId}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary">Provider:</Typography>
              <Typography variant="caption" fontWeight={700}>{selectedProvider} Gateway</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary">Order Total (USD):</Typography>
              <Typography variant="caption" fontWeight={700}>${order.orderTotal}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary">Total in UZS:</Typography>
              <Typography variant="caption" fontWeight={700}>{totalUZS} UZS</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" color="text.secondary">Timestamp:</Typography>
              <Typography variant="caption" fontWeight={700}>{new Date().toLocaleString()}</Typography>
            </Stack>
          </Box>

          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="outlined"
              onClick={() => window.print()}
              sx={{ borderColor: "#2e7d32", color: "#2e7d32", px: 3, fontWeight: 700 }}
            >
              🖨️ Chekni chop etish
            </Button>
            <Button
              variant="contained"
              onClick={handleResetAndClose}
              sx={{ bgcolor: "#2e7d32", "&:hover": { bgcolor: "#1b5e20" }, px: 4, fontWeight: 700 }}
            >
              {lang === "ko" ? "확인" : lang === "uz" ? "Tayyor" : "Done"}
            </Button>
          </Stack>
        </Box>
      )}
    </Dialog>
  );
}
