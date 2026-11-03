import React from "react";
import { Box, Stack, Typography, Button, Chip } from "@mui/material";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrieveFinishedOrders } from "./selector";
import { serverApi } from "../../../lib/config";
import { Order, OrderItem } from "../../../lib/types/order";
import { Product } from "../../../lib/types/product";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ReceiptIcon from "@mui/icons-material/Receipt";
import moment from "moment";

const USD_TO_UZS = 12850;

const finishedOrdersRetriever = createSelector(
  retrieveFinishedOrders,
  (finishedOrders) => ({ finishedOrders }),
);

export default function FinishedOrders() {
  const { finishedOrders } = useSelector(finishedOrdersRetriever);

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
      {finishedOrders?.map((order: Order) => {
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
                icon={<CheckCircleIcon sx={{ fontSize: 16, color: "#166534" }} />}
                label="Yetkazilgan"
                size="small"
                sx={{
                  bgcolor: "#DCFCE7",
                  color: "#166534",
                  fontWeight: 700,
                  fontSize: 11.5,
                  borderRadius: "8px",
                  border: "1px solid #BBF7D0",
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

            {/* Total summary */}
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
                  <span>Jami to'langan:</span>
                  <strong>{totalUzs} so'm</strong>
                  <small>(≈ ${totalUsd} USD)</small>
                </div>
              </Box>

              <div className="order-action-btns">
                <Button
                  variant="outlined"
                  size="small"
                  className="invoice-button"
                  startIcon={<ReceiptIcon sx={{ fontSize: 16 }} />}
                  onClick={() => alert(`Buyurtma #${order._id.slice(-6).toUpperCase()} elektron cheki: To'lov muvaffaqiyatli qabul qilingan.`)}
                >
                  Chekni ko'rish
                </Button>
              </div>
            </Box>
          </Box>
        );
      })}

      {(!finishedOrders || finishedOrders.length === 0) && (
        <Box className="empty-orders-card">
          <div className="empty-icon-wrap">
            <ShoppingBagOutlinedIcon sx={{ fontSize: 40, color: "#94a3b8" }} />
          </div>
          <Typography sx={{ fontWeight: 700, fontSize: 17, color: "#1e293b", mt: 1 }}>
            Yakunlangan buyurtmalar hozircha yo'q
          </Typography>
          <Typography sx={{ fontSize: 13, color: "#64748b", mt: 0.5, maxWidth: 320 }}>
            Yetkazib berilgan barcha muvaffaqiyatli buyurtmalar arxiv sifatida shu yerda saqlanadi.
          </Typography>
        </Box>
      )}
    </Stack>
  );
}
