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
  InputLabel,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import TranslateIcon from '@mui/icons-material/Translate';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import bilingualChatService from '../services/ai/bilingualChatService';
import { supportedLanguages, languageLevels } from '../services/i18n/languageConfig';

const BilingualConversation = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [level, setLevel] = useState('intermediate');
  const [nativeLanguage, setNativeLanguage] = useState('th'); // Default to Thai
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Text-to-speech function
  const speak = (text, language) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'en' ? 'en-US' : language;
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    try {
      setIsLoading(true);
      const userMessage = input;
      setInput('');

      // Add user message to chat
      setMessages(prev => [...prev, { 
        type: 'user', 
        content: userMessage,
        timestamp: new Date().toISOString()
      }]);

      // Get response from ChatGPT
      const response = await bilingualChatService.conversationPractice(
        userMessage,
        nativeLanguage,
        level,
        messages.map(m => ({ role: m.type === 'user' ? 'user' : 'assistant', content: m.content }))
      );

      // Add AI response
      setMessages(prev => [
        ...prev,
        { 
          type: 'assistant',
          content: response.reply,
          timestamp: new Date().toISOString()
        }
      ]);

      // If there are corrections, add them
      if (response.corrections?.corrections?.length > 0) {
        setMessages(prev => [
          ...prev,
          {
            type: 'correction',
            content: response.corrections.corrections.join('\n'),
            explanations: response.corrections.explanations,
            timestamp: new Date().toISOString()
          }
        ]);
      }
    } catch (error) {
      console.error('Error in conversation:', error);
      setMessages(prev => [
        ...prev,
        {
          type: 'error',
          content: 'Sorry, there was an error processing your message. Please try again.',
          timestamp: new Date().toISOString()
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

  const renderMessage = (message) => {
    const isAssistant = message.type === 'assistant';
    const parts = isAssistant ? message.content.split('\n') : [message.content];

    return (
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
        {parts.map((part, index) => (
          <Box key={index}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body1">{part}</Typography>
              {part.trim() && (
                <IconButton 
                  size="small"
                  onClick={() => speak(part, part.startsWith('🇬🇧') ? 'en' : nativeLanguage)}
                >
                  <VolumeUpIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
            {index < parts.length - 1 && <Divider sx={{ my: 1 }} />}
          </Box>
        ))}

        {message.explanations && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Explanations:
            </Typography>
            <Box sx={{ pl: 2 }}>
              {message.explanations.english.map((exp, i) => (
                <Typography key={i} variant="body2">
                  🇬🇧 {exp}
                </Typography>
              ))}
              {message.explanations.native.map((exp, i) => (
                <Typography key={i} variant="body2">
                  {getLanguageEmoji(nativeLanguage)} {exp}
                </Typography>
              ))}
            </Box>
          </Box>
        )}

        <Typography variant="caption" sx={{ display: 'block', mt: 1, textAlign: 'right' }}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </Typography>
      </Paper>
    );
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, height: '70vh', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Native Language</InputLabel>
            <Select
              value={nativeLanguage}
              label="Native Language"
              onChange={(e) => setNativeLanguage(e.target.value)}
            >
              {Object.entries(supportedLanguages).map(([code, lang]) => (
                <MenuItem key={code} value={code}>
                  {lang.nativeName} ({lang.name})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>English Level</InputLabel>
            <Select
              value={level}
              label="English Level"
              onChange={(e) => setLevel(e.target.value)}
            >
              {Object.entries(languageLevels).map(([key, labels]) => (
                <MenuItem key={key} value={key}>
                  {labels[nativeLanguage]} / {labels.en}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

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
              {renderMessage(message)}
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Type your message in English or ${supportedLanguages[nativeLanguage].name}...`}
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

const getLanguageEmoji = (language) => {
  const emojiMap = {
    th: '🇹🇭',
    vi: '🇻🇳',
    zh: '🇨🇳',
    ja: '🇯🇵',
    ko: '🇰🇷'
  };
  return emojiMap[language] || '🌏';
};

export default BilingualConversation; 