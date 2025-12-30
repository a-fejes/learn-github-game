# Quick Reference: Stages 3-10 Validators

## At a Glance

| Stage | Task | Validates | API | Pending | Lines |
|-------|------|-----------|-----|---------|-------|
| **3** | Edit Title | `updated_at > created_at` | 2 | ✅ | ~60 |
| **4** | Edit Body | `updated_at > created_at` | 2 | ✅ | ~60 |
| **5** | Edit Comment | Comment `updated_at > created_at` | 2 | ✅ | ~70 |
| **6** | Reopen/Close | Comment count ≥2 | 2 | ✅ | ~70 |
| **7** | Add Label | `labels.length > 0` | 1 | ✅ | ~50 |
| **8** | Self-Assign | User in `assignees[]` | 2 | ✅ | ~60 |
| **9** | LICENSE | `/contents/LICENSE` exists | 1 | ❌ | ~40 |
| **10** | Open PR | PR by user exists | 1 | ✅ | ~70 |

---

## Implementation Checklist

```javascript
// In game.js, all present:
✅ function checkLevel3(options)      – Edit title
✅ function checkLevel4(options)      – Edit body
✅ function checkLevel5(options)      – Edit comment
✅ function checkLevel6(options)      – Reopen/close
✅ function checkLevel7(options)      – Add label
✅ function checkLevel8(options)      – Self-assign
✅ function checkLevel9()             – License file
✅ function checkLevel10(options)     – Open PR

✅ Helper: issueHasBeenEdited(issueNumber)
✅ Helper: issueIsAssignedToUser(issueNumber, username)
✅ Helper: markLevelCompleted(level)
✅ Helper: markLevelPending(level)

✅ Poller: startPendingCheckPoller()
✅ Recheck: recheckLevel(level) – handles all 8 levels
```

---

## Event Wiring

```html
<!-- In index.html, all present: -->
<button id="check-level-3">I Updated the Title!</button>
<button id="check-level-4">I Updated the Body!</button>
<button id="check-level-5">I Edited My Comment!</button>
<button id="check-level-6">I Reopened and Clarified!</button>
<button id="check-level-7">I Added a Label!</button>
<button id="check-level-8">I Assigned Myself!</button>
<button id="check-level-9">I Added the License!</button>
<button id="check-level-10">I Created a Pull Request!</button>
```

```javascript
// In game.js, all wired in DOMContentLoaded:
document.getElementById('check-level-3').addEventListener('click', checkLevel3);
document.getElementById('check-level-4').addEventListener('click', checkLevel4);
document.getElementById('check-level-5').addEventListener('click', checkLevel5);
document.getElementById('check-level-6').addEventListener('click', checkLevel6);
document.getElementById('check-level-7').addEventListener('click', checkLevel7);
document.getElementById('check-level-8').addEventListener('click', checkLevel8);
document.getElementById('check-level-9').addEventListener('click', checkLevel9);
document.getElementById('check-level-10').addEventListener('click', checkLevel10);
```

---

## Validation Flow (Example: Level 3)

```javascript
checkLevel3() {
    // 1. Search for user's issue
    fetch(`/search/issues?q=repo:...is:issue...author:${username}`)
    
    // 2. Get first result
    const issue = result.items[0];
    
    // 3. Check if edited
    const edited = await issueHasBeenEdited(issue.number);
    
    // 4. Mark complete or pending
    if (edited) {
        markLevelCompleted(3);
        gameState.currentLevel = 4;  // Advance
        saveGameState();
        updateUI();
    } else {
        markLevelPending(3);
        gameState.currentLevel = 4;  // Allow continue
        show("Saved as pending... auto-recheck in 45s");
        updateUI();
    }
}
```

---

## Pending Recheck Cycle

```javascript
// Background poller (runs every 45 seconds)
setInterval(processPendingChecks, 45000);

// For each pending level, call recheck version:
async function recheckLevel(level) {
    switch(level) {
        case 3: return checkLevel3({ recheck: true });
        case 4: return checkLevel4({ recheck: true });
        // ... etc
    }
}

// Recheck version auto-advances or auto-rollbacks:
checkLevel3({ recheck: true }) {
    if (edited) {
        // Auto-advance (no UI interaction)
        markLevelCompleted(3);
        gameState.currentLevel++;
    } else {
        // Auto-rollback
        gameState.currentLevel = 3;  // Pull back
        show("Please redo this step");
    }
}
```

---

## localStorage State

```javascript
gameState = {
    username: "github-username",
    currentLevel: 5,
    completedLevels: [0, 1, 2, 3, 4],
    pendingChecks: {
        3: { startedAt: 1234567890, lastChecked: 1234567890 },
        4: { startedAt: 1234567890, lastChecked: 1234567890 }
    },
    skippedStages: [],
    userProfile: {
        name: "Full Name",
        followers: 100,
        publicRepos: 42,
        ...
    },
    online: true
}
```

---

## Testing a Single Validator

```javascript
// In browser console:

// Test immediate
await checkLevel3();

// Test with recheck
await checkLevel3({ recheck: true });

// Monitor state
console.log(gameState.pendingChecks);
console.log(gameState.completedLevels);

// Check what changed
console.log("Current level:", gameState.currentLevel);
console.log("Completed:", gameState.completedLevels);
```

---

## Common Patterns

### Edit Detection
```javascript
// Used in: Levels 3, 4, 5
async function issueHasBeenEdited(issueNumber) {
    const issue = await fetch(`/repos/.../issues/{id}`).json();
    return new Date(issue.updated_at) > new Date(issue.created_at);
}
```

### Array Searching
```javascript
// Used in: Levels 7, 8
if (issue.labels.length > 0) { ... }  // Level 7
if (issue.assignees.some(a => a.login === username)) { ... }  // Level 8
```

### Comment Counting
```javascript
// Used in: Level 6
const userComments = comments.filter(c => c.user.login === username).length;
if (userComments >= 2) { ... }
```

---

## Debugging Tips

### Check what validators exist
```javascript
Object.keys(window).filter(k => k.startsWith('checkLevel'))
// Output: ["checkLevel1", "checkLevel2", ..., "checkLevel10"]
```

### Test if buttons are wired
```javascript
document.getElementById('check-level-3').onclick
// Should return the checkLevel3 function, not null
```

### Manually mark level complete
```javascript
gameState.completedLevels.push(3);
gameState.currentLevel = 4;
saveGameState();
updateUI();
```

### Manually trigger pending
```javascript
gameState.pendingChecks[3] = { startedAt: Date.now(), lastChecked: Date.now() };
saveGameState();
// Next poller run (in 45s) will recheck
```

---

## File Line References

| Validator | Lines | File |
|-----------|-------|------|
| checkLevel3 | 409-468 | game.js |
| checkLevel4 | 470-529 | game.js |
| checkLevel5 | 531-602 | game.js |
| checkLevel6 | 604-677 | game.js |
| checkLevel7 | 679-740 | game.js |
| checkLevel8 | 742-805 | game.js |
| checkLevel9 | 807-838 | game.js |
| checkLevel10 | 840-920 | game.js |

---

## Minimal Test Script

```javascript
// Paste into console to test all validators
async function testAll() {
    console.log("Testing validators...");
    
    try {
        console.log("Level 3:", await checkLevel3());
        console.log("Level 3 (recheck):", await checkLevel3({ recheck: true }));
        console.log("Level 7:", await checkLevel7());
        console.log("Level 10:", await checkLevel10());
        
        console.log("\nFinal state:", gameState);
    } catch (e) {
        console.error("Error:", e);
    }
}

testAll();
```

---

## API Quotas

```
Unauthenticated: 60 requests/hour
Typical playthrough: ~16 requests
Capacity: ~3-4 simultaneous players

With token: 5,000 requests/hour
Capacity: ~300 simultaneous players
```

---

## Success Signs

✅ Validator runs without error  
✅ Shows "Level 3 complete" or "Saved as pending"  
✅ gameState.currentLevel advances  
✅ localStorage persists after refresh  
✅ Pending recheck auto-advances in 45s  
✅ Can navigate to next level  

---

## Error Messages

| Message | When | What to do |
|---------|------|-----------|
| "Saved as pending" | Task not detected yet | Wait 45s or refresh GitHub |
| "Error checking..." | Network/API error | Check internet, try again |
| "LICENSE file not found" | File doesn't exist | Create LICENSE in repo |
| "Not found on GitHub" | Resource doesn't exist | Double-check GitHub URL |

---

## Links

- **Testing Guide:** [TESTING_GUIDE.md](TESTING_GUIDE.md)
- **Code Reference:** [VALIDATOR_CODE_REFERENCE.md](VALIDATOR_CODE_REFERENCE.md)
- **Implementation Details:** [VALIDATOR_IMPLEMENTATION.md](VALIDATOR_IMPLEMENTATION.md)
- **Quick Summary:** [STAGES_3-10_COMPLETE.md](STAGES_3-10_COMPLETE.md)

---

**Print this page or save as reference while testing!**
