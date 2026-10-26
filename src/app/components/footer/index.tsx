import React from "react";
import { Box, Container, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Footers = styled.div`
  width: 100%;
  min-height: 520px;
  display: flex;
  background: #1e261f;
  background-size: cover;
  padding-bottom: 40px;
`;

export default function Footer() {
  const authMember = null;

  return (
    <Footers>
      <Container>
        <Stack flexDirection={"row"} sx={{ mt: "80px" }} justifyContent="space-between">
          <Stack flexDirection={"column"} style={{ width: "360px" }}>
            <Box>
              <img width={"140px"} src={"/icons/agrivia-logo.svg"} alt="Agrivia" />
            </Box>
            <Box className={"foot-desc-txt"} sx={{ mt: 2, color: "#a0aec0", lineHeight: 1.6 }}>
              Agrivia — Qishloq xo'jaligi, zamonaviy urug'chilik, agro-kimyo va sifatli
              dorilar yetkazib beruvchi yetakchi agro-platforma. Dehqon va fermerlarga
              har qadamda ishonchli hamroh.
            </Box>
            <Box className="sns-context" sx={{ mt: 3 }}>
              <img src={"/icons/facebook.svg"} alt="facebook" />
              <img src={"/icons/twitter.svg"} alt="twitter" />
              <img src={"/icons/instagram.svg"} alt="instagram" />
              <img src={"/icons/youtube.svg"} alt="youtube" />
            </Box>
          </Stack>

          <Stack sx={{ ml: "80px" }} flexDirection={"row"} gap="80px">
            <Stack>
              <Box>
                <Box className={"foot-category-title"} sx={{ color: "#fff", fontWeight: 700, mb: 2 }}>
                  Bo'limlar
                </Box>
                <Box className={"foot-category-link"}>
                  <Link to="/">Bosh sahifa</Link>
                  <Link to="/products">Mahsulotlar</Link>
                  <Link to="/news">Yangiliklar & Maslahatlar</Link>
                  {authMember && <Link to="/orders">Buyurtmalar</Link>}
                  <Link to="/help">Yordam & FAQ</Link>
                </Box>
              </Box>
            </Stack>

            <Stack>
              <Box>
                <Box className={"foot-category-title"} sx={{ color: "#fff", fontWeight: 700, mb: 2 }}>
                  Bog'lanish
                </Box>
                <Box
                  flexDirection={"column"}
                  className={"foot-category-link"}
                  justifyContent={"space-between"}
                >
                  <Box flexDirection={"row"} className={"find-us"}>
                    <span>L.</span>
                    <div>Toshkent shahri, O'zbekiston</div>
                  </Box>
                  <Box className={"find-us"}>
                    <span>P.</span>
                    <div>+998 71 200 00 00</div>
                  </Box>
                  <Box className={"find-us"}>
                    <span>E.</span>
                    <div>info@agrivia.uz</div>
                  </Box>
                  <Box className={"find-us"}>
                    <span>H.</span>
                    <div>Har kuni: 08:00 - 20:00</div>
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
          © 2026 Agrivia AgroPlatformasi. Barcha huquqlar himoyalangan.
        </Stack>
      </Container>
    </Footers>
  );
}
