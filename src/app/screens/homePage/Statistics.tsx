import { Box, Container, Stack } from "@mui/material";
import React from "react";
import Divider from "../../components/divider";

export default function Statistics() {
  return (
    <div className={"static-frame"}>
      <Container>
        <Stack className={"info"}>
          <Stack className={"static-box"}>
            <Box className={"static-num"}>15+</Box>
            <Box className={"static-text"}>Agro Do'konlar</Box>
          </Stack>

          <Divider height="64" width="2" bg="#E3C08D" />

          <Stack className={"static-box"}>
            <Box className={"static-num"}>8</Box>
            <Box className={"static-text"}>Yillik Tajriba</Box>
          </Stack>

          <Divider height="64" width="2" bg="#E3C08D" />

          <Stack className={"static-box"}>
            <Box className={"static-num"}>500+</Box>
            <Box className={"static-text"}>Agro Mahsulotlar</Box>
          </Stack>

          <Divider height="64" width="2" bg="#E3C08D" />

          <Stack className={"static-box"}>
            <Box className={"static-num"}>10,000+</Box>
            <Box className={"static-text"}>Fermer & Bog'bonlar</Box>
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
