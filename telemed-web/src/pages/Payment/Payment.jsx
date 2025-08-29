// src/pages/Payment/Payment.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Card,
  CardContent,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
  List,
  ListItem,
  ListItemText,
  Chip
} from '@mui/material';
import {
  Payment as PaymentIcon,
  CreditCard,
  AccountBalance,
  QrCode,
  CheckCircle,
  Error as ErrorIcon
} from '@mui/icons-material';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../lib/api';

const steps = ['เลือกวิธีชำระเงิน', 'กรอกข้อมูล', 'ยืนยันการชำระ', 'สำเร็จ'];

export default function Payment() {
  const navigate = useNavigate();
  const { appointmentId } = useParams();
  const [searchParams] = useSearchParams();
  
  // Payment states
  const [activeStep, setActiveStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('promptpay');
  const [amount, setAmount] = useState(parseFloat(searchParams.get('amount')) || 500);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  // Appointment data
  const [appointment, setAppointment] = useState(null);
  const [loadingAppointment, setLoadingAppointment] = useState(true);
  
  // Form data
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    holderName: ''
  });
  
  // QR Code mock
  const [qrCodeUrl] = useState('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=promptpay-mock-payment');
  
  useEffect(() => {
    loadAppointment();
  }, [appointmentId]);
  
  const loadAppointment = async () => {
    try {
      // Mock appointment data - in real app would fetch from API
      setAppointment({
        id: appointmentId,
        doctor_name: 'นพ.สมชาย ใจดี',
        chosen_date: '2024-01-15',
        service: 'การปรึกษาออนไลน์',
        amount: amount
      });
    } catch (error) {
      console.error('Failed to load appointment:', error);
      setError('ไม่สามารถโหลดข้อมูลการนัดหมายได้');
    } finally {
      setLoadingAppointment(false);
    }
  };
  
  const handleNext = () => {
    if (activeStep === 0) {
      setActiveStep(1);
    } else if (activeStep === 1) {
      if (validateForm()) {
        setActiveStep(2);
      }
    } else if (activeStep === 2) {
      processPayment();
    }
  };
  
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  const validateForm = () => {
    if (paymentMethod === 'credit_card') {
      if (!cardData.cardNumber || !cardData.expiryDate || !cardData.cvv || !cardData.holderName) {
        setError('กรุณากรอกข้อมูลบัตรเครดิตให้ครบถ้วน');
        return false;
      }
      // Simple card number validation
      if (cardData.cardNumber.replace(/\s/g, '').length !== 16) {
        setError('หมายเลขบัตรไม่ถูกต้อง');
        return false;
      }
    }
    setError('');
    return true;
  };
  
  const processPayment = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Mock payment processing
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate processing time
      
      // Call actual payment API
      const response = await api.post(`/appointments/${appointmentId}/payment`, {
        amount: amount,
        payment_method: paymentMethod
      });
      
      if (response.data.payment) {
        setPaymentSuccess(true);
        setActiveStep(3);
      } else {
        throw new Error('การชำระเงินไม่สำเร็จ');
      }
    } catch (error) {
      console.error('Payment failed:', error);
      setError(error.response?.data?.error?.message || 'การชำระเงินไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };
  
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };
  
  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardData(prev => ({ ...prev, cardNumber: formatted }));
  };
  
  if (loadingAppointment) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  const renderPaymentMethodStep = () => (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>เลือกวิธีการชำระเงิน</Typography>
      
      <RadioGroup
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
      >
        <Card sx={{ mb: 2, border: paymentMethod === 'promptpay' ? '2px solid #2196F3' : '1px solid #e0e0e0' }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
            <FormControlLabel 
              value="promptpay" 
              control={<Radio />} 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <QrCode color="primary" />
                  <Box>
                    <Typography variant="subtitle1">PromptPay</Typography>
                    <Typography variant="body2" color="text.secondary">
                      ชำระผ่าน QR Code ด้วยแอปธนาคาร
                    </Typography>
                  </Box>
                </Box>
              }
            />
          </CardContent>
        </Card>
        
        <Card sx={{ border: paymentMethod === 'credit_card' ? '2px solid #2196F3' : '1px solid #e0e0e0' }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
            <FormControlLabel 
              value="credit_card" 
              control={<Radio />} 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CreditCard color="primary" />
                  <Box>
                    <Typography variant="subtitle1">บัตรเครดิต/เดบิต</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Visa, MasterCard, JCB
                    </Typography>
                  </Box>
                </Box>
              }
            />
          </CardContent>
        </Card>
      </RadioGroup>
    </Box>
  );
  
  const renderFormStep = () => (
    <Box sx={{ mt: 2 }}>
      {paymentMethod === 'promptpay' ? (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>สแกน QR Code เพื่อชำระเงิน</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <img src={qrCodeUrl} alt="PromptPay QR Code" style={{ maxWidth: 200, height: 'auto' }} />
          </Box>
          <Typography variant="body2" color="text.secondary">
            กรุณาสแกน QR Code ด้วยแอปธนาคารของคุณ
          </Typography>
          <Alert severity="info" sx={{ mt: 2 }}>
            จำนวนเงิน: {amount.toLocaleString()} บาท
          </Alert>
        </Box>
      ) : (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>ข้อมูลบัตรเครดิต/เดบิต</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="หมายเลขบัตร"
                fullWidth
                value={cardData.cardNumber}
                onChange={handleCardNumberChange}
                placeholder="0000 0000 0000 0000"
                inputProps={{ maxLength: 19 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="วันหมดอายุ (MM/YY)"
                fullWidth
                value={cardData.expiryDate}
                onChange={(e) => setCardData(prev => ({ ...prev, expiryDate: e.target.value }))}
                placeholder="MM/YY"
                inputProps={{ maxLength: 5 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="CVV"
                fullWidth
                value={cardData.cvv}
                onChange={(e) => setCardData(prev => ({ ...prev, cvv: e.target.value }))}
                placeholder="000"
                inputProps={{ maxLength: 3 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="ชื่อผู้ถือบัตร"
                fullWidth
                value={cardData.holderName}
                onChange={(e) => setCardData(prev => ({ ...prev, holderName: e.target.value }))}
                placeholder="ชื่อตามบัตร"
              />
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
  
  const renderConfirmStep = () => (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>ยืนยันการชำระเงิน</Typography>
      
      <List>
        <ListItem>
          <ListItemText
            primary="การนัดหมาย"
            secondary={`${appointment?.doctor_name} - ${appointment?.chosen_date}`}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="บริการ"
            secondary={appointment?.service}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="วิธีการชำระ"
            secondary={paymentMethod === 'promptpay' ? 'PromptPay' : 'บัตรเครดิต/เดบิต'}
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary={<Typography variant="h6">ยอดรวม</Typography>}
            secondary={<Typography variant="h5" color="primary">{amount.toLocaleString()} บาท</Typography>}
          />
        </ListItem>
      </List>
      
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>กำลังดำเนินการชำระเงิน...</Typography>
        </Box>
      )}
    </Box>
  );
  
  const renderSuccessStep = () => (
    <Box sx={{ mt: 2, textAlign: 'center' }}>
      <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
      <Typography variant="h5" sx={{ mb: 2 }}>ชำระเงินสำเร็จ!</Typography>
      <Typography variant="body1" sx={{ mb: 3 }} color="text.secondary">
        การชำระเงินของคุณเสร็จสิ้นแล้ว การนัดหมายได้รับการยืนยันแล้ว
      </Typography>
      
      <Card sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>รายละเอียดการชำระเงิน</Typography>
          <Typography variant="body2">
            Transaction ID: PAY{Date.now().toString().slice(-8)}
          </Typography>
          <Typography variant="body2">
            จำนวน: {amount.toLocaleString()} บาท
          </Typography>
          <Typography variant="body2">
            เวลา: {new Date().toLocaleString('th-TH')}
          </Typography>
        </CardContent>
      </Card>
      
      <Button
        variant="contained"
        size="large"
        onClick={() => navigate('/patient')}
        sx={{ mr: 2 }}
      >
        ไปยังแดชบอร์ด
      </Button>
      <Button
        variant="outlined"
        size="large"
        onClick={() => navigate(`/consultation/${appointmentId}`)}
      >
        เริ่มการปรึกษา
      </Button>
    </Box>
  );
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
          ชำระเงิน
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {/* Appointment Summary */}
        {appointment && activeStep < 3 && (
          <Card sx={{ mb: 3, bgcolor: 'grey.50' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>สรุปการนัดหมาย</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>แพทย์:</Typography>
                <Typography fontWeight="bold">{appointment.doctor_name}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>วันที่:</Typography>
                <Typography fontWeight="bold">{appointment.chosen_date}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>จำนวนเงิน:</Typography>
                <Typography fontWeight="bold" color="primary">{amount.toLocaleString()} บาท</Typography>
              </Box>
            </CardContent>
          </Card>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {/* Step Content */}
        {activeStep === 0 && renderPaymentMethodStep()}
        {activeStep === 1 && renderFormStep()}
        {activeStep === 2 && renderConfirmStep()}
        {activeStep === 3 && renderSuccessStep()}
        
        {/* Navigation Buttons */}
        {activeStep < 3 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              ย้อนกลับ
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading}
            >
              {activeStep === 2 ? 'ชำระเงิน' : 'ถัดไป'}
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
}