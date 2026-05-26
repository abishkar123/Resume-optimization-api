# Git Hooks Complete Reference Guide

Master guide for implementing and managing Git hooks across all projects using Husky.

## Quick Start (Copy-Paste)

### For Node.js Projects

```bash
# 1. Install Husky
npm install husky --save-dev

# 2. Initialize
npx husky init

# 3. Create pre-commit hook
cat > .husky/pre-commit << 'EOF'
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
npm run lint:fix && npm run build
EOF

# 4. Make executable
chmod +x .husky/pre-commit

# 5. Commit
git add .husky/ && git commit -m "chore: add git hooks"
```

---

## Complete Setup by Project Type

### Node.js Backend (Express, Fastify, etc.)

**Installation:**
```bash
npm install husky --save-dev
npx husky init
```

**`.husky/pre-commit`:**
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
npm run lint:fix || exit 1
npm run build || exit 1
```

**`.husky/pre-push`:**
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
npm test || exit 1
npm run build || exit 1
```

**Package Scripts Needed:**
```json
{
  "scripts": {
    "lint": "eslint src",
    "lint:fix": "eslint src --fix",
    "build": "tsc",
    "test": "jest"
  }
}
```

---

### React/Frontend Project

**Installation:**
```bash
npm install husky --save-dev
npx husky init
```

**`.husky/pre-commit`:**
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
npm run lint:fix || exit 1
npm run type-check || exit 1
```

**`.husky/pre-push`:**
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
npm run build || exit 1
npm test || exit 1
```

**Package Scripts Needed:**
```json
{
  "scripts": {
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix",
    "type-check": "tsc --noEmit",
    "build": "vite build",
    "test": "vitest"
  }
}
```

---

### Python Project

**Installation (using pre-commit framework):**
```bash
pip install pre-commit
```

**`.pre-commit-config.yaml`:**
```yaml
repos:
  - repo: https://github.com/psf/black
    rev: 23.3.0
    hooks:
      - id: black
  
  - repo: https://github.com/PyCQA/flake8
    rev: 6.0.0
    hooks:
      - id: flake8
  
  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.0.0
    hooks:
      - id: mypy
        args: [--strict]
```

**Initialize:**
```bash
pre-commit install
```

---

### Full Stack (Monorepo with Frontend & Backend)

**`.husky/pre-commit`:**
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

CHANGED=$(git diff --cached --name-only)

# Check backend
if echo "$CHANGED" | grep -q "^api/"; then
  cd api
  npm run lint:fix || exit 1
  npm run build || exit 1
  cd ..
fi

# Check frontend
if echo "$CHANGED" | grep -q "^client/"; then
  cd client
  npm run lint:fix || exit 1
  npm run type-check || exit 1
  cd ..
fi
```

**`.husky/pre-push`:**
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Backend tests
cd api && npm test || exit 1 && cd ..

# Frontend tests & build
cd client && npm run build && npm test || exit 1 && cd ..
```

---

## Hook Types Explained

### Pre-Commit Hook

**When**: Before `git commit` creates the commit object

**Use for**:
- Code linting
- Code formatting
- Type checking (TypeScript)
- Quick unit tests (optional)
- File validation

**Example:**
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
npm run lint:fix || exit 1
npm run build || exit 1
```

**Skip with**: `git commit --no-verify`

---

### Pre-Push Hook

**When**: Before `git push` sends commits to remote

**Use for**:
- Full test suite
- Build verification
- Coverage checks
- Linting on final code

**Example:**
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
npm test || exit 1
npm run build || exit 1
```

**Skip with**: `git push --no-verify` or `git push --force-with-lease`

---

### Commit-Msg Hook

**When**: After commit message is entered but before commit is final

**Use for**:
- Enforce commit message format
- Validate semantic versioning
- Check for required fields

**Example (Conventional Commits):**
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

COMMIT_MSG=$(cat "$1")

if ! echo "$COMMIT_MSG" | grep -qE "^(feat|fix|docs|style|refactor|test|chore)((\(.+\))?)!?: .{1,}"; then
  echo "Invalid format. Use: <type>(<scope>): <message>"
  exit 1
fi
```

---

### Post-Merge Hook

**When**: After `git merge` completes

**Use for**:
- Reinstall dependencies (if package.json changed)
- Run database migrations
- Clear caches

**Example:**
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

if git diff --name-only HEAD@{1}..HEAD | grep -q "^package.json$"; then
  npm install
fi
```

---

### Post-Checkout Hook

**When**: After branch is checked out

**Use for**:
- Ensure dependencies are up to date
- Update Git submodules

**Example:**
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm install
```

---

## Performance Optimization with lint-staged

Large codebases slow down hooks. Use `lint-staged` to check only changed files:

### Installation

```bash
npm install lint-staged --save-dev
```

### Configuration in `package.json`

```json
{
  "lint-staged": {
    "src/**/*.ts": ["eslint --fix"],
    "src/**/*.tsx": ["eslint --fix", "prettier --write"],
    "tests/**/*.ts": ["eslint --fix"]
  }
}
```

### `.husky/pre-commit` with lint-staged

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
npx lint-staged || exit 1
```

**Benefits:**
- ✅ Lints only changed files (fast)
- ✅ Prevents linting unrelated code
- ✅ Better developer experience

---

## Advanced: Conditional Hooks

### Only Run on Certain Branches

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [[ "$BRANCH" == "main" || "$BRANCH" == "develop" ]]; then
  npm test || exit 1
fi
```

### Skip Hooks for Specific Commits

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

COMMIT_MSG=$(cat "$1")

# Skip on WIP commits
if echo "$COMMIT_MSG" | grep -q "^WIP"; then
  exit 0
fi

# Run normal validation
npm run lint:fix || exit 1
```

### Environment-Based Hooks

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

if [ "$CI" == "true" ]; then
  # In CI: run everything
  npm run lint && npm test && npm run build
else
  # Local: quick checks only
  npm run lint:fix
fi
```

---

## Troubleshooting

### Problem: Hooks Not Executing

**Solution 1: Make executable**
```bash
chmod +x .husky/pre-commit
chmod +x .husky/pre-push
```

**Solution 2: Reinstall Husky**
```bash
npx husky install
```

**Solution 3: Check permissions**
```bash
ls -la .husky/
```

---

### Problem: Permission Denied on Windows

**Solution: Configure Git**
```bash
git config core.hooksPath .husky
```

Or for all users globally:
```bash
git config --global core.hooksPath .husky
```

---

### Problem: Hook Runs but Fails

**Debug:**
```bash
# Run hook manually
./.husky/pre-commit

# Or with verbose output
bash -x .husky/pre-commit
```

**Check dependencies:**
```bash
npm run lint     # Should exist
npm run build    # Should exist
npm test         # Should exist
```

---

### Problem: Hook is Too Slow

**Solution: Use lint-staged**
```bash
npm install lint-staged --save-dev
```

Update `.husky/pre-commit`:
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
npx lint-staged
```

---

### Problem: Need to Skip Hook Temporarily

```bash
# Skip pre-commit
git commit --no-verify

# Skip pre-push
git push --no-verify

# Disable all hooks
HUSKY=0 git commit -m "message"
```

---

## Integration with CI/CD

**Important**: Git hooks are local. Always mirror checks in CI.

### GitHub Actions Example

```yaml
name: CI

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint
      
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test
      
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
```

---

## Team Workflow

### Initial Setup (DevOps/Lead)

```bash
# Create hooks
npm install husky --save-dev
npx husky init

# Create .husky/pre-commit, pre-push, etc.
# (see templates above)

# Commit
git add .husky/
git commit -m "chore: add git hooks"
git push
```

### Team Member Setup

```bash
# Clone repo (hooks come with it)
git clone <repo>

# Install dependencies (includes husky)
npm install

# Ready to go! Hooks work automatically
```

### Update Hooks

```bash
# Edit .husky/pre-commit
nano .husky/pre-commit

# Commit change
git add .husky/
git commit -m "chore: update pre-commit hook"
git push

# Team members pull → hooks auto-update
```

---

## Best Practices

✅ **DO:**
- Store `.husky/` in version control
- Mirror hook checks in CI/CD
- Use `lint-staged` for large codebases
- Document hook behavior in README
- Test hooks locally before committing
- Make hooks executable (`chmod +x`)

❌ **DON'T:**
- Rely on hooks as sole enforcement (use CI/CD too)
- Make hooks too slow (use lint-staged)
- Skip hooks regularly (defeats purpose)
- Assume all devs use same OS (test on all platforms)
- Store secrets or credentials in hooks

---

## File Checklist

For a complete setup, you should have:

```
.husky/
├── pre-commit           ✓ Lint + build
├── pre-push             ✓ Tests + build
├── commit-msg           ✓ Message format
├── post-merge           ✓ Reinstall deps
└── _/husky.sh          (auto-generated)
```

---

## Documentation Template for README

Add to your project README:

```markdown
## Development

### Git Hooks

This project uses Husky for Git hooks. They run automatically on:

- **Pre-commit**: Linting and type checking
- **Pre-push**: Full test suite and build
- **Commit-msg**: Message format validation

To skip hooks temporarily:
```bash
git commit --no-verify
git push --no-verify
```

To manually test hooks:
```bash
./.husky/pre-commit
./.husky/pre-push
```
```

---

## Summary Table

| Command | Effect |
|---------|--------|
| `npm install husky --save-dev` | Install Husky |
| `npx husky init` | Create `.husky/` directory |
| `chmod +x .husky/*` | Make hooks executable |
| `git commit --no-verify` | Skip pre-commit |
| `git push --no-verify` | Skip pre-push |
| `HUSKY=0 git commit` | Disable all hooks |
| `npx husky uninstall` | Remove Husky |

---

## References

- [Husky Docs](https://typicode.github.io/husky/)
- [lint-staged Docs](https://github.com/okonet/lint-staged)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Hooks Official Docs](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)

---

This guide covers everything needed to implement Git hooks across all projects!
