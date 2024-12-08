import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import TranslateIcon from '@mui/icons-material/Translate';
import CultureIcon from '@mui/icons-material/Public';
import { getLanguageEmoji } from '../utils/languageUtils';

const CulturalContext = ({
  expression,
  nativeLanguage,
  meaning,
  culturalContext,
  equivalentExpressions,
  usageExamples
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleSpeak = (text, lang) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'en' ? 'en-US' : lang;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <Card sx={{ maxWidth: 600, mx: 'auto', mb: 3 }}>
      <CardContent>
        {/* Expression Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CultureIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h5" component="h2">
            {expression}
          </Typography>
          <IconButton 
            size="small" 
            onClick={() => handleSpeak(expression, 'en')}
            sx={{ ml: 1 }}
          >
            <VolumeUpIcon />
          </IconButton>
        </Box>

        {/* Meaning Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Meaning
          </Typography>
          <Typography paragraph>
            🇬🇧 {meaning.english}
          </Typography>
          <Typography paragraph>
            {getLanguageEmoji(nativeLanguage)} {meaning.native}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Cultural Context Section */}
        <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" color="text.secondary">
              Cultural Context
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography paragraph>
              🇬🇧 {culturalContext.english}
            </Typography>
            <Typography paragraph>
              {getLanguageEmoji(nativeLanguage)} {culturalContext.native}
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* Equivalent Expressions */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Similar Expressions
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {equivalentExpressions.map((expr, index) => (
              <Tooltip 
                key={index}
                title={
                  <Box>
                    <Typography variant="body2">
                      🇬🇧 {expr.english}
                    </Typography>
                    <Typography variant="body2">
                      {getLanguageEmoji(nativeLanguage)} {expr.native}
                    </Typography>
                  </Box>
                }
              >
                <Chip
                  label={expr.english}
                  onClick={() => handleSpeak(expr.english, 'en')}
                  icon={<TranslateIcon />}
                />
              </Tooltip>
            ))}
          </Box>
        </Box>

        {/* Usage Examples */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Usage Examples
          </Typography>
          {usageExamples.english.map((example, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography>
                  🇬🇧 {example}
                </Typography>
                <IconButton 
                  size="small"
                  onClick={() => handleSpeak(example, 'en')}
                >
                  <VolumeUpIcon fontSize="small" />
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <Typography>
                  {getLanguageEmoji(nativeLanguage)} {usageExamples.native[index]}
                </Typography>
                <IconButton 
                  size="small"
                  onClick={() => handleSpeak(usageExamples.native[index], nativeLanguage)}
                >
                  <VolumeUpIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default CulturalContext; 