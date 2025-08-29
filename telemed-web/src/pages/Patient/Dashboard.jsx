// src/pages/Patient/Dashboard.jsx
import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Container,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
  IconButton
} from "@mui/material";
import {
  ErrorOutline as ErrorOutlineIcon,
  EventAvailable as EventAvailableIcon,
  Search,
  History,
  VideoCall,
  Payment,
  Add,
  PlayArrow,
  Receipt
} from "@mui/icons-material";
import api from "../../lib/api";
import { useNavigate } from "react-router-dom";

function formatDateTime(ts) {
  try {
    const d = new Date(ts);
    return d.toLocaleString("th-TH", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "-";
  }
}

function statusChip(status) {
  switch ((status || "").toLowerCase()) {
    case "confirmed":
    case "upcoming":
      return <Chip label="confirmed" size="small" color="primary" />;
    case "completed":
    case "done":
      return (
        <Chip
          label="completed"
          size="small"
          sx={{ bgcolor: "#E6FFFA", color: "#065F46" }}
        />
      );
    case "cancelled":
    case "rejected": // ✅ เพิ่ม case 'rejected'
      return (
        <Chip
          label={status} // ✅ ใช้ status ที่ส่งมาเป็น label
          size="small"
          sx={{ bgcolor: "#FFF1F2", color: "#7F1D1D" }}
        />
      );
    default:
      return <Chip label={status || "unknown"} size="small" />;
  }
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [appts, setAppts] = useState([]);
  const [err, setErr] = useState("");
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const r = await api.get("/appointments/me");
        if (!cancelled) setAppts(r?.data?.data || []);
      } catch (e) {
        console.error("fetch appointments error:", e);
        if (!cancelled) setErr("โหลดประวัติการนัดไม่สำเร็จ กรุณาลองใหม่");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // เรียงใหม่: ล่าสุดอยู่บน
  const history = (appts || [])
    .slice()
    .sort(
      (a, b) =>
        new Date(b.start_time || b.start || b.created_at) -
        new Date(a.start_time || a.start || a.created_at)
    );

  return (
    <Box sx={{ minHeight: "80vh", py: 4, bgcolor: "#f5f5f5" }}>
      <Container maxWidth="xl">
        {/* Welcome Section */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            สวัสดี {user?.full_name || 'ผู้ใช้'}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            ยินดีต้อนรับสู่แดชบอร์ดผู้ป่วย จัดการการนัดหมายและดูแลสุขภาพของคุณ
          </Typography>
        </Paper>
        
        {/* Quick Actions */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            เมนูด่วน
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => navigate('/patient/home')}>
                <CardContent>
                  <Search sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h6">ค้นหาแพทย์</Typography>
                  <Typography variant="body2" color="text.secondary">
                    ค้นหาและจองนัดกับแพทย์
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => navigate('/patient/history')}>
                <CardContent>
                  <History sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h6">ประวัติการรักษา</Typography>
                  <Typography variant="body2" color="text.secondary">
                    ดูประวัติและใบสั่งยา
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', opacity: 0.7 }}>
                <CardContent>
                  <VideoCall sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="h6" color="text.secondary">การปรึกษา</Typography>
                  <Typography variant="body2" color="text.secondary">
                    เข้าร่วมการปรึกษาออนไลน์
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', opacity: 0.7 }}>
                <CardContent>
                  <Payment sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="h6" color="text.secondary">การชำระเงิน</Typography>
                  <Typography variant="body2" color="text.secondary">
                    ชำระค่าบริการ
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
        
        {/* Recent Appointments */}
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              การนัดหมายล่าสุด
            </Typography>
            <Button 
              variant="outlined" 
              size="small" 
              onClick={() => navigate('/patient/home')}
              startIcon={<Add />}
            >
              จองนัดใหม่
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress />
            </Box>
          ) : err ? (
            <Box
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
                color: "error.main",
                p: 2,
              }}
            >
              <ErrorOutlineIcon />
              <Typography>{err}</Typography>
            </Box>
          ) : !history.length ? (
            <Box sx={{ py: 6, textAlign: "center", color: "text.secondary" }}>
              <Typography variant="body1">ยังไม่มีประวัติการนัด</Typography>
              <Button 
                variant="contained" 
                sx={{ mt: 2 }}
                onClick={() => navigate('/patient/home')}
                startIcon={<Add />}
              >
                จองนัดหมายแรก
              </Button>
            </Box>
          ) : (
            <List disablePadding>
              {history.slice(0, 5).map((a) => (
                <ListItem
                  key={a.id}
                  sx={{
                    mb: 1.2,
                    borderRadius: 2,
                    bgcolor: "background.paper",
                    boxShadow: "0 8px 22px rgba(16,24,40,0.06)",
                    px: { xs: 1, md: 2 },
                  }}
                  secondaryAction={
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      {statusChip(a.status)}
                      {a.status === 'confirmed' && (
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => {
                            // Mock consultation creation
                            const consultationId = `consult_${a.id}`;
                            navigate(`/consultation/${consultationId}`);
                          }}
                          title="เข้าร่วมการปรึกษา"
                        >
                          <PlayArrow />
                        </IconButton>
                      )}
                      {(a.status === 'confirmed' || a.status === 'pending') && (
                        <IconButton 
                          size="small" 
                          color="success"
                          onClick={() => navigate(`/payment/${a.id}?amount=500`)}
                          title="ชำระเงิน"
                        >
                          <Receipt />
                        </IconButton>
                      )}
                    </Box>
                  }
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: "primary.main" }}>
                      <EventAvailableIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
                        <Typography sx={{ fontWeight: 700 }}>
                          {a.title || "การปรึกษาออนไลน์"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          • {a.doctor_name || "แพทย์"}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {formatDateTime(a.start_time || a.start || a.created_at)}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
              {history.length > 5 && (
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Button 
                    variant="text" 
                    onClick={() => navigate('/patient/history')}
                  >
                    ดูทั้งหมด ({history.length} รายการ)
                  </Button>
                </Box>
              )}
            </List>
          )}
        </Paper>
        
        {/* Stats Section */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary.main">
                  {history.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  การนัดหมายทั้งหมด
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success.main">
                  {history.filter(a => a.status === 'completed').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  การรักษาเสร็จสิ้น
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="warning.main">
                  {history.filter(a => a.status === 'confirmed' || a.status === 'pending').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  นัดที่กำลังรอ
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}