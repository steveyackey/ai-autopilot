import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  language: 'en' | 'it';
  theme: 'light' | 'dark';
  soundEnabled: boolean;
}

const initialState: SettingsState = {
  language: 'en',
  theme: 'light',
  soundEnabled: true,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<'en' | 'it'>) => {
      state.language = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    toggleSound: (state) => {
      state.soundEnabled = !state.soundEnabled;
    },
  },
});

export const { setLanguage, setTheme, toggleSound } = settingsSlice.actions;
export default settingsSlice.reducer;