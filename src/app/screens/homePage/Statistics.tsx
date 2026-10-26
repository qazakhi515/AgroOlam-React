import { Box, Container, Stack } from "@mui/material";
import React from "react";
import Divider from "../../components/divider";
import { getSavedLanguage, translations } from "../../../lib/i18n";

export default function Statistics() {
  const lang = getSavedLanguage();
  const t = translations[lang].home.stats;

  return (
    <div className={"static-frame"}>
      <Container>
        <Stack className={"info"}>
          <Stack className={"static-box"}>
            <Box className={"static-num"}>15+</Box>
            <Box className={"static-text"}>{t.stores}</Box>
          </Stack>

          <Divider height="64" width="2" bg="#E3C08D" />

          <Stack className={"static-box"}>
            <Box className={"static-num"}>8</Box>
            <Box className={"static-text"}>{t.experience}</Box>
          </Stack>

          <Divider height="64" width="2" bg="#E3C08D" />

          <Stack className={"static-box"}>
            <Box className={"static-num"}>500+</Box>
            <Box className={"static-text"}>{t.products}</Box>
          </Stack>

          <Divider height="64" width="2" bg="#E3C08D" />

          <Stack className={"static-box"}>
            <Box className={"static-num"}>10,000+</Box>
            <Box className={"static-text"}>{t.farmers}</Box>
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
