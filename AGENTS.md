# AGENTS.md

> **⚠️ INSTRUCTION FOR AI AGENTS & CONTRIBUTORS:**
> Read this file before generating code, content, or PRs. This project has strict architectural patterns.

---

## 1. Project Identity & Scope

### Core Principles
- **Repository Type:** Public GitHub Pages site
- **Tone:**
    * **Code:** Robust, secure, accessible.
    * **Content:** Clear, accurate, user-focused.

### Non-negotiables
- **No fake UI:** If a control exists, it works. If it does not work, remove it.
- **No fabricated data:** No fake sources or claims. Citations must be real and verifiable.
- **No tracking:** No fingerprinting or "phone home" behavior in tools.
- **Progressive enhancement:** Core content and primary actions must work without JS when feasible.
- **Accessibility:** Target WCAG 2.2 AA for all public-facing pages and tools.

---

## 2. Interactive Tools Standards

### Required Sections (every tool page)
1. **Clear page title** and one-sentence purpose
2. **Instructions** for inputs
3. **Results area** with appropriate ARIA live regions
4. **Error handling** section (user-visible)
5. **Limitations/assumptions** section
6. **"Sources / last verified"** section if referencing external facts

### Reliability Requirements
- **No uncaught exceptions** on page load
- **Wrap risky logic** in `try/catch` with user-visible error messages
- **If using `fetch`:**
  - Degrade gracefully when offline or blocked
  - Show loading and error states
  - Avoid sending user-entered content to third parties

### Privacy and Security
- Do not access `window.parent` or `window.top`
- Avoid localStorage/sessionStorage unless strictly required and documented
- **No third-party analytics** or tracking

---

## 3. Accessibility Requirements (WCAG 2.2 AA)

### Keyboard and Focus
- Every interactive element is reachable by keyboard
- Visible focus indicator (do not remove outlines)
- No keyboard traps
- Tab order matches visual order

### Labels and Names
- Every input has a programmatic label (`<label for>`, or `aria-label`/`aria-labelledby`)
- Buttons and links have accessible names matching visible labels
- Icon-only controls must have accessible names

### Errors and Dynamic Updates
- Validation errors must be:
  - Specific and actionable
  - Tied to the offending input (`aria-describedby`)
  - Shown in text (not color-only)
- Dynamic result updates must be announced via `role="status"` or `aria-live="polite"`

### Semantics
- One `<h1>` per page
- Use landmarks: `<header>`, `<main>`, `<footer>`
- Prefer native controls (`button`/`input`/`select`). Avoid div-as-button

### Touch Targets (WCAG 2.2)
- Controls must be sized/spaced to prevent mis-taps (minimum 24×24 CSS pixels)

---

## 4. Data Integrity and "Freshness" Rules

If a tool or policy references:
- Laws/regulations, standards versions (including WCAG)
- "Current" statistics, pricing, schedules, role-holders
- Recent events or temporary conditions

Then:
- **Cite an authoritative source** in-page, OR
- **Label content as unverified** and avoid definitive language
- **Include:** "Last verified: YYYY-MM-DD" when verified

### Content Creation Using AI
AI can be used to generate or normalize content, but:
- Result must remain consistent with the project's standards and contribution structure
- Must include resource links back to original sources where applicable
- Must not fabricate citations or data

---

## 5. Quality Enforcement Model (Phased)

This project uses a phased approach to quality enforcement to avoid blocking deployment while pages and tools are still stabilizing.

### Phase 1: Manual enforcement (current)
All requirements below are mandatory, but verified manually.

### Phase 2: Automated enforcement (planned)
Once the site builds reliably, these checks become enforced via GitHub Actions. No new requirements are introduced at that point; automation only enforces what already exists.

---

## 6. Planned Quality Checks

The following checks represent quality standards for this project. Implementation approach (manual, automated, or hybrid) will be determined based on project needs.

### Build and Deployment
**Purpose:**
- Ensure site builds and deploys without errors.

**Expectation:**
- Build process completes successfully.
- No broken links in generated output.
- All pages are accessible after deployment.

### HTML Validation
**Purpose:**
- Catch broken markup that causes rendering or accessibility failures.

**Expectation:**
- All pages produce valid semantic HTML.

**Suggested tool:**
- html-validate or W3C HTML validator (CLI)

### JavaScript Quality
**Purpose:**
- Prevent runtime failures in public tools.

**Expectation:**
- No uncaught exceptions on load.
- No syntax errors.
- Defensive coding around user input and network calls.

**Suggested tool:**
- ESLint with a minimal ruleset

### Accessibility Testing
**Purpose:**
- Catch obvious WCAG 2.2 AA failures early.

**Expectation:**
- No serious or critical violations.
- Manual review remains authoritative.

**Suggested tool:**
- axe-core via automated testing framework

**Thresholds (Fail Criteria if automated):**
- **Critical violations:** 0 allowed (fail build)
- **Serious violations:** 0 allowed (fail build)
- **Moderate violations:** Warning only (do not fail build)
- **Minor violations:** Informational only

### Security and Privacy Check
**Purpose:**
- Prevent accidental introduction of tracking or unsafe behavior.

**Expectation:**
- No third-party analytics.
- No unexpected network calls.
- No storage usage without documentation.

**Method:**
- Code review + network inspection

---

## 7. Definition of Done (For Any New Tool or Major Change)

A change is not considered complete until all of the following are true:

### Functionality
- Page loads with no console errors.
- All interactive controls work.
- Error states are visible and understandable.
- Empty states are handled.

### Accessibility (WCAG 2.2 AA intent)
- Keyboard navigation verified manually.
- Focus indicator visible.
- Labels and error messages programmatically associated.
- Dynamic results announced or otherwise perceivable.

### Content integrity
- No fabricated data or claims.
- Assumptions and limitations are stated.
- External facts are cited or labeled unverified.
- "Last verified" date included where applicable.

### Privacy and safety
- No tracking or analytics.
- No third-party data submission.
- No unsafe DOM or window access.

### Readiness for Automation
- Code is structured so automated checks can be added without refactoring.
- Known violations are documented explicitly (not silently ignored).

---

## 6. Game Architecture & Mechanics (The Git-Goat's Gazette)

### Tech Stack
- **Frontend:** Vanilla JavaScript (no frameworks, minimal dependencies)
- **External API:** GitHub REST API v3 (unauthenticated)
- **Storage:** Browser `localStorage` (game state, user progress)
- **Styling:** CSS Grid/Flexbox, CSS Variables for theming
- **Characters:** Inline SVG (scalable, accessible, animatable)

### Game State Structure
```javascript
gameState = {
    username: String | null,        // GitHub handle (null = not logged in)
    currentLevel: Number,           // 0-5 (0=login, 5=victory)
    completedLevels: Array<Number>  // [0, 1, 2, 3, 4] when complete
}
```

**Storage Key:** `'gitGoatGameState'` (as JSON string in localStorage)

### API Integration Strategy

**Rate Limits:**
- Unauthenticated: 60 requests/hour per IP address
- Shared WiFi (workshop): All students on same IP = shared limit
- **Mitigation:** Provide Personal Access Token option for high-traffic scenarios

**Endpoints Used:**

| Endpoint | Level | Purpose | Rate Impact | Notes |
|----------|-------|---------|-------------|-------|
| `GET /users/{username}` | 0 (Login) | Verify user exists | 1 req | Instant response |
| `GET /repos/{owner}/{repo}/issues/{issue_id}/comments` | 1 | Check for user comment | 1 req | May be delayed if just posted |
| `GET /search/issues?q=repo:...author:...` | 2, 4 | Search for issues/PRs | 1 req per level | **30-60 sec indexing delay** |
| `GET /repos/{owner}/{repo}/contents/LICENSE` | 3 | Check file existence | 1 req | 404 = not found |

**Error Handling Pattern:**
```javascript
try {
    const response = await fetch(url, { headers: API_HEADERS });
    
    if (!response.ok) {
        if (response.status === 404) {
            showError("Resource not found. Did you complete the task?");
        } else if (response.status === 403) {
            showError("Rate limit exceeded. Wait a few moments and try again.");
        } else {
            showError("GitHub API error. Please try again.");
        }
        return;
    }
    
    const data = await response.json();
    // Process data...
} catch (e) {
    showError("Network error. Check your connection.");
    console.error('API error:', e);
}
```

### Client-Side Validation
- All level checks are performed by the **browser**, not a server
- No backend exists; the game is entirely static HTML/CSS/JS
- GitHub's public API is the "source of truth" for validation
- User can see API requests in browser DevTools (transparency)

### State Persistence
- On page load: `restoreGameState()` reads from localStorage
- After level completion: `saveGameState()` writes to localStorage
- No server-side session; progress lost if localStorage is cleared
- Reset available via `window.resetGame()` (console command for testing)

---

## 7. Level & Component Patterns

### Level HTML Structure (Template)

Every level follows this pattern:

```html
<section id="level-N" class="seuss-card level-card" aria-labelledby="level-N-title" hidden>
    <div class="card-content">
        <!-- 1. Level Title -->
        <h2 id="level-N-title" class="level-title">Level N: [Seussian Name]</h2>

        <!-- 2. Character Intro (optional) -->
        <div class="character-intro">
            <div class="character grumpy-gopher">
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <!-- SVG paths -->
                </svg>
            </div>
            <p class="character-label">[Character Name]</p>
        </div>

        <!-- 3. Rhyming Narrative -->
        <p class="rhyme">
            <em>"Rhyming text that explains the task..."</em>
        </p>

        <!-- 4. Git-Goat Guidance (optional) -->
        <div class="git-goat-speaks">
            <p><strong>The Git-Goat says:</strong> "Plain language explanation..."</p>
        </div>

        <!-- 5. Mission/Instructions -->
        <div class="mission-box">
            <h3>Your Mission:</h3>
            <ol>
                <li>Step 1</li>
                <li>Step 2</li>
                <li>Click the button below</li>
            </ol>
        </div>

        <!-- 6. Call-to-Action Link (if needed) -->
        <a id="[action]-link" class="action-link" target="_blank" rel="noopener">
            → Open [Thing] in GitHub
        </a>

        <!-- 7. Validation Button -->
        <button type="button" id="check-level-N" class="level-button button-primary">
            [Seussian Button Text]!
        </button>

        <!-- 8. Error Message (live region) -->
        <div id="level-N-error" class="error-msg" role="alert" aria-live="assertive"></div>

        <!-- 9. Hint (disclosure widget) -->
        <details class="hint">
            <summary>Need a hint?</summary>
            <p>Helpful hint text...</p>
        </details>
    </div>
</section>
```

### Naming Conventions
- **Section ID:** `level-{0-4}` (plus `victory`)
- **Button ID:** `check-level-{N}`
- **Error Message ID:** `level-{N}-error`
- **Links:** `{action}-link` (e.g., `issue-link`, `fork-link`)
- **CSS Classes:** `.level-card`, `.button-primary`, `.mission-box`, `.rhyme`

### JavaScript Handler Pattern
```javascript
async function checkLevelN() {
    const errorMsg = document.getElementById('level-N-error');
    errorMsg.classList.remove('show');

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        
        // Check condition
        if (conditionMet(data)) {
            gameState.currentLevel = N + 1;
            saveGameState();
            updateUI();
        } else {
            errorMsg.textContent = 'User-friendly error message.';
            errorMsg.classList.add('show');
        }
    } catch (e) {
        errorMsg.textContent = 'Error checking. Please try again.';
        errorMsg.classList.add('show');
        console.error(`Level ${N} error:`, e);
    }
}

// Wire up button
document.getElementById('check-level-N').addEventListener('click', checkLevelN);
```

### Character & SVG Guidelines

**Accessibility:**
- SVG `aria-hidden="true"` for decorative characters
- Meaningful alt text in story text, not the SVG
- Example: "The Git-Goat, a cheerful orange fox in a chef's hat..."

**Animation:**
- Wobble/sway animations use `@keyframes` defined in CSS
- All animations wrapped in `@media (prefers-reduced-motion: no-preference)`
- Example: `.wobble-effect { animation: wobble 3s ease-in-out infinite; }`

**SVG Structure:**
- Keep paths simple for fast rendering
- Use semantic circle/ellipse over complex paths when possible
- Test in multiple browsers (Safari has SVG quirks)

### Glossary Table Pattern
```html
<table class="glossary-table">
    <thead>
        <tr>
            <th>What the Goat Says</th>
            <th>GitHub Term</th>
            <th>What It Really Means</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>[Plain Language]</td>
            <td>[GitHub Jargon]</td>
            <td>[Explanation]</td>
        </tr>
    </tbody>
</table>
```

---

## 8. Accessibility Standards for Interactive Games

### Focus Management
When a new level becomes visible:
```javascript
const heading = currentSection.querySelector('h2');
if (heading) {
    setTimeout(() => heading.focus(), 100);
}
```

This ensures:
- Screen reader announces the new level title
- Keyboard user focus is moved to logical starting point
- No "focus trap" (user isn't stuck in previous level)

### Live Regions for Error Messages
```html
<div id="level-N-error" class="error-msg" role="alert" aria-live="assertive"></div>
```

- `role="alert"` + `aria-live="assertive"`: Screen reader **interrupts** to announce errors immediately
- Error text is **always** visible (not color-only, not hidden)
- Multiple errors: Clear previous error, show new one

### Motion Preferences
```css
@media (prefers-reduced-motion: reduce) {
    .wobble-effect {
        animation: none;
    }
}
```

**Rules:**
- All `@keyframes` wrapped in `@media (prefers-reduced-motion: no-preference)`
- No infinite animations for reduced-motion users
- Auto-advance or timed events disabled for reduced-motion users

### Form Accessibility
Every input must have a label:
```html
<label for="github-username">Your GitHub Username:</label>
<input 
    type="text" 
    id="github-username" 
    class="input-field" 
    required
    aria-describedby="username-hint"
>
<p id="username-hint" class="form-hint">Help text...</p>
```

- `<label for="">` links label to input
- `aria-describedby=""` links hint text to input
- Validation errors use `aria-describedby` to point to error message

### Focus Styles (Visible Always)
```css
button:focus {
    outline: 3px dashed var(--color-primary-focus);  /* Orange dashed */
    outline-offset: 2px;                              /* Visible padding */
}
```

**No removing outlines.** Outline contrast must be ≥3:1 against background.

---

## 9. Adding New Levels (Definition of Done)

### Pre-Development: Design Review
- [ ] New concept fits into GitHub workflow (not too advanced, not redundant)
- [ ] Seussian rhyme captures the spirit of the task
- [ ] GitHub API endpoint exists and is well-documented
- [ ] Character/illustration sketched (even rough)

### HTML Structure
- [ ] Section follows level template (Section 7)
- [ ] H2 title present and unique (id matches section id)
- [ ] Character SVG included with `aria-hidden="true"`
- [ ] Rhyme text wrapped in `<p class="rhyme">` and italicized
- [ ] Mission box lists exact steps (numbered list)
- [ ] Action link opens correct GitHub URL (target="_blank" rel="noopener")
- [ ] Check button has unique ID and clear Seussian text
- [ ] Error message div has role="alert" and aria-live="assertive"
- [ ] Hint details element provided (even if simple)

### JavaScript Logic
- [ ] Handler function follows checkLevelN() pattern
- [ ] GitHub API endpoint documented in function comment
- [ ] Error handling covers: 404, rate limit (403), network errors, no match
- [ ] Error messages are friendly and actionable (no "API Error Code 422")
- [ ] Success updates `gameState.currentLevel` and calls `saveGameState()`
- [ ] Success calls `updateUI()` to show next level
- [ ] Event listener wired to button in DOMContentLoaded

### CSS
- [ ] New classes follow naming pattern (`.level-card`, `.mission-box`, etc.)
- [ ] Colors meet 4.5:1 contrast ratio (WCAG AA)
- [ ] Responsive at 480px, 768px, and desktop widths
- [ ] Any animations wrapped in `@media (prefers-reduced-motion: no-preference)`
- [ ] SVG character wobble/animation defined and tested

### Story & Accessibility
- [ ] Rhyme maintains Seussian tone (rhythm, meter, whimsy)
- [ ] Plain language explains task without technical jargon first
- [ ] Glossary table updated with any new GitHub terms
- [ ] Keyboard navigation tested (Tab through all interactive elements)
- [ ] Screen reader tested (NVDA on Windows, VoiceOver on Mac)
- [ ] Error message read aloud properly
- [ ] Focus moved correctly when level changes
- [ ] No focus traps

### Testing
- [ ] Test with valid GitHub username (should advance)
- [ ] Test with invalid input (should show error)
- [ ] Test with API rate limit (should show friendly error)
- [ ] Test offline mode (should show network error)
- [ ] Test with `prefers-reduced-motion: reduce` (no animations)
- [ ] Test on mobile (touch-friendly, responsive layout)
- [ ] Test in Chrome, Firefox, Safari, Edge

---

## 10. Customization & Localization

### Story Modifications (Safe)
The rhymes live entirely in `<p class="rhyme">` tags in [index.html](index.html):

**Safe to change:**
- Rhyming text (keep rhythm/meter similar)
- Character names and descriptions
- Mission step wording
- Button text (keep Seussian tone)
- Error messages (keep friendly/helpful)

**Careful with:**
- Level order (some depend on others)
- GitHub API endpoints (changes require JS updates)
- Number of levels (requires testing entire flow)

### Difficulty Levels
To adjust validation strictness:

**Easy Mode (Perfect for Absolute Beginners):**
```javascript
// Level 2: Accept ANY issue from user (don't require specific title)
if (result.items && result.items.length > 0) {
    // They created an issue. Good enough!
    gameState.currentLevel = 3;
}
```

**Hard Mode (Advanced Users):**
```javascript
// Level 4: Require PR to be MERGED (not just open)
if (result.items && result.items[0].pull_request.merged_at) {
    // PR is merged. Success!
}
```

### Theming (CSS Variables)
Change colors without editing entire stylesheet:

```css
:root {
    --color-primary: #1B5E20;           /* Change to your brand green */
    --color-accent-orange: #FF5722;     /* Focus ring color */
    --color-accent-purple: #8E44AD;     /* Secondary accent */
    --font-display: 'Comic Neue', cursive;  /* Title font */
    --font-body: 'Comic Neue', sans-serif;  /* Body font */
}
```

### Character Design (SVG)
To create a new character:
1. Design in Figrator or Illustrator (hand-drawn look)
2. Export as SVG
3. Inline the SVG in HTML (remove `<svg>` wrapper, keep `<path>` elements)
4. Add `class="wobble-effect"` to group for animation
5. Add `aria-hidden="true"` and descriptive text in story

### Repository Variables (Multi-Tenant Support)
To support different target repos without code changes:

```html
<input 
    type="hidden" 
    id="repo-owner" 
    value="default-owner"
>
<input 
    type="hidden" 
    id="repo-name" 
    value="git-goat-gazette"
>
```

Then in JS:
```javascript
const REPO_OWNER = document.getElementById('repo-owner').value;
const REPO_NAME = document.getElementById('repo-name').value;
```

This allows hosting the game on multiple GitHub Pages sites without code duplication.

---

## 11. Testing Checklist Before Deployment

### GitHub API Verification
- [ ] Endpoint `/users/{username}` returns 200 for valid user, 404 for invalid
- [ ] Endpoint `/repos/{owner}/{repo}/issues/{id}/comments` returns array
- [ ] Search endpoint `/search/issues` works with query (note 30-60 sec delay)
- [ ] Endpoint `/repos/{owner}/{repo}/contents/LICENSE` returns 200 or 404
- [ ] All endpoints tested with network throttling (slow 3G)
- [ ] Rate limit headers checked: `X-RateLimit-Remaining`

### Game State & Persistence
- [ ] `localStorage` stores game state correctly
- [ ] On page refresh, game state restored (same level)
- [ ] `resetGame()` clears state completely
- [ ] `gameState` object has correct structure

### Accessibility Testing
- [ ] Keyboard navigation: Tab through all interactive elements
- [ ] Focus moves to new level heading when level changes
- [ ] All buttons/links have visible focus indicators (orange dashed)
- [ ] Screen reader (NVDA/JAWS on Windows, VoiceOver on Mac):
  - [ ] Level title is announced
  - [ ] Form labels are read
  - [ ] Error messages are announced as "alert"
  - [ ] Mission list is read as ordered list
- [ ] Touch: All buttons are 24×24+ CSS pixels, no accidental taps
- [ ] Color contrast: Text vs. background ≥4.5:1 (checked with axe-core)

### Error Handling
- [ ] Rate limit (403): Shows friendly message, suggests waiting
- [ ] Invalid username (404): Shows "user not found" message
- [ ] Network error: Shows offline message
- [ ] API down: Shows "GitHub is busy" message
- [ ] Missing GitHub resource: Shows actionable error (e.g., "Issue #1 not found")

### Cross-Browser Testing
| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| Chrome | Latest | ✓ | Primary target |
| Firefox | Latest | ✓ | ESC key behavior different |
| Safari | 15+ | ✓ | SVG animation quirks possible |
| Edge | Latest | ✓ | Same as Chrome (Chromium) |
| Mobile Safari | iOS 15+ | ✓ | Touch-friendly |
| Chrome Mobile | Latest | ✓ | Responsive layout |

### Performance
- [ ] Page load time < 2 seconds (lighthouse)
- [ ] API calls complete < 5 seconds (with throttling)
- [ ] CSS animations are smooth (60 FPS)
- [ ] No console errors or warnings
- [ ] No memory leaks (check DevTools memory profiler)

### Workshop Simulation
- [ ] Simulate 10 concurrent users on same IP
- [ ] Verify rate limit handling (show error after 60 requests)
- [ ] Test with staggered submissions (some waiting 30-60 sec for search)
- [ ] Test on slow network (3G, high latency)

---

## 12. Rate Limiting & Scaling Strategy

### Current Architecture
- **Unauthenticated:** 60 requests/hour per IP
- **Per-level cost:** 1-2 API requests
- **Expected capacity:** ~30 requests/hour = 15-30 students before rate limit

### Scaling Scenarios

#### Scenario 1: Small Workshop (< 10 students)
- **Setup:** No changes needed
- **Expected behavior:** All students pass within 60 requests
- **Monitoring:** None required

#### Scenario 2: Medium Workshop (10-30 students)
- **Setup:** Stagger participation (break into 2-3 groups of 10)
- **Timing:** Group 1 plays 9am-9:30am, Group 2 plays 10am-10:30am
- **Rate reset:** Full reset at 1 hour mark (e.g., 9am batch resets at 10am)

#### Scenario 3: Large Event (30+ students, same time)
- **Issue:** Shared IP = 60 combined requests/hour
- **Solution:** Provide Personal Access Tokens (PAT)

**Implementation (PAT Support):**

1. Create PATs for attendees beforehand (or guide them to create own):
   - Scope: `public_repo` only
   - Expiration: After workshop
   - Note: "Git-Goat Workshop - [Date]"

2. Modify [game.js](game.js) to accept optional token:
   ```javascript
   // Optional: Add to Level 0 form
   <input type="password" id="github-token" placeholder="(Optional) GitHub Token">
   
   const token = document.getElementById('github-token').value;
   const API_HEADERS = token ? {
       'Authorization': `token ${token}`,
       'Accept': 'application/vnd.github.v3+json'
   } : {
       'Accept': 'application/vnd.github.v3+json'
   };
   ```

3. **Do NOT save token to localStorage.** Clear on page unload:
   ```javascript
   window.addEventListener('beforeunload', () => {
       document.getElementById('github-token').value = '';
   });
   ```

4. With PAT: Rate limit increases to **5,000 requests/hour**

**Rate Limit Response:**
```javascript
const remaining = response.headers.get('X-RateLimit-Remaining');
if (remaining === '0') {
    showError(`Rate limit reached. ${10} requests remaining. Wait 1 hour or use a GitHub token.`);
}
```

### Monitoring
Check current rate limit in browser console:
```javascript
async function checkRateLimit() {
    const res = await fetch('https://api.github.com/rate_limit', { headers: API_HEADERS });
    const data = await res.json();
    console.log(`Remaining: ${data.rate.remaining}/${data.rate.limit}`);
}
```

### Best Practices for Instructors
- [ ] Test with expected number of students on same WiFi
- [ ] Have backup: Print GitHub URLs for manual access if API unavailable
- [ ] Explain rate limits upfront (sets expectations)
- [ ] Provide PAT instructions for large groups
- [ ] Monitor rate limit during workshop (run `checkRateLimit()` periodically)
- [ ] Have students stagger submissions if hitting limit