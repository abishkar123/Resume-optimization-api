# Git Hooks Setup Guide with Husky

This guide provides a complete setup for implementing Git hooks using Husky across all your projects. Git hooks automate code quality checks before commits and pushes.

## What Are Git Hooks?

Git hooks are scripts that run automatically at specific points in the Git workflow:
- **Pre-commit**: Runs before `git commit` (lint, format, test)
- **Pre-push**: Runs before `git push` (run tests, type checking)
- **Commit-msg**: Validates commit message format
- **Post-merge**: Runs after `git merge` (e.g., reinstall dependencies)

## Why Use Husky?

Husky makes Git hooks easy to manage:
- ✅ Install Git hooks without shell script expertise
- ✅ Share hook configuration across the team via version control
- ✅ Automatic hook installation when cloning repository
- ✅ Easy to enable/disable hooks with `husky` CLI

## Installation & Setup

### Step 1: Install Husky

```bash
npm install husky --save-dev
```

### Step 2: Initialize Husky

```bash
npx husky init
```

This creates:
- `.husky/` directory
- `.husky/pre-commit` hook template
- Updates `package.json` with prepare script

### Step 3: Create Pre-Commit Hook

Create `.husky/pre-commit`:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🔍 Running pre-commit checks..."

# Lint
echo "📝 Linting code..."
npm run lint:fix || exit 1

# Type checking
echo "🔐 Type checking..."
npm run build || exit 1

# Unit tests (optional - can be slow)
# echo "✅ Running unit tests..."
# npm run test:unit || exit 1

echo "✨ Pre-commit checks passed!"
```

**Make executable:**
```bash
chmod +x .husky/pre-commit
```

### Step 4: Create Pre-Push Hook

Create `.husky/pre-push`:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🔍 Running pre-push checks..."

# Run full test suite
echo "✅ Running tests..."
npm test || exit 1

# Ensure build succeeds
echo "🔨 Building project..."
npm run build || exit 1

echo "✨ Pre-push checks passed! Ready to push."
```

**Make executable:**
```bash
chmod +x .husky/pre-push
```

### Step 5: Create Commit Message Hook (Optional)

Create `.husky/commit-msg`:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Check commit message format
# Convention: feat: description, fix: description, docs: description, etc.
if ! head -1 "$1" | grep -qE "^(feat|fix|docs|style|refactor|test|chore|perf)((\(.+\))?)!?: .{1,}"; then
  echo "❌ Commit message does not follow convention!"
  echo "Expected format: <type>(<scope>): <description>"
  echo "Types: feat, fix, docs, style, refactor, test, chore, perf"
  echo "Example: feat(auth): add firebase integration"
  exit 1
fi
```

**Make executable:**
```bash
chmod +x .husky/commit-msg
```

## Configuration for Common NPM Commands

Ensure your `package.json` has these scripts available:

```json
{
  "scripts": {
    "lint": "eslint src tests",
    "lint:fix": "eslint src tests --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:unit": "jest --testPathPattern=unit",
    "build": "tsc",
    "dev": "nodemon --watch src..."
  }
}
```

## Selective Hook Enforcement

### Disable a Single Hook Temporarily

```bash
# Skip pre-commit
git commit --no-verify

# Skip pre-push
git push --no-verify
```

### Disable Husky Completely

```bash
# Temporarily disable all hooks
HUSKY=0 git commit -m "message"

# Permanently disable in a local clone
husky uninstall
```

## Team Best Practices

1. **Commit `.husky/` to version control** - Ensures all team members have same hooks
2. **Make hooks fast** - Slow hooks frustrate developers; consider:
   - Running only changed files (using `lint-staged`)
   - Deferring full tests to CI/CD
3. **Document in README** - Let team know what hooks run and why
4. **Use lint-staged** - Only lint/format changed files (see next section)

## Advanced: Using lint-staged

`lint-staged` runs linters on staged files only (faster):

### Install

```bash
npm install lint-staged --save-dev
```

### Configure in `package.json`

```json
{
  "lint-staged": {
    "src/**/*.ts": ["eslint --fix"],
    "tests/**/*.ts": ["eslint --fix"]
  }
}
```

### Update Pre-Commit Hook

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🔍 Running pre-commit checks on staged files..."
npx lint-staged || exit 1

echo "✨ Pre-commit checks passed!"
```

## Troubleshooting

### Hooks Not Running

**Problem**: Hooks exist but don't execute on commit

**Solution**:
```bash
# Ensure hooks are executable
chmod +x .husky/pre-commit
chmod +x .husky/pre-push
chmod +x .husky/commit-msg

# Reinstall husky
npx husky install
```

### Permission Denied Error

```bash
# On Windows (if using Git Bash)
git config core.hooksPath .husky

# On Mac/Linux
chmod +x .husky/*
```

### Hooks Run but Build Fails

Check that all npm scripts exist:
```bash
npm run lint      # Should work
npm run build     # Should work
npm test          # Should work
```

Add missing scripts to `package.json` before committing.

### Hook Runs When It Shouldn't

Verify hook file logic and test manually:
```bash
# Test pre-commit hook manually
./.husky/pre-commit
```

## Project-Specific Examples

### For Node.js/Express Backend

**Pre-commit**: Lint + TypeScript build
```bash
npm run lint:fix && npm run build
```

**Pre-push**: Full test suite + type check
```bash
npm run build && npm test
```

### For React Frontend

**Pre-commit**: Lint + format + type check
```bash
npm run lint:fix && npm run type-check
```

**Pre-push**: Lint + build + tests
```bash
npm run lint && npm run build && npm test
```

### For Monorepo

**Pre-commit**: Run tools on affected packages only
```bash
npm run lint:fix -- --since=main
npm run build -- --since=main
```

## Integration with CI/CD

Git hooks are **local** safety nets. Always have CI/CD run the same checks:
- Hooks catch issues early (developer experience)
- CI/CD enforces rules for all PRs (team enforcement)

Never rely on hooks alone for compliance.

## Reference: Hook File Locations

```
.husky/
├── pre-commit       # Runs before commit
├── pre-push         # Runs before push
├── commit-msg       # Validates commit message
├── post-merge       # Runs after merge
├── prepare-commit-msg  # Auto-formats commit message
└── _/husky.sh       # Husky helper (auto-generated)
```

## Useful Commands

```bash
# List all installed hooks
ls -la .husky/

# Test a hook manually
./.husky/pre-commit

# View hook file
cat .husky/pre-commit

# Edit hook
nano .husky/pre-commit

# Reinstall all hooks
npx husky install
```

## Summary Checklist

- [ ] Install Husky: `npm install husky --save-dev`
- [ ] Initialize Husky: `npx husky init`
- [ ] Create `.husky/pre-commit` script
- [ ] Create `.husky/pre-push` script (optional)
- [ ] Make scripts executable: `chmod +x .husky/*`
- [ ] Commit `.husky/` directory to git
- [ ] Update `package.json` with prepare script
- [ ] Test hooks locally before pushing
- [ ] Document hooks in project README
- [ ] Share setup guide with team
