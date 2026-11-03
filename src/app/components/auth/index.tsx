import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  Stack,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Tabs,
  Tab,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LoginIcon from "@mui/icons-material/Login";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import VerifiedIcon from "@mui/icons-material/Verified";
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from "../../../lib/sweetAlert";
import { LoginInput, MemberInput } from "../../../lib/types/member";
import MemberService from "../../services/memberService";
import { useGlobals } from "../hooks/useGlobals";

interface AuthenticationModalProps {
  signupOpen: boolean;
  loginOpen: boolean;
  handleSignupClose: () => void;
  handleLoginClose: () => void;
}

export default function AuthenticationModal(props: AuthenticationModalProps) {
  const { signupOpen, loginOpen, handleSignupClose, handleLoginClose } = props;
  const { setAuthMember } = useGlobals();

  const [activeTab, setActiveTab] = useState<"login" | "signup">(
    signupOpen ? "signup" : "login"
  );
  const [memberNick, setMemberNick] = useState<string>("");
  const [memberPhone, setMemberPhone] = useState<string>("");
  const [memberPassword, setMemberPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Sync tab with props
  React.useEffect(() => {
    if (signupOpen) setActiveTab("signup");
    else if (loginOpen) setActiveTab("login");
  }, [signupOpen, loginOpen]);

  const isOpen = signupOpen || loginOpen;

  const handleClose = () => {
    setMemberNick("");
    setMemberPhone("");
    setMemberPassword("");
    if (signupOpen) handleSignupClose();
    if (loginOpen) handleLoginClose();
  };

  const handleSignupRequest = async () => {
    try {
      if (!memberNick.trim() || !memberPhone.trim() || !memberPassword.trim()) {
        throw new Error("Iltimos, barcha maydonlarni to'ldiring!");
      }
      setIsLoading(true);

      const signupInput: MemberInput = {
        memberNick: memberNick.trim(),
        memberPhone: memberPhone.trim(),
        memberPassword: memberPassword,
      };
      const member = new MemberService();
      const result = await member.signup(signupInput);

      setAuthMember(result);
      handleClose();
      await sweetTopSmallSuccessAlert("Muvaffaqiyatli ro'yxatdan o'tdingiz!", 1200);
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginRequest = async () => {
    try {
      if (!memberNick.trim() || !memberPassword.trim()) {
        throw new Error("Iltimos, ism va parolingizni kiriting!");
      }
      setIsLoading(true);

      const loginInput: LoginInput = {
        memberNick: memberNick.trim(),
        memberPassword: memberPassword,
      };

      const member = new MemberService();
      const result = await member.login(loginInput);

      setAuthMember(result);
      handleClose();
      await sweetTopSmallSuccessAlert("Xush kelibsiz! Tizimga muvaffaqiyatli kirdingiz.", 1200);
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (activeTab === "signup") handleSignupRequest();
      else handleLoginRequest();
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.25)",
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Stack direction={{ xs: "column", md: "row" }} sx={{ minHeight: 460 }}>
          {/* Left Visual Banner */}
          <Box
            sx={{
              width: { xs: "100%", md: "42%" },
              background: "linear-gradient(145deg, #0e271d 0%, #1b4332 50%, #2d6a4f 100%)",
              p: 4,
              color: "#ffffff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <img
                  src="/icons/agroolam-logo.svg"
                  alt="AgroOlam"
                  style={{ height: 28, filter: "brightness(0) invert(1)" }}
                  onError={(e: any) => {
                    e.target.style.display = "none";
                  }}
                />
              </Box>

              <Typography
                variant="h5"
                sx={{
                  fontFamily: "DM Sans, sans-serif",
                  fontWeight: 800,
                  fontSize: 22,
                  mt: 3,
                  lineHeight: 1.3,
                }}
              >
                O'zbekistonning Yetakchi AgroTech Ekotizimi
              </Typography>

              <Typography
                sx={{
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: 13,
                  color: "#a7f3d0",
                  mt: 1.5,
                  lineHeight: 1.5,
                }}
              >
                Sertifikatlangan urug'lar, ekin dorilari, issiqxona plyonkalari va real-vaqtli AI barg patologiyasi diagnostikasi.
              </Typography>
            </div>

            <Box sx={{ mt: 4, pt: 3, borderTop: "1px solid rgba(255, 255, 255, 0.15)" }}>
              <Stack spacing={1}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, fontSize: 12, color: "#d1fae5" }}>
                  <VerifiedIcon sx={{ fontSize: 16, color: "#4ade80" }} />
                  <span>Davlat ro'yxatidan o'tgan preparatlar</span>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, fontSize: 12, color: "#d1fae5" }}>
                  <VerifiedIcon sx={{ fontSize: 16, color: "#4ade80" }} />
                  <span>Respublika bo'ylab tezkor yetkazib berish</span>
                </Box>
              </Stack>
            </Box>
          </Box>

          {/* Right Form */}
          <Box sx={{ flex: 1, p: { xs: 3, md: 4.5 }, position: "relative" }}>
            <IconButton
              onClick={handleClose}
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                color: "#64748b",
                "&:hover": { bgcolor: "#f1f5f9" },
              }}
            >
              <CloseIcon sx={{ fontSize: 20 }} />
            </IconButton>

            {/* Tabs */}
            <Tabs
              value={activeTab}
              onChange={(e, val) => setActiveTab(val)}
              sx={{
                mb: 3,
                minHeight: 40,
                "& .MuiTabs-indicator": { bgcolor: "#1B4332", height: 3, borderRadius: 2 },
              }}
            >
              <Tab
                value="login"
                label="Kirish"
                sx={{
                  fontFamily: "DM Sans, sans-serif",
                  fontWeight: 700,
                  fontSize: 15,
                  textTransform: "none",
                  color: activeTab === "login" ? "#1B4332" : "#64748b",
                  minHeight: 40,
                }}
              />
              <Tab
                value="signup"
                label="Ro'yxatdan o'tish"
                sx={{
                  fontFamily: "DM Sans, sans-serif",
                  fontWeight: 700,
                  fontSize: 15,
                  textTransform: "none",
                  color: activeTab === "signup" ? "#1B4332" : "#64748b",
                  minHeight: 40,
                }}
              />
            </Tabs>

            <Typography
              variant="h6"
              sx={{
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 800,
                color: "#0f172a",
                mb: 0.5,
              }}
            >
              {activeTab === "login" ? "Shaxsiy kabinetga kirish" : "Fermer sifatida ro'yxatdan o'tish"}
            </Typography>
            <Typography sx={{ color: "#64748b", fontSize: 13, mb: 3 }}>
              {activeTab === "login"
                ? "AgroOlam hisobingizga kiring va buyurtmalaringizni boshqaring"
                : "AgroOlam ekotizimidan foydalanish uchun ma'lumotlaringizni kiriting"}
            </Typography>

            {/* Inputs */}
            <Stack spacing={2}>
              <TextField
                fullWidth
                size="small"
                label="Fermer ismi / Loginingiz"
                placeholder="Masalan: Sardor"
                value={memberNick}
                onChange={(e) => setMemberNick(e.target.value)}
                onKeyDown={handleKeyDown}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineIcon sx={{ color: "#1B4332", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: "12px", bgcolor: "#f8fafc" },
                }}
              />

              {activeTab === "signup" && (
                <TextField
                  fullWidth
                  size="small"
                  label="Telefon raqamingiz"
                  placeholder="+998 90 123 45 67"
                  value={memberPhone}
                  onChange={(e) => setMemberPhone(e.target.value)}
                  onKeyDown={handleKeyDown}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIphoneIcon sx={{ color: "#1B4332", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: "12px", bgcolor: "#f8fafc" },
                  }}
                />
              )}

              <TextField
                fullWidth
                size="small"
                type={showPassword ? "text" : "password"}
                label="Parol"
                placeholder="••••••••"
                value={memberPassword}
                onChange={(e) => setMemberPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: "#1B4332", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon sx={{ fontSize: 18 }} /> : <VisibilityIcon sx={{ fontSize: 18 }} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: { borderRadius: "12px", bgcolor: "#f8fafc" },
                }}
              />

              <Button
                fullWidth
                variant="contained"
                disabled={isLoading}
                onClick={activeTab === "signup" ? handleSignupRequest : handleLoginRequest}
                startIcon={activeTab === "signup" ? <HowToRegIcon /> : <LoginIcon />}
                sx={{
                  mt: 1,
                  py: 1.2,
                  bgcolor: "#1B4332",
                  color: "#ffffff",
                  fontFamily: "DM Sans, sans-serif",
                  fontWeight: 700,
                  fontSize: 14.5,
                  borderRadius: "12px",
                  textTransform: "none",
                  boxShadow: "0 4px 14px -2px rgba(27, 67, 50, 0.35)",
                  "&:hover": { bgcolor: "#2D6A4F" },
                }}
              >
                {isLoading
                  ? "Bajarilmoqda..."
                  : activeTab === "signup"
                  ? "Ro'yxatdan o'tish"
                  : "Kirish"}
              </Button>

              {/* Bottom Switcher */}
              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Typography sx={{ fontSize: 13, color: "#64748b" }}>
                  {activeTab === "login" ? (
                    <>
                      Hisobingiz yo'qmi?{" "}
                      <span
                        style={{ color: "#1B4332", fontWeight: 700, cursor: "pointer" }}
                        onClick={() => setActiveTab("signup")}
                      >
                        Ro'yxatdan o'ting
                      </span>
                    </>
                  ) : (
                    <>
                      Allaqachon ro'yxatdan o'tganmisiz?{" "}
                      <span
                        style={{ color: "#1B4332", fontWeight: 700, cursor: "pointer" }}
                        onClick={() => setActiveTab("login")}
                      >
                        Kirish
                      </span>
                    </>
                  )}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
