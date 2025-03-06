# Scopa Scorer Requirements

## Functional Requirements

### Game Setup
- Users can start a new game with 2-4 players
- Users can enter player names
- Users can select game variants (standard Scopa)
- Users can set target score for match end

### Scoring System
- Automatic calculation of points for:
  - Carte: 1 point for most cards captured
  - Denari: 1 point for most coin cards captured
  - Settebello: 1 point for capturing seven of coins
  - Scope: 1 point per sweep
  - Primiera: 1 point for highest prime value
- Display running total of points for each player
- Show breakdown of points by category
- Support for end-of-round scoring
- Support for end-of-match scoring

### Game Management
- Save game state automatically
- Resume interrupted games
- View match history
- Export game results
- Undo last score entry

### Rules Reference
- Quick access to scoring rules
- Visual guide for card values
- Prime scoring reference table

## Non-Functional Requirements

### Performance
- Load time under 2 seconds
- Score updates in real-time
- Offline functionality
- Support for concurrent games

### User Interface
- Responsive design (mobile-first)
- Touch-friendly interface
- High contrast for card values
- Language support for English and Italian
- Intuitive navigation
- Dark/light mode support

### Technical Requirements
- Progressive Web App (PWA) capabilities
- Local storage for offline data
- Cross-browser compatibility
- Screen reader accessibility
- Data backup/export functionality

### Security
- User data privacy
- Secure storage of game history
- Optional account system for sync

## Constraints
- Must work without internet connection
- Must be usable on small screens (minimum 320px width)
- Must be accessible to color-blind users
- Must support both portrait and landscape orientations