#!/bin/bash

# Set error handling
set -e

# Configuration
REPO_NAME="PJ"
GH_PAGES_BRANCH="gh-pages"
BUILD_DIR="build"

# Ensure we're in the frontend directory
cd "$(dirname "$0")"

# Build the React application
echo "Building the React application..."
npm run build

# Check if build folder exists
if [ ! -d "$BUILD_DIR" ]; then
  echo "Error: build folder not found. Build process failed."
  exit 1
fi

echo "Creating/updating gh-pages branch..."

# Create a temporary directory
TEMP_DIR=$(mktemp -d)
cp -r $BUILD_DIR/* $TEMP_DIR/

# Create a .nojekyll file to prevent GitHub from processing the site with Jekyll
touch $TEMP_DIR/.nojekyll

# Navigate to temp directory
cd $TEMP_DIR

# Initialize git and create commit
git init
git add .
git config --local user.email "deployment@example.com"
git config --local user.name "Deployment Script"
git commit -m "Deploy to GitHub Pages"

# Get the repository URL from the parent git repository
cd -
cd ..
REPO_URL=$(git remote get-url origin)
if [ -z "$REPO_URL" ]; then
  echo "Error: Could not get repository URL. Please enter it manually:"
  read REPO_URL
fi

# Push to GitHub Pages
cd $TEMP_DIR
git remote add origin $REPO_URL
git checkout -b $GH_PAGES_BRANCH
git push -f origin $GH_PAGES_BRANCH

echo "Deployment completed successfully!"
echo "Your site should be available at: https://[username].github.io/$REPO_NAME/"

# Clean up
rm -rf $TEMP_DIR