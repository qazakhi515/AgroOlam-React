import React, { useState } from "react";
import { Box, Stack, Typography, Button, Chip } from "@mui/material";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrieveProcessOrders } from "./selector";
import { Messages, serverApi } from "../../../lib/config";
import { Order, OrderItem, OrderUpdateInput } from "../../../lib/types/order";
import { Product } from "../../../lib/types/product";
import { useGlobals } from "../../components/hooks/useGlobals";
import { OrderStatus } from "../../../lib/enums/order.enum";
import OrderService from "../../services/OrdersService";
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from "../../../lib/sweetAlert";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import TreatmentReminderModal from "../../components/reminders/TreatmentReminderModal";
import moment from "moment";

const USD_TO_UZS = 12850;

const processOrdersRetriever = createSelector(
  retrieveProcessOrders,
  (processOrders) => ({ processOrders }),
);

interface ProcessOrdersProps {
  setValue: (input: string) => void;
}

export default function ProcessOrders(props: ProcessOrdersProps) {
  const { setValue } = props;
  const { authMember, setOrderBuilder } = useGlobals();
  const { processOrders } = useSelector(processOrdersRetriever);
  const [isReminderOpen, setIsReminderOpen] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const finishOrderHandler = async (orderId: string) => {
    try {
      const confirmation = window.confirm("Agromahsulotlar to'liq yetib kelganini tasdiqlaysizmi?");
      if (confirmation) {
        const input: OrderUpdateInput = {
          orderId: orderId,
          orderStatus: OrderStatus.FINISH,
        };
        const order = new OrderService();
        await order.updateOrder(input);
        setOrderBuilder(new Date());
        setValue("3");
        await sweetTopSmallSuccessAlert("Buyurtma muvaffaqiyatli qabul qilindi!", 1800);
      }
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
      {processOrders?.map((order: Order) => {
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
            {/* Header */}
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
                icon={<LocalShippingOutlinedIcon sx={{ fontSize: 16 }} />}
                label="Yetkazilmoqda (Yo'lda)"
                size="small"
                sx={{
                  bgcolor: "#EFF6FF",
                  color: "#1D4ED8",
                  fontWeight: 700,
                  fontSize: 11.5,
                  borderRadius: "8px",
                  border: "1px solid #BFDBFE",
                }}
              />
            </div>

            {/* Product items */}
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

            {/* Total and Verify Fulfil button */}
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

              <div className="order-action-btns" style={{ display: "flex", gap: "8px" }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<NotificationsActiveIcon sx={{ fontSize: 16 }} />}
                  onClick={() => {
                    setSelectedOrder(order);
                    setIsReminderOpen(true);
                  }}
                  sx={{
                    textTransform: "none",
                    fontWeight: 700,
                    borderRadius: "8px",
                    borderColor: "#16a34a",
                    color: "#16a34a",
                    fontSize: "12px",
                    "&:hover": { bgcolor: "#f0fdf4", borderColor: "#15803d" },
                  }}
                >
                  ⏰ Davolash Eslatmasi
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  className="verify-button"
                  startIcon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
                  onClick={() => finishOrderHandler(order._id)}
                >
                  Qabul qilib oldim
                </Button>
              </div>
            </Box>
          </Box>
        );
      })}

      {/* Treatment Reminder Modal */}
      <TreatmentReminderModal
        open={isReminderOpen}
        onClose={() => setIsReminderOpen(false)}
        orderId={selectedOrder?._id}
        defaultProductName={selectedOrder?.productData?.[0]?.productName || "Ridomil Gold MZ 68 WG"}
      />

      {(!processOrders || processOrders.length === 0) && (
        <Box className="empty-orders-card">
          <div className="empty-icon-wrap">
            <LocalShippingOutlinedIcon sx={{ fontSize: 40, color: "#94a3b8" }} />
          </div>
          <Typography sx={{ fontWeight: 700, fontSize: 17, color: "#1e293b", mt: 1 }}>
            Hozirda yetkazilayotgan buyurtmalar yo'q
          </Typography>
          <Typography sx={{ fontSize: 13, color: "#64748b", mt: 0.5, maxWidth: 320 }}>
            To'lovi amalga oshirilgan barcha agro-buyurtmalar bu yerda kuryer holati bilan ko'rinadi.
          </Typography>
        </Box>
      )}
    </Stack>
  );
}
