const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  buildFolder: 'build',
  repositoryUrl: process.env.GITHUB_REPOSITORY_URL || '',
  branch: 'gh-pages',
  cname: process.env.CNAME || '',
};

// Ensure the build folder exists
if (!fs.existsSync(path.join(__dirname, config.buildFolder))) {
  console.error(`Error: Build folder '${config.buildFolder}' not found.`);
  console.error('Please run "npm run build" before deploying.');
  process.exit(1);
}

// Deploy function
async function deploy() {
  try {
    // Check if repository URL is provided
    if (!config.repositoryUrl) {
      throw new Error('GitHub repository URL is not provided. Set GITHUB_REPOSITORY_URL environment variable.');
    }

    console.log('Starting deployment process...');
    
    // Navigate to the build folder
    process.chdir(path.join(__dirname, config.buildFolder));
    
    // Initialize git repository
    console.log('Initializing git repository...');
    execSync('git init');
    
    // Add CNAME file if provided
    if (config.cname) {
      console.log(`Adding CNAME file with domain: ${config.cname}`);
      fs.writeFileSync('CNAME', config.cname);
    }
    
    // Add all files
    console.log('Adding files to git...');
    execSync('git add .');
    
    // Commit changes
    console.log('Committing changes...');
    execSync('git commit -m "Deploy to GitHub Pages"');
    
    // Add remote repository
    console.log('Adding remote repository...');
    execSync(`git remote add origin ${config.repositoryUrl}`);
    
    // Push to GitHub Pages branch
    console.log(`Pushing to ${config.branch} branch...`);
    execSync(`git push -f origin master:${config.branch}`);
    
    console.log('\nDeployment completed successfully!');
    console.log(`Your site is now published at https://<username>.github.io/<repo-name>/`);
    
  } catch (error) {
    console.error('\nDeployment failed:');
    console.error(error.message);
    process.exit(1);
  }
}

// Run deployment
deploy();