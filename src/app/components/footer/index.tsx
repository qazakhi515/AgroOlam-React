import React from "react";
import { Box, Container, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { getSavedLanguage, translations } from "../../../lib/i18n";
import { useGlobals } from "../hooks/useGlobals";

const Footers = styled.div`
  width: 100%;
  min-height: 520px;
  display: flex;
  background: #1e261f;
  background-size: cover;
  padding-bottom: 40px;
`;

export default function Footer() {
  const { authMember } = useGlobals();
  const lang = getSavedLanguage();
  const t = translations[lang].footer;

  return (
    <Footers>
      <Container>
        <Stack flexDirection={"row"} sx={{ mt: "80px", flexWrap: { xs: "wrap", md: "nowrap" } }} justifyContent="space-between">
          <Stack flexDirection={"column"} style={{ width: "360px", maxWidth: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <img style={{ height: "54px", width: "auto" }} src={"/icons/agroolam-emblem-white.png"} alt="AgroOlam 2024" />
              <Box>
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 900, fontSize: "22px", color: "#ffffff", lineHeight: 1.1, letterSpacing: "-0.5px" }}>
                  Agro<span style={{ color: "#4ade80" }}>Olam</span>
                </Typography>
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "10px", color: "#a7f3d0", letterSpacing: "1.2px", textTransform: "uppercase" }}>
                  2024 • AgroTech
                </Typography>
              </Box>
            </Box>
            <Box className={"foot-desc-txt"} sx={{ mt: 2, color: "#a0aec0", lineHeight: 1.6 }}>
              {t.desc}
            </Box>
            <Box className="sns-context" sx={{ mt: 3 }}>
              <img src={"/icons/facebook.svg"} alt="facebook" />
              <img src={"/icons/twitter.svg"} alt="twitter" />
              <img src={"/icons/instagram.svg"} alt="instagram" />
              <img src={"/icons/youtube.svg"} alt="youtube" />
            </Box>
          </Stack>

          <Stack sx={{ ml: { xs: 0, md: "80px" }, mt: { xs: 4, md: 0 } }} flexDirection={"row"} gap="80px">
            <Stack>
              <Box>
                <Box className={"foot-category-title"} sx={{ color: "#fff", fontWeight: 700, mb: 2 }}>
                  {t.sectionsTitle}
                </Box>
                <Box className={"foot-category-link"}>
                  <Link to="/">{t.home}</Link>
                  <Link to="/products">{t.products}</Link>
                  <Link to="/news">{t.news}</Link>
                  {authMember && <Link to="/orders">{t.orders}</Link>}
                  <Link to="/help">{t.help}</Link>
                </Box>
              </Box>
            </Stack>

            <Stack>
              <Box>
                <Box className={"foot-category-title"} sx={{ color: "#fff", fontWeight: 700, mb: 2 }}>
                  {t.contactTitle}
                </Box>
                <Box
                  flexDirection={"column"}
                  className={"foot-category-link"}
                  justifyContent={"space-between"}
                >
                  <Box flexDirection={"row"} className={"find-us"}>
                    <span>L.</span>
                    <div>{t.location}</div>
                  </Box>
                  <Box className={"find-us"}>
                    <span>P.</span>
                    <div>{t.phone}</div>
                  </Box>
                  <Box className={"find-us"}>
                    <span>E.</span>
                    <div>{t.email}</div>
                  </Box>
                  <Box className={"find-us"}>
                    <span>H.</span>
                    <div>{t.hours}</div>
                  </Box>
                </Box>
              </Box>
            </Stack>
          </Stack>
        </Stack>
        <Stack
          style={{ border: "1px solid #4a5568", width: "100%", opacity: "0.4" }}
          sx={{ mt: "60px" }}
        ></Stack>
        <Stack className={"copyright-txt"} sx={{ textAlign: "center", mt: 3, color: "#a0aec0", fontSize: 14 }}>
          {t.copyright}
        </Stack>
      </Container>
    </Footers>
  );
}
