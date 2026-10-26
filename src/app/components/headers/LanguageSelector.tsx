import React, { useState } from "react";
import { Box, Button, Menu, MenuItem } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import { getSavedLanguage, setSavedLanguage, Language } from "../../../lib/i18n";

const langLabels: Record<Language, { label: string; flag: string }> = {
  en: { label: "EN", flag: "🇺🇸" },
  ko: { label: "한국어", flag: "🇰🇷" },
  uz: { label: "UZ", flag: "🇺🇿" },
};

export default function LanguageSelector() {
  const [currentLang, setCurrentLang] = useState<Language>(getSavedLanguage());
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const selectLanguage = (lang: Language) => {
    setSavedLanguage(lang);
    setCurrentLang(lang);
    handleClose();
    window.location.reload();
  };

  return (
    <Box sx={{ display: "inline-block" }}>
      <Button
        size="small"
        onClick={handleClick}
        startIcon={<LanguageIcon sx={{ fontSize: 18 }} />}
        sx={{
          color: "#2e7d32",
          background: "#edf7ee",
          borderRadius: "16px",
          px: 1.5,
          py: 0.5,
          fontSize: 12,
          fontWeight: 700,
          textTransform: "none",
          border: "1px solid #c8e6c9",
          "&:hover": { background: "#e8f5e9" },
        }}
      >
        {langLabels[currentLang].flag} {langLabels[currentLang].label}
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={() => selectLanguage("en")} selected={currentLang === "en"}>
          🇺🇸 English
        </MenuItem>
        <MenuItem onClick={() => selectLanguage("ko")} selected={currentLang === "ko"}>
          🇰🇷 한국어 (Korean)
        </MenuItem>
        <MenuItem onClick={() => selectLanguage("uz")} selected={currentLang === "uz"}>
          🇺🇿 O'zbekcha
        </MenuItem>
      </Menu>
    </Box>
  );
}
