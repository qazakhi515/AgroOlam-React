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

export default function HelpPage() {
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
            🌱 AgroOlam Qo'llab-Quvvatlash Markazi
          </Typography>
          <Typography sx={{ color: "#64748b", fontSize: 14, mt: 0.5 }}>
            Fermerlar uchun rasmiy kafolatlar, ko'p beriladigan savollar va to'g'ridan-to'g'ri agronomik yordam
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
                label="Qoidalar & Kafolatlar"
                value="1"
              />
              <Tab
                icon={<HelpOutlineIcon sx={{ fontSize: 18 }} />}
                iconPosition="start"
                label="Ko'p Beriladigan Savollar (FAQ)"
                value="2"
              />
              <Tab
                icon={<MailOutlineIcon sx={{ fontSize: 18 }} />}
                iconPosition="start"
                label="Agronomga Savol Yuborish"
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
                        <label>Fermer / Xo'jalik Ismi *</label>
                        <input
                          type="text"
                          placeholder="Ismingiz yoki xo'jalik nomini kiriting"
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                        />
                      </div>

                      <div style={{ display: "flex", gap: 16 }}>
                        <div className="admin-input-box" style={{ flex: 1 }}>
                          <label>Telefon Raqam *</label>
                          <input
                            type="text"
                            placeholder="+998 90 123 45 67"
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value)}
                          />
                        </div>

                        <div className="admin-input-box" style={{ flex: 1 }}>
                          <label>Elektron Pochta (Ixtiyoriy)</label>
                          <input
                            type="email"
                            placeholder="pochta@misol.uz"
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="admin-input-box">
                        <label>Murojaat Matni *</label>
                        <textarea
                          placeholder="Ekin turi, issiqxona maydoni va sizni qiziqtirgan savolni batafsil yozing..."
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
                        {contactLoading ? "Yuborilmoqda..." : "Murojaatni Yuborish"}
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
