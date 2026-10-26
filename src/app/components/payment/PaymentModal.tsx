import React, { useState } from "react";
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LockIcon from "@mui/icons-material/Lock";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { Order } from "../../../lib/types/order";
import { getSavedLanguage } from "../../../lib/i18n";

interface PaymentModalProps {
  open: boolean;
  order: Order | null;
  onClose: () => void;
  onPaymentSuccess: (orderId: string) => Promise<void>;
}

export default function PaymentModal({
  open,
  order,
  onClose,
  onPaymentSuccess,
}: PaymentModalProps) {
  const lang = getSavedLanguage();
  const [tabIndex, setTabIndex] = useState(0);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState("");

  if (!order) return null;

  // Format card number with spaces (4-4-4-4)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 16);
    val = val.replace(/(.{4})/g, "$1 ").trim();
    setCardNumber(val);
  };

  // Format expiry date (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (val.length >= 2) {
      val = val.slice(0, 2) + "/" + val.slice(2);
    }
    setCardExpiry(val);
  };

  const handlePay = async () => {
    setIsProcessing(true);
    // Simulate real gateway processing latency
    setTimeout(async () => {
      try {
        const txId = "TXN-" + Math.random().toString(36).substring(2, 10).toUpperCase();
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
                {lang === "ko" ? "안전 결제 (Secure Checkout)" : lang === "uz" ? "Xavfsiz To'lov (Secure Checkout)" : "Secure Checkout"}
              </Typography>
            </Stack>
            <IconButton onClick={handleResetAndClose}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent dividers sx={{ p: 2.5 }}>
            {/* Order Summary Box */}
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
                <Typography variant="body2" fontWeight={600}>
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
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="subtitle1" fontWeight={700}>
                  {lang === "ko" ? "총 결제 금액" : lang === "uz" ? "Jami to'lov" : "Total Amount"}:
                </Typography>
                <Typography variant="h6" fontWeight={800} color="#2e7d32">
                  ${order.orderTotal}
                </Typography>
              </Stack>
            </Box>

            {/* Payment Methods */}
            <Tabs
              value={tabIndex}
              onChange={(e, val) => setTabIndex(val)}
              variant="fullWidth"
              sx={{ mb: 2, "& .MuiTab-root": { textTransform: "none", fontWeight: 700 } }}
            >
              <Tab icon={<CreditCardIcon />} label="Credit / Debit Card" />
              <Tab icon={<AccountBalanceIcon />} label="Toss / Kakao / Bank" />
            </Tabs>

            {tabIndex === 0 ? (
              <Stack spacing={2}>
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
                    onChange={handleExpiryChange}
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
                  placeholder="JOHN DOE"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                  fullWidth
                  size="small"
                />
              </Stack>
            ) : (
              <Box sx={{ p: 2, bgcolor: "#fafafa", borderRadius: "8px", textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                  {lang === "ko"
                    ? "한국 토스페이, 카카오페이 또는 계좌이체 시뮬레이션입니다."
                    : "Simulated instant electronic transfer (Toss / KakaoPay / Instant Bank)."}
                </Typography>
                <Typography variant="subtitle2" fontWeight={700} color="#1565c0">
                  Account: Shinhan Bank 110-345-678901 (AgroPlant Global Inc.)
                </Typography>
              </Box>
            )}

            <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" sx={{ mt: 2.5 }}>
              <LockIcon sx={{ fontSize: 16, color: "#4caf50" }} />
              <Typography variant="caption" color="text.secondary">
                256-Bit SSL Encrypted & PCI-DSS Level 1 Certified Checkout
              </Typography>
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleResetAndClose} color="inherit">
              {lang === "ko" ? "취소" : lang === "uz" ? "Bekor qilish" : "Cancel"}
            </Button>
            <Button
              variant="contained"
              onClick={handlePay}
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
              ) : (
                `Pay $${order.orderTotal}`
              )}
            </Button>
          </DialogActions>
        </>
      ) : (
        /* Success Receipt Dialog */
        <Box sx={{ p: 4, textAlign: "center" }}>
          <CheckCircleOutlineIcon sx={{ fontSize: 64, color: "#2e7d32", mb: 1.5 }} />
          <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>
            {lang === "ko" ? "결제가 완료되었습니다!" : lang === "uz" ? "To'lov muvaffaqiyatli amalga oshirildi!" : "Payment Successful!"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {lang === "ko"
              ? "주문이 접수되었으며 출고 준비가 시작됩니다."
              : lang === "uz"
              ? "Buyurtmangiz qabul qilindi va yetkazib berishga tayyorlanmoqda."
              : "Your order has been confirmed and transferred to processing."}
          </Typography>

          <Box
            sx={{
              p: 2,
              mb: 3,
              bgcolor: "#f9fbe7",
              border: "1px dashed #9e9d24",
              borderRadius: "8px",
              textAlign: "left",
            }}
          >
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography variant="caption" color="text.secondary">Transaction ID:</Typography>
              <Typography variant="caption" fontWeight={700}>{transactionId}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography variant="caption" color="text.secondary">Order Amount:</Typography>
              <Typography variant="caption" fontWeight={700}>${order.orderTotal}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" color="text.secondary">Date & Time:</Typography>
              <Typography variant="caption" fontWeight={700}>{new Date().toLocaleString()}</Typography>
            </Stack>
          </Box>

          <Button
            variant="contained"
            onClick={handleResetAndClose}
            sx={{ bgcolor: "#2e7d32", "&:hover": { bgcolor: "#1b5e20" }, px: 4 }}
          >
            {lang === "ko" ? "확인" : lang === "uz" ? "Tushunarli" : "Done"}
          </Button>
        </Box>
      )}
    </Dialog>
  );
}

