# The Git-Goat's Gazette

A **whimsical, WCAG 2.2 AA accessible** GitHub learning game for non-coders, designers, and policy-makers who want to understand collaborative development without fear of the terminal.

---

## 📖 What Is This?

"The Git-Goat's Gazette" teaches core GitHub skills through a narrative game:

1. **Level 0:** Log in with your GitHub username (Login)
2. **Level 1:** Leave a comment on an issue (Collaboration)
3. **Level 2:** Create a new issue (Reporting & Documentation)
4. **Level 3:** Add a LICENSE file (Legal/Ownership)
5. **Level 4:** Make a Pull Request (The Big Contribution)

At each level, the player reads a Seussian rhyme, performs a real GitHub action, and the game validates it in real-time using the GitHub REST API.

---

## 🎮 How to Set Up for a Workshop

### Step 1: Create the Target Repository

On GitHub, create a new **public** repository named `git-goat-gazette`. This is the repository that students will interact with.

```bash
# Suggested:
- Owner: Your GitHub username
- Repository name: git-goat-gazette
- Visibility: Public
- Initialize with: No template
```

### Step 2: Seed the Repository Content

Push the following structure to the repository's `main` branch:

#### File: `menu.txt`
```
1. Ham.
```

This file will be edited by students in Level 4.

#### File: `.github/ISSUE_TEMPLATE/suggestion_box.md` (Optional)
If you want to guide students on what to write:
```markdown
# Suggestion Box

What would you like the Goat to know?

- Is there something broken?
- Do you have an idea?
- Tell us!
```

#### Create Issue #1
Go to the **Issues** tab and create a new issue:

- **Title:** `Suggestion Box`
- **Description:** 
  ```
  Welcome to the Gazette! This is where the Goat and the Gopher chat.
  
  Leave a comment below saying hello!
  ```
- **Do NOT close this issue.** Leave it open and pinned.

#### Enable Discussions (Optional)
Go to **Settings > Features** and enable **Discussions**. This allows students to practice more collaboration, though Level 3 focuses on the LICENSE file instead.

### Step 3: Deploy the Game on GitHub Pages

1. **Enable GitHub Pages:**
   - Go to Settings → Pages
   - Source: Deploy from branch
   - Branch: `main`
   - Folder: `/` (root)

2. **Push these files to the repository:**
   - `index.html`
   - `style.css`
   - `game.js`
   - `README.md` (this file)

3. **Update `game.js` configuration:**
   ```javascript
   const REPO_OWNER = 'YOUR_GITHUB_USERNAME'; // Replace with your username
   const REPO_NAME = 'git-goat-gazette';       // Should match your repo name
   ```

4. **Access the game:**
   ```
   https://YOUR_USERNAME.github.io/git-goat-gazette/
   ```

---

## 🏫 Running a Workshop

### Before the Workshop

1. Create the repository and seed it (Steps 1–2 above).
2. Verify the game loads at `https://YOUR_USERNAME.github.io/git-goat-gazette/`.
3. Test the game yourself with a test GitHub account.

### During the Workshop

1. **Introduce the Characters:**
   - The Git-Goat: Your friendly guide.
   - The Grumpy Gopher: The skeptical learner (that's the audience).
   - The GNU: The licensing lawyer.

2. **Explain the Goal:**
   > "You're helping the Grumpy Gopher understand that GitHub isn't scary—it's just a shared filing cabinet for teamwork."

3. **Have Students Visit the Game URL.**
   - They'll enter their GitHub username.
   - They'll follow the rhyming instructions to complete each level.
   - The game validates in real-time using the public GitHub API.

4. **Circulate and Help:**
   - **Issue:** "The API is blocking me." → They've hit the 60-request/hour rate limit. Explain that if many people refresh, they can share a Personal Access Token (optional, advanced).
   - **Issue:** "It says my comment isn't there yet." → GitHub's search API is indexed asynchronously. Wait 30–60 seconds and retry.
   - **Issue:** "I don't understand what a Fork is." → Point them to the Glossary at the bottom of the game page.

5. **Celebrate Victory:**
   - When students complete Level 4 (merge the PR), they see a victory screen.
   - They can view their GitHub contribution graph.

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
