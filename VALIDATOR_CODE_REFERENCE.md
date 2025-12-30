# Validator Code Reference

## Level 3: Edit Issue Title

**What it does:** Checks if the issue has been modified by comparing `updated_at > created_at`.

**Key logic:**
```javascript
// Find the user's issue
const query = `repo:${REPO_OWNER}/${REPO_NAME} is:issue state:closed author:${gameState.username} "Anchor" OR "Tight"`;

// Get the first matching issue
const result = await fetch(API_URL);
const issue = result.items[0];

// Check if edited
const edited = await issueHasBeenEdited(issueNumber);

// Helper function (in helpers section)
async function issueHasBeenEdited(issueNumber) {
    const url = `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/issues/${issueNumber}`;
    const response = await fetch(url, { headers: API_HEADERS });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const issue = await response.json();
    return new Date(issue.updated_at).getTime() > new Date(issue.created_at).getTime();
}
```

**API calls:**
1. `GET /search/issues?q=repo:...` (search for closed issue)
2. `GET /repos/{owner}/{repo}/issues/{id}` (check updated_at)

**Pending support:** ✅ Yes
- If not found, marked as pending
- Rechecked every 45 seconds
- Auto-advances if found on recheck
- Auto-rollback if never found

---

## Level 4: Edit Issue Body

**What it does:** Similar to Level 3, checks if issue body was edited.

**Key logic:**
```javascript
// Same search logic as Level 3
const query = `repo:${REPO_OWNER}/${REPO_NAME} is:issue state:closed author:${gameState.username} "Anchor" OR "Tight"`;

// Check if body was updated
const edited = await issueHasBeenEdited(issueNumber);
// The helper checks updated_at, which covers title OR body changes
```

**API calls:** Same as Level 3

**Pending support:** ✅ Yes

---

## Level 5: Edit Comment

**What it does:** Checks if the user has edited one of their own comments.

**Key logic:**
```javascript
// Find the issue (same search)
const issue = result.items[0];

// Fetch all comments on the issue
const commentsUrl = `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/issues/${issueNumber}/comments`;
const comments = await fetch(commentsUrl);

// Find if any user comment was edited (updated_at > created_at with 1s buffer)
const editedComment = comments.find(c => 
    c.user.login === gameState.username && 
    new Date(c.updated_at).getTime() > new Date(c.created_at).getTime() + 1000
);

// 1000ms buffer prevents false positives from GitHub's timestamps
if (editedComment) {
    // Success!
    markLevelCompleted(5);
}
```

**API calls:**
1. `GET /search/issues?q=repo:...` (find issue)
2. `GET /repos/{owner}/{repo}/issues/{id}/comments` (fetch comments)

**Pending support:** ✅ Yes
- Works with pending recheck
- Timestamp comparison prevents accidental advances

---

## Level 6: Reopen & Clarify Cycle

**What it does:** Checks if the user has posted multiple comments (opening + reopening + closing comments).

**Key logic:**
```javascript
// Find the issue
const issue = result.items[0];

// Fetch all comments
const comments = await fetch(commentsUrl);

// Count user's comments - must have ≥2
const userCommentCount = comments.filter(c => c.user.login === gameState.username).length;

if (userCommentCount >= 2) {
    // They've posted at least an opening comment and a follow-up
    // (indicating a reopen/clarify cycle)
    markLevelCompleted(6);
}
```

**API calls:**
1. `GET /search/issues?q=repo:...` (find issue)
2. `GET /repos/{owner}/{repo}/issues/{id}/comments` (count comments)

**Pending support:** ✅ Yes

**Note:** This is a "best effort" validation. It counts comments but doesn't verify the full reopen/close sequence. Future enhancement could check event timeline.

---

## Level 7: Add Label

**What it does:** Checks if the issue has at least one label.

**Key logic:**
```javascript
// Find the issue via search
const query = `repo:${REPO_OWNER}/${REPO_NAME} is:issue state:closed author:${gameState.username} "Anchor" OR "Tight"`;
const result = await fetch(API_URL);
const issue = result.items[0];

// The search result includes labels
if (issue.labels && issue.labels.length > 0) {
    // Has at least one label
    markLevelCompleted(7);
}
```

**API calls:**
1. `GET /search/issues?q=repo:...` (search includes labels in response)

**Pending support:** ✅ Yes

**Efficiency:** Only 1 API call needed because search results include label data.

---

## Level 8: Self-Assign

**What it does:** Checks if the issue is assigned to the user.

**Key logic:**
```javascript
// Find the issue
const issue = result.items[0];

// Check if assigned to user using helper
const assigned = await issueIsAssignedToUser(issue.number, gameState.username);

// Helper function (in helpers section)
async function issueIsAssignedToUser(issueNumber, username) {
    const url = `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/issues/${issueNumber}`;
    const response = await fetch(url, { headers: API_HEADERS });
    if (!response.ok) return false;
    
    const issue = await response.json();
    return issue.assignees?.some(a => a.login === username) || false;
}
```

**API calls:**
1. `GET /search/issues?q=repo:...` (find issue)
2. `GET /repos/{owner}/{repo}/issues/{id}` (check assignees)

**Pending support:** ✅ Yes

---

## Level 9: LICENSE File Check

**What it does:** Checks if a LICENSE file exists in the repo.

**Key logic:**
```javascript
// Direct check for LICENSE file in repo root
const url = `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/LICENSE`;
const response = await fetch(url, { headers: API_HEADERS });

if (response.ok) {
    // File exists
    markLevelCompleted(9);
    gameState.currentLevel = 10;
} else if (response.status === 404) {
    // File not found
    errorMsg.textContent = 'LICENSE file not found...';
}
```

**API calls:**
1. `GET /repos/{owner}/{repo}/contents/LICENSE`

**Pending support:** ❌ No
- Immediate validation (no background recheck)
- Simple 200 vs 404 check

---

## Level 10: Open Pull Request

**What it does:** Checks if the user has opened a PR to the repo.

**Key logic:**
```javascript
// Search for PRs by the user against the repo
const query = `repo:${REPO_OWNER}/${REPO_NAME} is:pr author:${gameState.username} is:open`;
const url = `${GITHUB_API_BASE}/search/issues?q=${encodeURIComponent(query)}`;
const response = await fetch(url);

const result = await response.json();
const foundPR = result.items && result.items.length > 0;

if (foundPR) {
    markLevelCompleted(10);
    gameState.currentLevel = 5; // Victory!
}
```

**API calls:**
1. `GET /search/issues?q=repo:... is:pr author:... is:open`

**Pending support:** ✅ Yes
- GitHub search can lag 30-60 seconds
- Pending message explains the delay
- Background poller retries after 45s interval

---

## Helper Functions Used

### issueHasBeenEdited(issueNumber)
```javascript
async function issueHasBeenEdited(issueNumber) {
    const url = `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/issues/${issueNumber}`;
    const response = await fetch(url, { headers: API_HEADERS });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const issue = await response.json();
    return new Date(issue.updated_at).getTime() > new Date(issue.created_at).getTime();
}
```
**Used by:** Levels 3, 4

### issueIsAssignedToUser(issueNumber, username)
```javascript
async function issueIsAssignedToUser(issueNumber, username) {
    const url = `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/issues/${issueNumber}`;
    const response = await fetch(url, { headers: API_HEADERS });
    if (!response.ok) return false;
    
    const issue = await response.json();
    return issue.assignees?.some(a => a.login === username) || false;
}
```
**Used by:** Level 8

### markLevelCompleted(level)
```javascript
function markLevelCompleted(level) {
    if (!gameState.completedLevels) gameState.completedLevels = [];
    if (!gameState.completedLevels.includes(level)) {
        gameState.completedLevels.push(level);
    }
    if (gameState.pendingChecks && gameState.pendingChecks[level]) {
        delete gameState.pendingChecks[level];
    }
}
```
**Used by:** All levels

### markLevelPending(level)
```javascript
function markLevelPending(level) {
    if (!gameState.pendingChecks) gameState.pendingChecks = {};
    gameState.pendingChecks[level] = {
        startedAt: Date.now(),
        lastChecked: Date.now()
    };
}
```
**Used by:** Levels 1-8, 10 (not 9)

---

## Pending Recheck Flow Diagram

```
User clicks button
    ↓
┌─ Validator runs
│   ├─ Condition met? → Mark completed, advance ✅
│   └─ Condition not met?
│       ├─ First check? → Mark pending, allow advance, show message
│       └─ Recheck (45s later)? → Mark pending, check again
│           ├─ Found? → Auto-advance ✅
│           └─ Not found? → Auto-rollback 🔄
│
└─ Background poller (every 45s)
    └─ For each pending level
        └─ Call checkLevel{N}({ recheck: true })
```

---

## State Object Structure

```javascript
gameState = {
    username: "torvalds",                          // GitHub username
    currentLevel: 3,                               // Current level (0-5)
    completedLevels: [0, 1, 2],                   // Levels that passed validation
    pendingChecks: {
        3: { startedAt: 1234567890, lastChecked: 1234567900 },
        4: { startedAt: 1234567890, lastChecked: 1234567900 }
    },
    skippedStages: [11, 12],                      // Optional stages skipped
    userProfile: {
        name: "Linus Torvalds",
        bio: "Linux creator",
        location: "Portland, OR",
        followers: 50000,
        publicRepos: 150,
        avatarUrl: "https://avatars.githubusercontent.com/u/1234"
    },
    online: true                                   // Connection status
}
```

---

## Error Messages Strategy

Each validator provides **user-friendly, actionable** error messages:

### Pending Message (Non-Terminal)
```
"Saved as pending. Edit the issue title and try again.
We'll automatically recheck in 45 seconds.
Verify at: [link to GitHub]"
```

### Network Error
```
"Error checking issue. Please try again."
```

### Not Found (After Pending Timeout)
```
"LICENSE file not found. Create it in your repository and try again."
```

**Key principle:** Errors should tell the user *what* to do, not just *what went wrong*.

---

## API Rate Limiting Handling

```javascript
// Check rate limit headers after each request
const remaining = response.headers.get('X-RateLimit-Remaining');
const reset = response.headers.get('X-RateLimit-Reset');

if (remaining === '0') {
    showError(`Rate limit reached. Reset at ${new Date(reset * 1000)}.`);
}
```

For unauthenticated users: 60 requests/hour  
For users with token: 5,000 requests/hour

Typical game uses ~16 requests for full playthrough = sustainable.

---

## Testing Validators

### Manual Test Script
```javascript
// In browser console:

// Test Level 3
checkLevel3().then(result => console.log('Level 3:', result));

// Test with recheck
checkLevel3({ recheck: true }).then(result => console.log('Level 3 recheck:', result));

// Check state
console.log('Game state:', JSON.stringify(gameState, null, 2));

// Check pending
console.log('Pending checks:', gameState.pendingChecks);
```

### Automated Test (Future)
```javascript
// Pseudocode for test suite
async function testLevel3() {
    // Setup: Create test issue
    // Run: checkLevel3()
    // Assert: level completed or pending
    // Cleanup: Delete test issue
}
```

---

## Performance Considerations

- **Search requests:** 30-60s delay (GitHub indexing)
- **Direct API calls:** <100ms typically
- **Total validation time:** 1-5 seconds for immediate checks, 30-60s for search-based
- **Poller interval:** 45 seconds (prevents hammering API)
- **Minimum gap between rechecks:** 5 seconds (avoids duplicate requests)

---

## Future Enhancements

1. **Timeline validation:** For Level 6, check issue timeline to verify full reopen/close cycle
2. **Specific label validation:** Require specific label (e.g., "enhancement" not just any label)
3. **Comment content validation:** Require comment contains certain keywords
4. **Batch validation:** Check multiple conditions in single API call to save quota
5. **Timeout for pending:** Auto-fail pending checks after 24 hours
6. **Analytics:** Track which levels are most commonly pending (indicates pain points)
