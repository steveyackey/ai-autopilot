import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  Menu,
  MenuItem,
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LanguageIcon from '@mui/icons-material/Language';
import { useState } from 'react';
import { RootState } from '../../store';
import { setTheme } from '../../features/settings/settingsSlice';
import { setLanguage } from '../../features/settings/settingsSlice';
import { useTranslation } from 'react-i18next';

export const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { theme, language } = useSelector((state: RootState) => state.settings);
  const [languageMenu, setLanguageMenu] = useState<null | HTMLElement>(null);

  const handleThemeToggle = () => {
    dispatch(setTheme(theme === 'light' ? 'dark' : 'light'));
  };

  const handleLanguageChange = (lang: 'en' | 'it') => {
    dispatch(setLanguage(lang));
    i18n.changeLanguage(lang);
    setLanguageMenu(null);
  };

  return (
    <AppBar position="static" color="primary" enableColorOnDark>
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ cursor: 'pointer' }} 
          onClick={() => navigate('/')}
        >
          {t('common.appName')}
        </Typography>

        <Box sx={{ flexGrow: 1, display: 'flex', gap: 2, ml: 3 }}>
          <Button 
            color="inherit" 
            onClick={() => navigate('/history')}
          >
            {t('history.title')}
          </Button>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton 
            color="inherit" 
            onClick={(e) => setLanguageMenu(e.currentTarget)}
            aria-label={t('settings.language')}
          >
            <LanguageIcon />
          </IconButton>
          <Menu
            anchorEl={languageMenu}
            open={Boolean(languageMenu)}
            onClose={() => setLanguageMenu(null)}
          >
            <MenuItem 
              onClick={() => handleLanguageChange('en')}
              selected={language === 'en'}
            >
              English
            </MenuItem>
            <MenuItem 
              onClick={() => handleLanguageChange('it')}
              selected={language === 'it'}
            >
              Italiano
            </MenuItem>
          </Menu>

          <IconButton 
            color="inherit" 
            onClick={handleThemeToggle}
            aria-label={t('settings.darkMode')}
          >
            {theme === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};