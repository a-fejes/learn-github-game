# Implementation Guide: 18–25 Stage Rollout

## ✅ What's Ready

- **EXPANDED_JOURNEY_18-25.md**: Complete design spec (philosophy, stages, permissions, technical notes)
- **Profile personalization**: Game now fetches and displays user's name, followers, repos count
- **Seussian templates**: Built-in comment suggestions (random selection from templates)
- **Helper functions**: 
  - `checkForExistingUserIssue()`: Skip stage if they already have an issue
  - `issueHasBeenEdited()`: Validate title/body changes
  - `issueHasLabel()`: Verify label added
  - `issueIsAssignedToUser()`: Check self-assignment
  - `getSeussianTemplate()`: Random template picker
- **State persistence**: `userProfile`, `skippedStages` saved in localStorage
- **Offline support**: Connection indicator already in place

## 🎬 Next Steps (Priority Order)

### Phase 1A: Finish Core 18 (2–3 days)
These build on existing structure and reuse patterns:

1. **Add Stages 3–5: Edit/Close Loop** (index.html + game.js)
   - Level 3: Edit issue title (validate with `issueHasBeenEdited()`)
   - Level 4: Edit issue body
   - Level 5: Edit comment (need to fetch comments, check updated_at)
   - UI: Reuse mission-box pattern, add validation buttons

2. **Add Stages 6–8: Reopen/Label/Assign** (index.html + game.js)
   - Level 6: Reopen & clarify cycle
   - Level 7: Add label (use `issueHasLabel()`)
   - Level 8: Self-assign (use `issueIsAssignedToUser()`)
   - UI: Same pattern, new validators

3. **Clarification Boxes** (index.html + style.css)
   - Add `.permission-note` class for permission disclaimers
   - Add `.optional-stage` for branching/advanced steps
   - Explain "Your fork vs. shared repo" differences

### Phase 1B: Fork & Web Edit (1–2 days)
4. **Stages 9–12: Fork, Edit, Branching, Commit** (index.html + game.js)
   - Level 9: Fork exists (check via `/user/repos?type=forks`)
   - Level 10: File edited in fork (search for commit by user in fork)
   - Level 11: Optional branching step (with skip button)
   - Level 12: Commit message understanding (mostly educational, no validation)

### Phase 2A: PRs & Collaboration (2–3 days)
5. **Stages 13–17: PR Lifecycle** (index.html + game.js)
   - Level 13: Open PR (check `/repos/{owner}/{repo}/pulls?head={user}:...`)
   - Level 14: Edit PR body (check updated_at)
   - Level 15: Comment on PR
   - Level 16: Understand feedback (PR has comment from maintainer)
   - Level 17: Celebrate (PR closed/merged or feedback cycle complete)

### Phase 2B: Optional Drills (1 week)
6. **Stages 18–25: Muscle Memory & Advanced** (index.html + game.js)
   - Repeat comment/issue cycles with different names
   - Discussions integration (if enabled)
   - CONTRIBUTING.md or CODEOWNERS stub
   - License relicensing demo

---

## 📐 Implementation Patterns

### New Stage Structure (HTML)
```html
<!-- LEVEL N: [Seussian Name] -->
<section id="level-N" class="seuss-card level-card" aria-labelledby="level-N-title" hidden>
    <div class="card-content">
        <h2 id="level-N-title" class="level-title">Level N: [Name]</h2>
        
        <p class="rhyme">
            <em>"[Seussian rhyme about the task]"</em>
        </p>
        
        <div class="mission-box">
            <h3>Your Mission:</h3>
            <ol>
                <li>Step 1</li>
                <li>Step 2</li>
                <li>Step 3</li>
            </ol>
        </div>
        
        <p class="permission-note">
            💡 <strong>Note:</strong> [Permission or complexity note]
        </p>
        
        <p id="level-N-template" class="template-suggestion" hidden></p>
        
        <button type="button" id="check-level-N" class="level-button button-primary">
            [Seussian button text]!
        </button>
        
        <div id="level-N-error" class="error-msg" role="alert" aria-live="assertive"></div>
        
        <details class="hint">
            <summary>Need a hint?</summary>
            <p>[Helpful hint]</p>
        </details>
    </div>
</section>
```

### New Validator Pattern (game.js)
```javascript
async function checkLevelN(options = {}) {
    const { recheck = false } = options;
    const errorMsg = document.getElementById('level-N-error');
    if (!recheck) {
        errorMsg.classList.remove('show');
    }

    try {
        // 1. Fetch data from GitHub API
        const response = await fetch(url, { headers: API_HEADERS });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        
        // 2. Check condition
        const conditionMet = /* check data */;

        if (conditionMet) {
            markLevelCompleted(N);
            gameState.currentLevel = Math.max(gameState.currentLevel, N + 1);
            saveGameState();
            if (!recheck) {
                updateUI();
            }
            return true;
        }

        // 3a. If recheck and failed, pull back
        if (recheck) {
            markLevelPending(N);
            if (gameState.currentLevel > N) {
                gameState.currentLevel = N;
                saveGameState();
                updateUI();
            }
            return false;
        }

        // 3b. First attempt: save as pending, allow advance
        markLevelPending(N);
        gameState.currentLevel = Math.max(gameState.currentLevel, N + 1);
        saveGameState();
        errorMsg.innerHTML = `Saved as <strong>pending</strong>. [Detailed message with link]. We'll re-check automatically.`;
        errorMsg.classList.add('show');
        updateUI();
        return false;
    } catch (e) {
        if (!recheck) {
            errorMsg.textContent = 'Error checking. Please try again.';
            errorMsg.classList.add('show');
        }
        console.error(`Level ${N} error:`, e);
        return false;
    }
}

// Wire in DOMContentLoaded
document.getElementById('check-level-N').addEventListener('click', checkLevelN);
```

### Adding Skip Logic
```javascript
async function canSkipLevel(level) {
    // Example: Skip "create issue" if they already have one
    if (level === 2) {
        return checkForExistingUserIssue(gameState.username);
    }
    return false;
}

// In mission box:
if (await canSkipLevel(gameState.currentLevel)) {
    // Show: "You already did this! Click Next to skip."
}
```

### Adding Template Suggestion
```html
<p id="level-1-template" class="template-suggestion" hidden></p>

<!-- After page load: -->
<script>
    const template = getSeussianTemplate('comment');
    const elem = document.getElementById('level-1-template');
    elem.textContent = `💡 Suggestion: "${template}"`;
    elem.hidden = false;
</script>
```

### CSS for New Elements
```css
.permission-note {
    background: rgba(255, 215, 0, 0.1);
    border-left: 4px solid var(--color-seuss-yellow);
    padding: var(--space-md);
    margin: var(--space-md) 0;
    font-size: 0.95rem;
}

.template-suggestion {
    background: rgba(0, 168, 255, 0.1);
    border-left: 4px solid var(--color-seuss-blue);
    padding: var(--space-md);
    margin: var(--space-md) 0;
    font-style: italic;
    color: var(--text-dark);
}

.optional-stage {
    opacity: 0.75;
    border: 2px dashed var(--color-accent-orange);
}
```

---

## 🔗 API Endpoints Needed

| Stage | Endpoint | Purpose | Notes |
|-------|----------|---------|-------|
| 1–2 | `/issues` | Check for comments | Search or direct fetch |
| 3–5 | `/issues/{id}` | Validate edits | Check updated_at vs created_at |
| 5 | `/issues/{id}/comments` | Edit comments | Fetch all, compare timestamps |
| 7 | `/issues/{id}` | Check labels | Already in issue data |
| 8 | `/issues/{id}` | Check assignee | Already in issue data |
| 9 | `/user/repos` | Check fork exists | Filter type=forks |
| 10 | `/repos/{user}/{fork}/commits` | Validate file edit | Check commit author |
| 11 | `/repos/{user}/{fork}/branches` | Check branch created | Not critical |
| 13 | `/repos/{owner}/{repo}/pulls` | Check PR open | Filter head branch |
| 14 | `/pulls/{id}` | Validate PR edit | Check updated_at |
| 15 | `/pulls/{id}/comments` | Check PR comments | Fetch and validate |

All within GitHub's **60 request/hour unauthenticated limit**. With caching and pending rechecks, easily manageable.

---

## 🎪 Seussian Rhymes (Templates)

### Editing Rhymes
```
"You've made a start! You've made a creation!
But now comes the time for a small modification!
Edit the title! Add a version mark!
Change it with care! Make it a lark!"
```

### Labeling Rhymes
```
"A label, a label, a wonderful tag!
It helps you organize—oh what a drag!
Without the labels, all would be lost!
Add one now! No matter the cost!"
```

### Forking Rhymes
```
"A fork is YOUR copy, just for you!
You can change it! Yes, it's true!
The original stays the same, don't you see?
But YOUR fork is a playground—come follow me!"
```

### PR Rhymes
```
"A Pull Request is like a love note,
Saying 'Here are my changes! Please take note!'
The maintainer reads it, and says 'Yes!' or 'No!'
And that's how open source grows and grows!"
```

---

## ✨ Success Criteria

When Phase 1 is complete:
- [ ] All 18 stages load without errors
- [ ] Profile personalization shows name + followers + repos
- [ ] Pending recheck works (user can advance, auto-rollback on failure)
- [ ] Seussian templates display randomly
- [ ] Skip logic allows users to jump stages they've already done
- [ ] Offline indicator works (red/green dot)
- [ ] All localStorage persists across browser restarts
- [ ] Mobile responsive (320px+)
- [ ] WCAG 2.2 AA accessibility maintained

---

## 📝 Testing Checklist

### Before Rollout
- [ ] Test with 3+ different GitHub usernames
- [ ] Trigger rate limiting intentionally (test backoff)
- [ ] Close browser mid-game, reopen, verify state restored
- [ ] Go offline mid-game, verify error message, go back online
- [ ] Test all skip/branch/optional paths
- [ ] Verify all rhymes display (no HTML escaping issues)
- [ ] Screen reader test (NVDA/JAWS or VoiceOver)
- [ ] Mobile touch test (no accidental taps)
- [ ] Check all error messages are actionable

### During Workshop
- Monitor API rate limit (should use <30 reqs/student)
- Collect feedback on rhyme clarity
- Note any stages students skip or struggle with
- Track time per stage (should be 2–5 min each)

---

## 💰 Rough Effort Estimate

| Phase | Stages | Days | Notes |
|-------|--------|------|-------|
| 1A | 3–8 | 2–3 | HTML structure + validators (pattern repeats) |
| 1B | 9–12 | 1–2 | Fork/web UI (less complex validation) |
| 2A | 13–17 | 2–3 | PR workflow (most complex API) |
| 2B | 18–25 | 1 week | Drills + polish |
| Testing | All | 2–3 | Cross-browser, accessibility, edge cases |
| **Total** | **18–25** | **2–3 weeks** | **Full rollout** |

---

## 🚀 Launch Plan

1. **Week 1**: Stages 1–8 (discovery, create, edit, label, assign)
2. **Week 2**: Stages 9–12 (fork, web edit, branching, commit) + testing
3. **Week 3**: Stages 13–17 (PR workflow) + polish
4. **Ongoing**: Gather feedback, add optional drills as time permits

Each stage deployable independently via URL navigation (`#level1`, `#level2`, etc.).

---

## 📞 Questions to Answer

1. **Repository permissions**: Will we use a real repo or a test sandbox?
2. **PR approval**: Who merges student PRs? (Suggestion: Auto-comment from bot, no merge)
3. **License default**: MIT as suggested? Can students change to GPL/AGPL?
4. **Discussions**: Enable them? Add as optional stage 20?
5. **Images**: Link Shutterstock, or use in-game SVG only?
6. **Workshop size**: Expected max concurrent users? (Affects rate limit planning)

---

**Ready to start Phase 1A? Let me know which stage to begin with!** 🐐✨
