#!/usr/bin/env node

/**
 * Script to create dummy pull requests for Mergify testing
 * Requires GitHub CLI (gh) to be installed and authenticated
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const REPO_OWNER = 'AlexandreGaubert';
const REPO_NAME = 'mergic';
const BASE_BRANCH = 'main';

function log(message, type = 'info') {
  const icons = {
    info: '🔵',
    success: '✅',
    error: '❌',
    warning: '⚠️'
  };
  console.log(`${icons[type] || '🔵'} ${message}`);
}

function execCommand(command, description) {
  try {
    log(description);
    const result = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    return result.trim();
  } catch (error) {
    log(`Failed: ${description}`, 'error');
    log(`Error: ${error.message}`, 'error');
    process.exit(1);
  }
}

function checkPrerequisites() {
  // Check if in git repository
  if (!fs.existsSync('.git')) {
    log('Not in a git repository', 'error');
    process.exit(1);
  }

  // Check GitHub CLI
  try {
    execSync('gh --version', { stdio: 'pipe' });
  } catch {
    log('GitHub CLI (gh) is not installed. Please install it: https://cli.github.com/', 'error');
    process.exit(1);
  }

  // Check authentication
  try {
    execSync('gh auth status', { stdio: 'pipe' });
  } catch {
    log('Not authenticated with GitHub CLI. Please run: gh auth login', 'error');
    process.exit(1);
  }
}

function createDummyPR() {
  const timestamp = new Date().toISOString().replace(/[-:.]/g, '').slice(0, 15);
  const branchName = `test/dummy-pr-${timestamp}`;

  log(`Creating dummy pull request for ${REPO_OWNER}/${REPO_NAME}`);
  log(`Base branch: ${BASE_BRANCH}`);
  log(`Feature branch: ${branchName}`);

  checkPrerequisites();

  // Update main branch
  execCommand(`git checkout ${BASE_BRANCH}`, 'Switching to main branch');
  execCommand(`git pull origin ${BASE_BRANCH}`, 'Updating main branch');

  // Create feature branch
  execCommand(`git checkout -b ${branchName}`, `Creating feature branch: ${branchName}`);

  // Create a simple dummy file with timestamp
  const dummyFile = `dummy-${timestamp}.txt`;
  const dummyContent = `Dummy file created at ${new Date().toISOString()}`;

  fs.writeFileSync(dummyFile, dummyContent);

  log('Created dummy file');

  // Commit changes
  execCommand('git add .', 'Staging changes');
  
  const commitMessage = `feat: add dummy file ${timestamp}

Simple dummy file for Mergify testing.`;

  execCommand(`git commit -m "${commitMessage}"`, 'Committing changes');

  // Push branch
  execCommand(`git push origin ${branchName}`, 'Pushing branch to remote');

  // Create PR
  const prTitle = `Test: Dummy file ${timestamp}`;
  const prBody = `Automated test PR for Mergify - adds dummy-${timestamp}.txt`;

  const prUrl = execCommand(
    `gh pr create --title "${prTitle}" --body "${prBody}" --base ${BASE_BRANCH} --head ${branchName}`,
    'Creating pull request'
  );

  log('Pull request created successfully!', 'success');
  log(`🔗 URL: ${prUrl}`);
  log(`🌿 Branch: ${branchName}`);
  log('');
  log('This PR will trigger:');
  log('  - GitHub Actions tests');
  log('  - Mergify queue processing');
  log('');
  log('To clean up later:');
  log(`  git checkout ${BASE_BRANCH}`);
  log(`  git branch -D ${branchName}`);
  log(`  git push origin --delete ${branchName}`);

  return { prUrl, branchName };
}

// Run if called directly
if (require.main === module) {
  try {
    createDummyPR();
  } catch (error) {
    log(`Unexpected error: ${error.message}`, 'error');
    process.exit(1);
  }
}

module.exports = { createDummyPR };
