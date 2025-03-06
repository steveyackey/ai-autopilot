import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import { RootState } from './store';
import { Header } from './components/organisms/Header';
import { GameSetup } from './components/pages/GameSetup';
import { ScoreTracker } from './components/organisms/ScoreTracker';

function App() {
  const { theme: themeMode } = useSelector((state: RootState) => state.settings);
  const { isGameActive } = useSelector((state: RootState) => state.game);

  const theme = createTheme({
    palette: {
      mode: themeMode,
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
    },
  });

  // Register service worker for PWA
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter basename="/ai-autopilot">
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
            <Routes>
              <Route 
                path="/" 
                element={isGameActive ? <Navigate to="/game" /> : <GameSetup />} 
              />
              <Route 
                path="/game" 
                element={isGameActive ? <ScoreTracker /> : <Navigate to="/" />} 
              />
            </Routes>
          </Box>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
