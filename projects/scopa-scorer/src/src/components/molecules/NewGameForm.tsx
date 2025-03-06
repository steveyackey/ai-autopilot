import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Slider,
  IconButton,
  Stack,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

interface NewGameFormProps {
  onSubmit: (playerNames: string[], targetScore: number) => void;
  onCancel: () => void;
}

export const NewGameForm: React.FC<NewGameFormProps> = ({ onSubmit, onCancel }) => {
  const { t } = useTranslation();
  const [playerNames, setPlayerNames] = useState<string[]>(['', '']);
  const [targetScore, setTargetScore] = useState<number>(11);
  const [error, setError] = useState<string | null>(null);

  // Add a new player input field
  const handleAddPlayer = () => {
    if (playerNames.length < 4) {
      setPlayerNames([...playerNames, '']);
    }
  };

  // Remove a player at the specified index
  const handleRemovePlayer = (index: number) => {
    if (playerNames.length > 2) {
      const updatedPlayers = [...playerNames];
      updatedPlayers.splice(index, 1);
      setPlayerNames(updatedPlayers);
    }
  };

  // Update player name at the specified index
  const handlePlayerNameChange = (index: number, value: string) => {
    const updatedPlayers = [...playerNames];
    updatedPlayers[index] = value;
    setPlayerNames(updatedPlayers);
  };

  // Handle form submission with validation
  const handleSubmit = () => {
    // Validate that all player names are filled
    const hasEmptyNames = playerNames.some(name => !name.trim());
    if (hasEmptyNames) {
      setError(t('errors.emptyPlayerNames'));
      return;
    }

    // Validate uniqueness of player names
    const uniqueNames = new Set(playerNames.map(name => name.trim()));
    if (uniqueNames.size !== playerNames.length) {
      setError(t('errors.duplicatePlayerNames'));
      return;
    }

    // Validate target score
    if (targetScore < 1) {
      setError(t('errors.invalidTargetScore'));
      return;
    }

    // Clear error and submit
    setError(null);
    onSubmit(playerNames, targetScore);
  };

  const targetScoreMarks = [
    { value: 1, label: '1' },
    { value: 11, label: '11' },
    { value: 21, label: '21' },
  ];

  return (
    <Paper sx={{ p: 3, maxWidth: '500px', mx: 'auto' }}>
      <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
        {t('game.newGame')}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" noValidate autoComplete="off" sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          {t('game.playerNames')}
        </Typography>

        <List dense>
          {playerNames.map((name, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <ListItem
                secondaryAction={
                  playerNames.length > 2 && (
                    <IconButton
                      edge="end"
                      aria-label={`delete-player-${index + 1}`}
                      onClick={() => handleRemovePlayer(index)}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  )
                }
              >
                <TextField
                  fullWidth
                  label={`${t('game.player')} ${index + 1}`}
                  variant="outlined"
                  size="small"
                  value={name}
                  onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                  required
                  error={!name.trim()}
                  helperText={!name.trim() ? t('errors.required') : ''}
                  margin="dense"
                />
              </ListItem>
            </motion.div>
          ))}
        </List>

        {playerNames.length < 4 && (
          <Button
            startIcon={<PersonAddIcon />}
            onClick={handleAddPlayer}
            variant="outlined"
            size="small"
            sx={{ mt: 1 }}
            fullWidth
          >
            {t('game.addPlayer')}
          </Button>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          {t('game.targetScore')}
        </Typography>
        <Box sx={{ px: 2 }}>
          <Slider
            value={targetScore}
            min={1}
            max={21}
            step={1}
            marks={targetScoreMarks}
            valueLabelDisplay="auto"
            onChange={(_, value) => setTargetScore(value as number)}
          />
        </Box>
      </Box>

      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button variant="outlined" onClick={onCancel}>
          {t('common.cancel')}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={playerNames.some(name => !name.trim())}
        >
          {t('game.startGame')}
        </Button>
      </Stack>
    </Paper>
  );
};