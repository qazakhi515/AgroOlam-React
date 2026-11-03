import React, { useMemo, useState } from "react";
import { Box, Button, Stack, IconButton, Badge, Menu, Typography } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { useHistory } from "react-router-dom";
import { CartItem } from "../../../lib/types/search";
import { serverApi } from "../../../lib/config";
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from "../../../lib/sweetAlert";
import { useGlobals } from "../hooks/useGlobals";
import OrderService from "../../services/OrdersService";
import MemberService from "../../services/memberService";
import { chemicalIncompatibilities, ChemicalRule } from "../../../lib/data/agroRules";
import PaymentModal from "../payment/PaymentModal";
import { Order } from "../../../lib/types/order";
import { OrderStatus } from "../../../lib/enums/order.enum";

interface BasketProps {
  cartItems: CartItem[];
  onAdd: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
  onDeleteAll: () => void;
}

const USD_TO_UZS = 12850;

export default function Basket(props: BasketProps) {
  const { cartItems, onAdd, onRemove, onDelete, onDeleteAll } = props;
  const { authMember, setAuthMember, setOrderBuilder } = useGlobals();
  const history = useHistory();

  const [paymentOrder, setPaymentOrder] = useState<Order | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const rawItemsPrice: number = cartItems.reduce(
    (a: number, c: CartItem) => a + c.quantity * (c.price < 1000 ? c.price * USD_TO_UZS : c.price),
    0,
  );
  // Free delivery for orders over 500,000 UZS
  const shippingCostUZS = rawItemsPrice === 0 ? 0 : rawItemsPrice < 500000 ? 25000 : 0;
  const totalPriceUZS = rawItemsPrice + shippingCostUZS;
  const totalUzs = totalPriceUZS.toLocaleString("uz-UZ");
  const totalUSD = (totalPriceUZS / USD_TO_UZS).toFixed(1);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Check chemical incompatibilities
  const detectedConflicts: ChemicalRule[] = useMemo(() => {
    if (cartItems.length < 2) return [];
    const itemTexts = cartItems.map((it) => it.name.toLowerCase());
    const conflicts: ChemicalRule[] = [];

    for (const rule of chemicalIncompatibilities) {
      const satisfied = rule.substances.filter((sub) => {
        return itemTexts.some((text) => {
          if (sub === "copper") return text.includes("copper") || text.includes("mis") || text.includes("kupro");
          if (sub === "sulfur") return text.includes("sulfur") || text.includes("oltingugurt") || text.includes("thiovit");
          if (sub === "captan") return text.includes("captan") || text.includes("kaptan") || text.includes("merpan");
          if (sub === "mineral_oil") return text.includes("oil") || text.includes("moy") || text.includes("mineral");
          if (sub === "calcium") return text.includes("calcium") || text.includes("kalsiy") || text.includes("selitra");
          if (sub === "phosphate") return text.includes("phosphate") || text.includes("fosfat") || text.includes("ammophos");
          return text.includes(sub);
        });
      });

      if (satisfied.length >= rule.substances.length) {
        conflicts.push(rule);
      }
    }
    return conflicts;
  }, [cartItems]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getImageUrl = (img?: string) => {
    if (!img) return "/img/default-agro.png";
    if (img.startsWith("http://") || img.startsWith("https://") || img.startsWith("/img/")) {
      return img;
    }
    return `${serverApi}/${img}`;
  };

  const ensureAuthSession = async () => {
    if (!authMember) {
      const memberService = new MemberService();
      const guest = await memberService.signup({
        memberNick: "Fermer Xo'jaligi",
        memberPhone: "+998 90 123 45 67",
        memberPassword: "guest",
      });
      setAuthMember(guest);
      return guest;
    }
    return authMember;
  };

  // 1. Instant Payment from Basket
  const instantPayHandler = async () => {
    try {
      handleClose();
      await ensureAuthSession();

      const orderSvc = new OrderService();
      const created = await orderSvc.createOrder(cartItems);

      setPaymentOrder(created);
      setIsPaymentOpen(true);
    } catch (err) {
      console.log("Error in instantPayHandler:", err);
      sweetErrorHandling(err).then();
    }
  };

  // Payment completed successfully in modal
  const handlePaymentSuccess = async (orderId: string) => {
    try {
      const orderSvc = new OrderService();
      await orderSvc.updateOrder({ orderId, orderStatus: OrderStatus.PROCESS });

      onDeleteAll();
      setOrderBuilder(new Date());
      setIsPaymentOpen(false);

      await sweetTopSmallSuccessAlert("To'lov muvaffaqiyatli amalga oshirildi! Buyurtma yetkazishga o'tdi.", 1800);
      history.push("/orders");
    } catch (err) {
      console.log("Payment success handler error:", err);
    }
  };

  // 2. Save order and proceed to Orders page
  const proceedOrderHandler = async () => {
    try {
      handleClose();
      await ensureAuthSession();

      const order = new OrderService();
      await order.createOrder(cartItems);

      onDeleteAll();
      setOrderBuilder(new Date());
      await sweetTopSmallSuccessAlert("Buyurtma yaratildi! To'lov kutilmoqda.", 1500);
      history.push("/orders");
    } catch (err) {
      console.log("Error in proceedOrderHandler:", err);
      sweetErrorHandling(err).then();
    }
  };

  const totalQuantity = cartItems.reduce((acc, it) => acc + it.quantity, 0);

  return (
    <Box className="hover-line">
      <IconButton
        aria-label="agro-cart"
        id="agro-cart-btn"
        aria-controls={open ? "agro-basket-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{
          color: "#1B4332",
          transition: "all 0.2s ease",
          "&:hover": { bgcolor: "rgba(27, 67, 50, 0.08)", transform: "scale(1.05)" },
        }}
      >
        <Badge
          badgeContent={totalQuantity}
          sx={{
            "& .MuiBadge-badge": {
              bgcolor: "#1B4332",
              color: "#ffffff",
              fontWeight: 700,
              fontSize: 11,
              boxShadow: "0 2px 6px rgba(27,67,50,0.3)",
            },
          }}
        >
          <img
            src="/icons/shopping-cart.svg"
            alt="cart"
            style={{ width: 22, height: 22, filter: "invert(20%) sepia(50%) saturate(600%) hue-rotate(110deg)" }}
          />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        id="agro-basket-menu"
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            mt: 1.5,
            borderRadius: "20px",
            border: "none",
            bgcolor: "transparent",
            boxShadow: "none",
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 8,
              right: 18,
              width: 12,
              height: 12,
              bgcolor: "#1B4332",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Stack className="basket-frame">
          {/* Top Header */}
          <Box className="all-check-box">
            <div className="basket-title-wrap">
              <span>🌱 AgroOlam Savati</span>
              <span className="basket-count-badge">{totalQuantity} ta</span>
            </div>

            {cartItems.length > 0 && (
              <button
                type="button"
                className="clear-all-btn"
                onClick={() => onDeleteAll()}
              >
                <DeleteOutlineIcon sx={{ fontSize: 14 }} />
                <span>Tozalash</span>
              </button>
            )}
          </Box>

          {/* Cart Items List or Empty state */}
          {cartItems.length === 0 ? (
            <Box className="empty-basket-view">
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "#ECFDF5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                }}
              >
                <ShoppingBagOutlinedIcon sx={{ fontSize: 30, color: "#1B4332" }} />
              </div>
              <Typography sx={{ fontFamily: "DM Sans", fontWeight: 700, fontSize: 16, color: "#0f172a" }}>
                Savatingiz bo'sh
              </Typography>
              <Typography sx={{ fontFamily: "DM Sans", fontSize: 12.5, color: "#64748b", mt: 0.5, maxWidth: 260 }}>
                Issiqxona uchun urug'lar, dorilar yoki tizimlarni tanlang va xaridni amalga oshiring.
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  handleClose();
                  history.push("/products");
                }}
                sx={{
                  mt: 2,
                  borderColor: "#1B4332",
                  color: "#1B4332",
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: "8px",
                  "&:hover": { bgcolor: "#ECFDF5", borderColor: "#1B4332" },
                }}
              >
                Agro-Marketga o'tish
              </Button>
            </Box>
          ) : (
            <Box className="orders-main-wrapper">
              <Box className="orders-wrapper">
                {cartItems.map((item: CartItem) => {
                  const imageSrc = getImageUrl(item.image);

                  return (
                    <Box className="basket-info-box" key={item._id}>
                      <img
                        src={imageSrc}
                        alt={item.name}
                        className="product-img"
                        onError={(e: any) => {
                          e.target.src = "/img/default-agro.png";
                        }}
                      />

                      <div className="product-details">
                        <span className="product-name" title={item.name}>
                          {item.name}
                        </span>
                        <div className="product-price">
                          <span>{(item.price < 1000 ? item.price * USD_TO_UZS : item.price).toLocaleString("uz-UZ")} so'm</span>
                          <span className="uzs-equiv">(≈ ${((item.price < 1000 ? item.price * USD_TO_UZS : item.price) / USD_TO_UZS).toFixed(1)})</span>
                        </div>
                      </div>

                      <div className="qty-control-pill">
                        <button
                          type="button"
                          onClick={() => onRemove(item)}
                          title="Kamaytirish"
                        >
                          <RemoveIcon sx={{ fontSize: 13 }} />
                        </button>
                        <span className="qty-number">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => onAdd(item)}
                          title="Ko'paytirish"
                        >
                          <AddIcon sx={{ fontSize: 13 }} />
                        </button>
                      </div>

                      <span
                        className="item-delete-btn"
                        title="O'chirish"
                        onClick={() => onDelete(item)}
                      >
                        <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                      </span>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}

          {/* Chemical Incompatibility Warnings */}
          {detectedConflicts.length > 0 && (
            <Box sx={{ px: 2, py: 1.5, bgcolor: "#fffbeb", borderTop: "1px solid #fef3c7" }}>
              {detectedConflicts.map((conflict, idx) => (
                <Box
                  key={idx}
                  sx={{
                    p: 1.2,
                    mb: 1,
                    borderRadius: "10px",
                    bgcolor: conflict.severity === "DANGER" ? "#fef2f2" : "#fff7ed",
                    border:
                      conflict.severity === "DANGER"
                        ? "1px solid #fecaca"
                        : "1px solid #fed7aa",
                    fontSize: 11.5,
                  }}
                >
                  <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 0.3 }}>
                    <WarningAmberIcon
                      sx={{
                        color: conflict.severity === "DANGER" ? "#dc2626" : "#ea580c",
                        fontSize: 16,
                      }}
                    />
                    <strong
                      style={{
                        color: conflict.severity === "DANGER" ? "#b91c1c" : "#c2410c",
                        fontSize: 12,
                      }}
                    >
                      {conflict.title}
                    </strong>
                  </Stack>
                  <div style={{ color: "#475569", marginBottom: 3, lineHeight: 1.3 }}>
                    {conflict.reason}
                  </div>
                  <div style={{ color: "#166534", fontWeight: 600, fontSize: 11 }}>
                    💡 {conflict.recommendation}
                  </div>
                </Box>
              ))}
            </Box>
          )}

          {/* Footer & Order summary */}
          {cartItems.length > 0 && (
            <Box className="basket-footer">
              <div className="price-summary-row">
                <span>Mahsulotlar qiymati:</span>
                <span style={{ fontWeight: 600, color: "#0f172a" }}>{rawItemsPrice.toLocaleString("uz-UZ")} so'm</span>
              </div>

              <div className="price-summary-row">
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <LocalShippingOutlinedIcon sx={{ fontSize: 14, color: "#059669" }} />
                  Yetkazib berish:
                </span>
                <span style={{ color: shippingCostUZS === 0 ? "#059669" : "#0f172a", fontWeight: 600 }}>
                  {shippingCostUZS === 0 ? "Bepul (Aksiya)" : `${shippingCostUZS.toLocaleString("uz-UZ")} so'm`}
                </span>
              </div>

              <div className="price-total-row">
                <div>
                  <span className="total-label">Jami to'lov:</span>
                  <span className="total-uzs">{totalUzs} so'm</span>
                </div>
                <div className="total-val">≈ ${totalUSD}</div>
              </div>

              {/* Action Buttons: 1. Pay with Payme/Click/Card directly, 2. Save order */}
              <Stack spacing={1}>
                <button
                  type="button"
                  className="checkout-cta-btn"
                  onClick={instantPayHandler}
                  style={{
                    background: "linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)",
                  }}
                >
                  <CreditCardIcon sx={{ fontSize: 18 }} />
                  <span>To'lov qilish (Payme / Click / Karta)</span>
                </button>

                <Button
                  variant="outlined"
                  size="small"
                  onClick={proceedOrderHandler}
                  sx={{
                    borderColor: "#cbd5e1",
                    color: "#475569",
                    fontWeight: 700,
                    textTransform: "none",
                    borderRadius: "10px",
                    fontSize: 12.5,
                    "&:hover": { bgcolor: "#f8fafc", borderColor: "#1B4332", color: "#1B4332" },
                  }}
                >
                  Buyurtma sifatida saqlash →
                </Button>
              </Stack>
            </Box>
          )}
        </Stack>
      </Menu>

      {/* Direct Payment Modal from Basket */}
      <PaymentModal
        open={isPaymentOpen}
        order={paymentOrder}
        onClose={() => setIsPaymentOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </Box>
  );
}
