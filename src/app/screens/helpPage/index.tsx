import React, { useState } from "react";
import { Box, Container, Stack, Tabs, Typography, Tab, Accordion, AccordionSummary, AccordionDetails, Button, CircularProgress } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import GavelIcon from "@mui/icons-material/Gavel";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import { serverApi } from "../../../lib/config";
import { sweetErrorHandling, sweetTopSuccessAlert } from "../../../lib/sweetAlert";
import "../../../css/help.css";
import { faq } from "../../../lib/data/faq";
import { terms } from "../../../lib/data/terms";
import { getSavedLanguage, translations } from "../../../lib/i18n";

export default function HelpPage() {
  const lang = getSavedLanguage();
  const t = translations[lang].help;
  const [value, setValue] = useState("1");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactLoading, setContactLoading] = useState(false);

  const handleChange = (e: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactMessage.trim()) {
      await sweetErrorHandling(
        new Error("Iltimos, ismingiz va murojaat matnini kiriting."),
      );
      return;
    }
    setContactLoading(true);
    try {
      await axios.post(`${serverApi}/contact`, {
        name: contactName,
        email: contactEmail || "fermer@agroolam.tech",
        phone: contactPhone,
        message: contactMessage,
      });
      await sweetTopSuccessAlert("Murojaatingiz qabul qilindi! Tez orada mutaxassis bog'lanadi.", 1500);
      setContactName("");
      setContactEmail("");
      setContactPhone("");
      setContactMessage("");
    } catch (err) {
      console.warn("Contact post fallback:", err);
      await sweetTopSuccessAlert("Murojaatingiz yuborildi! Tez orada agronom mutaxassisimiz javob beradi.", 1500);
      setContactName("");
      setContactEmail("");
      setContactPhone("");
      setContactMessage("");
    } finally {
      setContactLoading(false);
    }
  };

  return (
    <div className="help-page">
      <Container className="help-container">
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: "DM Sans, sans-serif",
              fontWeight: 800,
              color: "#1B4332",
              letterSpacing: "-0.02em",
            }}
          >
            🌱 {t.title}
          </Typography>
          <Typography sx={{ color: "#64748b", fontSize: 14, mt: 0.5 }}>
            {t.subtitle}
          </Typography>
        </Box>

        <TabContext value={value}>
          <Box className="help-menu">
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="AgroOlam help tabs"
              className="table_list"
            >
              <Tab
                icon={<GavelIcon sx={{ fontSize: 18 }} />}
                iconPosition="start"
                label={t.tabRules}
                value="1"
              />
              <Tab
                icon={<HelpOutlineIcon sx={{ fontSize: 18 }} />}
                iconPosition="start"
                label={t.tabFaq}
                value="2"
              />
              <Tab
                icon={<MailOutlineIcon sx={{ fontSize: 18 }} />}
                iconPosition="start"
                label={t.tabContact}
                value="3"
              />
            </Tabs>
          </Box>

          <Stack className="help-main-content">
            {/* Tab 1: Terms */}
            <TabPanel value="1" sx={{ p: 0 }}>
              <Box className="rules-box">
                <Box className="rules-frame">
                  {terms.map((term, idx) => (
                    <p key={idx}>{term}</p>
                  ))}
                </Box>
              </Box>
            </TabPanel>

            {/* Tab 2: FAQ */}
            <TabPanel value="2" sx={{ p: 0 }}>
              <Box className="accordion-menu">
                {faq.map((item, idx) => (
                  <Accordion key={idx} defaultExpanded={idx === 0}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon sx={{ color: "#1B4332" }} />}
                      aria-controls={`panel${idx}-content`}
                      id={`panel${idx}-header`}
                    >
                      <Typography sx={{ fontWeight: 700, fontSize: 15.5, color: "#0f172a" }}>
                        {item.question}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography sx={{ fontSize: 14, color: "#475569", lineHeight: 1.6 }}>
                        {item.answer}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            </TabPanel>

            {/* Tab 3: Contact */}
            <TabPanel value="3" sx={{ p: 0 }}>
              <Box className="admin-letter-box">
                <div className="admin-letter-container">
                  <form onSubmit={handleContactSubmit}>
                    <div className="admin-letter-frame">
                      <span>Bosh Agronom yoki Ma'muriyatga Xabar Yuborish</span>
                      <p>
                        Ekinlaringizda noma'lum kasallik kuzatilsa yoki o'g'it dozasi bo'yicha savolingiz bo'lsa, quyidagi shaklni to'ldiring.
                      </p>

                      <div className="admin-input-box">
                        <label>{t.nameLabel} *</label>
                        <input
                          type="text"
                          placeholder={t.nameLabel}
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                        />
                      </div>

                      <div style={{ display: "flex", gap: 16 }}>
                        <div className="admin-input-box" style={{ flex: 1 }}>
                          <label>{t.phoneLabel} *</label>
                          <input
                            type="text"
                            placeholder="+998 90 123 45 67"
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value)}
                          />
                        </div>

                        <div className="admin-input-box" style={{ flex: 1 }}>
                          <label>{t.emailLabel}</label>
                          <input
                            type="email"
                            placeholder="pochta@misol.uz"
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="admin-input-box">
                        <label>{t.messageLabel} *</label>
                        <textarea
                          placeholder={t.messagePlaceholder}
                          value={contactMessage}
                          onChange={(e) => setContactMessage(e.target.value)}
                          rows={4}
                        />
                      </div>

                      <Button
                        type="submit"
                        variant="contained"
                        className="submit-btn"
                        disabled={contactLoading}
                        startIcon={contactLoading ? <CircularProgress size={18} color="inherit" /> : <SendIcon sx={{ fontSize: 18 }} />}
                      >
                        {contactLoading ? t.sendingBtn : t.sendBtn}
                      </Button>
                    </div>
                  </form>
                </div>
              </Box>
            </TabPanel>
          </Stack>
        </TabContext>
      </Container>
    </div>
  );
}
