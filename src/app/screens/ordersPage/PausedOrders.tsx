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
        const isLegacy = order.orderTotal < 1000;
        const totalUZSNum = isLegacy ? order.orderTotal * USD_TO_UZS : order.orderTotal;
        const totalUSDNum = isLegacy ? order.orderTotal : Math.round((order.orderTotal / USD_TO_UZS) * 10) / 10;
        const totalUzs = totalUZSNum.toLocaleString("uz-UZ");
        const totalUsd = totalUSDNum.toFixed(1);

        const deliveryUZS = order.orderDelivery === 0
          ? 0
          : (order.orderDelivery < 1000 ? order.orderDelivery * USD_TO_UZS : order.orderDelivery);
        const itemsOnlyUZS = totalUZSNum - deliveryUZS;

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
                const itemPriceUZS = item.itemPrice < 1000 ? item.itemPrice * USD_TO_UZS : item.itemPrice;
                const itemTotalUZS = (item.itemQuantity * itemPriceUZS).toLocaleString("uz-UZ");
                const itemTotalUSD = (item.itemQuantity * (itemPriceUZS / USD_TO_UZS)).toFixed(1);

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
                        {itemPriceUZS.toLocaleString("uz-UZ")} so'm × {item.itemQuantity} ta
                      </span>
                    </div>

                    <Box className="price-box">
                      <span className="item-usd">{itemTotalUZS} so'm</span>
                      <span className="item-uzs">(≈ ${itemTotalUSD})</span>
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
                  <strong>{itemsOnlyUZS.toLocaleString("uz-UZ")} so'm</strong>
                </div>
                <span className="divider-dot">•</span>
                <div className="price-item">
                  <span>Yetkazish:</span>
                  <strong style={{ color: deliveryUZS === 0 ? "#059669" : "inherit" }}>
                    {deliveryUZS === 0 ? "Bepul" : `${deliveryUZS.toLocaleString("uz-UZ")} so'm`}
                  </strong>
                </div>
                <span className="divider-dot">•</span>
                <div className="price-item total-highlight">
                  <span>Jami:</span>
                  <strong>{totalUzs} so'm</strong>
                  <small>(≈ ${totalUsd} USD)</small>
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
