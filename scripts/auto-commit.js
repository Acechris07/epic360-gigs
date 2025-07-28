#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, options = {}) {
  try {
    const result = execSync(command, {
      encoding: 'utf8',
      stdio: 'pipe',
      ...options,
    });
    return { success: true, output: result };
  } catch (error) {
    return { success: false, output: error.message };
  }
}

function getCommitMessage() {
  const timestamp = new Date().toISOString();
  const types = ['chore', 'docs', 'feat', 'fix', 'refactor', 'style', 'test'];
  const scopes = ['api', 'auth', 'ui', 'db', 'deps', 'config'];

  // Randomly select type and scope for demo purposes
  const type = types[Math.floor(Math.random() * types.length)];
  const scope = scopes[Math.floor(Math.random() * scopes.length)];

  return `${type}(${scope}): auto-commit at ${timestamp}`;
}

function main() {
  log('🚀 Starting automatic commit process...', 'blue');

  // Check if we're in a git repository
  const gitCheck = runCommand('git status');
  if (!gitCheck.success) {
    log('❌ Not in a git repository', 'red');
    process.exit(1);
  }

  // Check for changes
  const status = runCommand('git status --porcelain');
  if (!status.success || !status.output.trim()) {
    log('ℹ️ No changes to commit', 'yellow');
    return;
  }

  log('📝 Changes detected:', 'green');
  console.log(status.output);

  // Run linting and formatting
  log('🔍 Running linting and formatting...', 'blue');
  const lintResult = runCommand('npm run lint');
  const formatResult = runCommand('npm run format');

  if (!lintResult.success) {
    log('⚠️ Linting issues found, but continuing...', 'yellow');
  }

  // Add all changes
  log('📦 Adding changes to staging...', 'blue');
  const addResult = runCommand('git add .');
  if (!addResult.success) {
    log('❌ Failed to add changes', 'red');
    process.exit(1);
  }

  // Create commit
  const commitMessage = getCommitMessage();
  log(`💾 Creating commit: ${commitMessage}`, 'blue');

  const commitResult = runCommand(`git commit -m "${commitMessage}"`);
  if (!commitResult.success) {
    log('❌ Failed to create commit', 'red');
    console.log(commitResult.output);
    process.exit(1);
  }

  // Push changes
  log('🚀 Pushing changes to remote...', 'blue');
  const pushResult = runCommand('git push');
  if (!pushResult.success) {
    log('❌ Failed to push changes', 'red');
    console.log(pushResult.output);
    process.exit(1);
  }

  log('✅ Automatic commit completed successfully!', 'green');
}

if (require.main === module) {
  main();
}

module.exports = { main, getCommitMessage };
