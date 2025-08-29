// src/pages/Auth/Login.jsx
import React, { useState } from "react";
import {
  Button,
  TextField,
  Container,
  Typography,
  Paper,
  Box,
  IconButton,
  InputAdornment,
  CircularProgress,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import { keyframes } from "@emotion/react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { transform: translateX(-110%); opacity: 0; }
  40% { opacity: 1; }
  100% { transform: translateX(110%); opacity: 0; }
`;

/* Minimal grayscale theme */
const theme = createTheme({
  palette: {
    primary: { main: "#2b2b2b" },
    background: { default: "#ffffff", paper: "#ffffff" },
    text: { primary: "#0b1220", secondary: "#6b7280" },
  },
  typography: {
    fontFamily: ['"Inter"', "system-ui", "sans-serif"].join(","),
    h4: { fontWeight: 700, fontSize: "1.8rem", color: "#0b1220" }
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          padding: "44px 44px",
          animation: `${fadeIn} 320ms ease-out both`,
          boxShadow: "0 20px 40px rgba(8,12,20,0.06)"
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: 0,
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
            backgroundColor: "#ffffff",
            "& fieldset": { borderColor: "#e6e7ea" },
            "&:hover fieldset": { borderColor: "#d7d9dd" },
            "&.Mui-focused fieldset": { borderColor: "#2b2b2b", boxShadow: "0 0 0 4px rgba(43,43,43,0.04)" }
          },
          "& .MuiInputLabel-root": { color: "#8a8f98" },
          "& .MuiInputLabel-root.Mui-focused": { color: "#2b2b2b" }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: "12px 16px",
          fontWeight: 700,
          textTransform: "none",
          boxShadow: "0 8px 18px rgba(11,18,25,0.04)",
          "&:active": { transform: "translateY(0)" }
        }
      }
    }
  }
});

const ShimmerButton = styled(Button)(({ theme }) => ({
  position: "relative",
  overflow: "hidden",
  zIndex: 1,
  background: "#2b2b2b",
  color: "#fff",
  "&:hover": { background: "#1f1f1f" },
  "&::after": {
    content: '""',
    position: "absolute",
    left: "-120%",
    top: 0,
    height: "100%",
    width: "40%",
    transform: "skewX(-12deg)",
    background: "linear-gradient(90deg, rgba(255,255,255,0.03), rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
    opacity: 0,
    pointerEvents: "none"
  },
  "&:hover::after": {
    animation: `${shimmer} 900ms linear forwards`
  }
}));

export default function Login() {
  const [email, setEmail] = useState(localStorage.getItem("rememberedEmail") || "");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [rememberMe, setRememberMe] = useState(true); // ค่าเริ่มต้น true
  const navigate = useNavigate();

  const validateInputs = () => {
    if (!email.trim()) return "กรุณาใส่อีเมล";
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let emailToSend = email.trim();
    if (
      !emailToSend.includes("@") &&
      !emailToSend.includes(".com") &&
      !emailToSend.includes(".th") &&
      !emailToSend.includes(".ac.th")
    ) {
      emailToSend += "@gmail.com";
    }
    if (!re.test(emailToSend)) return "รูปแบบอีเมลไม่ถูกต้อง";
    if (!password) return "กรุณาใส่รหัสผ่าน";
    return null;
  };

  const handleLogin = async (e) => {
    e?.preventDefault();
    setErrMsg("");
    const v = validateInputs();
    if (v) { setErrMsg(v); return; }
    setLoading(true);

    let emailToSend = email.trim();
    if (
      !emailToSend.includes("@") &&
      !emailToSend.includes(".com") &&
      !emailToSend.includes(".th") &&
      !emailToSend.includes(".ac.th")
    ) {
      emailToSend += "@gmail.com";
    }

    try {
      // ✅ เรียกผ่าน axios instance ที่ baseURL = "/api"
      const res = await api.post("/auth/login", { email: emailToSend, password });
      const token = res?.data?.token;
      let user = res?.data?.user || null;

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      if (!token) throw new Error("โทเค็นจากเซิร์ฟเวอร์ไม่ถูกต้อง");

      // บางส่วนของโค้ดที่อื่นอาจใช้ชื่อ key ต่างกัน เก็บให้ครบ
      localStorage.setItem("token", token);
      localStorage.setItem("accessToken", token);

      // ถ้า login ไม่คืน user/role ลองดึงเพิ่มจาก /auth/me
      if (!user || !user.role) {
        try {
          const me = await api.get("/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          user = me?.data?.user || me?.data || user;
        } catch (e) {
          console.warn("whoami failed:", e?.response?.status || e.message);
        }
      }

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }
      if (user?.role) {
        localStorage.setItem("role", user.role);
      }

      const role = user?.role || localStorage.getItem("role") || "patient";
      if (role === "doctor") navigate("/doctor/home", { replace: true });
      else navigate("/patient/home", { replace: true });

    } catch (err) {
      console.error("Login error:", err);
      const serverMsg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        err?.message;
      setErrMsg(serverMsg || "เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบข้อมูลแล้วลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      {/* background image bgbw (grayscale) */}
      <Box sx={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        backgroundImage: `url('/bgbw.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "none",
      }} />

      <Container
        maxWidth={false}
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          px: 2,
          pt: { xs: 8, md: 10 }
        }}
      >
        <Box sx={{
          width: "100%",
          maxWidth: 520,
          mx: "auto",
          mt: { xs: 2, sm: "-6vh", md: "0vh" }
        }}>
          <Paper elevation={6}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography variant="h4" align="center">เข้าสู่ระบบ</Typography>

              <Typography variant="body1" align="center" sx={{ color: "text.secondary" }}>
                ใส่อีเมลและรหัสผ่านเพื่อเข้าสู่ระบบ
              </Typography>

              <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
                <TextField
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  autoComplete="email"
                  required
                  variant="outlined"
                  sx={{ mb: 3 }}
                />

                <TextField
                  label="Password"
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPwd(s => !s)}
                          edge="end"
                          aria-label={showPwd ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                          size="large"
                        >
                          {showPwd ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  sx={{ mb: 2 }}
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="จดจำฉัน"
                  sx={{ mb: 1 }}
                />

                {errMsg && (
                  <Box sx={{ mt: 1, mb: 1, p: 1, borderRadius: 1, bgcolor: "#fff6f6", color: "#7a1f1f" }}>
                    {errMsg}
                  </Box>
                )}

                <ShimmerButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={loading}
                  sx={{ mt: 2, py: 1.6 }}
                >
                  {loading ? <CircularProgress size={20} color="inherit" /> : "เข้าสู่ระบบ"}
                </ShimmerButton>

                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4, alignItems: "center" }}>
                  <Typography variant="body2" sx={{ color: "#374151" }}>
                    ยังไม่มีบัญชี? <a href="/register" style={{ color: "#374151", textDecoration: "underline" }}>สมัครสมาชิก</a>
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#374151" }}>
                    <a href="/forgot" style={{ color: "#374151", textDecoration: "underline" }}>ลืมรหัสผ่าน?</a>
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
}