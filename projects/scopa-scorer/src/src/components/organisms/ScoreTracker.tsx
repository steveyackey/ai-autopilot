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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { RootState } from '../../store';
import { addScopa, updateRoundScore, endRound } from '../../features/game/gameSlice';

export const ScoreTracker = () => {
  const dispatch = useDispatch();
  const { players, currentRound, isGameActive } = useSelector((state: RootState) => state.game);
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

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Round {currentRound}
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2 }}>
        {players.map((player) => (
          <Card key={player.id}>
            <CardContent>
              <Typography variant="h6">{player.name}</Typography>
              <Typography variant="h4" color="primary">
                {player.score.total}
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2">Points Breakdown:</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  <Chip label={`Carte: ${player.score.carte}`} size="small" />
                  <Chip label={`Denari: ${player.score.denari}`} size="small" />
                  <Chip label={`Settebello: ${player.score.settebello}`} size="small" />
                  <Chip label={`Scope: ${player.score.scope}`} size="small" />
                  <Chip label={`Primiera: ${player.score.primiera}`} size="small" />
                </Box>
              </Box>

              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleScopaClick(player.id)}
                  startIcon={<AddIcon />}
                >
                  Scopa
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    setSelectedPlayer(player.id);
                    setOpenScoring(true);
                  }}
                >
                  Update Score
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
          End Round
        </Button>
      </Box>

      <Dialog open={openScoring} onClose={() => setOpenScoring(false)}>
        <DialogTitle>Update Score</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gap: 2, mt: 2 }}>
            {['carte', 'denari', 'settebello', 'primiera'].map((type) => (
              <Box key={type} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography>{type.charAt(0).toUpperCase() + type.slice(1)}:</Typography>
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
          <Button onClick={() => setOpenScoring(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};