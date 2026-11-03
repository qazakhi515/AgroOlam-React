import { useState, SyntheticEvent, useEffect } from "react";
import { Container, Stack, Box, Typography, Chip, Button } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import VerifiedIcon from "@mui/icons-material/Verified";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PausedOrders from "./PausedOrders";
import ProcessOrders from "./ProcessOrders";
import FinishedOrders from "./FinishedOrders";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setPausedOrders, setProcessOrders, setFinishedOrders } from "./slice";
import "../../../css/order.css";
import { Order, OrderInquiry } from "../../../lib/types/order";
import { OrderStatus } from "../../../lib/enums/order.enum";
import { MemberType } from "../../../lib/enums/member.enum";
import OrderService from "../../services/OrdersService";
import { useGlobals } from "../../components/hooks/useGlobals";
import { serverApi } from "../../../lib/config";
import TelegramAlertCard from "../../components/telegram/TelegramAlertCard";
import { retrievePausedOrders, retrieveProcessOrders, retrieveFinishedOrders } from "./selector";
import { getSavedLanguage, translations } from "../../../lib/i18n";

const actionDispatch = (dispatch: Dispatch) => ({
  setPausedOrders: (data: Order[]) => dispatch(setPausedOrders(data)),
  setProcessOrders: (data: Order[]) => dispatch(setProcessOrders(data)),
  setFinishedOrders: (data: Order[]) => dispatch(setFinishedOrders(data)),
});

export default function OrdersPage() {
  const { setPausedOrders, setProcessOrders, setFinishedOrders } =
    actionDispatch(useDispatch());
  const { orderBuilder, authMember } = useGlobals();
  const lang = getSavedLanguage();
  const t = translations[lang].orders;
  const [value, setValue] = useState("1");
  const [orderInquiry, setOrderInquiry] = useState<OrderInquiry>({
    page: 1,
    limit: 10,
    orderStatus: OrderStatus.PAUSE,
  });

  const pausedOrders = useSelector(retrievePausedOrders) || [];
  const processOrders = useSelector(retrieveProcessOrders) || [];
  const finishedOrders = useSelector(retrieveFinishedOrders) || [];

  useEffect(() => {
    const order = new OrderService();

    order
      .getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.PAUSE })
      .then((data) => setPausedOrders(data))
      .catch((err) => console.log(err));

    order
      .getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.PROCESS })
      .then((data) => setProcessOrders(data))
      .catch((err) => console.log(err));

    order
      .getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.FINISH })
      .then((data) => setFinishedOrders(data))
      .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderInquiry, orderBuilder]);

  const handleChange = (e: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const memberImg = authMember?.memberImage
    ? (authMember.memberImage.startsWith("http")
        ? authMember.memberImage
        : `${serverApi}/${authMember.memberImage}`)
    : "/icons/default-user.svg";

  return (
    <div className="order-page">
      <Container className="order-container">
        {/* LEFT SIDE: ORDERS LIST */}
        <Stack className="order-left">
          {/* Header Title */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h4"
              sx={{
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 800,
                color: "#1B4332",
                letterSpacing: "-0.02em",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              🌱 {t.title}
            </Typography>
            <Typography sx={{ color: "#64748b", fontSize: 14, mt: 0.5 }}>
              {t.subtitle}
            </Typography>
          </Box>

          <TabContext value={value}>
            <Box className="order-nav-frame">
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="agro order tabs"
                className="table_list"
              >
                <Tab
                  icon={<HourglassEmptyIcon sx={{ fontSize: 18 }} />}
                  iconPosition="start"
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <span>{t.tabPaused}</span>
                      {pausedOrders.length > 0 && (
                        <span className="order-tab-badge">{pausedOrders.length}</span>
                      )}
                    </Box>
                  }
                  value="1"
                />
                <Tab
                  icon={<LocalShippingOutlinedIcon sx={{ fontSize: 18 }} />}
                  iconPosition="start"
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <span>{t.tabProcess}</span>
                      {processOrders.length > 0 && (
                        <span className="order-tab-badge active">{processOrders.length}</span>
                      )}
                    </Box>
                  }
                  value="2"
                />
                <Tab
                  icon={<CheckCircleOutlineIcon sx={{ fontSize: 18 }} />}
                  iconPosition="start"
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <span>{t.tabFinished}</span>
                      {finishedOrders.length > 0 && (
                        <span className="order-tab-badge">{finishedOrders.length}</span>
                      )}
                    </Box>
                  }
                  value="3"
                />
              </Tabs>
            </Box>

            <Stack className="order-main-content">
              <TabPanel value="1" sx={{ p: 0, pt: 2.5 }}>
                <PausedOrders setValue={setValue} />
              </TabPanel>

              <TabPanel value="2" sx={{ p: 0, pt: 2.5 }}>
                <ProcessOrders setValue={setValue} />
              </TabPanel>

              <TabPanel value="3" sx={{ p: 0, pt: 2.5 }}>
                <FinishedOrders />
              </TabPanel>
            </Stack>
          </TabContext>
        </Stack>

        {/* RIGHT SIDE: FARMER PROFILE & TELEGRAM ADVISOR */}
        <Stack className="order-right">
          {/* USER INFO BOX */}
          <Box className="order-info-box">
            <Box className="member-box">
              <div className="order-user-img">
                <img
                  src={memberImg}
                  className="order-user-avatar"
                  alt="user"
                  onError={(e: any) => {
                    e.target.src = "/icons/default-user.svg";
                  }}
                />
                <div className="order-user-icon-box">
                  <VerifiedIcon sx={{ fontSize: 16, color: "#ffffff" }} />
                </div>
              </div>

              <span className="order-user-name">
                {authMember?.memberNick || "Fermer xo'jaligi"}
              </span>

              <Chip
                label={authMember?.memberType === MemberType.RESTAURANT ? t.supplier : t.certifiedFarmer}
                size="small"
                sx={{
                  mt: 0.8,
                  bgcolor: "#ECFDF5",
                  color: "#065F46",
                  fontWeight: 700,
                  fontSize: 11,
                  border: "1px solid #A7F3D0",
                }}
              />
            </Box>

            <Box className="liner" />

            <Box className="order-user-address">
              <LocationOnIcon sx={{ color: "#059669", fontSize: 20 }} />
              <span className="spec-address-txt">
                {authMember?.memberAddress || "O'zbekiston, Toshkent viloyati"}
              </span>
            </Box>

            {/* Quick Farm Stats Summary */}
            <Box sx={{ width: "100%", mt: 2, pt: 2, borderTop: "1px dashed #e2e8f0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "#64748b", marginBottom: 6 }}>
                <span>{t.activeOrders}</span>
                <strong style={{ color: "#0f172a" }}>{pausedOrders.length + processOrders.length}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "#64748b" }}>
                <span>{t.finishedPurchases}</span>
                <strong style={{ color: "#059669" }}>{finishedOrders.length}</strong>
              </div>
            </Box>
          </Box>

          {/* TELEGRAM AGRO REMINDER CARD */}
          <TelegramAlertCard />

          {/* 24/7 Agro-Consultant Hotline Box */}
          <Box
            sx={{
              mt: 2.5,
              p: 2.5,
              borderRadius: "16px",
              bgcolor: "linear-gradient(135deg, #0e271d 0%, #1b4332 100%)",
              background: "linear-gradient(135deg, #0e271d 0%, #1b4332 100%)",
              color: "#ffffff",
              boxShadow: "0 10px 25px -5px rgba(14, 39, 29, 0.25)",
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
              <SupportAgentIcon sx={{ color: "#4ade80", fontSize: 28 }} />
              <div>
                <Typography sx={{ fontWeight: 800, fontSize: 14 }}>
                  {t.hotlineTitle}
                </Typography>
                <Typography sx={{ fontSize: 11, color: "#a7f3d0" }}>
                  {t.hotlineDesc}
                </Typography>
              </div>
            </Stack>
            <Typography sx={{ fontSize: 12, color: "#e2e8f0", lineHeight: 1.4, mb: 1.5 }}>
              O'g'itlar me'yori yoki yetkazib berish bo'yicha savollaringiz bo'lsa, agronomlarimiz 24/7 xizmatingizda.
            </Typography>
            <Button
              fullWidth
              variant="contained"
              size="small"
              onClick={() => window.open("https://t.me/agroolam_uz", "_blank")}
              sx={{
                bgcolor: "#2D6A4F",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: 12,
                borderRadius: "10px",
                textTransform: "none",
                "&:hover": { bgcolor: "#4ade80", color: "#0e271d" },
              }}
            >
              Telegram orqali bog'lanish
            </Button>
          </Box>
        </Stack>
      </Container>
    </div>
  );
}
