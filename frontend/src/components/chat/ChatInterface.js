import React, { useEffect, useRef } from 'react';
import { Box, TextField, Button, Paper, Typography, Avatar, Grid } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import { useChat } from '../../contexts/ChatContext';

const ChatInterface = () => {
  const { messages, userInput, setUserInput, sendMessage, isLoading } = useChat();
  const messagesEndRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userInput.trim()) {
      sendMessage(userInput);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Paper elevation={3} sx={{ height: '70vh', display: 'flex', flexDirection: 'column', mb: 2 }}>
      <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h6">PRISM-X Patient Journey Assistant</Typography>
        <Typography variant="caption">Powered by Claude AI</Typography>
      </Box>
      
      <Box className="chat-container" sx={{ 
        flexGrow: 1, 
        p: 2, 
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {messages.map((message) => (
          <Box
            key={message.id}
            sx={{
              display: 'flex',
              justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
              mb: 2,
            }}
          >
            {message.sender === 'assistant' && (
              <Avatar sx={{ bgcolor: 'primary.main', mr: 1 }}>
                <SmartToyIcon />
              </Avatar>
            )}
            
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                maxWidth: '70%',
                bgcolor: message.sender === 'user' ? 'primary.light' : 'grey.100',
                color: message.sender === 'user' ? 'white' : 'text.primary',
                borderRadius: 2,
                borderBottomRightRadius: message.sender === 'user' ? 0 : 2,
                borderBottomLeftRadius: message.sender === 'assistant' ? 0 : 2,
              }}
            >
              <Typography variant="body1">{message.content}</Typography>
            </Paper>
            
            {message.sender === 'user' && (
              <Avatar sx={{ bgcolor: 'secondary.main', ml: 1 }}>
                <PersonIcon />
              </Avatar>
            )}
          </Box>
        ))}
        
        {isLoading && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', mr: 1 }}>
              <SmartToyIcon />
            </Avatar>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                bgcolor: 'grey.100',
                borderRadius: 2,
                borderBottomLeftRadius: 0,
              }}
            >
              <div className="typing-indicator">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </Paper>
          </Box>
        )}
        
        <div ref={messagesEndRef} />
      </Box>
      
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Grid container spacing={2}>
          <Grid item xs>
            <TextField
              fullWidth
              placeholder="Type your message..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              variant="outlined"
              disabled={isLoading}
            />
          </Grid>
          <Grid item>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              endIcon={<SendIcon />}
              disabled={!userInput.trim() || isLoading}
              sx={{ height: '100%' }}
            >
              Send
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default ChatInterface;