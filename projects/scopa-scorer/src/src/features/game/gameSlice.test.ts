import { describe, it, expect } from 'vitest';
import gameReducer, {
  startNewGame,
  addScopa,
  updateRoundScore,
  undoLastAction,
  endRound,
  resetGame
} from './gameSlice';

describe('game reducer', () => {
  it('should handle initial state', () => {
    expect(gameReducer(undefined, { type: 'unknown' })).toEqual({
      players: [],
      currentRound: 1,
      targetScore: 11,
      isGameActive: false,
      gameHistory: [],
      scoreHistory: []
    });
  });

  it('should handle startNewGame', () => {
    const players = ['Player 1', 'Player 2'];
    const targetScore = 15;
    const state = gameReducer(undefined, startNewGame({ players, targetScore }));

    expect(state.players.length).toBe(2);
    expect(state.players[0].name).toBe('Player 1');
    expect(state.players[1].name).toBe('Player 2');
    expect(state.targetScore).toBe(15);
    expect(state.isGameActive).toBe(true);
  });

  it('should handle addScopa', () => {
    const initialState = {
      players: [
        { id: '1', name: 'Player 1', score: { carte: 0, denari: 0, settebello: 0, scope: 0, primiera: 0, total: 0 } },
        { id: '2', name: 'Player 2', score: { carte: 0, denari: 0, settebello: 0, scope: 0, primiera: 0, total: 0 } }
      ],
      currentRound: 1,
      targetScore: 11,
      isGameActive: true,
      gameHistory: [],
      scoreHistory: []
    };

    const state = gameReducer(initialState, addScopa('1'));
    expect(state.players[0].score.scope).toBe(1);
    expect(state.players[0].score.total).toBe(1);
    expect(state.scoreHistory.length).toBe(1);
  });

  it('should handle updateRoundScore', () => {
    const initialState = {
      players: [
        { id: '1', name: 'Player 1', score: { carte: 0, denari: 0, settebello: 0, scope: 0, primiera: 0, total: 0 } }
      ],
      currentRound: 1,
      targetScore: 11,
      isGameActive: true,
      gameHistory: [],
      scoreHistory: []
    };

    const state = gameReducer(initialState, updateRoundScore({
      playerId: '1',
      score: { carte: 1, denari: 1 }
    }));

    expect(state.players[0].score.carte).toBe(1);
    expect(state.players[0].score.denari).toBe(1);
    expect(state.players[0].score.total).toBe(2);
  });

  it('should handle undoLastAction', () => {
    const initialState = {
      players: [
        { id: '1', name: 'Player 1', score: { carte: 1, denari: 1, settebello: 0, scope: 0, primiera: 0, total: 2 } }
      ],
      currentRound: 1,
      targetScore: 11,
      isGameActive: true,
      gameHistory: [],
      scoreHistory: [
        {
          playerId: '1',
          action: 'update' as const,
          timestamp: Date.now(),
          previousScore: { carte: 0, denari: 0, settebello: 0, scope: 0, primiera: 0, total: 0 },
          newScore: { carte: 1, denari: 1, settebello: 0, scope: 0, primiera: 0, total: 2 }
        }
      ]
    };

    const state = gameReducer(initialState, undoLastAction());
    expect(state.players[0].score.carte).toBe(0);
    expect(state.players[0].score.denari).toBe(0);
    expect(state.players[0].score.total).toBe(0);
    expect(state.scoreHistory.length).toBe(0);
  });

  it('should handle endRound and detect winner', () => {
    const initialState = {
      players: [
        { id: '1', name: 'Player 1', score: { carte: 6, denari: 3, settebello: 1, scope: 2, primiera: 0, total: 12 } }
      ],
      currentRound: 1,
      targetScore: 11,
      isGameActive: true,
      gameHistory: [],
      scoreHistory: []
    };

    const state = gameReducer(initialState, endRound());
    expect(state.currentRound).toBe(2);
    expect(state.isGameActive).toBe(false);
    expect(state.gameHistory.length).toBe(1);
    expect(state.gameHistory[0].winner).toBe('1');
  });

  it('should handle resetGame', () => {
    const initialState = {
      players: [
        { id: '1', name: 'Player 1', score: { carte: 1, denari: 1, settebello: 1, scope: 1, primiera: 1, total: 5 } }
      ],
      currentRound: 3,
      targetScore: 11,
      isGameActive: false,
      gameHistory: [],
      scoreHistory: []
    };

    const state = gameReducer(initialState, resetGame());
    expect(state.currentRound).toBe(1);
    expect(state.isGameActive).toBe(true);
    expect(state.players[0].score.total).toBe(0);
    expect(state.scoreHistory.length).toBe(0);
  });
});