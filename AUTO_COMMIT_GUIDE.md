# Automatic GitHub Commit System Guide

This guide explains how to use the automatic GitHub commit system set up for the Epic360 Gigs project.

## 🚀 Overview

The automatic commit system includes:

- **GitHub Actions workflows** for automated commits
- **Husky pre-commit hooks** for code quality checks
- **lint-staged** for formatting staged files
- **Prettier** for consistent code formatting
- **Custom auto-commit script** for manual triggering

## 📋 Components

### 1. GitHub Actions Workflows

#### `auto-commit.yml`

- **Trigger**: On push to main/master branch or pull requests
- **Purpose**: Automatically commits and pushes changes
- **Features**:
  - Runs linting and type checking
  - Builds the project
  - Commits changes with descriptive messages

#### `scheduled-auto-commit.yml`

- **Trigger**: Daily at 2 AM UTC (configurable)
- **Purpose**: Regular maintenance commits
- **Features**:
  - Updates timestamp file
  - Commits any pending changes
  - Ensures repository activity

### 2. Pre-commit Hooks (Husky)

#### `.husky/pre-commit`

- **Trigger**: Before every commit
- **Purpose**: Ensure code quality
- **Checks**:
  - Runs lint-staged for formatting
  - Type checking with TypeScript
  - Build verification

### 3. Code Formatting

#### Prettier Configuration (`.prettierrc`)

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

#### lint-staged Configuration

- Formats JavaScript/TypeScript files with Prettier
- Formats JSON, Markdown, YAML files
- Runs automatically on staged files

## 🛠️ Usage

### Manual Auto-Commit

#### Using npm script:

```bash
npm run auto-commit
```

#### Using the batch file (Windows):

```bash
auto-commit.bat
```

#### Using the Node.js script directly:

```bash
node scripts/auto-commit.js
```

### Commit Message Template

The system uses conventional commit messages:

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Types:

- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code formatting
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Test changes
- `chore`: Maintenance tasks

#### Scopes:

- `auth`: Authentication
- `api`: API changes
- `ui`: UI/UX changes
- `db`: Database changes
- `deps`: Dependencies
- `config`: Configuration

### Examples:

```bash
feat(auth): add two-factor authentication
fix(api): resolve user signup issue
docs(readme): update installation instructions
style(ui): format components with prettier
```

## ⚙️ Configuration

### Environment Variables

The system respects your existing environment variables and won't interfere with your development setup.

### Customization

#### Modify GitHub Actions Schedule

Edit `.github/workflows/scheduled-auto-commit.yml`:

```yaml
on:
  schedule:
    # Run every Monday at 9 AM UTC
    - cron: '0 9 * * 1'
```

#### Add Custom Pre-commit Checks

Edit `.husky/pre-commit`:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Your custom checks here
npm run custom-check
npx lint-staged
```

#### Modify Auto-commit Script

Edit `scripts/auto-commit.js` to add custom logic:

```javascript
// Add custom validation
function customValidation() {
  // Your validation logic
}

// Add to main function
function main() {
  // ... existing code ...
  customValidation();
  // ... rest of code ...
}
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Pre-commit Hook Fails

**Problem**: Husky pre-commit hook fails
**Solution**:

```bash
# Reinstall husky
npm run prepare

# Or manually install
npx husky install
```

#### 2. GitHub Actions Not Running

**Problem**: Workflows not triggering
**Solution**:

- Check repository permissions
- Ensure workflows are in `.github/workflows/` directory
- Verify branch names match workflow triggers

#### 3. Auto-commit Script Errors

**Problem**: Node.js script fails
**Solution**:

```bash
# Check Node.js version
node --version

# Install dependencies
npm install

# Run with debug info
DEBUG=* npm run auto-commit
```

#### 4. Prettier Conflicts

**Problem**: Prettier formatting conflicts
**Solution**:

```bash
# Format all files
npm run format

# Check formatting
npm run format:check
```

### Debug Mode

Enable debug mode for the auto-commit script:

```bash
DEBUG=* npm run auto-commit
```

## 📊 Monitoring

### GitHub Actions Dashboard

- Go to your repository on GitHub
- Click "Actions" tab
- Monitor workflow runs and logs

### Local Monitoring

```bash
# Check git status
git status

# View recent commits
git log --oneline -10

# Check pre-commit hook status
ls -la .husky/
```

## 🔒 Security

### Permissions

- GitHub Actions use `GITHUB_TOKEN` with minimal permissions
- Pre-commit hooks run locally with your user permissions
- No sensitive data is committed automatically

### Best Practices

1. **Review auto-commits**: Always review automatic commits
2. **Test locally**: Test changes before pushing
3. **Use feature branches**: Create branches for major changes
4. **Monitor logs**: Check GitHub Actions logs regularly

## 🚀 Advanced Features

### Custom Workflows

Create additional workflows in `.github/workflows/`:

```yaml
name: Custom Workflow
on:
  push:
    branches: [feature/*]
jobs:
  custom-job:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Custom step
        run: echo "Custom workflow"
```

### Integration with CI/CD

The auto-commit system works alongside your existing CI/CD pipeline:

```yaml
# Example: Add to existing workflow
- name: Auto-commit after tests
  if: success()
  run: |
    git config user.email "ci@example.com"
    git config user.name "CI Bot"
    git add .
    git commit -m "ci: update after successful tests"
    git push
```

## 📝 Maintenance

### Regular Tasks

1. **Update dependencies**: `npm update`
2. **Review workflows**: Check GitHub Actions performance
3. **Clean up**: Remove old branches and commits
4. **Monitor logs**: Check for errors and warnings

### Updates

```bash
# Update all tools
npm update

# Update Husky
npm install husky@latest

# Update Prettier
npm install prettier@latest

# Update lint-staged
npm install lint-staged@latest
```

## 🎯 Best Practices

1. **Commit frequently**: Small, focused commits
2. **Use descriptive messages**: Follow conventional commit format
3. **Test before committing**: Ensure code works locally
4. **Review auto-commits**: Don't rely solely on automation
5. **Keep workflows simple**: Avoid complex automation logic
6. **Monitor performance**: Watch for slow builds or failures

## 📞 Support

If you encounter issues:

1. Check this guide for troubleshooting steps
2. Review GitHub Actions logs
3. Check local git status and logs
4. Create an issue in the repository
5. Contact the development team

---

**Happy coding! 🚀**
