// src/pages/Patient/Home.jsx - Comprehensive Telemedicine Landing Page
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  MenuItem,
  Grid,
  Chip,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Modal,
  Stack,
} from "@mui/material";
import {
  Search,
  VideoCall,
  Chat,
  Payment,
  History,
  PersonAdd,
  Login,
  LocalHospital,
  AccessTime,
  Security,
  Phone,
  Email,
  Close
} from "@mui/icons-material";
import api from "../../lib/api";
import { useNavigate } from "react-router-dom";

export default function PatientHome() {
  const nav = useNavigate();
  const [specialties, setSpecialties] = useState([]);
  const [q, setQ] = useState("");
  const [spec, setSpec] = useState("");
  const [loadingSpecs, setLoadingSpecs] = useState(false);

  // search state
  const [searching, setSearching] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [searchErr, setSearchErr] = useState("");
  
  // modal states
  const [showFeatures, setShowFeatures] = useState(false);
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);
  
  // auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    setIsLoggedIn(!!token);
    setUserRole(role);
  }, []);

  useEffect(() => {
    (async () => {
      setLoadingSpecs(true);
      try {
        const r = await api.get("/specialties");
        setSpecialties(r?.data?.data || []);
      } catch (e) {
        console.error("load specialties", e);
      } finally {
        setLoadingSpecs(false);
      }
    })();
  }, []);

  const handleSearch = async () => {
    setSearching(true);
    setSearchErr("");
    setDoctors([]);
    try {
      // ส่ง specialty_id (backend รองรับ)
      const params = {};
      if (q) params.q = q;
      if (spec) params.specialty_id = spec;
      const r = await api.get("/doctors", { params });
      setDoctors(r?.data?.data || []);
    } catch (e) {
      console.error("search doctors error:", e);
      const msg = e?.response?.data?.error?.message || "ค้นหาไม่สำเร็จ กรุณาลองใหม่";
      setSearchErr(msg);
    } finally {
      setSearching(false);
    }
  };

  const handleChipClick = async (s) => {
    setSpec(s.id);
    setQ("");
    setSearching(true);
    setSearchErr("");
    setDoctors([]);
    try {
      const r = await api.get("/doctors", { params: { specialty_id: s.id } });
      setDoctors(r?.data?.data || []);
    } catch (e) {
      console.error("search by chip error:", e);
      const msg = e?.response?.data?.error?.message || "ค้นหาไม่สำเร็จ กรุณาลองใหม่";
      setSearchErr(msg);
    } finally {
      setSearching(false);
    }
  };

  const goBook = (doctor) => {
    const params = new URLSearchParams();
    params.set("doctorId", doctor.id);
    if (doctor.full_name) params.set("doctorName", doctor.full_name);
    nav(`/patient/book?${params.toString()}`);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  // --- helper: build full URL for userpic (handles absolute URL or relative /uploads/ path)
  const getUserpicUrl = (p) => {
    if (!p) return null;
    if (/^https?:\/\//i.test(p)) return p;
    // try to use axios baseURL if configured, otherwise return path as-is
    const base = api?.defaults?.baseURL || "";
    if (base) return `${base.replace(/\/$/, "")}${p}`;
    return p;
  };

  return (
    <Box sx={{ minHeight: "100vh", pt: 8, pb: 6 }}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Paper
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 3,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            mb: 4,
            textAlign: "center",
            boxShadow: "0 20px 40px rgba(102, 126, 234, 0.3)"
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
            ระบบการแพทย์ทางไกล Telemedicine
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            บริการปรึกษาแพทย์ออนไลน์ที่ทันสมัย ปลอดภัย และสะดวกสบาย
          </Typography>
          
          {!isLoggedIn ? (
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
              <Button
                variant="contained"
                size="large"
                startIcon={<PersonAdd />}
                onClick={() => nav("/register")}
                sx={{
                  bgcolor: "white",
                  color: "primary.main",
                  px: 4,
                  py: 1.5,
                  "&:hover": { bgcolor: "#f5f5f5" }
                }}
              >
                สมัครสมาชิก
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<Login />}
                onClick={() => nav("/login")}
                sx={{
                  borderColor: "white",
                  color: "white",
                  px: 4,
                  py: 1.5,
                  "&:hover": { bgcolor: "rgba(255,255,255,0.1)", borderColor: "white" }
                }}
              >
                เข้าสู่ระบบ
              </Button>
            </Stack>
          ) : (
            <Button
              variant="contained"
              size="large"
              onClick={() => nav(userRole === "doctor" ? "/doctor" : "/patient")}
              sx={{
                bgcolor: "white",
                color: "primary.main",
                px: 4,
                py: 1.5,
                "&:hover": { bgcolor: "#f5f5f5" }
              }}
            >
              ไปยังแดชบอร์ด
            </Button>
          )}
        </Paper>

        {/* Features Overview */}
        <Paper sx={{ p: 4, borderRadius: 2, mb: 4, boxShadow: "0 12px 24px rgba(0,0,0,0.1)" }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, textAlign: "center" }}>
            บริการหลักของเรา
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ 
                textAlign: "center", 
                p: 3, 
                borderRadius: 2,
                bgcolor: "rgba(102, 126, 234, 0.05)",
                border: "1px solid rgba(102, 126, 234, 0.1)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 25px rgba(102, 126, 234, 0.15)"
                }
              }}>
                <Search sx={{ fontSize: 56, color: "primary.main", mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: "primary.main" }}>
                  ค้นหาแพทย์
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                  ค้นหาและจองนัดปรึกษากับแพทย์เฉพาะทางได้ง่ายๆ
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small" 
                  onClick={() => setShowFeatures(true)}
                  sx={{ borderRadius: 20 }}
                >
                  เรียนรู้เพิ่มเติม
                </Button>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ 
                textAlign: "center", 
                p: 3, 
                borderRadius: 2,
                bgcolor: "rgba(76, 175, 80, 0.05)",
                border: "1px solid rgba(76, 175, 80, 0.1)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 25px rgba(76, 175, 80, 0.15)"
                }
              }}>
                <VideoCall sx={{ fontSize: 56, color: "success.main", mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: "success.main" }}>
                  ปรึกษาออนไลน์
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                  พบแพทย์ผ่าน Video Call หรือ Chat ได้ทุกที่ทุกเวลา
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small" 
                  onClick={() => setShowFeatures(true)}
                  sx={{ borderRadius: 20, borderColor: "success.main", color: "success.main" }}
                >
                  เรียนรู้เพิ่มเติม
                </Button>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ 
                textAlign: "center", 
                p: 3, 
                borderRadius: 2,
                bgcolor: "rgba(255, 152, 0, 0.05)",
                border: "1px solid rgba(255, 152, 0, 0.1)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 25px rgba(255, 152, 0, 0.15)"
                }
              }}>
                <Payment sx={{ fontSize: 56, color: "warning.main", mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: "warning.main" }}>
                  ชำระเงินออนไลน์
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                  รองรับ PromptPay และบัตรเครดิต ปลอดภัยและสะดวก
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small" 
                  onClick={() => setShowPaymentInfo(true)}
                  sx={{ borderRadius: 20, borderColor: "warning.main", color: "warning.main" }}
                >
                  ดูรายละเอียด
                </Button>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ 
                textAlign: "center", 
                p: 3, 
                borderRadius: 2,
                bgcolor: "rgba(156, 39, 176, 0.05)",
                border: "1px solid rgba(156, 39, 176, 0.1)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 25px rgba(156, 39, 176, 0.15)"
                }
              }}>
                <History sx={{ fontSize: 56, color: "secondary.main", mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: "secondary.main" }}>
                  ประวัติการรักษา
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                  เข้าถึงประวัติการรักษาและใบสั่งยาได้ตลอดเวลา
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small" 
                  disabled={!isLoggedIn} 
                  onClick={() => nav("/patient")}
                  sx={{ borderRadius: 20, borderColor: "secondary.main", color: "secondary.main" }}
                >
                  ดูประวัติ
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Doctor Search Section */}
        <Paper
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 2,
            boxShadow: "0 18px 40px rgba(16,24,40,0.06)",
            mb: 4,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
            ค้นหาแพทย์และ<Box component="span" sx={{ color: "primary.main" }}>จองนัดหมาย</Box>
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            ค้นหาแพทย์เฉพาะทางและจองนัดปรึกษาได้ทันที
          </Typography>

          <Grid container spacing={2} alignItems="flex-start">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="ค้นหา (ชื่อแพทย์)"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="เช่น นพ.สมชาย หรือ สมชาย"
                onKeyDown={onKeyDown}
                size="medium"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="สาขา"
                value={spec}
                onChange={(e) => setSpec(e.target.value)}
                helperText="เลือกสาขาเพื่อค้นหาให้เฉพาะเจาะจง"
                size="medium"
              >
                <MenuItem value="">ทั้งหมด</MenuItem>
                {specialties.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={2} sx={{ display: "flex", alignItems: "center" }}>
              <Button
                variant="contained"
                onClick={handleSearch}
                fullWidth
                disabled={searching}
                startIcon={searching ? <CircularProgress size={16} color="inherit" /> : null}
                sx={{ height: 44 }}
              >
                ค้นหา
              </Button>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
              สาขายอดนิยม
            </Typography>
            {loadingSpecs ? (
              <CircularProgress size={20} />
            ) : (
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {specialties.slice(0, 8).map((s) => (
                  <Chip
                    key={s.id}
                    label={s.name}
                    onClick={() => handleChipClick(s)}
                    clickable
                    sx={{
                      cursor: "pointer",
                      borderRadius: 2,
                      background: spec === s.id ? "rgba(43,111,178,0.08)" : undefined,
                      "&:hover": { transform: "translateY(-2px)" },
                      px: 1.5,
                      py: 0.6,
                      fontWeight: 600,
                    }}
                  />
                ))}
                {!specialties.length && <Typography color="text.secondary">ยังไม่มีข้อมูลสาขา</Typography>}
              </Box>
            )}
          </Box>
        </Paper>

        {/* Results */}
        <Paper sx={{ p: 2, borderRadius: 2, boxShadow: "0 12px 28px rgba(16,24,40,0.06)" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              ผลการค้นหา
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {searching ? "กำลังค้นหา..." : `${doctors.length} รายการ`}
            </Typography>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {searching ? (
            <Box sx={{ py: 6, display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          ) : searchErr ? (
            <Box sx={{ py: 4, textAlign: "center" }}>
              <Typography color="error.main">{searchErr}</Typography>
            </Box>
          ) : !doctors.length ? (
            <Box sx={{ py: 4, textAlign: "center", color: "text.secondary" }}>
              <Typography>ยังไม่มีผลลัพธ์ — ลองเปลี่ยนคำค้นหรือสาขา</Typography>
            </Box>
          ) : (
            <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
              <List disablePadding>
                {doctors.map((d) => {
                  const src = getUserpicUrl(d.userpic || d.user_pic || d.avatar || "");
                  return (
                    <React.Fragment key={d.id}>
                      <ListItem
                        sx={{
                          alignItems: "flex-start",
                          py: 2,
                          px: { xs: 1, md: 2 },
                          display: "flex",
                          gap: 2,
                        }}
                        secondaryAction={
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Button variant="outlined" size="small" onClick={() => nav(`/doctors/${d.id}`)}>
                              รายละเอียด
                            </Button>
                            <Button 
                              variant="contained" 
                              size="small" 
                              onClick={() => isLoggedIn ? goBook(d) : nav('/login')}
                            >
                              จอง{!isLoggedIn && ' (Login)'}
                            </Button>
                          </Box>
                        }
                      >
                        <ListItemAvatar>
                          <Avatar
                            src={src || undefined}
                            alt={d.full_name || "Doctor"}
                            sx={{ bgcolor: src ? "transparent" : "primary.main", width: 56, height: 56 }}
                          >
                            {!src && (d.full_name ? d.full_name.charAt(0) : "D")}
                          </Avatar>
                        </ListItemAvatar>

                        <ListItemText
                          primary={
                            <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
                              <Typography sx={{ fontWeight: 700 }}>{d.full_name}</Typography>
                              {d.email && (
                                <Typography variant="caption" color="text.secondary">
                                  • {d.email}
                                </Typography>
                              )}
                              {d.phone && (
                                <Typography variant="caption" color="text.secondary">
                                  • {d.phone}
                                </Typography>
                              )}
                            </Box>
                          }
                          secondary={d.bio || ""}
                        />
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  );
                })}
              </List>
            </Box>
          )}
        </Paper>

        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            คำแนะนำ: กดชื่อแพทย์เพื่อดูรายละเอียดหรือกด "จอง" เพื่อดำเนินการจอง {!isLoggedIn && "(ต้องเข้าสู่ระบบก่อน)"}
          </Typography>
        </Box>
        
        {/* Trust & Security Section */}
        <Paper sx={{ p: 4, borderRadius: 2, mt: 4, bgcolor: "#f8f9fa" }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, textAlign: "center" }}>
            ความปลอดภัยและความน่าเชื่อถือ
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: "center" }}>
                <Security sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>ปลอดภัยสูงสุด</Typography>
                <Typography variant="body2" color="text.secondary">
                  ข้อมูลส่วนตัวและการแพทย์ได้รับการเข้ารหัสและปกป้องตามมาตรฐานสากล
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: "center" }}>
                <LocalHospital sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>แพทย์ผู้เชี่ยวชาญ</Typography>
                <Typography variant="body2" color="text.secondary">
                  แพทย์ทุกท่านได้รับการรับรองและมีประสบการณ์ในการให้คำปรึกษาทางไกล
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: "center" }}>
                <AccessTime sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>บริการ 24/7</Typography>
                <Typography variant="body2" color="text.secondary">
                  พร้อมให้บริการทุกวันตลอด 24 ชั่วโมง เพื่อดูแลสุขภาพของคุณ
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        
        {/* Contact Section */}
        <Paper sx={{ p: 3, borderRadius: 2, mt: 4, textAlign: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>ติดต่อเรา</Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Phone sx={{ color: "primary.main" }} />
              <Typography>02-xxx-xxxx</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Email sx={{ color: "primary.main" }} />
              <Typography>support@telemed.com</Typography>
            </Box>
          </Stack>
        </Paper>

        {/* Features Modal */}
        <Modal open={showFeatures} onClose={() => setShowFeatures(false)}>
          <Box sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 600 },
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            p: 4,
            maxHeight: "80vh",
            overflow: "auto"
          }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>คุณสมบัติของระบบ</Typography>
              <IconButton onClick={() => setShowFeatures(false)}>
                <Close />
              </IconButton>
            </Box>
            
            <Stack spacing={3}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                  <Search color="primary" /> ค้นหาและจองนัดแพทย์
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • ค้นหาแพทย์เฉพาะทางตามอาการหรือสาขา<br/>
                  • เลือกช่วงเวลาที่สะดวกสำหรับการปรึกษา<br/>
                  • ระบบจองนัดอัตโนมัติแบบเรียลไทม์
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                  <VideoCall color="primary" /> ปรึกษาออนไลน์
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Video Call คุณภาพสูง HD<br/>
                  • ระบบ Chat สำหรับถาม-ตอบ<br/>
                  • บันทึกการปรึกษาอัตโนมัติ
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                  <History color="primary" /> ประวัติและใบสั่งยา
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • เก็บประวัติการรักษาทั้งหมด<br/>
                  • ดาวน์โหลดใบสั่งยาได้<br/>
                  • ติดตามผลการรักษา
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Modal>

        {/* Payment Info Modal */}
        <Modal open={showPaymentInfo} onClose={() => setShowPaymentInfo(false)}>
          <Box sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 500 },
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            p: 4
          }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>วิธีการชำระเงิน</Typography>
              <IconButton onClick={() => setShowPaymentInfo(false)}>
                <Close />
              </IconButton>
            </Box>
            
            <Stack spacing={2}>
              <Paper sx={{ p: 2, bgcolor: "#f8f9fa" }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>PromptPay</Typography>
                <Typography variant="body2" color="text.secondary">
                  ชำระเงินผ่าน QR Code PromptPay ได้ทันที ปลอดภัยและสะดวก
                </Typography>
              </Paper>
              
              <Paper sx={{ p: 2, bgcolor: "#f8f9fa" }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>บัตรเครดิต/เดบิต</Typography>
                <Typography variant="body2" color="text.secondary">
                  รองรับบัตร Visa, MasterCard, และ JCB<br/>
                  ระบบเข้ารหัสข้อมูลแบบ SSL
                </Typography>
              </Paper>
              
              <Box sx={{ mt: 2, p: 2, bgcolor: "primary.main", color: "white", borderRadius: 1 }}>
                <Typography variant="body2">
                  <strong>ค่าบริการ:</strong> เริ่มต้น 300 บาท/ครั้ง (ขึ้นอยู่กับสาขา)
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Modal>
        
      </Container>
    </Box>
  );
}
