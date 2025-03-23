/**
 * Prepare Electron Package Script
 * 
 * This script automates the process of preparing the web application
 * for packaging as a desktop application with Electron.
 * 
 * It performs the following tasks:
 * 1. Copies necessary files to a staging directory
 * 2. Modifies package.json to work with Electron
 * 3. Prepares the build environment
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const stagingDir = path.join(__dirname, 'electron-staging');
const resourcesDir = path.join(__dirname, 'resources');
const distDir = path.join(__dirname, 'client', 'dist');

// Ensure the staging directory exists
console.log('Creating staging directory...');
if (fs.existsSync(stagingDir)) {
  fs.rmSync(stagingDir, { recursive: true, force: true });
}
fs.mkdirSync(stagingDir, { recursive: true });
fs.mkdirSync(path.join(stagingDir, 'resources'), { recursive: true });

// Copy necessary files to staging directory
console.log('Copying files to staging directory...');
const filesToCopy = [
  'electron.js',
  'preload.js',
  'server.js',
  'electron-builder.yml'
];

filesToCopy.forEach(file => {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join(stagingDir, file));
    console.log(`Copied ${file}`);
  } else {
    console.error(`Warning: ${file} not found`);
  }
});

// Copy resources
if (fs.existsSync(resourcesDir)) {
  const resourceFiles = fs.readdirSync(resourcesDir);
  resourceFiles.forEach(file => {
    const sourcePath = path.join(resourcesDir, file);
    const destPath = path.join(stagingDir, 'resources', file);
    if (fs.statSync(sourcePath).isFile()) {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`Copied resource: ${file}`);
    }
  });
} else {
  console.error('Warning: resources directory not found');
  fs.mkdirSync(path.join(stagingDir, 'resources'), { recursive: true });
}

// Create a package.json for the Electron app
console.log('Creating package.json for Electron...');
const originalPackageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
const electronPackageJson = {
  name: 'rutube-web-translator',
  productName: 'Rutube Web Translator',
  version: '1.0.0',
  description: 'A desktop application that provides real-time Russian translation of English speech in YouTube videos',
  main: 'electron.js',
  type: 'commonjs',
  scripts: {
    start: 'electron .',
    build: 'electron-builder',
    'build:win': 'electron-builder --win',
    'build:mac': 'electron-builder --mac',
    'build:linux': 'electron-builder --linux'
  },
  author: {
    name: 'Rutube Web Translator Team'
  },
  license: 'MIT',
  dependencies: {
    express: originalPackageJson.dependencies.express,
    'node-fetch': originalPackageJson.dependencies['node-fetch']
  },
  devDependencies: {
    electron: originalPackageJson.dependencies.electron,
    'electron-builder': originalPackageJson.dependencies['electron-builder']
  }
};

fs.writeFileSync(
  path.join(stagingDir, 'package.json'), 
  JSON.stringify(electronPackageJson, null, 2)
);

console.log('Package preparation complete!');
console.log(`Staging directory: ${stagingDir}`);
console.log('\nNext steps:');
console.log('1. Run your build script to create the client/dist directory');
console.log('2. Copy client/dist to the staging directory');
console.log('3. Navigate to the staging directory and run:');
console.log('   npm install');
console.log('   npm run build:win (or build:mac, build:linux)');
console.log('\nYour executable will be created in the dist-electron directory inside the staging folder.');