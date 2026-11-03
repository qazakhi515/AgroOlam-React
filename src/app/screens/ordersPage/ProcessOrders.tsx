import React from "react";
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
        const totalUzs = (order.orderTotal * USD_TO_UZS).toLocaleString("uz-UZ");
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

            {/* Total and Verify Fulfil button */}
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
