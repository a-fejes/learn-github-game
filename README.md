# 🎪 The Git-Goat's Gazette

> A **narrative-driven, whimsical, WCAG 2.2 AA accessible** GitHub learning game for non-coders, designers, policy-makers, and anyone curious about collaborative development.

**Version 2.0** - Story-Driven Edition with URL Navigation, Parallax Guidance, and Interactive Events

---

## 📖 What Is This?

The Git-Goat's Gazette is an immersive educational experience that guides students on a **real GitHub journey**:

- **Consumer** → Explore and learn
- **Creator** → Report issues, share ideas
- **Contributor** → Fork, clone, experiment
- **Community Member** → Understand responsibility, collaborate

### 🎯 The Story Arc

| Level | Quest | Skill | Story |
|-------|-------|-------|-------|
| 0 | **Identity** | Create GitHub account | Establish yourself in the community |
| 1 | **Discovery** | Search for an issue | Learn to find what you need |
| 2 | **Voice** | Create an issue | Share your ideas with confidence |
| 3 | **Experimentation** | Fork a repository | Safe spaces to try things |
| 4 | **Responsibility** | Add a LICENSE | Understand ethics matter |
| 5 | **Collaboration** | Submit a PR | True partnership |
| Victory | **Recognition** | Celebrate! | You belong here |

Each level has:
- ✅ Seussian rhyming narrative
- ✅ Real GitHub action validation
- ✅ Visual parallax guidance
- ✅ Interactive feedback (discovery, creation, celebration)
- ✅ Educational scaffolding

---

## ✨ What's New in v2.0

### 🔗 URL Navigation
- **Shareable levels:** `https://example.com/#level1` through `#victory`
- **Bookmarkable progress:** Save and resume at any level
- **Browser back/forward:** Navigate like a normal website

### 🎨 Parallax Visual Guidance
- **Level 0:** Horizontal organizing (chaos → order)
- **Level 1:** Vertical search depth (discovery journey)
- **Level 3:** Deep forest (forking divergence)
- **Level 4:** Interactive library (spotlight guidance)
- **Level 5:** Isometric celebration stage

### 🎬 Interactive Events
- **Discovery:** Search particles, spotlight, sparkles
- **Creation:** Pen strokes, emergence effects
- **Error Recovery:** Gentle shake, helpful thought bubbles
- **Celebration:** Confetti, fireworks, trophies
- **Transitions:** Fades, wave reveals, dissolves

### 🎓 Better Pedagogy
- **Level 1:** Students **search** for "Suggestion Box" (not direct link)
- **Real skills:** Navigate like actual developers
- **Confidence building:** "I found it myself!"

### 📝 Content Lifecycle
- **Create:** See pen strokes, emergence animation
- **Edit:** Inline editing with preview
- **Delete:** Safe deletion with undo
- **Message:** Mistakes are learning opportunities

---

## 🚀 Quick Start

### 1. Setup Your Repository

Create a public GitHub repository named `git-goat-gazette`:

```bash
# Minimal content needed:
- Create Issue #1 titled "Suggestion Box"
  (Keep open—students will comment here)
- Create file: menu.txt with content: "1. Ham."
```

### 2. Deploy the Game

Push these files to your repository:
- `index.html`
- `style.css`
- `game.js`

Enable GitHub Pages (Settings → Pages → Deploy from main branch).

### 3. Configure the Game

Edit `game.js` (line ~10):
```javascript
const REPO_OWNER = 'your-username';
const REPO_NAME = 'git-goat-gazette';
```

### 4. Share the URL

Students visit:
```
https://your-username.github.io/git-goat-gazette/
```

---

## 🏫 Running a Workshop

### Before
1. ✅ Create and configure the repository (Steps 1–2 above)
2. ✅ Test the game with your GitHub account
3. ✅ Read [PEDAGOGICAL_DESIGN.md](PEDAGOGICAL_DESIGN.md) to understand the teaching approach

### During
1. **Frame the Story:**
   > "Today, you're helping the Grumpy Gopher learn that GitHub is just shared teamwork—nothing scary."

2. **Share the Game URL** with students.

3. **Key Teaching Moments:**
   - **Level 1:** "Notice you have to search? Real developers search. This teaches the skill."
   - **Level 3:** "Forking is how you experiment safely. Your changes don't affect the main project."
   - **Level 4:** "A LICENSE tells people how they can use your work. Ethics matter in code."

4. **Troubleshooting:**
   - **"API blocked"?** Rate limit hit (60 requests/hour). Wait or use a Personal Access Token.
   - **"Comment not found"?** GitHub's search indexes asynchronously (~30–60 sec). Retry.
   - **"Confused about a term"?** See the Glossary at the bottom of the game page.

5. **Celebrate!**
   - Level 5 completion shows a victory screen
   - Students see their real GitHub contribution graph
   - They've completed a real open-source-like workflow

---

## 📚 Documentation

| Document | For | Purpose |
|----------|-----|---------|
| [STORYBOARD.md](STORYBOARD.md) | Designers, Educators | Complete narrative arc and character journey |
| [VISUAL_DESIGN_DIRECTION.md](VISUAL_DESIGN_DIRECTION.md) | Designers, Developers | Parallax specs, interactive event specs, animations |
| [PEDAGOGICAL_DESIGN.md](PEDAGOGICAL_DESIGN.md) | Educators, Instructors | Why it works, learning outcomes, teaching strategy |
| [AGENTS.md](AGENTS.md) | Developers | Architecture, patterns, technical reference |
| [VISION_v2.0.md](VISION_v2.0.md) | Project Leads | Complete transformation overview |

---

## 💻 Technical Stack

- **Frontend:** Vanilla JavaScript (no frameworks, no build step)
- **API:** GitHub REST API v3 (public, unauthenticated)
- **Storage:** Browser localStorage (game state only)
- **Styling:** CSS Grid, CSS Variables, SVG characters
- **Accessibility:** WCAG 2.2 AA
- **Hosting:** GitHub Pages (free, fast, perfect)

---

## 🔧 Customization

### Change the Target Repository

Edit [game.js](game.js#L7-L8) to point to a different repository:
```javascript
const REPO_OWNER = 'your-username';      // GitHub username who owns the repo
const REPO_NAME = 'your-repo-name';      // Your repository name
```

**Primary repository:** https://github.com/mgifford/learn-github-game

### Change the Story/Rhymes

Edit the `<p class="rhyme">` sections in `index.html` to rewrite the narrative. Keep the accessibility structure (headings, labels, semantic HTML).

### Adjust Difficulty

**For Absolute Beginners:**
- On Level 2, lower the requirement. Instead of checking for a specific title, just check if they created *any* issue:
  ```javascript
  // In game.js, checkLevel2():
  if (result.items && result.items.length > 0) {
      // They created at least one issue. Pass.
  }
  ```

**For Advanced Users:**
- Add Level 5: Merging the PR.
- Add Level 6: Creating a Release.

### Change Colors/Fonts

Edit the CSS variables in `style.css`:
```css
:root {
    --color-primary: #1B5E20;       /* Change to your brand color */
    --color-accent-orange: #FF5722;
    --font-display: 'Comic Neue', cursive;
}
```

---

## ♿ Accessibility

This game is built for **WCAG 2.2 AA compliance**:

- ✅ **Keyboard Navigation:** Tab through all levels. Enter submits forms.
- ✅ **Focus Indicators:** Orange dashed outline shows where you are.
- ✅ **Screen Reader Compatible:** Semantic HTML, proper labels, ARIA live regions for errors.
- ✅ **Reduced Motion:** Animations pause for users with `prefers-reduced-motion: reduce`.
- ✅ **Color Contrast:** 4.5:1 text-to-background ratio (dark green on light backgrounds).
- ✅ **Touch-Friendly:** Buttons are 24×24 CSS pixels minimum.

---

## 🔐 Privacy & Security

- **No Tracking:** This game does not use Google Analytics, Mixpanel, or any third-party tracking.
- **No Data Storage:** All game state is saved to the student's browser (`localStorage`). No data is sent to any server except GitHub's public API.
- **HTTPS Only:** GitHub Pages is HTTPS-only. Usernames are sent securely to GitHub's API.
- **Public API Only:** The game uses only GitHub's **unauthenticated public API**, so no sensitive tokens are exposed.

**If you expect high traffic (30+ people at once on the same WiFi):**
- Provide students with Personal Access Tokens (PAT) scoped to `public_repo`.
- Modify `game.js` to accept an optional token and include it in the `Authorization` header.
- Do NOT save the token to `localStorage` permanently. Clear it on page unload.

---

## 📋 Instructor Checklist

- [ ] Create `git-goat-gazette` repository on GitHub
- [ ] Push `menu.txt` to main branch
- [ ] Create Issue #1 "Suggestion Box"
- [ ] Enable GitHub Pages
- [ ] Push `index.html`, `style.css`, `game.js` to main branch
- [ ] Update `REPO_OWNER` and `REPO_NAME` in `game.js`
- [ ] Test the game URL in a browser
- [ ] Verify Issue #1 is accessible and open
- [ ] Test all 5 levels with a test GitHub account
- [ ] Share the game URL with students

---

## 🐛 Troubleshooting

### Game Won't Load
- Check that GitHub Pages is enabled in Settings > Pages.
- Verify the game files are in the repository's main branch.
- Clear browser cache or open in an incognito window.

### "User not found" on Level 0
- Student may have entered their username incorrectly (typo).
- Verify the username at github.com/[username].

### "No comment found" on Level 1
- They may not have clicked "Comment" on Issue #1.
- They may have commented but GitHub's API hasn't indexed it yet (wait 30 seconds).

### "No issue found" on Level 2
- GitHub Search API has a delay. Wait 30–60 seconds and retry.
- If many students submit at once, the API rate limit (60 requests/hour per IP) may be hit. Solution: Use Personal Access Tokens.

### "LICENSE file not found" on Level 3
- They may have named it `Licence` (British spelling) instead of `LICENSE`.
- They may have committed to a different branch. Verify they're on `main`.

### "No Pull Request found" on Level 4
- Verify the PR is open (not merged or closed).
- Verify the PR is targeted at the main `git-goat-gazette` repo, not their own fork.

---

## 📚 Educational Principles

This game uses several learning design patterns:

### 1. **Narrative Framing**
The Seussian characters and rhyming story make the technical concepts approachable and memorable.

### 2. **Real Actions, Real Validation**
Students interact with GitHub directly. The game validates their work in real-time. This is not a simulation—it's scaffolded practice.

### 3. **Progressive Disclosure**
Each level introduces one concept:
- Level 0: Identity (Login)
- Level 1: Communication (Comments)
- Level 2: Reporting (Issues)
- Level 3: Ownership (Licensing)
- Level 4: Contribution (Pull Requests)

### 4. **Glossary as Safety Net**
Non-technical terms are used in the rhymes (e.g., "Suggestion Box" = Issue). The Glossary explains the GitHub terminology without breaking the narrative.

### 5. **Celebration of Mastery**
The victory screen explicitly lists the skills they've learned. They can view their GitHub profile and see the green square they just earned.

---

## 📝 License

This game is itself an example of good licensing. Choose one:

- **MIT License:** If you want others to fork and remix freely.
- **Creative Commons (CC-BY-4.0):** If you want credit attribution.
- **GNU GPL-3.0:** If you want modifications to remain open.

Add a `LICENSE` file to this repository to model what students will learn in Level 3!

---

## 🤝 Contributing

Found a bug or have an idea? Open an issue or pull request!

---

## 🎪 Inspiration

This game is inspired by the **Seussian aesthetic** of whimsy and learning, combined with the **design principles of accessible interactive tools** (WCAG 2.2 AA) and the **real-world value of collaborative development.**

The characters—the Git-Goat, the Grumpy Gopher, and the Wise GNU—are original creations designed to be legally distinct from existing works while capturing the same spirit of adventure and learning.

---

**Have fun, and remember: Everyone is welcome in open source.**

*– The Git-Goat* 🐐
