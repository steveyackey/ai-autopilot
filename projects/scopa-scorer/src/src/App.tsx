import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Paper } from '@mui/material';
import { RootState } from './store';
import { Header } from './components/organisms/Header';
import { GameSetup } from './components/pages/GameSetup';
import { ScoreTracker } from './components/organisms/ScoreTracker';
import { GameControls } from './components/organisms/GameControls';
import { MatchHistory } from './components/pages/MatchHistory';
import { Feedback } from './components/pages/Feedback'; // Import Feedback component

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
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          }
        }
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          }
        }
      }
    }
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
            <Paper 
              elevation={3}
              sx={{ 
                maxWidth: 900, 
                mx: 'auto', 
                p: 3, 
                mb: 4,
                boxShadow: theme.palette.mode === 'dark' ? '0 0 10px rgba(255,255,255,0.1)' : '0 0 15px rgba(0,0,0,0.1)'
              }}
            >
              {/* Game Controls always visible */}
              <GameControls />
              
              <Routes>
                <Route 
                  path="/" 
                  element={isGameActive ? <Navigate to="/game" /> : <GameSetup />} 
                />
                <Route 
                  path="/game" 
                  element={isGameActive ? <ScoreTracker /> : <Navigate to="/" />} 
                />
                <Route 
                  path="/history" 
                  element={<MatchHistory />} 
                />
                <Route 
                  path="/feedback" 
                  element={<Feedback />} 
                /> {/* Add Feedback route */}
              </Routes>
            </Paper>
          </Box>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
