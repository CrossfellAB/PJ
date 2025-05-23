#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "Starting deployment fix..."

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

# Create a temp directory for the gh-pages branch
TEMP_DIR=$(mktemp -d)
echo "Using temporary directory: $TEMP_DIR"

# Clone only the gh-pages branch to the temp directory
echo "Cloning gh-pages branch..."
git clone -b gh-pages --single-branch https://github.com/CrossfellAB/PJ.git "$TEMP_DIR"

# Remove all files from the gh-pages branch (except .git directory)
echo "Cleaning gh-pages branch..."
find "$TEMP_DIR" -mindepth 1 -not -path "$TEMP_DIR/.git*" -delete

# Copy the build folder to the gh-pages branch directory
echo "Copying build files to gh-pages directory..."
cp -r build/* "$TEMP_DIR/"
# Also copy the .nojekyll file and 404.html
touch "$TEMP_DIR/.nojekyll"
cp public/404.html "$TEMP_DIR/"

# Move to the gh-pages directory
cd "$TEMP_DIR"

# Configure git if needed
git config user.name "GitHub Pages Deployment"
git config user.email "deployment@example.com"

# Add all files and commit
echo "Committing changes..."
git add -A
git commit -m "Deploy React app to GitHub Pages"

# Push to the gh-pages branch
echo "Pushing to gh-pages branch..."
git push

echo "Deployment completed successfully!"
echo "Your site should now be available at: https://crossfellab.github.io/PJ/"

# Clean up
cd ..
rm -rf "$TEMP_DIR"