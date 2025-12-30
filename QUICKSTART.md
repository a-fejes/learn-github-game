# Quick Start: The Git-Goat's Gazette

## 🚀 5-Minute Setup

### 1. Configure the Game
Edit [game.js](game.js#L7-L8):
```javascript
const REPO_OWNER = 'mgifford';          // GitHub username
const REPO_NAME = 'learn-github-game';  // Repository name (change these if forking)
```

### 2. Create/Verify the Target Repository
On GitHub: https://github.com/mgifford/learn-github-game
- Create a new **public** repo named `learn-github-game`
- Create [Issue #1](https://github.com/mgifford/learn-github-game/issues/new) with title "Suggestion Box"
- Create a file `menu.txt` with content: `1. Ham.`
- Enable GitHub Pages (Settings → Pages → Source: main branch, root folder)

### 3. Push These Files
Push all files in this folder to the `learn-github-game` repository on the `main` branch:
- `index.html`
- `style.css`
- `game.js`
- `README.md`

### 4. Launch!
Visit: `https://mgifford.github.io/learn-github-game/`

---

## 🎮 Game Flow

| Level | Goal | GitHub Action | Validation |
|-------|------|---------------|-----------|
| **0** | Login | Enter GitHub username | API checks if user exists |
| **1** | Comment | Leave a note on Issue #1 | API checks for comment by user |
| **2** | Report | Create an issue with "Anchor" or "Tight" in title | API search for issue by user |
| **3** | License | Create a `LICENSE` file in the repo | API checks for file existence |
| **4** | Contribute | Fork + edit `menu.txt` + create a PR | API checks for open PR by user |
| **5** | Victory! | N/A | Celebration screen + link to GitHub profile |

---

## 🔧 Files Explained

| File | Purpose |
|------|---------|
| [index.html](index.html) | Game structure, rhymes, UI layout |
| [style.css](style.css) | WCAG 2.2 AA styling, animations, responsive design |
| [game.js](game.js#L7-L8) | **GitHub API calls, game state management, configuration** |
| [README.md](README.md) | **Full instructor guide** (read this before teaching!) |
| [AGENTS.md](AGENTS.md) | Project architecture and accessibility standards |

---

## ⚡ API Rate Limits & Gotchas

**The GitHub public API allows:**
- 60 requests per hour per IP address (unauthenticated)
- Search results have a 30–60 second indexing delay

**Workshop Tip:**
- If 30+ students play at once on the same WiFi, they may hit the rate limit
- **Solution:** Have students use Personal Access Tokens (PAT) with `public_repo` scope
- Update `game.js` to accept an optional token in the Authorization header

---

## ♿ Accessibility Checklist

This game meets **WCAG 2.2 AA**:

- ✅ Keyboard navigation (Tab, Enter, Space)
- ✅ Visible focus indicators (orange dashed outline)
- ✅ Semantic HTML with proper headings
- ✅ Screen reader compatible (ARIA labels, live regions)
- ✅ High contrast colors (4.5:1 ratio)
- ✅ Respects `prefers-reduced-motion`
- ✅ Touch-friendly button sizes (24×24+ CSS pixels)

No tracking, no third-party scripts, no sensitive data storage.

---

## 🧪 Test it Yourself First!

Before running a workshop, play through the game with a test GitHub account:

1. Create a test account (or use an existing one)
2. Visit the game URL
3. Complete all 5 levels to verify the flow
4. Check that Issue #1 exists and is open
5. Verify that the fork/PR flow works as expected

---

## 📞 Common Questions

**Q: Can I change the story/characters?**  
A: Yes! Edit the rhymes in [index.html](index.html). Keep the semantic structure (headings, labels).

**Q: Can I use a different repository name?**  
A: Yes, but update `REPO_NAME` in [game.js](game.js#L8) and ensure the repo exists on GitHub.

**Q: What if the API rate limit is hit?**  
A: Students will see an error message. Solution: Use Personal Access Tokens or wait 1 hour for the limit to reset.

**Q: Is this game only for coders?**  
A: No! It's designed for **non-coders, designers, and policy-makers.** The glossary translates GitHub jargon to plain language.

**Q: Can students collaborate on the same repository?**  
A: Yes! Multiple students can comment on Issue #1, create their own issues, add their PRs, etc. The game validates each student's work independently.

---

## 📚 Resources

- [GitHub Learning Lab](https://github.skills.github.com/)
- [GitHub REST API Docs](https://docs.github.com/en/rest)
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [Choose a License](https://choosealicense.com/)

---

**Ready to teach? Let's get those Grumpy Gophers coding!** 🐐
