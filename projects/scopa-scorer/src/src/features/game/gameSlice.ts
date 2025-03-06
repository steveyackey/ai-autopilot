import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Player {
  id: string;
  name: string;
  score: {
    carte: number;
    denari: number;
    settebello: number;
    scope: number;
    primiera: number;
    total: number;
    [key: string]: number; // Index signature for dynamic access
  };
}

interface GameState {
  players: Player[];
  currentRound: number;
  targetScore: number;
  isGameActive: boolean;
  gameHistory: {
    timestamp: number;
    players: Player[];
    winner: string;
    targetScore: number;
  }[];
  scoreHistory: {
    playerId: string;
    action: 'scopa' | 'update';
    timestamp: number;
    previousScore: Partial<Player['score']>;
    newScore: Partial<Player['score']>;
  }[];
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
  notification?: {
    message: string;
    type: 'increase' | 'decrease';
    timestamp: number;
  };
}

const initialState: GameState = {
  players: [],
  currentRound: 1,
  targetScore: 11,
  isGameActive: false,
  gameHistory: [],
  scoreHistory: [],
  lastScoreChange: undefined,
  confirmationRequired: {
    resetGame: true,
    newGame: true,
    endRound: false
  },
  notification: undefined
};

const calculateTotal = (player: Player) => {
  const { carte, denari, settebello, scope, primiera } = player.score;
  return carte + denari + settebello + scope + primiera;
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    startNewGame: (state, action: PayloadAction<{ players: string[], targetScore: number }>) => {
      state.players = action.payload.players.map(name => ({
        id: crypto.randomUUID(),
        name,
        score: { carte: 0, denari: 0, settebello: 0, scope: 0, primiera: 0, total: 0 }
      }));
      state.currentRound = 1;
      state.targetScore = action.payload.targetScore;
      state.isGameActive = true;
      state.scoreHistory = [];
      state.notification = {
        message: 'New game started',
        type: 'increase',
        timestamp: Date.now()
      };
    },
    
    addScopa: (state, action: PayloadAction<string>) => {
      const player = state.players.find(p => p.id === action.payload);
      if (player) {
        const previousScore = { ...player.score };
        player.score.scope += 1;
        player.score.total = calculateTotal(player);
        
        // Record the score change for animation
        state.lastScoreChange = {
          playerId: player.id,
          scoreType: 'scope',
          changeAmount: 1,
          timestamp: Date.now()
        };
        
        state.scoreHistory.push({
          playerId: player.id,
          action: 'scopa',
          timestamp: Date.now(),
          previousScore,
          newScore: { ...player.score }
        });
        
        // Create notification
        state.notification = {
          message: `${player.name} scored a scopa!`,
          type: 'increase',
          timestamp: Date.now()
        };
      }
    },
    
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
        const previousValue = player.score[scoreType];
        
        if (increment) {
          player.score[scoreType] += value;
        } else {
          player.score[scoreType] = value;
        }
        
        // Ensure non-negative scores
        player.score[scoreType] = Math.max(0, player.score[scoreType]);
        
        // Calculate the change amount
        const changeAmount = player.score[scoreType] - previousValue;
        
        // Record last change for animation
        state.lastScoreChange = {
          playerId,
          scoreType,
          changeAmount,
          timestamp: Date.now()
        };
        
        // Update the total score
        player.score.total = calculateTotal(player);
        
        // Add to score history
        state.scoreHistory.push({
          playerId: player.id,
          action: 'update',
          timestamp: Date.now(),
          previousScore,
          newScore: { ...player.score }
        });
        
        // Create notification if there was an actual change
        if (changeAmount !== 0) {
          const scoreTypeName = scoreType.charAt(0).toUpperCase() + scoreType.slice(1);
          
          state.notification = {
            message: `${player.name}: ${scoreTypeName} ${changeAmount > 0 ? '+' : ''}${changeAmount}`,
            type: changeAmount > 0 ? 'increase' : 'decrease',
            timestamp: Date.now()
          };
        }
      }
    },
    
    undoLastAction: (state) => {
      const lastAction = state.scoreHistory[state.scoreHistory.length - 1];
      if (lastAction) {
        const player = state.players.find(p => p.id === lastAction.playerId);
        if (player) {
          Object.assign(player.score, lastAction.previousScore);
        }
        state.scoreHistory.pop();
        
        // Create notification
        state.notification = {
          message: 'Last action undone',
          type: 'decrease',
          timestamp: Date.now()
        };
      }
    },
    
    endRound: (state) => {
      // If confirmation is required and this is the first attempt, set notification and return
      if (state.confirmationRequired.endRound && !state.notification?.message.includes('confirm')) {
        state.notification = {
          message: 'Please confirm ending the round',
          type: 'decrease',
          timestamp: Date.now()
        };
        return;
      }
      
      state.currentRound += 1;
      const winner = state.players.find(p => p.score.total >= state.targetScore);
      
      if (winner) {
        state.gameHistory.push({
          timestamp: Date.now(),
          players: JSON.parse(JSON.stringify(state.players)),
          winner: winner.id,
          targetScore: state.targetScore
        });
        state.isGameActive = false;
        
        // Create notification for winner
        state.notification = {
          message: `${winner.name} wins the game!`,
          type: 'increase',
          timestamp: Date.now()
        };
      } else {
        // Round ended but game continues
        state.notification = {
          message: `Round ${state.currentRound - 1} complete`,
          type: 'increase',
          timestamp: Date.now()
        };
      }
    },
    
    confirmEndRound: (state) => {
      state.currentRound += 1;
      const winner = state.players.find(p => p.score.total >= state.targetScore);
      
      if (winner) {
        state.gameHistory.push({
          timestamp: Date.now(),
          players: JSON.parse(JSON.stringify(state.players)),
          winner: winner.id,
          targetScore: state.targetScore
        });
        state.isGameActive = false;
        
        // Create notification for winner
        state.notification = {
          message: `${winner.name} wins the game!`,
          type: 'increase',
          timestamp: Date.now()
        };
      } else {
        // Round ended but game continues
        state.notification = {
          message: `Round ${state.currentRound - 1} complete`,
          type: 'increase',
          timestamp: Date.now()
        };
      }
    },
    
    resetGame: (state) => {
      state.players.forEach(player => {
        player.score = { carte: 0, denari: 0, settebello: 0, scope: 0, primiera: 0, total: 0 };
      });
      state.currentRound = 1;
      state.isGameActive = true;
      state.scoreHistory = [];
      
      // Create notification
      state.notification = {
        message: 'Game has been reset',
        type: 'decrease',
        timestamp: Date.now()
      };
    },
    
    requestNewGame: () => {
      // This action doesn't modify state, it's just a signal for the UI to show confirmation dialog
    },
    
    requestResetGame: () => {
      // This action doesn't modify state, it's just a signal for the UI to show confirmation dialog
    },
    
    dismissNotification: (state) => {
      state.notification = undefined;
    },
    
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

export const { 
  startNewGame, 
  addScopa, 
  updateRoundScore, 
  endRound, 
  confirmEndRound,
  resetGame,
  undoLastAction,
  requestNewGame,
  requestResetGame,
  dismissNotification,
  updateSettings
} = gameSlice.actions;

export default gameSlice.reducer;