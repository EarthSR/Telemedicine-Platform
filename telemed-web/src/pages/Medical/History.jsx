// src/pages/Medical/History.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tabs,
  Tab,
  Alert
} from '@mui/material';
import {
  History as HistoryIcon,
  LocalPharmacy,
  Description,
  Download,
  ExpandMore,
  CalendarMonth,
  Person,
  AccessTime,
  Medication,
  Print
} from '@mui/icons-material';
import api from '../../lib/api';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`medical-tabpanel-${index}`}
      aria-labelledby={`medical-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function MedicalHistory() {
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [prescriptionDialogOpen, setPrescriptionDialogOpen] = useState(false);
  
  // Mock data for demonstration
  const mockAppointments = [
    {
      id: 'A001',
      doctor_name: 'นพ.สมชาย ใจดี',
      chosen_date: '2024-01-15',
      status: 'completed',
      service: 'การปรึกษาออนไลน์',
      symptoms: 'ปวดหัว, ไข้',
      diagnosis: 'ไข้หวัดธรรมดา',
      notes: 'ควรพักผ่อนและดื่มน้ำมาก ๆ'
    },
    {
      id: 'A002',
      doctor_name: 'นพ.สุชาติ รักษาดี',
      chosen_date: '2024-01-10',
      status: 'completed',
      service: 'การปรึกษาออนไลน์',
      symptoms: 'ปวดท้อง, ท้องเสีย',
      diagnosis: 'อาหารเป็นพิษเล็กน้อย',
      notes: 'หลีกเลี่ยงอาหารเผ็ดและมันเป็นเวลา 3 วัน'
    }
  ];
  
  const mockPrescriptions = [
    {
      id: 'P001',
      consultation_id: 'C001',
      doctor_name: 'นพ.สมชาย ใจดี',
      created_at: '2024-01-15T10:30:00Z',
      details: {
        medications: [
          {
            name: 'พาราเซตามอล',
            dosage: '500mg',
            instructions: 'รับประทาน 3 ครั้งต่อวัน หลังอาหาร'
          },
          {
            name: 'วิตามินซี',
            dosage: '1000mg',
            instructions: 'รับประทานวันละ 1 เม็ด'
          }
        ],
        notes: 'ดื่มน้ำให้มาก พักผ่อนให้เพียงพอ หากอาการไม่ดีขึ้นภายใน 3 วัน กรุณามาตรวจซ้ำ'
      }
    },
    {
      id: 'P002',
      consultation_id: 'C002',
      doctor_name: 'นพ.สุชาติ รักษาดี',
      created_at: '2024-01-10T14:15:00Z',
      details: {
        medications: [
          {
            name: 'ลูก O.R.S',
            dosage: '1 ซอง',
            instructions: 'ละลายในน้ำเปล่า 200ml ดื่มเมื่อท้องเสีย'
          },
          {
            name: 'ยาแก้ปวดท้อง',
            dosage: '1 เม็ด',
            instructions: 'รับประทานเมื่อปวดท้อง ห่างอาหาร 30 นาที'
          }
        ],
        notes: 'หลีกเลี่ยงนม อาหารเผ็ด อาหารมัน ดื่มน้ำให้มาก'
      }
    }
  ];
  
  useEffect(() => {
    loadMedicalData();
  }, []);
  
  const loadMedicalData = async () => {
    try {
      // In production, these would be real API calls
      setAppointments(mockAppointments);
      setPrescriptions(mockPrescriptions);
    } catch (error) {
      console.error('Failed to load medical data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const openPrescriptionDialog = (prescription) => {
    setSelectedPrescription(prescription);
    setPrescriptionDialogOpen(true);
  };
  
  const closePrescriptionDialog = () => {
    setSelectedPrescription(null);
    setPrescriptionDialogOpen(false);
  };
  
  const handlePrintPrescription = (prescription) => {
    // Mock print functionality
    console.log('Printing prescription:', prescription);
    alert('สั่งพิมพ์ใบสั่งยาแล้ว');
  };
  
  const getStatusChip = (status) => {
    const statusConfig = {
      completed: { color: 'success', label: 'เสร็จสิ้น' },
      confirmed: { color: 'primary', label: 'ยืนยันแล้ว' },
      pending: { color: 'warning', label: 'รอยืนยัน' },
      cancelled: { color: 'error', label: 'ยกเลิก' }
    };
    
    const config = statusConfig[status] || { color: 'default', label: status };
    return <Chip size="small" color={config.color} label={config.label} />;
  };
  
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>กำลังโหลดข้อมูล...</Typography>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab 
              icon={<HistoryIcon />} 
              label="ประวัติการรักษา" 
              iconPosition="start"
            />
            <Tab 
              icon={<LocalPharmacy />} 
              label="ใบสั่งยา" 
              iconPosition="start"
            />
          </Tabs>
        </Box>
        
        {/* Medical History Tab */}
        <TabPanel value={tabValue} index={0}>
          <Typography variant="h5" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <HistoryIcon />
            ประวัติการรักษา
          </Typography>
          
          {appointments.length === 0 ? (
            <Alert severity="info">ยังไม่มีประวัติการรักษา</Alert>
          ) : (
            <Grid container spacing={3}>
              {appointments.map((appointment) => (
                <Grid item xs={12} key={appointment.id}>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <Person />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6">{appointment.doctor_name}</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <CalendarMonth fontSize="small" />
                              <Typography variant="body2" color="text.secondary">
                                {new Date(appointment.chosen_date).toLocaleDateString('th-TH')}
                              </Typography>
                            </Box>
                            {getStatusChip(appointment.status)}
                          </Box>
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" color="primary">บริการ</Typography>
                          <Typography variant="body2" sx={{ mb: 2 }}>{appointment.service}</Typography>
                          
                          <Typography variant="subtitle2" color="primary">อาการที่แจ้ง</Typography>
                          <Typography variant="body2" sx={{ mb: 2 }}>{appointment.symptoms}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" color="primary">การวินิจฉัย</Typography>
                          <Typography variant="body2" sx={{ mb: 2 }}>{appointment.diagnosis}</Typography>
                          
                          <Typography variant="subtitle2" color="primary">คำแนะนำ</Typography>
                          <Typography variant="body2">{appointment.notes}</Typography>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>
        
        {/* Prescriptions Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h5" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocalPharmacy />
            ใบสั่งยา
          </Typography>
          
          {prescriptions.length === 0 ? (
            <Alert severity="info">ยังไม่มีใบสั่งยา</Alert>
          ) : (
            <Grid container spacing={3}>
              {prescriptions.map((prescription) => (
                <Grid item xs={12} md={6} key={prescription.id}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                        <Box>
                          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Medication />
                            ใบสั่งยา #{prescription.id}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {prescription.doctor_name}
                          </Typography>
                        </Box>
                        <IconButton 
                          onClick={() => handlePrintPrescription(prescription)}
                          title="พิมพ์ใบสั่งยา"
                        >
                          <Print />
                        </IconButton>
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <AccessTime fontSize="small" />
                          {new Date(prescription.created_at).toLocaleString('th-TH')}
                        </Typography>
                      </Box>
                      
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>รายการยา:</Typography>
                      <List dense>
                        {prescription.details.medications.map((med, index) => (
                          <ListItem key={index} sx={{ pl: 0 }}>
                            <ListItemText
                              primary={`${med.name} (${med.dosage})`}
                              secondary={med.instructions}
                              primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                              secondaryTypographyProps={{ variant: 'caption' }}
                            />
                          </ListItem>
                        ))}
                      </List>
                      
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => openPrescriptionDialog(prescription)}
                        sx={{ mt: 1 }}
                      >
                        ดูรายละเอียด
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>
      </Paper>
      
      {/* Prescription Detail Dialog */}
      <Dialog
        open={prescriptionDialogOpen}
        onClose={closePrescriptionDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          รายละเอียดใบสั่งยา
          {selectedPrescription && (
            <Typography variant="subtitle1" color="text.secondary">
              {selectedPrescription.doctor_name} - {new Date(selectedPrescription.created_at).toLocaleDateString('th-TH')}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent dividers>
          {selectedPrescription && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>รายการยาและวิธีใช้</Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ชื่อยา</TableCell>
                      <TableCell>ขนาด</TableCell>
                      <TableCell>วิธีใช้</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedPrescription.details.medications.map((med, index) => (
                      <TableRow key={index}>
                        <TableCell>{med.name}</TableCell>
                        <TableCell>{med.dosage}</TableCell>
                        <TableCell>{med.instructions}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {selectedPrescription.details.notes && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>คำแนะนำเพิ่มเติม</Typography>
                  <Alert severity="info">
                    {selectedPrescription.details.notes}
                  </Alert>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closePrescriptionDialog}>ปิด</Button>
          <Button 
            variant="contained" 
            onClick={() => selectedPrescription && handlePrintPrescription(selectedPrescription)}
            startIcon={<Print />}
          >
            พิมพ์
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}