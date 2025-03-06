import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
  Typography,
  Stack,
  Tooltip
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SettingsIcon from '@mui/icons-material/Settings';

import { resetGame, startNewGame } from '../../features/game/gameSlice';
import { ConfirmationDialog } from '../molecules/ConfirmationDialog';
import { NewGameForm } from '../molecules/NewGameForm';
import { RootState } from '../../store';
import { useTranslation } from 'react-i18next';

export const GameControls: React.FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { isGameActive, confirmationRequired } = useSelector((state: RootState) => state.game);

  // Dialog states
  const [showNewGameForm, setShowNewGameForm] = useState(false);
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  const [showNewGameConfirmation, setShowNewGameConfirmation] = useState(false);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Alt+N for new game
      if (event.altKey && event.key === 'n') {
        event.preventDefault();
        handleNewGameClick();
      }
      // Alt+R for reset game
      if (event.altKey && event.key === 'r') {
        event.preventDefault();
        handleResetGameClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameActive, confirmationRequired]);

  // Handle starting a new game
  const handleStartNewGame = (playerNames: string[], targetScore: number) => {
    dispatch(startNewGame({
      players: playerNames,
      targetScore
    }));
    setShowNewGameForm(false);
  };

  // Handle resetting the current game
  const handleResetGame = () => {
    dispatch(resetGame());
    setShowResetConfirmation(false);
  };

  // Initial click handlers that check if confirmation is needed
  const handleNewGameClick = () => {
    if (isGameActive && confirmationRequired?.newGame) {
      setShowNewGameConfirmation(true);
    } else {
      setShowNewGameForm(true);
    }
  };

  const handleResetGameClick = () => {
    if (isGameActive && confirmationRequired?.resetGame) {
      setShowResetConfirmation(true);
    } else {
      handleResetGame();
    }
  };

  // Confirmation handlers
  const handleNewGameConfirm = () => {
    setShowNewGameConfirmation(false);
    setShowNewGameForm(true);
  };

  return (
    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
      <Stack direction="row" spacing={2}>
        <Tooltip title={`${t('game.newGame')} (Alt+N)`} arrow>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PlayArrowIcon />}
            onClick={handleNewGameClick}
          >
            {t('game.newGame')}
          </Button>
        </Tooltip>

        <Tooltip title={`${t('game.resetGame')} (Alt+R)`} arrow>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<RestartAltIcon />}
            onClick={handleResetGameClick}
            disabled={!isGameActive}
          >
            {t('game.resetGame')}
          </Button>
        </Tooltip>
      </Stack>

      {/* New Game Confirmation Dialog */}
      <ConfirmationDialog
        open={showNewGameConfirmation}
        title={t('game.confirmNewGame')}
        message={t('game.newGameWarning')}
        confirmLabel={t('common.continue')}
        cancelLabel={t('common.cancel')}
        onConfirm={handleNewGameConfirm}
        onCancel={() => setShowNewGameConfirmation(false)}
        severity="warning"
      />

      {/* Reset Game Confirmation Dialog */}
      <ConfirmationDialog
        open={showResetConfirmation}
        title={t('game.confirmReset')}
        message={t('game.resetWarning')}
        confirmLabel={t('common.reset')}
        cancelLabel={t('common.cancel')}
        onConfirm={handleResetGame}
        onCancel={() => setShowResetConfirmation(false)}
        severity="warning"
      />

      {/* New Game Form Dialog */}
      <Dialog
        open={showNewGameForm}
        onClose={() => setShowNewGameForm(false)}
        fullWidth
        maxWidth="sm"
      >
        <NewGameForm
          onSubmit={handleStartNewGame}
          onCancel={() => setShowNewGameForm(false)}
        />
      </Dialog>
    </Box>
  );
};