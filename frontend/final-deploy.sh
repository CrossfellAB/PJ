#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "Starting final deployment fix..."

# Make sure we're in the frontend directory
cd "$(dirname "$0")"

# Build the project
echo "Building React application..."
npm run build

# Check build directory exists
if [ ! -d "build" ]; then
  echo "Error: build directory not found. Build failed."
  exit 1
fi

# Create a temp directory for gh-pages content
TEMP_DIR=$(mktemp -d)
echo "Using temporary directory: $TEMP_DIR"

# Add .nojekyll file to prevent Jekyll processing
echo "Adding .nojekyll file..."
touch "build/.nojekyll"

# Clone gh-pages branch
echo "Cloning gh-pages branch..."
git clone -b gh-pages --single-branch https://github.com/CrossfellAB/PJ.git "$TEMP_DIR"

# Remove everything except .git directory
echo "Cleaning gh-pages branch..."
find "$TEMP_DIR" -mindepth 1 -not -path "$TEMP_DIR/.git*" -delete

# Copy build files to gh-pages directory
echo "Copying build files to gh-pages directory..."
cp -r build/* "$TEMP_DIR"/
cp build/.nojekyll "$TEMP_DIR"/

# Change to gh-pages directory
cd "$TEMP_DIR"

# Configure git
git config user.name "GitHub Pages Deployment"
git config user.email "deployment@example.com"

# Verify .nojekyll exists
if [ ! -f ".nojekyll" ]; then
  echo "Creating .nojekyll file..."
  touch .nojekyll
fi

# Add all files and commit
echo "Committing changes..."
git add -A
git commit -m "Deploy React app to GitHub Pages"

# Force push to gh-pages branch
echo "Pushing to gh-pages branch..."
git push -f origin gh-pages

echo "Deployment completed successfully!"
echo "Your site should now be available at: https://crossfellab.github.io/PJ/"

# Clean up
cd ..
rm -rf "$TEMP_DIR"