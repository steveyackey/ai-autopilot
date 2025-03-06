import { useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { RootState } from '../../store';
import { useTranslation } from 'react-i18next';

export const MatchHistory = () => {
  const { gameHistory } = useSelector((state: RootState) => state.game);
  const { t } = useTranslation();

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Typography variant="h5" gutterBottom>
        {t('history.title')}
      </Typography>

      {gameHistory.length === 0 ? (
        <Typography color="textSecondary" align="center">
          {t('history.noGames')}
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('history.date')}</TableCell>
                <TableCell>{t('history.players')}</TableCell>
                <TableCell>{t('history.winner')}</TableCell>
                <TableCell align="right">{t('history.score')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {gameHistory.map((game, index) => {
                const winner = game.players.find(p => p.id === game.winner);
                return (
                  <TableRow key={game.timestamp}>
                    <TableCell>
                      {new Date(game.timestamp).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {game.players.map(p => p.name).join(', ')}
                    </TableCell>
                    <TableCell>{winner?.name}</TableCell>
                    <TableCell align="right">{winner?.score.total}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};