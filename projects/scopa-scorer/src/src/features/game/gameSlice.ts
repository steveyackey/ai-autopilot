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
}

const initialState: GameState = {
  players: [],
  currentRound: 1,
  targetScore: 11,
  isGameActive: false,
  gameHistory: [],
  scoreHistory: [],
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
    },
    
    addScopa: (state, action: PayloadAction<string>) => {
      const player = state.players.find(p => p.id === action.payload);
      if (player) {
        const previousScore = { ...player.score };
        player.score.scope += 1;
        player.score.total = calculateTotal(player);
        state.scoreHistory.push({
          playerId: player.id,
          action: 'scopa',
          timestamp: Date.now(),
          previousScore,
          newScore: { ...player.score }
        });
      }
    },
    
    updateRoundScore: (state, action: PayloadAction<{
      playerId: string,
      score: Partial<Omit<Player['score'], 'total'>>
    }>) => {
      const player = state.players.find(p => p.id === action.payload.playerId);
      if (player) {
        const previousScore = { ...player.score };
        Object.assign(player.score, action.payload.score);
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
    
    undoLastAction: (state) => {
      const lastAction = state.scoreHistory[state.scoreHistory.length - 1];
      if (lastAction) {
        const player = state.players.find(p => p.id === lastAction.playerId);
        if (player) {
          Object.assign(player.score, lastAction.previousScore);
        }
        state.scoreHistory.pop();
      }
    },
    
    endRound: (state) => {
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
      }
    },
    
    resetGame: (state) => {
      state.players.forEach(player => {
        player.score = { carte: 0, denari: 0, settebello: 0, scope: 0, primiera: 0, total: 0 };
      });
      state.currentRound = 1;
      state.isGameActive = true;
      state.scoreHistory = [];
    }
  }
});

export const { 
  startNewGame, 
  addScopa, 
  updateRoundScore, 
  endRound, 
  resetGame,
  undoLastAction 
} = gameSlice.actions;

export default gameSlice.reducer;