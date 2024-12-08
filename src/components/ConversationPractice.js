import React, { useState, useRef, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import chatGPTService from '../services/ai/chatGPTService';

const ConversationPractice = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [level, setLevel] = useState('intermediate');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    try {
      setIsLoading(true);
      const userMessage = input;
      setInput('');

      // Add user message to chat
      setMessages(prev => [...prev, { type: 'user', content: userMessage }]);

      // Get response from ChatGPT
      const response = await chatGPTService.conversationPractice(
        userMessage,
        level,
        messages.map(m => ({ role: m.type === 'user' ? 'user' : 'assistant', content: m.content }))
      );

      // Add AI response and corrections
      setMessages(prev => [
        ...prev,
        { type: 'assistant', content: response.reply }
      ]);

      // If there are corrections, add them
      if (response.corrections?.corrections?.length > 0) {
        setMessages(prev => [
          ...prev,
          {
            type: 'correction',
            content: response.corrections.corrections.join('\n'),
            suggestions: response.corrections.suggestions
          }
        ]);
      }
    } catch (error) {
      console.error('Error in conversation:', error);
      setMessages(prev => [
        ...prev,
        {
          type: 'error',
          content: 'Sorry, there was an error processing your message. Please try again.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, height: '70vh', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ mb: 2 }}>
          <FormControl fullWidth>
            <InputLabel>English Level</InputLabel>
            <Select
              value={level}
              label="English Level"
              onChange={(e) => setLevel(e.target.value)}
            >
              <MenuItem value="beginner">Beginner</MenuItem>
              <MenuItem value="intermediate">Intermediate</MenuItem>
              <MenuItem value="advanced">Advanced</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Messages Container */}
        <Box sx={{ 
          flexGrow: 1, 
          overflowY: 'auto', 
          mb: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          p: 2
        }}>
          {messages.map((message, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                mb: 1
              }}
            >
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  maxWidth: '80%',
                  backgroundColor: message.type === 'user' ? 'primary.light' : 
                                 message.type === 'correction' ? 'warning.light' : 
                                 message.type === 'error' ? 'error.light' : 
                                 'background.paper',
                  color: message.type === 'user' ? 'white' : 'text.primary'
                }}
              >
                <Typography variant="body1">{message.content}</Typography>
                {message.suggestions && (
                  <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {message.suggestions.map((suggestion, i) => (
                      <Chip
                        key={i}
                        label={suggestion}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                )}
              </Paper>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input Area */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <Button
            variant="contained"
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            endIcon={isLoading ? <CircularProgress size={20} /> : <SendIcon />}
          >
            Send
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ConversationPractice; 