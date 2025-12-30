# Testing Stages 3-10 - Checklist & Guide

## Quick Start

### Prerequisites
1. GitHub account (with access to Grumpy Gopher repo fork)
2. Browser with console access (DevTools)
3. http://localhost:8000 open
4. Complete Levels 0-2 first

---

## Test Plan: Stages 3-10

### Stage 0: Sign In ✅
- [ ] Visit http://localhost:8000
- [ ] Enter GitHub username
- [ ] See personalized greeting with follower count
- [ ] Navigate to Level 1

### Stage 1: Comment on Issue #1 ✅
- [ ] Visit issue #1 in your fork
- [ ] Add any comment
- [ ] Click "I Commented on Issue #1!"
- [ ] Should advance to Stage 2

### Stage 2: Open & Close Issue ✅
- [ ] Go to Issues → New Issue
- [ ] Title: "Anchor" or "Tight" issue
- [ ] Add description
- [ ] Comment on your own issue
- [ ] Close the issue
- [ ] Click "I Opened and Closed It!"
- [ ] Should advance to Stage 3

---

## New Stages 3-10 Testing

### Stage 3: Edit Issue Title ⏳ [NEW]

**Setup:** Complete Stage 2 first

**Test:**
```
1. Navigate to Level 3
2. Read: "Now that your issue is created and done..."
3. Go to GitHub, find your closed issue
4. Click pencil icon on title
5. Add "(v2)" to the title
6. Click "Update" button
7. Return to game
8. Click "I Updated the Title!"
9. Expected: 
   - If immediate: "Level 3 complete → Level 4"
   - If delayed: "Saved as pending... we'll recheck" → Auto-advance in 45s
```

**Verification:**
- [ ] Title edit visible in GitHub
- [ ] Validator button triggers
- [ ] Message appears (immediate or pending)
- [ ] Can navigate to Level 4

---

### Stage 4: Edit Issue Body ⏳ [NEW]

**Setup:** Complete Stage 3

**Test:**
```
1. Navigate to Level 4
2. Read: "The body is the deeper view..."
3. Go to GitHub, find your issue
4. Click pencil icon on description/body
5. Change the text (add line, edit wording)
6. Click "Update"
7. Return to game
8. Click "I Updated the Body!"
9. Expected: Same as Stage 3 (immediate or pending)
```

**Verification:**
- [ ] Body edit visible in GitHub
- [ ] Validator recognizes change
- [ ] Advance to Level 5

---

### Stage 5: Edit Comment ⏳ [NEW]

**Setup:** Complete Stage 4, have commented on your issue

**Test:**
```
1. Navigate to Level 5
2. Read: "Comments can be changed too..."
3. Go to GitHub, find your comment
4. Click "..." menu on comment
5. Select "Edit"
6. Change the text
7. Click "Update comment"
8. Return to game
9. Click "I Edited a Comment!"
10. Expected: Validator checks if comment.updated_at > created_at
```

**Verification:**
- [ ] Comment edit visible (timestamp shown)
- [ ] Validator passes
- [ ] Advance to Level 6

---

### Stage 6: Reopen & Clarify ⏳ [NEW]

**Setup:** Complete Stage 5, have your issue closed

**Test:**
```
1. Navigate to Level 6
2. Read: "Reopen, clarify, then close again..."
3. Go to GitHub, find your closed issue
4. Click "Open issue" button
5. Issue should now show as "Open"
6. Click "Reply" and add a new comment (clarification)
7. Click "Close issue" again
8. Return to game
9. Click "I Reopened and Clarified!"
10. Expected: Validator counts comments (should have ≥2)
```

**Verification:**
- [ ] Issue shows as closed
- [ ] You have ≥2 comments
- [ ] Validator passes
- [ ] Advance to Level 7

---

### Stage 7: Add Label ⏳ [NEW]

**Setup:** Complete Stage 6

**Test:**
```
1. Navigate to Level 7
2. Read: "Labels help organize issues..."
3. Go to GitHub, find your issue
4. In the right sidebar, find "Labels"
5. Click "Labels" (or the label icon)
6. Select any label (e.g., "enhancement", "documentation")
7. Label should appear on issue
8. Return to game
9. Click "I Added a Label!"
10. Expected: Validator checks if issue.labels.length > 0
```

**Verification:**
- [ ] Label visible on issue
- [ ] Label appears in issue sidebar
- [ ] Validator passes
- [ ] Advance to Level 8

---

### Stage 8: Self-Assign ⏳ [NEW]

**Setup:** Complete Stage 7

**Test:**
```
1. Navigate to Level 8
2. Read: "Assign issues to track who's working..."
3. Go to GitHub, find your issue
4. In the right sidebar, find "Assignees"
5. Click "Assignees"
6. Select your own username
7. Your name should appear in assignees
8. Return to game
9. Click "I Assigned Myself!"
10. Expected: Validator checks if user in issue.assignees
```

**Verification:**
- [ ] Your username shows in Assignees
- [ ] Validator passes
- [ ] Advance to Level 9

---

### Stage 9: Add LICENSE File ✅ [RENAMED]

**Setup:** Complete Stage 8

**Test:**
```
1. Navigate to Level 9
2. Read: "Every repo needs a license..."
3. Go to GitHub repo, find "Add file"
4. Click "Create new file"
5. Name it: "LICENSE"
6. Copy MIT, Apache, or GPL license text
7. Commit the file
8. Return to game
9. Click "I Added the License!"
10. Expected: Immediate success (checks /contents/LICENSE)
```

**Verification:**
- [ ] LICENSE file visible in repo root
- [ ] Validator passes immediately (no pending)
- [ ] Advance to Level 10

---

### Stage 10: Open Pull Request ⏳ [RENAMED]

**Setup:** Complete Stage 9, have changes in fork

**Test:**
```
1. Navigate to Level 10
2. Read: "Pull requests propose changes..."
3. Go to your fork on GitHub
4. Click "Compare & pull request" OR
5. Go to Pull requests → New → compare across forks
6. Select base: Grumpy Gopher repo (base fork)
7. Select head: Your fork (your changes)
8. Click "Create Pull Request"
9. Add title and description
10. Click "Create Pull Request"
11. Return to game
12. Click "I Created a Pull Request!"
13. Expected: 
    - Validator searches for open PRs
    - May show "pending" (GitHub search lag 30-60s)
    - Auto-checks every 45s
    - Auto-advances when found
14. **VICTORY!** 🎉
```

**Verification:**
- [ ] PR visible at https://github.com/grumpygopher/git-goat-gazette/pulls
- [ ] PR authored by you
- [ ] Validator passes (may be pending)
- [ ] Victory screen shows

---

## Pending Recheck Testing

### Test Pending Behavior
```
1. Complete a validator partially (e.g., start editing title but don't save)
2. Click validator button → should show "Saved as pending"
3. Note the level number
4. Keep the game open (don't close)
5. Go to GitHub and complete the task (save the edit)
6. Wait 45 seconds (or watch console for "Checking level...")
7. Watch the game auto-advance without clicking anything
```

### Monitor Pending in Console
```javascript
// Open DevTools Console (F12), then:
setInterval(() => {
    console.log('Pending:', gameState.pendingChecks);
    console.log('Current Level:', gameState.currentLevel);
}, 10000);
```

---

## localStorage Testing

### Check Persistence
```javascript
// In console:
console.log(JSON.stringify(gameState, null, 2));

// Should show:
{
  "username": "your-github-username",
  "currentLevel": 5,
  "completedLevels": [0, 1, 2, 3, 4],
  "pendingChecks": { ... },
  "userProfile": { ... },
  "online": true
}
```

### Test Page Refresh
```
1. Complete Level 3
2. Refresh the page (Cmd+R)
3. Should show same level (3 or 4 depending on completion)
4. Profile should still show your name
5. completedLevels should still include [0, 1, 2, 3]
```

### Reset Game (if needed)
```javascript
// In console:
localStorage.removeItem('gitGoatGameState');
location.reload();
// Game resets to Level 0
```

---

## Accessibility Testing

### Keyboard Navigation
```
1. Tab through page
2. Should reach all buttons in logical order
3. Shift+Tab to go backwards
4. Enter on buttons to activate
5. No keyboard traps (can always Tab away)
```

### Screen Reader Testing (Mac)
```
1. Enable VoiceOver: Cmd+F5
2. Tab to reach elements
3. Errors should be announced immediately
4. Level titles should be announced
5. Button labels should be clear
```

### Color Contrast
```
1. Open DevTools → Accessibility tab
2. Check error messages aren't color-only
3. Text should be readable at 125% zoom
```

---

## Error Scenario Testing

### Network Error
```
1. Turn off WiFi
2. Click validator button
3. Should show: "Network error. Please try again."
4. Turn WiFi back on
5. Should be able to retry
```

### Rate Limit Simulation (Advanced)
```
1. Open DevTools → Network tab
2. Manually make 60+ GitHub API calls
3. Next validator should show rate limit error
4. Message should explain wait time
```

### GitHub 404 (License Stage)
```
1. Delete LICENSE file from your repo
2. Try Stage 9 without creating LICENSE
3. Should show: "LICENSE file not found. Create it..."
4. Create LICENSE file
5. Retry validator
```

---

## Performance Testing

### Measure Validation Time
```javascript
// In console:
const start = performance.now();
checkLevel3().then(() => {
    console.log(`Validation took ${performance.now() - start}ms`);
});
```

### Monitor API Calls
```
1. Open DevTools → Network tab
2. Click validator button
3. Watch network requests
4. Should see 1-2 GitHub API calls
5. Timing should be <2 seconds for direct calls
```

---

## Batch Testing (All Stages)

### Quick Full Playthrough
```
Time estimate: 10-15 minutes
Prerequisite: GitHub account with Grumpy Gopher fork

1. Sign in (Level 0)
2. Comment on #1 (Level 1) – 2 minutes
3. Open & close issue (Level 2) – 3 minutes
4. Edit title (Level 3) – 1 minute
5. Edit body (Level 4) – 1 minute
6. Edit comment (Level 5) – 1 minute
7. Reopen/close cycle (Level 6) – 2 minutes
8. Add label (Level 7) – 1 minute
9. Self-assign (Level 8) – 1 minute
10. Add LICENSE (Level 9) – 1 minute
11. Open PR (Level 10) – 3 minutes (may include waiting)
Total: ~15 minutes
```

---

## Success Criteria Checklist

### Levels 0-2 (Already Working)
- [x] Sign in accepts GitHub username
- [x] Comments on Issue #1 detected
- [x] Open/close issue with comment detected

### Levels 3-8 (New Validators)
- [ ] Level 3: Edit title detected (immediate or pending)
- [ ] Level 4: Edit body detected (immediate or pending)
- [ ] Level 5: Edit comment detected (immediate or pending)
- [ ] Level 6: Reopen/close cycle detected (immediate or pending)
- [ ] Level 7: Label addition detected (immediate or pending)
- [ ] Level 8: Self-assign detected (immediate or pending)

### Levels 9-10 (Renamed)
- [ ] Level 9: LICENSE file detected (immediate)
- [ ] Level 10: PR opening detected (immediate or pending)

### System Features
- [ ] Pending recheck works (auto-advance after 45s)
- [ ] Auto-rollback works (pull user back if action reverted)
- [ ] localStorage persists (refresh shows same level)
- [ ] Error messages helpful and actionable
- [ ] Profile personalization shows name/followers
- [ ] Connection indicator shows online/offline status

### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader announces errors
- [ ] Focus indicator visible
- [ ] Color not relying on color-only

---

## Known Issues to Watch For

### May Be Observed
1. **Search delay:** Level 2 and Level 10 may show "pending" due to GitHub's 30-60s indexing lag
   - This is **expected and by design**
   - Pending recheck will auto-advance when search catches up

2. **Duplicate comments:** If you comment on Issue #1 multiple times, all will be counted
   - This is OK (just makes validation easier)

3. **Label search:** Level 7 doesn't verify which label was added, just that one exists
   - Future enhancement could specify required label

---

## Debugging Commands

### Check Current State
```javascript
gameState
completedLevels
pendingChecks
userProfile
```

### Test Specific Validator
```javascript
checkLevel3()
checkLevel3({ recheck: true })
checkLevel5()
// etc.
```

### Monitor Poller
```javascript
setInterval(() => {
    console.log('Next poller run in ~45s');
    console.log('Pending:', gameState.pendingChecks);
}, 1000);
```

### Manually Advance
```javascript
gameState.currentLevel = 5;
gameState.completedLevels.push(4);
saveGameState();
updateUI();
```

---

## Expected Timelines

| Activity | Duration | Notes |
|----------|----------|-------|
| Quick test (one stage) | 5-10 min | Level 3 or 7 (fastest) |
| Full playthrough | 15-20 min | All stages 0-10 |
| Pending recheck test | 50 min | Requires waiting for poller |
| Accessibility audit | 30 min | Screen reader + keyboard |
| Cross-browser test | 60 min | Chrome, Firefox, Safari |
| Workshop simulation | 120 min | 10+ concurrent users |

---

## Report Template

```markdown
# Testing Report: Stages 3-10

## Test Date
[Date]

## Tester
[Name]

## Environment
- Browser: [Chrome/Firefox/Safari/Edge]
- OS: [macOS/Windows/Linux]
- Screen reader: [None/NVDA/JAWS/VoiceOver]

## Results

### Stage 3: Edit Title
- [ ] Pass – validator worked immediately
- [ ] Pass – validator marked pending, auto-advanced
- [ ] Fail – validator didn't detect edit
- [ ] Error – network/API error occurred

[Repeat for each stage]

## Issues Found
1. [Description]
2. [Description]

## Recommendations
1. [Suggestion]
2. [Suggestion]

## Overall Assessment
- [ ] Ready for production
- [ ] Needs fixes before production
- [ ] Needs more testing
```

---

## Questions?

If a test fails:

1. **Check the console:** F12 → Console tab for error messages
2. **Check GitHub:** Verify changes actually saved on GitHub UI
3. **Check localStorage:** `console.log(gameState)` to see stored state
4. **Try resetting:** `localStorage.removeItem('gitGoatGameState')` and reload
5. **Check network:** DevTools → Network tab to see API calls

For deeper debugging, check [VALIDATOR_CODE_REFERENCE.md](VALIDATOR_CODE_REFERENCE.md).

---

✅ **Ready to test!** Follow this guide to verify all stages are working correctly.
