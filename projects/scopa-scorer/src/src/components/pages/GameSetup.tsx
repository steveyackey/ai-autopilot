import { useState, ChangeEvent } from 'react';
import { useDispatch } from 'react-redux';
import {
  Box,
  Button,
  TextField,
  Typography,
  Slider,
  Paper,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { startNewGame } from '../../features/game/gameSlice';

export const GameSetup = () => {
  const dispatch = useDispatch();
  const [players, setPlayers] = useState<string[]>(['', '']);
  const [targetScore, setTargetScore] = useState<number>(11);

  const handlePlayerNameChange = (index: number, name: string) => {
    const newPlayers = [...players];
    newPlayers[index] = name;
    setPlayers(newPlayers);
  };

  const addPlayer = () => {
    if (players.length < 4) {
      setPlayers([...players, '']);
    }
  };

  const removePlayer = (index: number) => {
    if (players.length > 2) {
      const newPlayers = players.filter((_, i) => i !== index);
      setPlayers(newPlayers);
    }
  };

  const handleStartGame = () => {
    if (players.every(name => name.trim()) && players.length >= 2) {
      dispatch(startNewGame({ players: players.map(p => p.trim()), targetScore }));
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          New Game
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography gutterBottom>Players ({players.length}/4)</Typography>
          {players.map((player, index) => (
            <Box key={index} sx={{ display: 'flex', mb: 2, gap: 1 }}>
              <TextField
                fullWidth
                label={`Player ${index + 1}`}
                value={player}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handlePlayerNameChange(index, e.target.value)}
              />
              {players.length > 2 && (
                <IconButton
                  color="error"
                  onClick={() => removePlayer(index)}
                >
                  <RemoveIcon />
                </IconButton>
              )}
            </Box>
          ))}
          {players.length < 4 && (
            <Button
              startIcon={<AddIcon />}
              onClick={addPlayer}
              variant="outlined"
              fullWidth
            >
              Add Player
            </Button>
          )}
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography gutterBottom>Target Score: {targetScore}</Typography>
          <Slider
            value={targetScore}
            onChange={(_: Event, value: number | number[]) => setTargetScore(Array.isArray(value) ? value[0] : value)}
            min={1}
            max={21}
            step={1}
            marks
            valueLabelDisplay="auto"
          />
        </Box>

        <Button
          variant="contained"
          fullWidth
          onClick={handleStartGame}
          disabled={!players.every(name => name.trim()) || players.length < 2}
        >
          Start Game
        </Button>
      </Paper>
    </Box>
  );
};