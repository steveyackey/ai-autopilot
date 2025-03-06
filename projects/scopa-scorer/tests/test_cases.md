# Scopa Scorer Test Cases - Iteration 2

## 1. Enhanced Scoring Interface Test Cases

### TC-1.1: ScoreControl Increment Functionality

**Description:** Verify the increment button increases the score value correctly.

**Steps:**
1. Start a new game with 2 players
2. Open the score update dialog for any player
3. Note the current value for the "Cards" score
4. Click the increment (+) button for "Cards"

**Expected Results:**
- The score value should increase by 1
- Animation badge should appear showing "+1"
- The player's total score should increase accordingly

**Priority:** High

---

### TC-1.2: ScoreControl Decrement Functionality

**Description:** Verify the decrement button decreases the score value correctly.

**Steps:**
1. Start a new game with 2 players
2. Open the score update dialog for any player
3. Set the "Cards" score to 2
4. Click the decrement (-) button for "Cards"

**Expected Results:**
- The score value should decrease by 1
- Animation badge should appear showing "-1"
- The player's total score should decrease accordingly

**Priority:** High

---

### TC-1.3: ScoreControl Minimum Boundary Test

**Description:** Verify the minimum boundary constraint prevents negative scores.

**Steps:**
1. Start a new game with 2 players
2. Open the score update dialog for any player
3. Set the "Cards" score to 0
4. Click the decrement (-) button for "Cards"

**Expected Results:**
- The score should remain at 0 (no negative values allowed)
- The decrement button should appear disabled

**Priority:** Medium

---

### TC-1.4: ScoreControl Maximum Boundary Test

**Description:** Verify the maximum boundary constraint (if applicable).

**Steps:**
1. Start a new game with 2 players
2. Open the score update dialog for any player
3. Set the "Prime" score to 1 (maximum value)
4. Click the increment (+) button for "Prime"

**Expected Results:**
- The score should remain at 1 (max value for Prime)
- The increment button should appear disabled

**Priority:** Medium

---

### TC-1.5: Settebello Toggle Functionality

**Description:** Verify the checkbox toggle for Settebello works correctly.

**Steps:**
1. Start a new game with 2 players
2. Open the score update dialog for any player
3. Note the initial state of the "Seven of Coins" checkbox (should be unchecked)
4. Click the checkbox to select it

**Expected Results:**
- The checkbox should become checked
- The player's score for Settebello should be set to 1
- The player's total score should increase by 1
- Visual feedback should indicate the change

**Priority:** Medium

---

### TC-1.6: Score Controls Tooltips

**Description:** Verify tooltips appear correctly for score controls.

**Steps:**
1. Start a new game with 2 players
2. Open the score update dialog for any player
3. Hover over the label for "Cards"

**Expected Results:**
- A tooltip should appear with explanatory text about the "Cards" scoring
- Tooltip should be readable and correctly positioned

**Priority:** Low

---

## 2. Visual Feedback System Test Cases

### TC-2.1: Score Change Notification Appearance

**Description:** Verify notifications appear when scores change.

**Steps:**
1. Start a new game with 2 players
2. Click the "Scopa" button for Player 1

**Expected Results:**
- A notification toast should appear at the bottom of the screen
- The toast should indicate that Player 1 scored a scopa
- The toast should be styled as a success/increase notification

**Priority:** High

---

### TC-2.2: Notification Auto-dismiss

**Description:** Verify notifications auto-dismiss after the timeout period.

**Steps:**
1. Start a new game with 2 players
2. Click the "Scopa" button for Player 1
3. Wait for 3 seconds

**Expected Results:**
- The notification should automatically disappear after 3 seconds
- The dismissal should have a smooth animation

**Priority:** Medium

---

### TC-2.3: Chip Highlighting on Score Change

**Description:** Verify the relevant score chip is highlighted when a score changes.

**Steps:**
1. Start a new game with 2 players
2. Click the "Scopa" button for Player 1

**Expected Results:**
- The "Sweeps" chip in Player 1's card should be highlighted
- The highlighting should be visually distinct

**Priority:** Medium

---

### TC-2.4: Score Animation on Change

**Description:** Verify score values animate when changed.

**Steps:**
1. Start a new game with 2 players
2. Click the "Scopa" button for Player 1

**Expected Results:**
- The player's total score should animate when updated
- The animation should be smooth and visually clear

**Priority:** Medium

---

## 3. Game Management Test Cases

### TC-3.1: New Game Button Functionality

**Description:** Verify the New Game button opens the game setup form.

**Steps:**
1. Open the application
2. Click the "New Game" button

**Expected Results:**
- The New Game Form should appear
- The form should allow entry of player names
- The form should include a target score slider

**Priority:** High

---

### TC-3.2: New Game Creation

**Description:** Verify creating a new game with the form works correctly.

**Steps:**
1. Open the application
2. Click the "New Game" button
3. Enter names for two players: "Alice" and "Bob"
4. Set the target score to 15
5. Click "Start Game"

**Expected Results:**
- A new game should be created with the entered players
- The target score should be set to 15
- The game screen should be displayed with score trackers for both players
- A notification toast should appear indicating the game has started

**Priority:** High

---

### TC-3.3: New Game Validation - Empty Names

**Description:** Verify validation prevents creating a game with empty player names.

**Steps:**
1. Open the application
2. Click the "New Game" button
3. Leave player name fields empty
4. Click "Start Game"

**Expected Results:**
- The game should not be created
- Error messages should appear indicating player names are required

**Priority:** Medium

---

### TC-3.4: New Game Validation - Duplicate Names

**Description:** Verify validation prevents creating a game with duplicate player names.

**Steps:**
1. Open the application
2. Click the "New Game" button
3. Enter "Alice" for both players
4. Click "Start Game"

**Expected Results:**
- The game should not be created
- An error message should appear indicating player names must be unique

**Priority:** Medium

---

### TC-3.5: Reset Game Functionality

**Description:** Verify the Reset Game button resets the current game.

**Steps:**
1. Start a new game with 2 players
2. Add some scores to both players
3. Click the "Reset Game" button
4. Click "Reset" in the confirmation dialog

**Expected Results:**
- All player scores should be reset to zero
- The round should reset to 1
- A notification toast should appear confirming the reset
- The game remains active with the same players

**Priority:** High

---

### TC-3.6: Reset Game Confirmation

**Description:** Verify that cancelling the Reset Game confirmation preserves the game state.

**Steps:**
1. Start a new game with 2 players
2. Add some scores to both players
3. Click the "Reset Game" button
4. Click "Cancel" in the confirmation dialog

**Expected Results:**
- The confirmation dialog should close
- All player scores should remain unchanged
- The game state should remain unchanged

**Priority:** Medium

---

### TC-3.7: End Round Functionality

**Description:** Verify the End Round button advances to the next round.

**Steps:**
1. Start a new game with 2 players
2. Add some scores to both players (below winning threshold)
3. Click the "End Round" button

**Expected Results:**
- The round number should increment by 1
- Player scores should be preserved
- A notification toast should appear confirming the round completion

**Priority:** High

---

### TC-3.8: End Round with Winner Detection

**Description:** Verify winner detection when a player reaches the target score.

**Steps:**
1. Start a new game with 2 players and target score of 11
2. Give Player 1 enough points to reach the target score
3. Click the "End Round" button

**Expected Results:**
- The game should be marked as complete
- A notification toast should indicate that Player 1 has won
- The game should be added to match history
- Game controls should reflect the game is no longer active

**Priority:** High

---

### TC-3.9: New Game Confirmation When Game is Active

**Description:** Verify confirmation appears when starting a new game while another is active.

**Steps:**
1. Start a new game with 2 players
2. Add some scores to both players
3. Click the "New Game" button

**Expected Results:**
- A confirmation dialog should appear warning about losing current game progress
- The dialog should have options to continue or cancel

**Priority:** Medium

---

### TC-3.10: Keyboard Shortcuts

**Description:** Verify keyboard shortcuts for game management functions.

**Steps:**
1. Start a new game with 2 players
2. Press Alt+N (for New Game)
3. Cancel the dialog
4. Press Alt+R (for Reset Game)

**Expected Results:**
- Alt+N should open the New Game confirmation dialog
- Alt+R should open the Reset Game confirmation dialog

**Priority:** Low

---

## 4. Undo Functionality Test Cases

### TC-4.1: Undo Last Action

**Description:** Verify the Undo button reverts the last score change.

**Steps:**
1. Start a new game with 2 players
2. Click the "Scopa" button for Player 1
3. Click the "Undo" button

**Expected Results:**
- The scopa point should be removed from Player 1
- Player 1's total score should be decremented accordingly
- A notification toast should appear confirming the undo action
- The score history should be updated

**Priority:** High

---

### TC-4.2: Undo Button Disabled State

**Description:** Verify the Undo button is disabled when there are no actions to undo.

**Steps:**
1. Start a new game with 2 players
2. Observe the Undo button without making any score changes

**Expected Results:**
- The Undo button should appear disabled
- A tooltip should explain that there are no actions to undo

**Priority:** Medium

---

## 5. Internationalization Test Cases

### TC-5.1: English Language Display

**Description:** Verify all new components display correctly in English.

**Steps:**
1. Set the application language to English
2. Navigate through all screens and dialogs

**Expected Results:**
- All text in the new components should appear in English
- Formatting should be correct and natural in English

**Priority:** Medium

---

### TC-5.2: Italian Language Display

**Description:** Verify all new components display correctly in Italian.

**Steps:**
1. Set the application language to Italian
2. Navigate through all screens and dialogs

**Expected Results:**
- All text in the new components should appear in Italian
- Formatting should be correct and natural in Italian

**Priority:** Medium

---

## 6. Accessibility Test Cases

### TC-6.1: Keyboard Navigation

**Description:** Verify the application can be fully navigated with keyboard.

**Steps:**
1. Start a new game with 2 players
2. Use Tab key to navigate through all interactive elements
3. Use Enter/Space to activate buttons and controls
4. Use Escape to close dialogs

**Expected Results:**
- All interactive elements should be focusable with the Tab key
- Focus order should be logical
- Buttons should activate with Enter or Space
- Dialogs should close with Escape

**Priority:** High

---

### TC-6.2: Screen Reader Compatibility

**Description:** Verify screen readers can access and announce all UI elements.

**Steps:**
1. Enable a screen reader (e.g., VoiceOver, NVDA)
2. Navigate through the application

**Expected Results:**
- All UI elements should be properly announced
- Interactive elements should have appropriate roles and labels
- Dialogs should be announced as dialogs
- Score changes should be announced

**Priority:** Medium

---

### TC-6.3: Color Contrast

**Description:** Verify color contrast meets accessibility standards.

**Steps:**
1. Inspect color contrast for all text elements
2. Check both light and dark modes if available

**Expected Results:**
- Text should have sufficient contrast with its background
- Interactive elements should be clearly distinguishable

**Priority:** Medium

---

## 7. Responsive Design Test Cases

### TC-7.1: Mobile View Layout

**Description:** Verify the layout works correctly on mobile screens.

**Steps:**
1. Open the application on a mobile device or using a mobile viewport (320px-767px)
2. Navigate through all screens and dialogs

**Expected Results:**
- All elements should be properly sized and positioned
- No horizontal scrolling should be required
- Touch targets should be large enough for mobile use
- Dialogs should be responsive and properly centered

**Priority:** High

---

### TC-7.2: Tablet View Layout

**Description:** Verify the layout works correctly on tablet screens.

**Steps:**
1. Open the application using a tablet viewport (768px-1023px)
2. Navigate through all screens and dialogs

**Expected Results:**
- The layout should adapt appropriately for the tablet screen size
- Controls should be properly sized and positioned
- Player cards should arrange in an optimal layout for the screen size

**Priority:** Medium

---

### TC-7.3: Desktop View Layout

**Description:** Verify the layout works correctly on desktop screens.

**Steps:**
1. Open the application on a desktop viewport (1024px+)
2. Navigate through all screens and dialogs

**Expected Results:**
- The layout should make efficient use of the available screen space
- Controls should be properly sized and positioned
- Player cards should arrange in an optimal layout for the screen size

**Priority:** Medium