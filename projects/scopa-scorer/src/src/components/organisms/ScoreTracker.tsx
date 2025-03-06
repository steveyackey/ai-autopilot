import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Stack,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import UndoIcon from '@mui/icons-material/Undo';
import { RootState } from '../../store';
import { addScopa, updateRoundScore, endRound, undoLastAction } from '../../features/game/gameSlice';
import { RulesReference } from './RulesReference';
import { useTranslation } from 'react-i18next';

export const ScoreTracker = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { players, currentRound, isGameActive, scoreHistory } = useSelector((state: RootState) => state.game);
  const [openScoring, setOpenScoring] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  const handleScopaClick = (playerId: string) => {
    dispatch(addScopa(playerId));
  };

  const handleEndRound = () => {
    dispatch(endRound());
  };

  const handleUpdateScore = (playerId: string, score: {
    carte?: number;
    denari?: number;
    settebello?: number;
    primiera?: number;
  }) => {
    dispatch(updateRoundScore({ playerId, score }));
  };

  const handleUndo = () => {
    dispatch(undoLastAction());
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">
          {t('common.round')} {currentRound}
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<UndoIcon />}
            onClick={handleUndo}
            disabled={scoreHistory.length === 0}
          >
            {t('game.undo')}
          </Button>
          <RulesReference />
        </Stack>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2 }}>
        {players.map((player) => (
          <Card key={player.id}>
            <CardContent>
              <Typography variant="h6">{player.name}</Typography>
              <Typography variant="h4" color="primary">
                {player.score.total}
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2">{t('game.pointsBreakdown')}:</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  <Chip label={`${t('scoring.carte')}: ${player.score.carte}`} size="small" />
                  <Chip label={`${t('scoring.denari')}: ${player.score.denari}`} size="small" />
                  <Chip label={`${t('scoring.settebello')}: ${player.score.settebello}`} size="small" />
                  <Chip label={`${t('scoring.scope')}: ${player.score.scope}`} size="small" />
                  <Chip label={`${t('scoring.primiera')}: ${player.score.primiera}`} size="small" />
                </Box>
              </Box>

              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleScopaClick(player.id)}
                  startIcon={<AddIcon />}
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
                >
                  {t('game.updateScore')}
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleEndRound}
          disabled={!isGameActive}
        >
          {t('game.endRound')}
        </Button>
      </Box>

      <Dialog open={openScoring} onClose={() => setOpenScoring(false)}>
        <DialogTitle>{t('game.updateScore')}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gap: 2, mt: 2 }}>
            {['carte', 'denari', 'settebello', 'primiera'].map((type) => (
              <Box key={type} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography>{t(`scoring.${type}`)}</Typography>
                <IconButton
                  size="small"
                  onClick={() => selectedPlayer && handleUpdateScore(selectedPlayer, { [type]: 1 })}
                >
                  <AddIcon />
                </IconButton>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenScoring(false)}>{t('common.close')}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};