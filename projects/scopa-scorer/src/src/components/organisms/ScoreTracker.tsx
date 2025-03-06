import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Stack,
  Divider,
  Checkbox,
  FormControlLabel,
  Tooltip,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import UndoIcon from '@mui/icons-material/Undo';
import { RootState } from '../../store';
import { 
  addScopa, 
  updateRoundScore, 
  endRound, 
  undoLastAction,
  confirmEndRound,
  dismissNotification
} from '../../features/game/gameSlice';
import { RulesReference } from './RulesReference';
import { ScoreControl } from '../molecules/ScoreControl';
import { ConfirmationDialog } from '../molecules/ConfirmationDialog';
import { ScoreChangeNotification } from '../atoms/ScoreChangeNotification';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export const ScoreTracker: React.FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { 
    players, 
    currentRound, 
    isGameActive, 
    scoreHistory, 
    notification, 
    confirmationRequired,
    lastScoreChange
  } = useSelector((state: RootState) => state.game);
  
  const [openScoring, setOpenScoring] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [showEndRoundConfirm, setShowEndRoundConfirm] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'increase' | 'decrease'>('increase');

  // Handle notifications from Redux store
  useEffect(() => {
    if (notification) {
      setNotificationMessage(notification.message);
      setNotificationType(notification.type);
      setNotificationVisible(true);
      
      // Auto dismiss after 3 seconds
      const timer = setTimeout(() => {
        setNotificationVisible(false);
        dispatch(dismissNotification());
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [notification, dispatch]);

  // Handle clicks on the Scopa button
  const handleScopaClick = useCallback((playerId: string) => {
    dispatch(addScopa(playerId));
  }, [dispatch]);

  // Handle ending the round with optional confirmation
  const handleEndRound = useCallback(() => {
    if (confirmationRequired.endRound) {
      setShowEndRoundConfirm(true);
    } else {
      dispatch(endRound());
    }
  }, [dispatch, confirmationRequired.endRound]);

  // Handle confirming the end of round
  const handleConfirmEndRound = useCallback(() => {
    setShowEndRoundConfirm(false);
    dispatch(confirmEndRound());
  }, [dispatch]);

  // Handle updating a specific score type
  const handleUpdateScore = useCallback((playerId: string, scoreType: string, value: number, increment: boolean = true) => {
    dispatch(updateRoundScore({ playerId, scoreType, value, increment }));
  }, [dispatch]);

  // Handle undoing the last action
  const handleUndo = useCallback(() => {
    dispatch(undoLastAction());
  }, [dispatch]);

  // Handle closing notification
  const handleCloseNotification = useCallback(() => {
    setNotificationVisible(false);
    dispatch(dismissNotification());
  }, [dispatch]);

  // Component for score dialog content
  const ScoreDialogContent = useCallback(() => {
    if (!selectedPlayer) return null;
    
    const player = players.find(p => p.id === selectedPlayer);
    if (!player) return null;
    
    return (
      <>
        <DialogTitle>
          {t('game.updateScoreFor', { player: player.name })}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <ScoreControl
              label={t('scoring.carte')}
              value={player.score.carte}
              onChange={(value) => handleUpdateScore(player.id, 'carte', value, false)}
              tooltipText={t('scoring.carteHelp')}
            />
            
            <ScoreControl
              label={t('scoring.denari')}
              value={player.score.denari}
              onChange={(value) => handleUpdateScore(player.id, 'denari', value, false)}
              tooltipText={t('scoring.denariHelp')}
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={player.score.settebello > 0}
                  onChange={(e) => handleUpdateScore(player.id, 'settebello', e.target.checked ? 1 : 0, false)}
                  color="primary"
                />
              }
              label={
                <Tooltip title={t('scoring.settebelloHelp')} arrow placement="right">
                  <Typography>{t('scoring.settebello')}</Typography>
                </Tooltip>
              }
            />
            
            <ScoreControl
              label={t('scoring.primiera')}
              value={player.score.primiera}
              onChange={(value) => handleUpdateScore(player.id, 'primiera', value, false)}
              tooltipText={t('scoring.primieraHelp')}
              max={1}
            />
            
            <Divider />
            
            <ScoreControl
              label={t('scoring.scope')}
              value={player.score.scope}
              onChange={(value) => handleUpdateScore(player.id, 'scope', value, false)}
              tooltipText={t('scoring.scopeHelp')}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenScoring(false)}>{t('common.close')}</Button>
        </DialogActions>
      </>
    );
  }, [selectedPlayer, players, handleUpdateScore, t]);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">
          {t('common.round')} {currentRound}
        </Typography>
        <Stack direction="row" spacing={1}>
          <Tooltip title={t('game.undoTooltip')} arrow>
            <span> {/* Wrap in span for disabled tooltip to work */}
              <Button
                variant="outlined"
                startIcon={<UndoIcon />}
                onClick={handleUndo}
                disabled={scoreHistory.length === 0}
              >
                {t('game.undo')}
              </Button>
            </span>
          </Tooltip>
          <RulesReference />
        </Stack>
      </Box>

      {/* Player cards grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2 }}>
        {players.map((player) => (
          <Card 
            key={player.id}
            component={motion.div}
            whileHover={{ 
              scale: 1.02,
              boxShadow: '0 5px 15px rgba(0,0,0,0.1)' 
            }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <CardContent>
              <Typography variant="h6">{player.name}</Typography>
              <AnimatePresence mode="wait">
                <motion.div
                  key={player.score.total}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Typography 
                    variant="h3" 
                    color="primary"
                    sx={{
                      fontWeight: 'bold',
                      textShadow: lastScoreChange?.playerId === player.id ? '0 0 5px rgba(25, 118, 210, 0.5)' : 'none',
                      transition: 'text-shadow 0.5s'
                    }}
                  >
                    {player.score.total}
                  </Typography>
                </motion.div>
              </AnimatePresence>
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2">{t('game.pointsBreakdown')}:</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  <motion.div whileHover={{ scale: 1.1 }}>
                    <Chip 
                      label={`${t('scoring.carte')}: ${player.score.carte}`} 
                      size="small"
                      color={lastScoreChange?.playerId === player.id && lastScoreChange?.scoreType === 'carte' ? 'primary' : 'default'}
                    />
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.1 }}>
                    <Chip 
                      label={`${t('scoring.denari')}: ${player.score.denari}`} 
                      size="small"
                      color={lastScoreChange?.playerId === player.id && lastScoreChange?.scoreType === 'denari' ? 'primary' : 'default'}
                    />
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.1 }}>
                    <Chip 
                      label={`${t('scoring.settebello')}: ${player.score.settebello}`}
                      size="small"
                      color={lastScoreChange?.playerId === player.id && lastScoreChange?.scoreType === 'settebello' ? 'primary' : 'default'}
                    />
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.1 }}>
                    <Chip 
                      label={`${t('scoring.scope')}: ${player.score.scope}`} 
                      size="small"
                      color={lastScoreChange?.playerId === player.id && lastScoreChange?.scoreType === 'scope' ? 'primary' : 'default'}
                    />
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.1 }}>
                    <Chip 
                      label={`${t('scoring.primiera')}: ${player.score.primiera}`} 
                      size="small"
                      color={lastScoreChange?.playerId === player.id && lastScoreChange?.scoreType === 'primiera' ? 'primary' : 'default'}
                    />
                  </motion.div>
                </Box>
              </Box>

              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleScopaClick(player.id)}
                  startIcon={<AddIcon />}
                  disabled={!isGameActive}
                >
                  {t('game.scopa')}
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    setSelectedPlayer(player.id);
                    setOpenScoring(true);
                  }}
                  disabled={!isGameActive}
                >
                  {t('game.updateScore')}
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* End Round button */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleEndRound}
          disabled={!isGameActive || players.length === 0}
        >
          {t('game.endRound')}
        </Button>
      </Box>

      {/* Score update dialog */}
      <Dialog 
        open={openScoring} 
        onClose={() => setOpenScoring(false)}
        fullWidth
        maxWidth="sm"
      >
        <ScoreDialogContent />
      </Dialog>

      {/* End round confirmation dialog */}
      <ConfirmationDialog
        open={showEndRoundConfirm}
        title={t('game.confirmEndRound')}
        message={t('game.endRoundWarning')}
        confirmLabel={t('common.endRound')}
        cancelLabel={t('common.cancel')}
        onConfirm={handleConfirmEndRound}
        onCancel={() => setShowEndRoundConfirm(false)}
        severity="warning"
      />

      {/* Score change notification */}
      <ScoreChangeNotification
        open={notificationVisible}
        message={notificationMessage}
        type={notificationType}
        onClose={handleCloseNotification}
      />
    </Box>
  );
};