import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
  Button,
  Collapse,
  Divider
} from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import FlipIcon from '@mui/icons-material/Flip';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { getLanguageEmoji } from '../utils/languageUtils';

const BilingualVocabularyCard = ({
  word,
  nativeLanguage,
  definition,
  pronunciation,
  examples,
  synonyms,
  antonyms,
  usage,
  onSave,
  isSaved
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showExamples, setShowExamples] = useState(false);

  const handleSpeak = (text, lang) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'en' ? 'en-US' : lang;
    window.speechSynthesis.speak(utterance);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <Card 
      sx={{ 
        maxWidth: 400,
        minHeight: 300,
        position: 'relative',
        transition: 'transform 0.6s',
        transformStyle: 'preserve-3d',
        transform: isFlipped ? 'rotateY(180deg)' : 'none'
      }}
    >
      {/* Front Side */}
      <Box sx={{ 
        display: isFlipped ? 'none' : 'block',
        p: 2
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="overline" color="text.secondary">
            Word of the Day
          </Typography>
          <IconButton onClick={() => onSave(word)}>
            {isSaved ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon />}
          </IconButton>
        </Box>

        <Box sx={{ textAlign: 'center', my: 3 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            {word}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {pronunciation}
          </Typography>
          <IconButton onClick={() => handleSpeak(word, 'en')}>
            <VolumeUpIcon />
          </IconButton>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="body1" paragraph>
          🇬🇧 {definition.english}
        </Typography>
        <Typography variant="body1" paragraph>
          {getLanguageEmoji(nativeLanguage)} {definition.native}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button 
            size="small" 
            onClick={() => setShowExamples(!showExamples)}
          >
            {showExamples ? 'Hide Examples' : 'Show Examples'}
          </Button>
          <IconButton onClick={handleFlip}>
            <FlipIcon />
          </IconButton>
        </Box>

        <Collapse in={showExamples}>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Examples:
            </Typography>
            {examples.english.map((example, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Typography variant="body2">
                  🇬🇧 {example}
                </Typography>
                <Typography variant="body2">
                  {getLanguageEmoji(nativeLanguage)} {examples.native[index]}
                </Typography>
              </Box>
            ))}
          </Box>
        </Collapse>
      </Box>

      {/* Back Side */}
      <Box sx={{ 
        display: isFlipped ? 'block' : 'none',
        p: 2,
        transform: 'rotateY(180deg)'
      }}>
        <Typography variant="h6" gutterBottom>
          Additional Information
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Synonyms:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {synonyms.english.map((syn, index) => (
              <Chip
                key={index}
                label={`${syn} (${synonyms.native[index]})`}
                size="small"
                onClick={() => handleSpeak(syn, 'en')}
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Antonyms:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {antonyms.english.map((ant, index) => (
              <Chip
                key={index}
                label={`${ant} (${antonyms.native[index]})`}
                size="small"
                color="secondary"
                onClick={() => handleSpeak(ant, 'en')}
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Usage Notes:
          </Typography>
          <Typography variant="body2" paragraph>
            🇬🇧 {usage.english}
          </Typography>
          <Typography variant="body2" paragraph>
            {getLanguageEmoji(nativeLanguage)} {usage.native}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <IconButton onClick={handleFlip}>
            <FlipIcon />
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
};

export default BilingualVocabularyCard; 