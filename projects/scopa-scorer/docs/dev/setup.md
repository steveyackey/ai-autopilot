# Scopa Scorer Setup Instructions

## Development Environment Setup

### Prerequisites

- Node.js (v16+)
- npm (v8+)
- Git

### Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd scopa-scorer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   This will start a development server at `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── atoms/       # Smallest UI components
│   ├── molecules/   # Combinations of atoms
│   ├── organisms/   # Larger components combining molecules
│   └── pages/       # Full page components
├── features/        # Redux slices and logic
│   ├── game/        # Game state management
│   └── settings/    # App settings management
├── i18n/            # Internationalization files
├── store/           # Redux store configuration
└── test/            # Test setup and utilities
```

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run test`: Run tests
- `npm run typecheck`: Run TypeScript type checking
- `npm run lint`: Lint the codebase
- `npm run format`: Format code with Prettier

## Dependencies

Main libraries used in the project:

- **UI Framework**: React with TypeScript
- **State Management**: Redux Toolkit
- **UI Components**: Material-UI (MUI)
- **Animations**: Framer Motion
- **Internationalization**: i18next
- **Routing**: React Router
- **Storage**: redux-persist
- **Build Tool**: Vite
- **Testing**: Vitest with React Testing Library

## Development Workflow

1. Make changes to the codebase
2. Run tests (`npm run test`)
3. Check TypeScript types (`npm run typecheck`)
4. Lint code (`npm run lint`)
5. Format code (`npm run format`)
6. Create a pull request

## New in Iteration 2

For Iteration 2, we've added additional dependencies:

- `framer-motion` for animations
- `@mui/icons-material` for additional icons

The following new components have been added:

1. `ScoreControl` - Interactive +/- controls for scoring
2. `ConfirmationDialog` - Reusable confirmation dialogs
3. `ScoreChangeNotification` - Toast notifications for score changes
4. `GameControls` - Game management controls (New Game/Reset Game)
5. `NewGameForm` - Form for configuring new games

## Testing the New Features

1. Start a new game with multiple players
2. Test the score controls (+/- buttons)
3. Test the confirmation dialogs for game management
4. Test the visual feedback when scores change
5. Test keyboard shortcuts (Alt+N for new game, Alt+R for reset)