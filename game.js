/**
 * The Git-Goat's Gazette
 * A WCAG 2.2 AA compliant GitHub learning game
 * 
 * Configuration
 */

// ⚙️ CONFIGURATION: Update these values to change the target repository
// These can be changed to point to different repos without modifying the game logic
const REPO_OWNER = 'mgifford';          // GitHub username who owns the repo
const REPO_NAME = 'learn-github-game';  // Repository name (no spaces, lowercase preferred)

// API configuration
const GITHUB_API_BASE = 'https://api.github.com';
const API_HEADERS = {
    'Accept': 'application/vnd.github.v3+json'
};

// Game state
let gameState = {
    username: null,
    currentLevel: 0,
    completedLevels: [],
};

/**
 * Initialize the game
 */
document.addEventListener('DOMContentLoaded', () => {
    restoreGameState();
    
    // Check URL hash for level navigation
    const hash = window.location.hash.slice(1);
    if (hash && isValidLevel(hash)) {
        gameState.currentLevel = getLevelNumberFromHash(hash);
    }
    
    updateUI();
    updateURLHash();

    // Event listeners for level validation
    document.getElementById('login-button').addEventListener('click', handleLoginClick);
    document.getElementById('check-level-1').addEventListener('click', checkLevel1);
    document.getElementById('check-level-2').addEventListener('click', checkLevel2);
    document.getElementById('check-level-3').addEventListener('click', checkLevel3);
    document.getElementById('check-level-4').addEventListener('click', checkLevel4);

    // Navigation buttons
    document.getElementById('prev-button').addEventListener('click', goToPreviousLevel);
    document.getElementById('next-button').addEventListener('click', goToNextLevel);

    // Allow Enter key to submit username
    document.getElementById('github-username').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleLoginClick();
        }
    });
    
    // Listen for hash changes (browser back/forward)
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.slice(1);
        if (hash && isValidLevel(hash)) {
            gameState.currentLevel = getLevelNumberFromHash(hash);
            updateUI();
        }
    });
});

/**
 * Update the entire UI based on game state
 */
function updateUI() {
    // Hide all sections
    document.querySelectorAll('.level-card, .victory-card').forEach(section => {
        section.setAttribute('hidden', '');
    });

    // Show current section
    const currentSection = document.getElementById(`level-${gameState.currentLevel}`);
    if (currentSection) {
        currentSection.removeAttribute('hidden');
        // Move focus to the section for accessibility
        const heading = currentSection.querySelector('h2');
        if (heading) {
            setTimeout(() => heading.focus(), 100);
        }
    } else if (gameState.currentLevel === 5) {
        // Victory screen
        const victorySection = document.getElementById('victory');
        victorySection.removeAttribute('hidden');
        const victoryHeading = victorySection.querySelector('h2');
        if (victoryHeading) {
            setTimeout(() => victoryHeading.focus(), 100);
        }
        // Set the profile link
        document.getElementById('profile-link').href = `https://github.com/${gameState.username}`;
    }

    // Update user status
    if (gameState.username) {
        document.getElementById('user-status').textContent = `Welcome, ${gameState.username}! You're on Level ${gameState.currentLevel}.`;
    }

    // Update repository links with actual username/repo
    updateRepositoryLinks();

    // Update navigation UI
    updateNavigationUI();
    
    // Update URL hash to reflect current level
    updateURLHash();
}

/**
 * Update all repository links
 */

/**
 * Update the URL hash to reflect current level
 */
function updateURLHash() {
    const hash = getLevelHashName(gameState.currentLevel);
    window.history.pushState(null, null, `#${hash}`);
}

/**
 * Get hash name for a level number
 */
function getLevelHashName(levelNumber) {
    const levelNames = {
        0: 'level0',
        1: 'level1',
        2: 'level2',
        3: 'level3',
        4: 'level4',
        5: 'victory'
    };
    return levelNames[levelNumber] || 'level0';
}

/**
 * Get level number from hash string
 */
function getLevelNumberFromHash(hash) {
    const hashMap = {
        'level0': 0,
        'level1': 1,
        'level2': 2,
        'level3': 3,
        'level4': 4,
        'level5': 5,
        'victory': 5
    };
    return hashMap[hash.toLowerCase()] !== undefined ? hashMap[hash.toLowerCase()] : 0;
}

/**
 * Check if hash is a valid level
 */
function isValidLevel(hash) {
    const validLevels = ['level0', 'level1', 'level2', 'level3', 'level4', 'level5', 'victory'];
    return validLevels.includes(hash.toLowerCase());
}

function updateRepositoryLinks() {
    const repoUrl = `https://github.com/${REPO_OWNER}/${REPO_NAME}`;
    
    // Level 1: Repository link (for searching)
    const repoLink = document.getElementById('repo-link');
    if (repoLink) {
        repoLink.href = `${repoUrl}/issues`;
    }

    // Level 2: New issue link
    const newIssueLink = document.getElementById('new-issue-link');
    if (newIssueLink) {
        newIssueLink.href = `${repoUrl}/issues/new`;
    }

    // Level 4: Fork link
    const forkLink = document.getElementById('fork-link');
    if (forkLink) {
        forkLink.href = `${repoUrl}/fork`;
    }
}

/**
 * Handle login (Level 0)
 */
async function handleLoginClick() {
    const input = document.getElementById('github-username');
    const username = input.value.trim();
    const errorMsg = document.getElementById('level-0-error');

    if (!username) {
        errorMsg.textContent = 'Please enter a GitHub username.';
        errorMsg.classList.add('show');
        return;
    }

    errorMsg.classList.remove('show');

    // Check if user exists
    try {
        const response = await fetch(
            `${GITHUB_API_BASE}/users/${username}`,
            { headers: API_HEADERS }
        );

        if (response.ok) {
            gameState.username = username;
            gameState.currentLevel = 1;
            saveGameState();
            updateUI();
        } else if (response.status === 404) {
            errorMsg.textContent = `User "${username}" not found. Sign up at github.com/signup.`;
            errorMsg.classList.add('show');
        } else {
            errorMsg.textContent = 'Error checking username. Please try again.';
            errorMsg.classList.add('show');
        }
    } catch (e) {
        errorMsg.textContent = 'Network error. Please check your connection.';
        errorMsg.classList.add('show');
        console.error('Login error:', e);
    }
}

/**
 * Level 1: Check if user commented on Issue #1
 */
async function checkLevel1() {
    const errorMsg = document.getElementById('level-1-error');
    errorMsg.classList.remove('show');

    try {
        const url = `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/issues/1/comments`;
        const response = await fetch(url, { headers: API_HEADERS });

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }

        const comments = await response.json();
        
        // Debug: Log all comments to console
        console.log('Comments on Issue #1:', comments);
        console.log('Looking for comments from:', gameState.username);
        
        const userComment = comments.some(c => c.user.login === gameState.username);

        if (userComment) {
            gameState.currentLevel = 2;
            saveGameState();
            updateUI();
        } else {
            // Provide actionable feedback with the actual issue URL
            const issueUrl = `https://github.com/${REPO_OWNER}/${REPO_NAME}/issues/1`;
            errorMsg.innerHTML = `✗ No comment found from <strong>${gameState.username}</strong> on <a href="${issueUrl}" target="_blank" rel="noopener">Issue #1</a> yet.<br><br>Did you actually post a comment? Verify at: <a href="${issueUrl}" target="_blank" rel="noopener">${issueUrl}</a>`;
            errorMsg.classList.add('show');
        }
    } catch (e) {
        errorMsg.textContent = 'Error checking comments. Please try again.';
        errorMsg.classList.add('show');
        console.error('Level 1 error:', e);
    }
}


/**
 * Level 2: Check if user created an issue with "Anchor" or "Tight" in the title
 */
async function checkLevel2() {
    const errorMsg = document.getElementById('level-2-error');
    errorMsg.classList.remove('show');

    try {
        // GitHub's search API is indexed, so new issues may take 30-60 seconds to appear
        const query = `repo:${REPO_OWNER}/${REPO_NAME} is:issue author:${gameState.username} "Anchor" OR "Tight"`;
        const url = `${GITHUB_API_BASE}/search/issues?q=${encodeURIComponent(query)}`;
        const response = await fetch(url, { headers: API_HEADERS });

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }

        const result = await response.json();
        
        // Debug: Log search results to console
        console.log('Search results for issues:', result);
        console.log(`Found ${result.total_count} issue(s)`);

        if (result.items && result.items.length > 0) {
            gameState.currentLevel = 3;
            saveGameState();
            updateUI();
        } else {
            const issuesUrl = `https://github.com/${REPO_OWNER}/${REPO_NAME}/issues`;
            errorMsg.innerHTML = `✗ No issue found with "Anchor" or "Tight" from <strong>${gameState.username}</strong>.<br><br><strong>GitHub's search has a 30-60 second delay.</strong> Try again in a moment, or <a href="${issuesUrl}" target="_blank" rel="noopener">verify your issue was created</a>.`;
            errorMsg.classList.add('show');
        }
    } catch (e) {
        errorMsg.textContent = 'Error checking issues. Please try again.';
        errorMsg.classList.add('show');
        console.error('Level 2 error:', e);
    }
}

/**
 * Level 3: Check if LICENSE file exists in repo
 */
async function checkLevel3() {
    const errorMsg = document.getElementById('level-3-error');
    errorMsg.classList.remove('show');

    try {
        const url = `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/LICENSE`;
        const response = await fetch(url, { headers: API_HEADERS });

        if (response.ok) {
            gameState.currentLevel = 4;
            saveGameState();
            updateUI();
        } else if (response.status === 404) {
            errorMsg.textContent = 'LICENSE file not found. Create it in your repository and try again.';
            errorMsg.classList.add('show');
        } else {
            throw new Error(`GitHub API error: ${response.status}`);
        }
    } catch (e) {
        errorMsg.textContent = 'Error checking LICENSE file. Please try again.';
        errorMsg.classList.add('show');
        console.error('Level 3 error:', e);
    }
}

/**
 * Level 4: Check if user has an open Pull Request
 */
async function checkLevel4() {
    const errorMsg = document.getElementById('level-4-error');
    errorMsg.classList.remove('show');

    try {
        const query = `repo:${REPO_OWNER}/${REPO_NAME} is:pr author:${gameState.username} is:open`;
        const url = `${GITHUB_API_BASE}/search/issues?q=${encodeURIComponent(query)}`;
        const response = await fetch(url, { headers: API_HEADERS });

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }

        const result = await response.json();
        
        // Debug: Log PR search results to console
        console.log('Search results for PRs:', result);
        console.log(`Found ${result.total_count} PR(s)`);

        if (result.items && result.items.length > 0) {
            gameState.currentLevel = 5; // Victory!
            gameState.completedLevels.push(4);
            saveGameState();
            updateUI();
        } else {
            const prsUrl = `https://github.com/${REPO_OWNER}/${REPO_NAME}/pulls`;
            errorMsg.innerHTML = `✗ No open Pull Request found from <strong>${gameState.username}</strong>.<br><br><strong>GitHub's search has a 30-60 second delay.</strong> Make sure your PR is open (not merged), then try again. <a href="${prsUrl}" target="_blank" rel="noopener">View all PRs</a>.`;
            errorMsg.classList.add('show');
        }
    } catch (e) {
        errorMsg.textContent = 'Error checking Pull Requests. Please try again.';
        errorMsg.classList.add('show');
        console.error('Level 4 error:', e);
    }
}

/**
 * Save game state to localStorage
 */
function saveGameState() {
    localStorage.setItem('gitGoatGameState', JSON.stringify(gameState));
}

/**
 * Restore game state from localStorage
 */
function restoreGameState() {
    const saved = localStorage.getItem('gitGoatGameState');
    if (saved) {
        try {
            gameState = JSON.parse(saved);
        } catch (e) {
            console.error('Error restoring game state:', e);
        }
    }
}

/**
 * Optional: Clear game state (for testing/resetting)
 */
function resetGame() {
    localStorage.removeItem('gitGoatGameState');
    gameState = {
        username: null,
        currentLevel: 0,
        completedLevels: [],
    };
    document.getElementById('github-username').value = '';
    updateUI();
}

// Make reset available globally for debugging
window.resetGame = resetGame;

// Navigation functions
function goToPreviousLevel() {
    if (gameState.currentLevel > 0) {
        gameState.currentLevel--;
        saveGameState();
        updateUI();
        console.log('Navigated to level', gameState.currentLevel);
    }
}

function goToNextLevel() {
    if (gameState.currentLevel < 5) {
        gameState.currentLevel++;
        saveGameState();
        updateUI();
        console.log('Navigated to level', gameState.currentLevel);
    }
}

// Update navigation buttons visibility
function updateNavigationUI() {
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const levelCounter = document.getElementById('level-counter');

    // Update level indicator
    levelCounter.textContent = gameState.currentLevel;

    // Show/hide prev button
    prevButton.hidden = gameState.currentLevel === 0;

    // Show/hide next button  
    nextButton.hidden = gameState.currentLevel === 5;

    // Disable next button if level not completed (unless already completed)
    if (gameState.currentLevel < 5 && gameState.currentLevel > 0) {
        const isLevelCompleted = gameState.completedLevels.includes(gameState.currentLevel);
        nextButton.disabled = !isLevelCompleted;
    } else {
        nextButton.disabled = false;
    }
}