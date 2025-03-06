# Component Design - Iteration 2

## Enhanced Scoring Interface

### ScoreTracker Component Enhancements

```jsx
// Enhanced ScoreTracker.tsx
import { useState, useCallback } from 'react';
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
  Checkbox,
  FormControlLabel,
  Zoom,
  Tooltip,
  Alert,
  Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import UndoIcon from '@mui/icons-material/Undo';
import { motion } from 'framer-motion';

import { RootState } from '../../store';
import { 
  addScopa, 
  updateRoundScore, 
  endRound, 
  undoLastAction,
  resetGame, 
  startNewGame
} from '../../features/game/gameSlice';
import { RulesReference } from './RulesReference';
import { useTranslation } from 'react-i18next';
import { ConfirmationDialog } from '../molecules/ConfirmationDialog';

// Component implementation with enhanced scoring controls and visual feedback
```

### New Components

1. **ScoreControl Component**
```jsx
// src/components/molecules/ScoreControl.tsx
import { useState } from 'react';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { motion } from 'framer-motion';

interface ScoreControlProps {
  label: string;
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
  max?: number;
  tooltipText?: string;
}

export const ScoreControl = ({ 
  label, 
  value, 
  onChange, 
  min = 0, 
  max = Infinity,
  tooltipText 
}: ScoreControlProps) => {
  // Implementation with +/- controls and animation feedback
};
```

2. **ConfirmationDialog Component**
```jsx
// src/components/molecules/ConfirmationDialog.tsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material';

interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  severity?: 'warning' | 'error' | 'info';
}

export const ConfirmationDialog = ({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  severity = 'warning'
}: ConfirmationDialogProps) => {
  // Implementation of reusable confirmation dialog
};
```

3. **ScoreChangeNotification Component**
```jsx
// src/components/atoms/ScoreChangeNotification.tsx
import { Snackbar, Alert } from '@mui/material';
import { motion } from 'framer-motion';

interface ScoreChangeNotificationProps {
  open: boolean;
  message: string;
  type: 'increase' | 'decrease';
  onClose: () => void;
}

export const ScoreChangeNotification = ({
  open,
  message,
  type,
  onClose
}: ScoreChangeNotificationProps) => {
  // Implementation of animated notification for score changes
};
```

## Game Management Features

### GameControls Component
```jsx
// src/components/organisms/GameControls.tsx
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

import { resetGame, startNewGame } from '../../features/game/gameSlice';
import { ConfirmationDialog } from '../molecules/ConfirmationDialog';
import { NewGameForm } from '../molecules/NewGameForm';
import { RootState } from '../../store';
import { useTranslation } from 'react-i18next';

export const GameControls = () => {
  // Implementation of new game and reset game functionality with confirmations
};
```

### NewGameForm Component
```jsx
// src/components/molecules/NewGameForm.tsx
import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Slider,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';

interface NewGameFormProps {
  onSubmit: (playerNames: string[], targetScore: number) => void;
  onCancel: () => void;
}

export const NewGameForm = ({ onSubmit, onCancel }: NewGameFormProps) => {
  // Implementation of new game setup form
};
```

## Redux State Update

### Enhanced Game Slice
```typescript
// src/features/game/gameSlice.ts

// Add new action types
interface GameState {
  // Existing properties
  lastScoreChange?: {
    playerId: string;
    scoreType: string;
    changeAmount: number;
    timestamp: number;
  };
  confirmationRequired: {
    resetGame: boolean;
    newGame: boolean;
    endRound: boolean;
  };
}

const initialState: GameState = {
  // Existing properties
  lastScoreChange: undefined,
  confirmationRequired: {
    resetGame: true,
    newGame: true,
    endRound: false
  }
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    // Existing reducers

    // Enhanced reducers
    updateRoundScore: (state, action: PayloadAction<{
      playerId: string,
      scoreType: string,
      value: number,
      increment?: boolean
    }>) => {
      const { playerId, scoreType, value, increment = false } = action.payload;
      const player = state.players.find(p => p.id === playerId);
      
      if (player && scoreType in player.score) {
        const previousScore = { ...player.score };
        
        if (increment) {
          player.score[scoreType] += value;
        } else {
          player.score[scoreType] = value;
        }
        
        // Ensure non-negative scores
        player.score[scoreType] = Math.max(0, player.score[scoreType]);
        
        // Record last change for animation
        state.lastScoreChange = {
          playerId,
          scoreType,
          changeAmount: player.score[scoreType] - previousScore[scoreType],
          timestamp: Date.now()
        };
        
        player.score.total = calculateTotal(player);
        state.scoreHistory.push({
          playerId: player.id,
          action: 'update',
          timestamp: Date.now(),
          previousScore,
          newScore: { ...player.score }
        });
      }
    },
    
    // New reducers for game management
    requestNewGame: (state) => {
      // Just marks that a new game was requested, UI will handle confirmation
    },
    
    requestResetGame: (state) => {
      // Just marks that a reset was requested, UI will handle confirmation
    },

    // Add settings management
    updateSettings: (state, action: PayloadAction<{
      confirmationRequired?: Partial<GameState['confirmationRequired']>
    }>) => {
      if (action.payload.confirmationRequired) {
        state.confirmationRequired = {
          ...state.confirmationRequired,
          ...action.payload.confirmationRequired
        };
      }
    }
  }
});
```

## Game Management Flow Diagram

```
┌───────────────────┐       ┌─────────────────────┐
│                   │       │                     │
│    GameControls   │       │     NewGameForm     │
│                   │       │                     │
└───────────┬───────┘       └──────────┬──────────┘
            │                          │
            │ ┌──────────────────────┐ │
            │ │                      │ │
            ├─┤ ConfirmationDialog   │◄┘
            │ │                      │
            │ └──────────────────────┘
            │
            │
            ▼
┌───────────────────┐       ┌─────────────────────┐
│                   │       │                     │
│    Redux Store    │──────►│  ScoreTracker       │
│                   │       │                     │
└───────────────────┘       └─────────────────────┘
```

## Interaction Patterns

### Score Update Interaction
1. User clicks +/- button on a score type
2. Visual feedback animation plays
3. Score updates in Redux store
4. Total score recalculates
5. Optional notification appears

### New Game Interaction
1. User clicks "New Game" button
2. Confirmation dialog appears (if enabled)
3. On confirm, New Game form opens
4. User enters player names and target score
5. Game initializes with new parameters

### Reset Game Interaction
1. User clicks "Reset Game" button
2. Confirmation dialog appears (if enabled)
3. On confirm, all scores reset to zero
4. Game state returns to round 1
5. Brief animation indicates successful reset