import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useTranslation } from 'react-i18next';

export const RulesReference = () => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const scoringRules = [
    { category: 'carte', description: t('rules.carteDescription'), points: 1 },
    { category: 'denari', description: t('rules.denariDescription'), points: 1 },
    { category: 'settebello', description: t('rules.settebelloDescription'), points: 1 },
    { category: 'scope', description: t('rules.scopeDescription'), points: 1 },
    { category: 'primiera', description: t('rules.primieraDescription'), points: 1 },
  ];

  const primieraValues = [
    { card: '7', value: 21 },
    { card: '6', value: 18 },
    { card: '1', value: 16 },
    { card: '5', value: 15 },
    { card: '4', value: 14 },
    { card: '3', value: 13 },
    { card: '2', value: 12 },
  ];

  return (
    <>
      <IconButton color="primary" onClick={() => setOpen(true)} aria-label={t('common.rules')}>
        <HelpOutlineIcon />
      </IconButton>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{t('rules.title')}</DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            {t('rules.scoringRules')}
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t('rules.category')}</TableCell>
                <TableCell>{t('rules.description')}</TableCell>
                <TableCell align="center">{t('rules.points')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {scoringRules.map((rule) => (
                <TableRow key={rule.category}>
                  <TableCell component="th" scope="row">
                    {t(`scoring.${rule.category}`)}
                  </TableCell>
                  <TableCell>{rule.description}</TableCell>
                  <TableCell align="center">{rule.points}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              {t('rules.primieraValues')}
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t('rules.card')}</TableCell>
                  <TableCell align="center">{t('rules.value')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {primieraValues.map((card) => (
                  <TableRow key={card.card}>
                    <TableCell component="th" scope="row">
                      {card.card}
                    </TableCell>
                    <TableCell align="center">{card.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>{t('common.close')}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};