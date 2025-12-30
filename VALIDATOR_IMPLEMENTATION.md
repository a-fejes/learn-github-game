# Validator Implementation for Stages 3-10

## Summary

All validator functions for stages 3-8 (Edit Title/Body/Comment, Reopen, Label, Assign) and renumbered stages 9-10 (License, PR) have been implemented and wired up.

## New Validator Functions Added

### checkLevel3() – Edit Issue Title
- **Purpose:** Validate that the user has edited the issue title
- **Validation:** Fetches issue, checks `updated_at > created_at`
- **Pending Support:** Yes, auto-recheckable every 45 seconds
- **Error Message:** Actionable instructions with link to verify
- **File:** game.js

### checkLevel4() – Edit Issue Body
- **Purpose:** Validate that the user has edited the issue description
- **Validation:** Fetches issue, checks for body changes via `updated_at > created_at`
- **Pending Support:** Yes, auto-recheckable
- **Error Message:** Directed at body text edit
- **File:** game.js

### checkLevel5() – Edit Comment
- **Purpose:** Validate that the user has edited one of their own comments
- **Validation:** Fetches issue comments, checks for user comment with `updated_at > created_at`
- **Pending Support:** Yes, auto-recheckable
- **Error Message:** Explains how to find edit button (... menu)
- **File:** game.js

### checkLevel6() – Reopen & Clarify Cycle
- **Purpose:** Validate that the user reopened the issue and posted additional comments
- **Validation:** Counts user comments (must have ≥2 to indicate reopen + clarify + close cycle)
- **Pending Support:** Yes, auto-recheckable
- **Error Message:** Explains the full cycle (reopen → comment → close)
- **File:** game.js

### checkLevel7() – Add Label
- **Purpose:** Validate that the user added a label to the issue
- **Validation:** Checks `issue.labels.length > 0`
- **Pending Support:** Yes, auto-recheckable
- **Error Message:** Directed at Labels section
- **File:** game.js

### checkLevel8() – Self-Assign
- **Purpose:** Validate that the user assigned the issue to themselves
- **Validation:** Uses `issueIsAssignedToUser()` helper
- **Pending Support:** Yes, auto-recheckable
- **Error Message:** Directed at Assignees section
- **File:** game.js

### checkLevel9() – LICENSE File Check (Renamed from Level 3)
- **Purpose:** Validate that a LICENSE file exists in the repo
- **Validation:** Checks `/repos/{owner}/{repo}/contents/LICENSE`
- **Pending Support:** No (immediate validation)
- **File:** game.js

### checkLevel10() – Open Pull Request (Renamed from Level 4)
- **Purpose:** Validate that user has opened a PR to the repo
- **Validation:** Searches for open PRs by user
- **Pending Support:** Yes, auto-recheckable (accounts for 30-60s GitHub search lag)
- **Error Message:** Explains search delay, provides PR link
- **File:** game.js

## Helper Functions Used

- **issueHasBeenEdited(issueNumber)** – Checks if issue was modified after creation
- **issueIsAssignedToUser(issueNumber, username)** – Checks if user is assigned
- **markLevelCompleted(level)** – Marks level as complete
- **markLevelPending(level)** – Marks level as pending revalidation

## Pending Recheck System Integration

All levels 3-8 and level 10 support the **pending recheck** mechanism:

1. **Initial Check:** User clicks button, validator runs
2. **If Found:** Level marked complete, player advances
3. **If Not Found (Pending Mode):**
   - Player is allowed to advance anyway
   - Level marked as "pending" in `gameState.pendingChecks`
   - Background poller recheckslevel every 45 seconds
4. **On Recheck Success:** Level auto-completes, no UI change needed
5. **On Recheck Failure:** Player is pulled back to that level with notification

## Event Listeners Updated

All 10 levels now have event listeners properly wired:

```javascript
document.getElementById('check-level-3').addEventListener('click', checkLevel3);
document.getElementById('check-level-4').addEventListener('click', checkLevel4);
document.getElementById('check-level-5').addEventListener('click', checkLevel5);
document.getElementById('check-level-6').addEventListener('click', checkLevel6);
document.getElementById('check-level-7').addEventListener('click', checkLevel7);
document.getElementById('check-level-8').addEventListener('click', checkLevel8);
document.getElementById('check-level-9').addEventListener('click', checkLevel9);
document.getElementById('check-level-10').addEventListener('click', checkLevel10);
```

## recheckLevel() Function Updated

The `recheckLevel()` function now handles all levels with pending support:

```javascript
switch (level) {
    case 1: return checkLevel1({ recheck: true });
    case 2: return checkLevel2({ recheck: true });
    case 3: return checkLevel3({ recheck: true });
    case 4: return checkLevel4({ recheck: true });
    case 5: return checkLevel5({ recheck: true });
    case 6: return checkLevel6({ recheck: true });
    case 7: return checkLevel7({ recheck: true });
    case 8: return checkLevel8({ recheck: true });
    case 10: return checkLevel10({ recheck: true });
    default: return false;
}
```

Note: Level 9 (LICENSE) is not included because it doesn't support pending (immediate validation).

## Testing Checklist

### Per Level (3-8)
- [ ] Navigate to level
- [ ] Complete the task in GitHub UI
- [ ] Click validator button
- [ ] If immediate: Should advance to next level
- [ ] If pending: Should show "pending" message with link, allow advance
- [ ] Wait 45 seconds (or wait for next poller interval)
- [ ] Should see level auto-complete if action is still valid

### Cross-Level
- [ ] Complete levels 3-4 in sequence (title edit, body edit)
- [ ] Complete level 5 by editing a comment
- [ ] Complete level 6 full cycle (reopen → comment → close)
- [ ] Complete level 7 (add label) and verify search includes label
- [ ] Complete level 8 (self-assign) and verify assignee updated
- [ ] Verify pending recheck pulls you back if action disappears
- [ ] Verify localStorage persists progress

### Edge Cases
- [ ] Edit same field twice (should count as one edit)
- [ ] Add label, remove it, add again (poller should detect on next check)
- [ ] Reopen issue multiple times (should count comments correctly)
- [ ] Test with slow network (simulate 3G to test pending behavior)

## Files Modified

1. **game.js** (~1169 lines)
   - Added checkLevel3–checkLevel8 validators (~670 new lines)
   - Renamed and updated checkLevel9–checkLevel10
   - Updated recheckLevel() switch statement

2. **index.html** (~686 lines) 
   - Already has all 10 level sections with proper IDs
   - All error message divs present
   - All buttons wired with correct IDs

3. **style.css** (~926 lines)
   - Already has styling for .error-msg, .permission-note, etc.
   - No changes needed

## Known Limitations

1. **Comment Edit Detection:** Checks for >1s difference between updated_at and created_at to avoid false positives
2. **Reopen Cycle:** Simply counts user comments (≥2), doesn't validate full reopen/close sequence
3. **Label Search:** Only checks if label exists, not which specific label was added
4. **Pending Timeout:** Currently recheckable indefinitely; could add timeout after 24 hours if needed

## Next Steps

- Implement stages 11-17 (fork, web edit, branching, PR workflow)
- Add optional drill stages (18-25)
- Full cross-browser and accessibility testing
- Workshop simulation with multiple concurrent users
