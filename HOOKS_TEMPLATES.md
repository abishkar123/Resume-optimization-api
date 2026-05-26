# Git Hooks Templates for All Projects

Ready-to-use hook templates for different project types. Copy and customize based on your project needs.

## Generic Node.js Project Hook

### `.husky/pre-commit`

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🔍 Running pre-commit checks..."

# Lint all TypeScript/JavaScript files
echo "📝 Linting code..."
npm run lint:fix || {
  echo "❌ Linting failed"
  exit 1
}

echo "✨ Pre-commit checks passed!"
```

### `.husky/pre-push`

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🚀 Running pre-push checks..."

# Type checking
echo "🔐 Type checking..."
npm run build || {
  echo "❌ Build failed"
  exit 1
}

# Run tests
echo "✅ Running tests..."
npm test -- --coverage || {
  echo "❌ Tests failed"
  exit 1
}

echo "✨ All checks passed! Ready to push."
```

---

## Express/Node.js Backend Hook

### `.husky/pre-commit`

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🔍 Backend pre-commit checks..."

# Lint
npm run lint:fix || exit 1

# Type check
npm run build || exit 1

# Unit tests (quick)
npm run test:unit || exit 1

echo "✨ Backend checks passed!"
```

### `.husky/pre-push`

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🚀 Backend pre-push checks..."

# Full test suite
npm test || exit 1

# Ensure production build works
npm run build || exit 1

echo "✨ Backend ready to push!"
```

---

## React Frontend Hook

### `.husky/pre-commit`

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🔍 Frontend pre-commit checks..."

# Lint and format
npm run lint:fix || exit 1

# Type check
npm run type-check || exit 1

# Check build
npm run build:check || exit 1

echo "✨ Frontend checks passed!"
```

### `.husky/pre-push`

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🚀 Frontend pre-push checks..."

# Lint
npm run lint || exit 1

# Type check
npm run type-check || exit 1

# Build
npm run build || exit 1

# Tests
npm test -- --coverage || exit 1

echo "✨ Frontend ready to push!"
```

---

## Full Stack (Frontend + Backend) Hook

### `.husky/pre-commit`

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🔍 Full-stack pre-commit checks..."

# Changed files
CHANGED=$(git diff --cached --name-only)

# Backend changes
if echo "$CHANGED" | grep -q "^api/"; then
  echo "📝 Linting backend..."
  cd api && npm run lint:fix && npm run build && cd .. || exit 1
fi

# Frontend changes
if echo "$CHANGED" | grep -q "^client/"; then
  echo "📝 Linting frontend..."
  cd client && npm run lint:fix && npm run type-check && cd .. || exit 1
fi

echo "✨ Full-stack checks passed!"
```

---

## Python Project Hook

### `.husky/pre-commit`

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🔍 Python pre-commit checks..."

# Format with Black
black . || exit 1

# Lint with Flake8
flake8 src/ || exit 1

# Type checking with mypy
mypy src/ || exit 1

echo "✨ Python checks passed!"
```

### `.husky/pre-push`

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🚀 Python pre-push checks..."

# Tests
pytest || exit 1

# Ensure imports are sorted
isort --check-only . || exit 1

echo "✨ Python ready to push!"
```

---

## Commit Message Validation Hook

### `.husky/commit-msg`

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

COMMIT_MSG=$(cat "$1")

# Validate conventional commit format
# Format: type(scope): description
# Types: feat, fix, docs, style, refactor, test, chore, perf, ci

if ! echo "$COMMIT_MSG" | grep -qE "^(feat|fix|docs|style|refactor|test|chore|perf|ci)((\(.+\))?)!?: .{1,}"; then
  echo "❌ Invalid commit message format!"
  echo ""
  echo "Expected format:"
  echo "  <type>(<scope>): <description>"
  echo ""
  echo "Types:"
  echo "  - feat:     A new feature"
  echo "  - fix:      A bug fix"
  echo "  - docs:     Documentation changes"
  echo "  - style:    Code style changes (formatting)"
  echo "  - refactor: Code refactoring"
  echo "  - test:     Adding or updating tests"
  echo "  - chore:    Build/dependency updates"
  echo "  - perf:     Performance improvements"
  echo "  - ci:       CI/CD changes"
  echo ""
  echo "Examples:"
  echo "  feat(auth): add google oauth"
  echo "  fix(upload): resolve s3 timeout issue"
  echo "  docs: update api documentation"
  echo "  chore: bump dependency versions"
  exit 1
fi
```

---

## Post-Merge Hook (Reinstall Dependencies)

### `.husky/post-merge`

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🔄 Post-merge: Checking dependencies..."

# Check if package.json was modified
if git diff --name-only HEAD@{1}..HEAD | grep -q "^package.json$"; then
  echo "📦 Installing dependencies..."
  npm install || exit 1
fi

echo "✅ Post-merge complete!"
```

---

## Using lint-staged for Better Performance

### Add to `package.json`

```json
{
  "lint-staged": {
    "src/**/*.{ts,tsx}": ["eslint --fix"],
    "src/**/*.{css,scss}": ["stylelint --fix"],
    "**/*.{json,md}": ["prettier --write"]
  }
}
```

### `.husky/pre-commit` with lint-staged

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🔍 Running lint-staged on changed files..."
npx lint-staged || exit 1

echo "✨ Pre-commit checks passed!"
```

---

## Quick Installation Guide

### For Any Project

1. **Install Husky**
   ```bash
   npm install husky --save-dev
   ```

2. **Initialize**
   ```bash
   npx husky init
   ```

3. **Create Hook Files**
   Copy template from above into `.husky/pre-commit`, `.husky/pre-push`, etc.

4. **Make Executable**
   ```bash
   chmod +x .husky/pre-commit
   chmod +x .husky/pre-push
   ```

5. **Commit**
   ```bash
   git add .husky/
   git commit -m "chore: add git hooks with husky"
   ```

---

## Customization Tips

### Slow Hooks?

Use `lint-staged` to only run checks on changed files:
```bash
npx lint-staged
```

### Skip Specific Checks

Disable pre-commit temporarily:
```bash
git commit --no-verify
```

### Debug a Failing Hook

```bash
# Run hook manually to see full error
./.husky/pre-commit

# Or with more details
bash -x .husky/pre-commit
```

### Platform-Specific (Windows vs Mac/Linux)

For Windows Git Bash:
```bash
git config core.hooksPath .husky
```

For all users globally:
```bash
git config --global core.hooksPath .husky
```

---

## Integration with CI/CD

Always mirror hook checks in CI pipeline:

### GitHub Actions Example

```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - run: npm test
```

This ensures code quality even if hooks are skipped locally.

---

## Troubleshooting Matrix

| Problem | Solution |
|---------|----------|
| Hooks not running | `chmod +x .husky/*` && `npx husky install` |
| Permission denied | `git config core.hooksPath .husky` |
| Wrong Node/npm version | Use `nvm use` in hook or `nodeenv` |
| Slow builds | Use `lint-staged` to check only changed files |
| Need to skip | `git commit --no-verify` or `HUSKY=0 git commit` |
| Different per dev | Use `.husky` in git + document in README |

---

## Reference: Which Hook to Use?

- **Pre-commit**: Lint, format, type-check (fail fast)
- **Pre-push**: Full tests, build verification (confidence boost)
- **Commit-msg**: Enforce commit message format (team consistency)
- **Post-merge**: Reinstall dependencies after pull (automation)

All hooks are **local** — always enforce in CI/CD too!
