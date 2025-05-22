#!/bin/bash

# Deployment script for GitHub Pages

# Build the React application
echo "Building the React application..."
npm run build

# Check if build folder exists
if [ ! -d "build" ]; then
  echo "Error: build folder not found. Build process failed."
  exit 1
fi

# Create a temporary directory for deployment
echo "Creating temporary directory for deployment..."
TEMP_DIR=$(mktemp -d)
cp -r build/* $TEMP_DIR/

# Move to the temporary directory
cd $TEMP_DIR

# Initialize git repository
echo "Initializing git repository..."
git init
git add .
git commit -m "Deploy to GitHub Pages"

# Check if GitHub CLI is available
if command -v gh &> /dev/null; then
  echo "Using GitHub CLI for deployment..."
  
  # Create a new branch for gh-pages
  git checkout -b gh-pages
  
  # Push to GitHub using GitHub CLI
  echo "Pushing to GitHub Pages..."
  gh repo set-default $(gh repo list --json nameWithOwner -q '.[0].nameWithOwner')
  gh repo sync --force
  git push --force origin gh-pages
else
  echo "GitHub CLI not found. Using git push..."
  
  # Add remote repository (user will need to provide the URL)
  echo "Enter your GitHub repository URL (e.g., https://github.com/username/repo.git):"
  read REPO_URL
  
  git remote add origin $REPO_URL
  git checkout -b gh-pages
  git push --force origin gh-pages
fi

echo "Deployment completed!"
echo "Your application should be available at: https://[username].github.io/[repository-name]/"

# Clean up
rm -rf $TEMP_DIR