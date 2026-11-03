import React, { useState } from "react";
import { Box, Stack, Typography, Button, Chip } from "@mui/material";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrievePausedOrders } from "./selector";
import { Messages, serverApi } from "../../../lib/config";
import { Order, OrderItem, OrderUpdateInput } from "../../../lib/types/order";
import { Product } from "../../../lib/types/product";
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from "../../../lib/sweetAlert";
import { OrderStatus } from "../../../lib/enums/order.enum";
import { useGlobals } from "../../components/hooks/useGlobals";
import OrderService from "../../services/OrdersService";
import PaymentModal from "../../components/payment/PaymentModal";
import PaymentIcon from "@mui/icons-material/Payment";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { useHistory } from "react-router-dom";
import moment from "moment";

const USD_TO_UZS = 12850;

const pausedOrdersRetriever = createSelector(
  retrievePausedOrders,
  (pausedOrders) => ({ pausedOrders }),
);

interface PausedOrdersProps {
  setValue: (input: string) => void;
}

export default function PausedOrders(props: PausedOrdersProps) {
  const { authMember, setOrderBuilder } = useGlobals();
  const { setValue } = props;
  const history = useHistory();
  const { pausedOrders } = useSelector(pausedOrdersRetriever);
  const [selectedOrderForPay, setSelectedOrderForPay] = useState<Order | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState<boolean>(false);

  const deleteOrderHandler = async (orderId: string) => {
    try {
      const confirmation = window.confirm("Haqiqatan ham ushbu buyurtmani bekor qilmoqchimisiz?");
      if (confirmation) {
        const input: OrderUpdateInput = {
          orderId: orderId,
          orderStatus: OrderStatus.DELETE,
        };
        const order = new OrderService();
        await order.updateOrder(input);
        setValue("1");
        setOrderBuilder(new Date());
      }
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    }
  };

  const handleOpenPayment = (order: Order) => {
    setSelectedOrderForPay(order);
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = async (orderId: string) => {
    try {
      const input: OrderUpdateInput = {
        orderId: orderId,
        orderStatus: OrderStatus.PROCESS,
      };
      const order = new OrderService();
      await order.updateOrder(input);
      setValue("2");
      setOrderBuilder(new Date());
      await sweetTopSmallSuccessAlert("To'lov muvaffaqiyatli qabul qilindi! Buyurtma yetkazishga o'tkazildi.", 1800);
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    }
  };

  const getProductImage = (product?: Product) => {
    const raw = product?.productImages?.[0];
    if (!raw) return "/img/default-agro.png";
    if (raw.startsWith("http://") || raw.startsWith("https://") || raw.startsWith("/img/")) {
      return raw;
    }
    return `${serverApi}/${raw}`;
  };

  return (
    <Stack spacing={2.5}>
      {pausedOrders?.map((order: Order) => {
        const totalUzs = (order.orderTotal * USD_TO_UZS).toLocaleString("uz-UZ");
        const orderDate = order.createdAt
          ? moment(order.createdAt).format("DD.MM.YYYY, HH:mm")
          : moment().format("DD.MM.YYYY");

        return (
          <Box key={order._id} className="order-main-box">
            {/* Order Card Top Bar */}
            <div className="order-box-header">
              <div className="order-header-left">
                <span className="order-id-label">
                  Buyurtma #{order._id.slice(-6).toUpperCase()}
                </span>
                <span className="order-date-text">
                  <AccessTimeIcon sx={{ fontSize: 13, mr: 0.4 }} />
                  {orderDate}
                </span>
              </div>
              <Chip
                label="To'lov kutilmoqda"
                size="small"
                sx={{
                  bgcolor: "#FEF3C7",
                  color: "#92400E",
                  fontWeight: 700,
                  fontSize: 11.5,
                  borderRadius: "8px",
                }}
              />
            </div>

            {/* Items inside this order */}
            <Box className="order-box-scroll">
              {order?.orderItems?.map((item: OrderItem) => {
                const product: Product | undefined = order.productData?.find(
                  (ele: Product) => item.productId === ele._id,
                );
                const imagePath = getProductImage(product);
                const productName = product?.productName || "Agromahsulot";
                const itemTotalUSD = item.itemQuantity * item.itemPrice;
                const itemTotalUZS = (itemTotalUSD * USD_TO_UZS).toLocaleString("uz-UZ");

                return (
                  <Box key={item._id} className="orders-name-price">
                    <img
                      src={imagePath}
                      className="order-product-img"
                      alt={productName}
                      onError={(e: any) => {
                        e.target.src = "/img/default-agro.png";
                      }}
                    />

                    <div className="order-item-desc">
                      <p className="title-product">{productName}</p>
                      <span className="unit-price-text">
                        ${item.itemPrice} × {item.itemQuantity} ta
                      </span>
                    </div>

                    <Box className="price-box">
                      <span className="item-usd">${itemTotalUSD}</span>
                      <span className="item-uzs">~{itemTotalUZS} so'm</span>
                    </Box>
                  </Box>
                );
              })}
            </Box>

            {/* Bottom Total & Actions Bar */}
            <Box className="total-price-box">
              <Box className="box-total">
                <div className="price-item">
                  <span>Mahsulotlar:</span>
                  <strong>${order.orderTotal - order.orderDelivery}</strong>
                </div>
                <span className="divider-dot">•</span>
                <div className="price-item">
                  <span>Yetkazish:</span>
                  <strong style={{ color: order.orderDelivery === 0 ? "#059669" : "inherit" }}>
                    {order.orderDelivery === 0 ? "Bepul" : `$${order.orderDelivery}`}
                  </strong>
                </div>
                <span className="divider-dot">•</span>
                <div className="price-item total-highlight">
                  <span>Jami:</span>
                  <strong>${order.orderTotal}</strong>
                  <small>({totalUzs} so'm)</small>
                </div>
              </Box>

              <div className="order-action-btns">
                <Button
                  variant="outlined"
                  size="small"
                  className="cancel-button"
                  startIcon={<DeleteOutlineIcon sx={{ fontSize: 16 }} />}
                  onClick={() => deleteOrderHandler(order._id)}
                >
                  Bekor qilish
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  className="pay-button"
                  startIcon={<PaymentIcon sx={{ fontSize: 16 }} />}
                  onClick={() => handleOpenPayment(order)}
                >
                  To'lov qilish
                </Button>
              </div>
            </Box>
          </Box>
        );
      })}

      <PaymentModal
        open={isPaymentOpen}
        order={selectedOrderForPay}
        onClose={() => setIsPaymentOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {(!pausedOrders || pausedOrders.length === 0) && (
        <Box className="empty-orders-card">
          <div className="empty-icon-wrap">
            <ShoppingBagOutlinedIcon sx={{ fontSize: 40, color: "#94a3b8" }} />
          </div>
          <Typography sx={{ fontWeight: 700, fontSize: 17, color: "#1e293b", mt: 1 }}>
            Kutilayotgan buyurtmalar yo'q
          </Typography>
          <Typography sx={{ fontSize: 13, color: "#64748b", mt: 0.5, maxWidth: 320 }}>
            Hozirda to'lov kutilayotgan agro-xaridingiz mavjud emas. Bozordan kerakli vositalarni tanlashingiz mumkin.
          </Typography>
          <Button
            variant="contained"
            onClick={() => history.push("/products")}
            sx={{
              mt: 2.5,
              bgcolor: "#1B4332",
              color: "#ffffff",
              textTransform: "none",
              borderRadius: "10px",
              fontWeight: 700,
              "&:hover": { bgcolor: "#2D6A4F" },
            }}
          >
            Agro-Bozorga o'tish
          </Button>
        </Box>
      )}
    </Stack>
  );
}
