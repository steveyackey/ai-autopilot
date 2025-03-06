import { describe, it, expect } from 'vitest';
import gameReducer, {
  startNewGame,
  addScopa,
  updateRoundScore,
  undoLastAction,
  endRound,
  confirmEndRound,
  resetGame,
  dismissNotification,
  updateSettings
} from './gameSlice';

describe('game reducer', () => {
  it('should handle initial state', () => {
    const initialState = gameReducer(undefined, { type: 'unknown' });
    expect(initialState.players).toEqual([]);
    expect(initialState.currentRound).toEqual(1);
    expect(initialState.isGameActive).toEqual(false);
    expect(initialState.confirmationRequired).toEqual({
      resetGame: true,
      newGame: true,
      endRound: false
    });
    expect(initialState.lastScoreChange).toBeUndefined();
    expect(initialState.notification).toBeUndefined();
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
    expect(state.notification).toBeDefined();
    expect(state.notification?.type).toBe('increase');
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
      scoreHistory: [],
      lastScoreChange: undefined,
      confirmationRequired: {
        resetGame: true,
        newGame: true,
        endRound: false
      },
      notification: undefined
    };

    const state = gameReducer(initialState, addScopa('1'));
    expect(state.players[0].score.scope).toBe(1);
    expect(state.players[0].score.total).toBe(1);
    expect(state.scoreHistory.length).toBe(1);
    expect(state.lastScoreChange).toBeDefined();
    expect(state.lastScoreChange?.scoreType).toBe('scope');
    expect(state.notification?.message).toContain('scopa');
  });

  describe('updateRoundScore', () => {
    it('should handle updateRoundScore with new API', () => {
      const initialState = {
        players: [
          { id: '1', name: 'Player 1', score: { carte: 0, denari: 0, settebello: 0, scope: 0, primiera: 0, total: 0 } }
        ],
        currentRound: 1,
        targetScore: 11,
        isGameActive: true,
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
  
      // Set direct value
      const state = gameReducer(initialState, updateRoundScore({
        playerId: '1',
        scoreType: 'carte',
        value: 2
      }));
  
      expect(state.players[0].score.carte).toBe(2);
      expect(state.players[0].score.total).toBe(2);
      expect(state.lastScoreChange?.scoreType).toBe('carte');
      expect(state.lastScoreChange?.changeAmount).toBe(2);
    });
  
    it('should handle incremental score updates', () => {
      const initialState = {
        players: [
          { id: '1', name: 'Player 1', score: { carte: 2, denari: 0, settebello: 0, scope: 0, primiera: 0, total: 2 } }
        ],
        currentRound: 1,
        targetScore: 11,
        isGameActive: true,
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
  
      // Increment value
      const state = gameReducer(initialState, updateRoundScore({
        playerId: '1',
        scoreType: 'carte',
        value: 1,
        increment: true
      }));
  
      expect(state.players[0].score.carte).toBe(3);
      expect(state.players[0].score.total).toBe(3);
      expect(state.lastScoreChange?.changeAmount).toBe(1);
    });
  
    it('should prevent negative scores', () => {
      const initialState = {
        players: [
          { id: '1', name: 'Player 1', score: { carte: 1, denari: 0, settebello: 0, scope: 0, primiera: 0, total: 1 } }
        ],
        currentRound: 1,
        targetScore: 11,
        isGameActive: true,
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
  
      // Try to decrement below zero
      const state = gameReducer(initialState, updateRoundScore({
        playerId: '1',
        scoreType: 'carte',
        value: -5,
        increment: true
      }));
  
      expect(state.players[0].score.carte).toBe(0); // Should be clamped to 0
    });
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
      ],
      lastScoreChange: undefined,
      confirmationRequired: {
        resetGame: true,
        newGame: true,
        endRound: false
      },
      notification: undefined
    };

    const state = gameReducer(initialState, undoLastAction());
    expect(state.players[0].score.carte).toBe(0);
    expect(state.players[0].score.denari).toBe(0);
    expect(state.players[0].score.total).toBe(0);
    expect(state.scoreHistory.length).toBe(0);
    expect(state.notification?.message).toContain('undone');
  });

  describe('endRound handling', () => {
    it('should handle endRound and detect winner', () => {
      const initialState = {
        players: [
          { id: '1', name: 'Player 1', score: { carte: 6, denari: 3, settebello: 1, scope: 2, primiera: 0, total: 12 } }
        ],
        currentRound: 1,
        targetScore: 11,
        isGameActive: true,
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
  
      const state = gameReducer(initialState, endRound());
      expect(state.currentRound).toBe(2);
      expect(state.isGameActive).toBe(false);
      expect(state.gameHistory.length).toBe(1);
      expect(state.gameHistory[0].winner).toBe('1');
      expect(state.notification?.message).toContain('wins');
    });
  
    it('should require confirmation when configured', () => {
      const initialState = {
        players: [
          { id: '1', name: 'Player 1', score: { carte: 0, denari: 0, settebello: 0, scope: 0, primiera: 0, total: 0 } }
        ],
        currentRound: 1,
        targetScore: 11,
        isGameActive: true,
        gameHistory: [],
        scoreHistory: [],
        lastScoreChange: undefined,
        confirmationRequired: {
          resetGame: true,
          newGame: true,
          endRound: true // Confirmation required
        },
        notification: undefined
      };
  
      // First attempt should not advance round
      const stateAfterAttempt = gameReducer(initialState, endRound());
      expect(stateAfterAttempt.currentRound).toBe(1); // Still at round 1
      expect(stateAfterAttempt.notification?.message).toContain('confirm');
      
      // After confirmation, it should advance
      const stateAfterConfirm = gameReducer(stateAfterAttempt, confirmEndRound());
      expect(stateAfterConfirm.currentRound).toBe(2);
    });
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
      scoreHistory: [],
      lastScoreChange: undefined,
      confirmationRequired: {
        resetGame: true,
        newGame: true,
        endRound: false
      },
      notification: undefined
    };

    const state = gameReducer(initialState, resetGame());
    expect(state.currentRound).toBe(1);
    expect(state.isGameActive).toBe(true);
    expect(state.players[0].score.total).toBe(0);
    expect(state.scoreHistory.length).toBe(0);
    expect(state.notification?.message).toContain('reset');
  });

  it('should handle dismissNotification', () => {
    const initialState = {
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
      notification: {
        message: 'Test notification',
        type: 'increase' as const,
        timestamp: Date.now()
      }
    };

    const state = gameReducer(initialState, dismissNotification());
    expect(state.notification).toBeUndefined();
  });

  it('should handle updateSettings', () => {
    const initialState = {
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

    const state = gameReducer(initialState, updateSettings({
      confirmationRequired: {
        endRound: true,
        resetGame: false
      }
    }));

    expect(state.confirmationRequired.endRound).toBe(true);
    expect(state.confirmationRequired.resetGame).toBe(false);
    expect(state.confirmationRequired.newGame).toBe(true); // Should keep existing values
  });
});