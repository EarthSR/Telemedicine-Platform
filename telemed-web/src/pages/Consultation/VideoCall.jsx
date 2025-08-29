// src/pages/Consultation/VideoCall.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  IconButton,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Stack
} from '@mui/material';
import {
  Videocam,
  VideocamOff,
  Mic,
  MicOff,
  CallEnd,
  Chat,
  Send,
  Close,
  PictureInPicture,
  Fullscreen,
  ScreenShare,
  StopScreenShare
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../lib/api';

export default function VideoCall() {
  const { consultationId } = useParams();
  const navigate = useNavigate();
  
  // Video call states
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callStatus, setCallStatus] = useState('connecting'); // connecting, connected, ended
  
  // Chat states
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  
  // Consultation data
  const [consultation, setConsultation] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Video refs
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  
  // Current user
  const [currentUser, setCurrentUser] = useState(null);
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setCurrentUser(user);
    loadConsultation();
    // Initialize mock video call
    initializeMockVideoCall();
  }, [consultationId]);
  
  const loadConsultation = async () => {
    try {
      const response = await api.get(`/consultations/${consultationId}`);
      setConsultation(response.data.consultation);
      setCallStatus('connected');
    } catch (error) {
      console.error('Failed to load consultation:', error);
      setCallStatus('ended');
    } finally {
      setLoading(false);
    }
  };
  
  const initializeMockVideoCall = () => {
    // Mock video initialization
    setTimeout(() => {
      setCallStatus('connected');
      // Add some mock messages
      setMessages([
        {
          id: 1,
          sender: 'doctor',
          message: 'สวัสดีครับ วันนี้มีอาการอะไรบ้างครับ?',
          timestamp: new Date(Date.now() - 5000)
        },
        {
          id: 2,
          sender: 'patient',
          message: 'สวัสดีค่ะ มีอาการปวดหัวและไข้เล็กน้อยค่ะ',
          timestamp: new Date(Date.now() - 3000)
        }
      ]);
    }, 2000);
  };
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message = {
      id: Date.now(),
      sender: currentUser?.role || 'patient',
      message: newMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    // Mock auto-reply from other party
    setTimeout(() => {
      const autoReply = {
        id: Date.now() + 1,
        sender: currentUser?.role === 'doctor' ? 'patient' : 'doctor',
        message: 'ขอบคุณสำหรับข้อมูลค่ะ/ครับ',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, autoReply]);
    }, 1000);
  };
  
  const handleEndCall = async () => {
    try {
      await api.patch(`/consultations/${consultationId}/status`, {
        status: 'completed'
      });
      navigate('/patient');
    } catch (error) {
      console.error('Failed to end call:', error);
      navigate('/patient');
    }
  };
  
  const toggleVideo = () => setIsVideoOn(!isVideoOn);
  const toggleAudio = () => setIsAudioOn(!isAudioOn);
  const toggleScreenShare = () => setIsScreenSharing(!isScreenSharing);
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography>กำลังโหลด...</Typography>
      </Box>
    );
  }
  
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: '#f5f5f5'
    }}>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Header */}
        <Paper sx={{ p: 2, mb: 2, borderRadius: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                การปรึกษาออนไลน์
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  สถานะ: {callStatus === 'connected' ? 'เชื่อมต่อแล้ว' : 
                          callStatus === 'connecting' ? 'กำลังเชื่อมต่อ' : 'สิ้นสุดการเชื่อมต่อ'}
                </Typography>
                <Chip
                  label={callStatus === 'connected' ? 'ออนไลน์' : 'ออฟไลน์'}
                  color={callStatus === 'connected' ? 'success' : 'default'}
                  size="small"
                />
              </Box>
            </Box>
            <Button
              variant="contained"
              color="error"
              onClick={handleEndCall}
              startIcon={<CallEnd />}
            >
              จบการปรึกษา
            </Button>
          </Box>
        </Paper>
        
        <Grid container spacing={2}>
          {/* Video Section */}
          <Grid item xs={12} md={showChat ? 8 : 12}>
            <Paper sx={{ 
              height: '500px',
              position: 'relative',
              bgcolor: '#000',
              borderRadius: 1,
              overflow: 'hidden'
            }}>
              {/* Remote Video (Main) */}
              <Box sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                backgroundImage: 'url(https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}>
                {/* Video Status */}
                <Box sx={{
                  position: 'absolute',
                  top: 10,
                  left: 10,
                  bgcolor: 'rgba(0,0,0,0.6)',
                  borderRadius: 1,
                  px: 1.5,
                  py: 0.5
                }}>
                  <Typography variant="body2" sx={{ color: 'white' }}>
                    {currentUser?.role === 'doctor' ? 'ผู้ป่วย' : 'แพทย์'}
                  </Typography>
                </Box>
                
                {callStatus !== 'connected' && (
                  <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    bgcolor: 'rgba(0,0,0,0.7)',
                    borderRadius: 1,
                    p: 2
                  }}>
                    <Typography variant="body1" sx={{ color: 'white' }}>
                      กำลังเชื่อมต่อ...
                    </Typography>
                  </Box>
                )}
                
                {/* Local Video (Picture in Picture) */}
                <Box sx={{
                  position: 'absolute',
                  bottom: 10,
                  right: 10,
                  width: 160,
                  height: 120,
                  bgcolor: '#333',
                  borderRadius: 1,
                  border: '2px solid white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  backgroundImage: isVideoOn ? 'url(https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=160)' : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}>
                  <Box sx={{
                    position: 'absolute',
                    bottom: 4,
                    left: 4,
                    bgcolor: 'rgba(0,0,0,0.7)',
                    borderRadius: 1,
                    px: 1,
                    py: 0.5
                  }}>
                    <Typography variant="caption" sx={{ color: 'white' }}>
                      คุณ
                    </Typography>
                  </Box>
                  
                  {!isVideoOn && (
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}>
                      <VideocamOff sx={{ fontSize: 30, mb: 0.5 }} />
                      <Typography variant="caption">
                        กล้องปิด
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
              
              {/* Video Controls */}
              <Box sx={{
                position: 'absolute',
                bottom: 10,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: 1,
                bgcolor: 'rgba(0,0,0,0.7)',
                borderRadius: 2,
                p: 1
              }}>
                <IconButton
                  onClick={toggleVideo}
                  sx={{ 
                    color: 'white',
                    bgcolor: isVideoOn ? 'rgba(33, 150, 243, 0.7)' : 'rgba(244, 67, 54, 0.7)'
                  }}
                >
                  {isVideoOn ? <Videocam /> : <VideocamOff />}
                </IconButton>
                <IconButton
                  onClick={toggleAudio}
                  sx={{ 
                    color: 'white',
                    bgcolor: isAudioOn ? 'rgba(33, 150, 243, 0.7)' : 'rgba(244, 67, 54, 0.7)'
                  }}
                >
                  {isAudioOn ? <Mic /> : <MicOff />}
                </IconButton>
                <IconButton
                  onClick={toggleScreenShare}
                  sx={{ 
                    color: 'white',
                    bgcolor: isScreenSharing ? 'rgba(76, 175, 80, 0.7)' : 'rgba(158, 158, 158, 0.5)'
                  }}
                >
                  {isScreenSharing ? <StopScreenShare /> : <ScreenShare />}
                </IconButton>
                <IconButton
                  onClick={() => setShowChat(!showChat)}
                  sx={{ 
                    color: 'white', 
                    bgcolor: showChat ? 'rgba(156, 39, 176, 0.7)' : 'rgba(158, 158, 158, 0.5)'
                  }}
                >
                  <Chat />
                </IconButton>
              </Box>
            </Paper>
          </Grid>
          
          {/* Chat Section */}
          {showChat && (
            <Grid item xs={12} md={4}>
              <Paper sx={{ 
                height: '500px',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 1
              }}>
                {/* Chat Header */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  p: 2,
                  borderBottom: '1px solid #e0e0e0',
                  bgcolor: '#f5f5f5'
                }}>
                  <Typography variant="h6" sx={{ color: '#333', fontWeight: 600 }}>
                    💬 แชท
                  </Typography>
                  <IconButton onClick={() => setShowChat(false)} sx={{ color: '#666' }}>
                    <Close />
                  </IconButton>
                </Box>
                
                {/* Messages */}
                <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
                  <List dense>
                    {messages.map((msg) => (
                      <ListItem key={msg.id} sx={{
                        display: 'flex',
                        flexDirection: msg.sender === currentUser?.role ? 'row-reverse' : 'row',
                        alignItems: 'flex-start'
                      }}>
                        <Box sx={{
                          maxWidth: '70%',
                          bgcolor: msg.sender === currentUser?.role ? '#2196F3' : '#e0e0e0',
                          color: msg.sender === currentUser?.role ? 'white' : '#333',
                          borderRadius: 2,
                          p: 1.5,
                          m: 0.5,
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                          <Typography variant="body2">{msg.message}</Typography>
                          <Typography variant="caption" sx={{ opacity: 0.7, fontSize: '0.7rem' }}>
                            {msg.timestamp.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                          </Typography>
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                </Box>
                
                {/* Message Input */}
                <Box sx={{ 
                  p: 2, 
                  borderTop: '1px solid #e0e0e0',
                  display: 'flex',
                  gap: 1,
                  bgcolor: '#fafafa'
                }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="พิมพ์ข้อความ..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'white'
                      }
                    }}
                  />
                  <IconButton 
                    onClick={handleSendMessage}
                    sx={{ 
                      color: 'white', 
                      bgcolor: '#2196F3',
                      '&:hover': {
                        bgcolor: '#1976D2'
                      }
                    }}
                  >
                    <Send />
                  </IconButton>
                </Box>
              </Paper>
            </Grid>
          )}
        </Grid>
        
        {/* Patient Info Panel */}
        <Paper sx={{ 
          p: 3, 
          mt: 2,
          borderRadius: 1
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
            📋 ข้อมูลการปรึกษา
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>ID การปรึกษา:</strong> {consultationId}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>สถานะ:</strong> {callStatus === 'connected' ? '✅ เชื่อมต่อแล้ว' : '🔄 กำลังเชื่อมต่อ'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>เวลาเริ่มต้น:</strong> {new Date().toLocaleString('th-TH')}
              </Typography>
              <Typography variant="body2">
                <strong>แพทย์:</strong> {currentUser?.role === 'doctor' ? 'คุณ (แพทย์)' : 'นพ.สมชาย ใจดี'}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}