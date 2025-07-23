#!/bin/bash

# Script to create a dummy pull request for Mergify testing
# Usage: ./create-dummy-pr.sh

set -e

# Configuration
REPO_OWNER="AlexandreGaubert"
REPO_NAME="mergic"
BASE_BRANCH="main"

# Generate a unique branch name
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BRANCH_NAME="test/dummy-pr-${TIMESTAMP}"

echo "🚀 Creating dummy pull request..."
echo "Repository: ${REPO_OWNER}/${REPO_NAME}"
echo "Base branch: ${BASE_BRANCH}"
echo "Feature branch: ${BRANCH_NAME}"
echo

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ Error: GitHub CLI (gh) is not installed"
    echo "Please install it: https://cli.github.com/"
    exit 1
fi

# Check if user is authenticated with GitHub CLI
if ! gh auth status &> /dev/null; then
    echo "❌ Error: Not authenticated with GitHub CLI"
    echo "Please run: gh auth login"
    exit 1
fi

# Ensure we're on the main branch and up to date
echo "📥 Updating main branch..."
git checkout ${BASE_BRANCH}
git pull origin ${BASE_BRANCH}

# Create and switch to new branch
echo "🌿 Creating feature branch: ${BRANCH_NAME}"
git checkout -b ${BRANCH_NAME}

# Make some dummy changes
echo "✏️  Making dummy changes..."

# Add a dummy feature file
cat > "src/dummy-feature-${TIMESTAMP}.js" << EOF
// Dummy feature for testing Mergify - ${TIMESTAMP}

class DummyFeature {
  constructor() {
    this.timestamp = '${TIMESTAMP}';
    this.message = 'This is a test feature for Mergify integration';
  }

  getMessage() {
    return \`\${this.message} - Created at \${this.timestamp}\`;
  }

  processData(data) {
    // Simulate some processing
    console.log('Processing data:', data);
    return {
      processed: true,
      timestamp: this.timestamp,
      data: data
    };
  }
}

module.exports = DummyFeature;
EOF

# Add a corresponding test file
cat > "test/dummy-feature-${TIMESTAMP}.test.js" << EOF
const DummyFeature = require('../src/dummy-feature-${TIMESTAMP}');

describe('DummyFeature ${TIMESTAMP}', () => {
  let dummyFeature;

  beforeEach(() => {
    dummyFeature = new DummyFeature();
  });

  test('should create instance with correct timestamp', () => {
    expect(dummyFeature.timestamp).toBe('${TIMESTAMP}');
  });

  test('should return formatted message', () => {
    const message = dummyFeature.getMessage();
    expect(message).toContain('This is a test feature for Mergify integration');
    expect(message).toContain('${TIMESTAMP}');
  });

  test('should process data correctly', () => {
    const testData = { id: 1, name: 'test' };
    const result = dummyFeature.processData(testData);
    
    expect(result.processed).toBe(true);
    expect(result.timestamp).toBe('${TIMESTAMP}');
    expect(result.data).toEqual(testData);
  });
});
EOF

# Update README with the new feature
echo "" >> README.md
echo "## Latest Test Feature" >> README.md
echo "" >> README.md
echo "- Added DummyFeature-${TIMESTAMP} for Mergify testing" >> README.md
echo "- Created at: $(date)" >> README.md

# Stage and commit changes
echo "💾 Committing changes..."
git add .
git commit -m "feat: add dummy feature ${TIMESTAMP} for Mergify testing

- Add DummyFeature class with basic functionality
- Include corresponding unit tests
- Update README with feature information

This is a test PR to validate Mergify configuration."

# Push the branch
echo "📤 Pushing branch to remote..."
git push origin ${BRANCH_NAME}

# Create pull request using GitHub CLI
echo "🔄 Creating pull request..."
PR_URL=$(gh pr create \
  --title "Test: Add dummy feature ${TIMESTAMP}" \
  --body "This is an automated test PR for Mergify integration testing.

## Changes
- Added \`DummyFeature-${TIMESTAMP}\` class
- Added corresponding unit tests
- Updated README

## Testing
- All tests should pass
- Mergify should process this PR according to the configuration

**This PR is safe to merge - it only adds test code.**" \
  --base ${BASE_BRANCH} \
  --head ${BRANCH_NAME})

echo
echo "✅ Pull request created successfully!"
echo "🔗 URL: ${PR_URL}"
echo "🌿 Branch: ${BRANCH_NAME}"
echo
echo "The PR will trigger:"
echo "  - GitHub Actions tests"
echo "  - Mergify queue processing"
echo
echo "To clean up later, run:"
echo "  git checkout ${BASE_BRANCH}"
echo "  git branch -D ${BRANCH_NAME}"
echo "  git push origin --delete ${BRANCH_NAME}"
