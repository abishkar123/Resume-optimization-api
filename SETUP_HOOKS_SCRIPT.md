# Automated Git Hooks Setup Script

This guide provides reusable scripts to automate Husky setup across all projects.

## One-Command Setup Script

Save this as `scripts/setup-hooks.sh` in your project:

```bash
#!/bin/bash

set -e

echo "🔧 Setting up Git hooks with Husky..."

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install Node.js and npm first."
    exit 1
fi

# Install husky
echo "📦 Installing Husky..."
npm install husky --save-dev

# Initialize husky (creates .husky directory)
echo "🚀 Initializing Husky..."
npx husky init || true

# Create pre-commit hook
echo "📝 Creating pre-commit hook..."
cat > .husky/pre-commit << 'EOF'
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🔍 Running pre-commit checks..."

# Lint
echo "📝 Linting code..."
npm run lint:fix || exit 1

# Type check
echo "🔐 Type checking..."
npm run build || exit 1

echo "✨ Pre-commit checks passed!"
EOF

chmod +x .husky/pre-commit

# Create pre-push hook
echo "📝 Creating pre-push hook..."
cat > .husky/pre-push << 'EOF'
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🚀 Running pre-push checks..."

# Tests
echo "✅ Running tests..."
npm test || exit 1

# Build
echo "🔨 Building..."
npm run build || exit 1

echo "✨ Pre-push checks passed!"
EOF

chmod +x .husky/pre-push

# Create commit-msg hook
echo "📝 Creating commit-msg hook..."
cat > .husky/commit-msg << 'EOF'
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

COMMIT_MSG=$(cat "$1")

if ! echo "$COMMIT_MSG" | grep -qE "^(feat|fix|docs|style|refactor|test|chore|perf|ci)((\(.+\))?)!?: .{1,}"; then
  echo "❌ Invalid commit message!"
  echo "Format: <type>(<scope>): <description>"
  echo "Types: feat, fix, docs, style, refactor, test, chore, perf, ci"
  exit 1
fi
EOF

chmod +x .husky/commit-msg

echo ""
echo "✅ Git hooks setup complete!"
echo ""
echo "📋 Summary:"
echo "  - .husky/pre-commit    (lint + build)"
echo "  - .husky/pre-push      (tests + build)"
echo "  - .husky/commit-msg    (commit message validation)"
echo ""
echo "💡 Tips:"
echo "  - Skip hook: git commit --no-verify"
echo "  - Test hook: ./.husky/pre-commit"
echo "  - Remove hook: rm .husky/pre-commit"
echo ""
echo "📚 Learn more: See GIT_HOOKS_SETUP.md"
```

**Usage:**
```bash
bash scripts/setup-hooks.sh
```

---

## Python Project Setup Script

Save as `scripts/setup-hooks.sh`:

```bash
#!/bin/bash

set -e

echo "🔧 Setting up Git hooks for Python project..."

# Check git
if ! command -v git &> /dev/null; then
    echo "❌ git not found"
    exit 1
fi

# Create .husky directory
mkdir -p .husky

# Create pre-commit hook for Python
cat > .husky/pre-commit << 'EOF'
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🔍 Python pre-commit checks..."

# Black (code formatter)
if command -v black &> /dev/null; then
  echo "🎨 Formatting with Black..."
  black . || exit 1
fi

# Flake8 (linter)
if command -v flake8 &> /dev/null; then
  echo "📝 Linting with Flake8..."
  flake8 src/ || exit 1
fi

# MyPy (type checker)
if command -v mypy &> /dev/null; then
  echo "🔐 Type checking with MyPy..."
  mypy src/ || exit 1
fi

echo "✨ Python checks passed!"
EOF

chmod +x .husky/pre-commit

echo "✅ Python hooks setup complete!"
```

---

## Interactive Setup (User Chooses Hooks)

Save as `scripts/interactive-setup.sh`:

```bash
#!/bin/bash

set -e

echo "🔧 Interactive Git Hooks Setup"
echo ""

# Determine project type
echo "What type of project is this?"
echo "1) Node.js/Express Backend"
echo "2) React Frontend"
echo "3) Full Stack (Frontend + Backend)"
echo "4) Python Project"
echo "5) Custom"
read -p "Enter choice (1-5): " PROJECT_TYPE

echo ""
echo "Install Husky? (y/n)"
read -p "Answer: " INSTALL_HUSKY

if [[ "$INSTALL_HUSKY" == "y" ]]; then
    npm install husky --save-dev
    npx husky init || true
fi

# Create hooks based on project type
case $PROJECT_TYPE in
    1)
        echo "Setting up Node.js Backend hooks..."
        cat > .husky/pre-commit << 'EOF'
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
npm run lint:fix && npm run build
EOF
        ;;
    2)
        echo "Setting up React Frontend hooks..."
        cat > .husky/pre-commit << 'EOF'
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
npm run lint:fix && npm run type-check
EOF
        ;;
    3)
        echo "Setting up Full Stack hooks..."
        cat > .husky/pre-commit << 'EOF'
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
cd api && npm run lint:fix && npm run build && cd ..
cd client && npm run lint:fix && npm run type-check && cd ..
EOF
        ;;
    4)
        echo "Setting up Python hooks..."
        cat > .husky/pre-commit << 'EOF'
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
black . && flake8 src/ && mypy src/
EOF
        ;;
    5)
        echo "Custom hooks - edit .husky/pre-commit manually"
        mkdir -p .husky
        cat > .husky/pre-commit << 'EOF'
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
# Add your custom commands here
EOF
        ;;
esac

chmod +x .husky/pre-commit

echo ""
echo "✅ Setup complete! Commit the .husky directory to version control."
```

**Usage:**
```bash
bash scripts/interactive-setup.sh
```

---

## Configuration File Approach

Create `.hooks.config.json` in project root:

```json
{
  "projectType": "node-express",
  "hooks": {
    "pre-commit": {
      "lint": true,
      "build": true,
      "test": false
    },
    "pre-push": {
      "test": true,
      "build": true
    },
    "commit-msg": {
      "validate": true,
      "format": "conventional"
    }
  },
  "ignore": []
}
```

Then use script to read config:

```bash
#!/bin/bash

CONFIG=".hooks.config.json"
PROJECT_TYPE=$(jq -r '.projectType' $CONFIG)

echo "Setting up hooks for: $PROJECT_TYPE"

# Generate hooks based on config...
```

---

## Team Synchronization Script

Ensure all developers have latest hooks:

Create `scripts/sync-hooks.sh`:

```bash
#!/bin/bash

echo "🔄 Synchronizing Git hooks..."

# Ensure .husky directory exists
if [ ! -d ".husky" ]; then
    echo "❌ .husky directory not found!"
    echo "Run: npm install husky --save-dev && npx husky init"
    exit 1
fi

# Make all hooks executable
echo "🔐 Making hooks executable..."
chmod +x .husky/pre-commit
chmod +x .husky/pre-push
chmod +x .husky/commit-msg 2>/dev/null || true

# Reinstall husky
echo "🔄 Reinstalling husky..."
npx husky install || npm install husky --save-dev

echo "✅ Hooks synchronized!"
echo ""
echo "Test hooks:"
echo "  ./.husky/pre-commit"
echo "  ./.husky/pre-push"
```

**Add to package.json:**
```json
{
  "scripts": {
    "setup:hooks": "bash scripts/setup-hooks.sh",
    "sync:hooks": "bash scripts/sync-hooks.sh"
  }
}
```

---

## Continuous Integration Verification

Ensure CI mirrors hook checks:

Create `.github/workflows/hooks-check.yml`:

```yaml
name: Hooks Verification

on: [pull_request]

jobs:
  verify:
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

---

## Docker Integration

For containerized projects, ensure hooks work in Docker:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Setup hooks
RUN npm install husky --save-dev && \
    npx husky install && \
    chmod +x .husky/pre-commit .husky/pre-push

CMD ["npm", "run", "dev"]
```

---

## Usage Across All Projects

### Initial Setup (One-Time)

```bash
# Run setup script
npm run setup:hooks

# Commit hooks to version control
git add .husky/
git commit -m "chore: add git hooks"
```

### After Cloning Repository

```bash
# Reinstall dependencies (includes husky)
npm install

# If hooks don't work, sync them
npm run sync:hooks
```

### Updating Hooks

1. Edit `.husky/pre-commit` or other hooks
2. Commit changes
3. Team members pull → hooks auto-update

---

## Troubleshooting Automation

### Script Permissions

```bash
# Make script executable
chmod +x scripts/setup-hooks.sh

# Run it
./scripts/setup-hooks.sh
```

### Check Husky Status

```bash
# Verify husky is installed
npm list husky

# Check hooks directory
ls -la .husky/

# Test a hook manually
./.husky/pre-commit
```

### Debug Failed Hook

```bash
# Run with verbose output
bash -x .husky/pre-commit
```

---

## Summary

| Script | Purpose |
|--------|---------|
| `setup-hooks.sh` | Initial setup for project |
| `interactive-setup.sh` | User-guided setup |
| `sync-hooks.sh` | Update/synchronize hooks |
| `.hooks.config.json` | Centralized configuration |

Use these templates and scripts to quickly set up consistent Git hooks across all your projects!
