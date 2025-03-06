# Technical Decisions

## Technology Stack

### Frontend
- **Framework**: React with TypeScript
  - Provides strong typing and component reusability
  - Large ecosystem and community support
  - Excellent performance for interactive applications
  
- **State Management**: Redux Toolkit
  - Centralized state management for game scores and history
  - DevTools for debugging
  - Predictable state updates
  - Robust action history for undo functionality

- **UI Components**: Material-UI (MUI)
  - Ready-made responsive components
  - Customizable theming
  - Built-in accessibility features
  - Dark/light mode support
  - Interactive form controls (toggles, sliders, +/- buttons)
  - Confirmation dialogs

- **PWA Framework**: Vite PWA plugin
  - Service worker for offline functionality
  - Fast development and build times
  - Modern build tooling

### Storage
- **Local Storage**: IndexedDB
  - Robust offline storage capability
  - Storage of game history and settings
  - Better performance than localStorage for larger datasets
  - Multiple game state persistence

- **State Persistence**: redux-persist
  - Automatic state saving
  - Configurable storage engines
  - Seamless state rehydration
  - Session recovery

### Internationalization
- **i18next**
  - Support for English and Italian
  - Dynamic language switching
  - JSON-based translations
  - Formatting utilities for numerical scores

## Architecture Decisions

### Application Structure
1. **Component Architecture**
   - Atomic design pattern
   - Reusable UI components
   - Clear separation of concerns
   - Enhanced modularity for scoring controls
   - Composable dialog system for confirmations

2. **State Management**
   - Game state in Redux
   - UI state in component local state
   - Persistent storage sync
   - Action-based history for undo/redo operations
   - Game session management

3. **Data Flow**
   - Unidirectional data flow
   - Action creators for game events
   - Reducers for score calculations
   - Middleware for visual feedback effects
   - Thunks for complex game management operations

4. **User Interaction Patterns**
   - Checkbox-style toggles for boolean score items
   - Increment/decrement controls (+/-) for numerical scores
   - Visual feedback animations for score changes
   - Confirmation patterns for destructive actions
   - Toast notifications for important events

### Progressive Web App
1. **Offline First**
   - Service worker caching
   - IndexedDB for data persistence
   - Offline-first architecture
   - Multi-game state management

2. **Installation**
   - Web app manifest
   - Install prompts
   - Home screen icon
   - Splash screen optimizations

### Performance Considerations
1. **Code Splitting**
   - Route-based splitting
   - Lazy loading of non-critical components
   - Dynamic imports for rules/reference content
   - Optimized animations for score feedback

2. **Optimization**
   - Image optimization
   - Bundle size monitoring
   - Performance budgets
   - Memoization of complex calculations
   - Virtualized lists for game history

### Security
1. **Data Privacy**
   - Local-first storage
   - No external dependencies for core functionality
   - Optional cloud sync with consent
   - Export/import of game data

### Testing Strategy
1. **Unit Tests**
   - Jest for logic
   - React Testing Library for components
   - Redux store testing
   - Visual feedback and animation testing

2. **E2E Tests**
   - Cypress for critical user paths
   - Cross-browser testing
   - Mobile device testing
   - Game flow validation

## Development Workflow
- Git-flow branching strategy
- ESLint + Prettier for code quality
- Husky for pre-commit hooks
- GitHub Actions for CI/CD

## Monitoring and Analytics
- Lighthouse scores tracking
- Core Web Vitals monitoring
- Optional anonymous usage analytics

## UI Enhancement Architecture

### Interactive Scoring Interface
1. **Score Modification Controls**
   - Toggle components for boolean scoring items (settebello)
   - Increment/decrement buttons (+/-) for numerical scores
   - Direct numeric input for advanced users
   - Visual validation of input values

2. **Visual Feedback System**
   - Animated score changes using framer-motion
   - Color indicators for score increases/decreases
   - Toast notifications for significant events
   - Focus management for keyboard users

### Game Management Components
1. **Game Session Control**
   - New Game dialog with player configuration
   - Reset Game confirmation modal
   - Game state persistence architecture
   - Round transition animations

2. **Confirmation System**
   - Standardized dialog component for destructive actions
   - Consistent button placement and styling
   - Keyboard accessibility for modal interactions
   - Focus trap for improved accessibility