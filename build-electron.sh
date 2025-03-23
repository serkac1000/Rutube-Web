#!/bin/bash

# Terminal colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Rutube Web Translator - Desktop Build Script${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""

# Check if a platform was specified
if [ $# -lt 1 ]; then
  echo -e "${YELLOW}Usage: $0 <platform>${NC}"
  echo -e "${YELLOW}Platforms: mac, linux, all${NC}"
  exit 1
fi

PLATFORM=$1

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
  echo -e "${RED}Error: Node.js is not installed or not in PATH.${NC}"
  echo -e "${YELLOW}Please install Node.js from https://nodejs.org/${NC}"
  exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
  echo -e "${RED}Error: npm is not installed or not in PATH.${NC}"
  echo -e "${YELLOW}It should be included with Node.js installation.${NC}"
  exit 1
fi

# Check if client/dist exists
if [ ! -d "client/dist" ]; then
  echo -e "${YELLOW}Building client...${NC}"
  npm run build
  if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to build client.${NC}"
    exit 1
  fi
else
  echo -e "${GREEN}Client build found.${NC}"
fi

# Run the preparation script
echo -e "${YELLOW}Preparing Electron package...${NC}"
node prepare-electron-package.js
if [ $? -ne 0 ]; then
  echo -e "${RED}Error: Failed to prepare Electron package.${NC}"
  exit 1
fi

# Copy the client build to the staging directory
echo -e "${YELLOW}Copying client build to staging directory...${NC}"
mkdir -p electron-staging/dist
cp -r client/dist/* electron-staging/dist/
if [ $? -ne 0 ]; then
  echo -e "${RED}Error: Failed to copy client build.${NC}"
  exit 1
fi

# Navigate to the staging directory and install dependencies
echo -e "${YELLOW}Installing dependencies in staging directory...${NC}"
cd electron-staging
npm install
if [ $? -ne 0 ]; then
  echo -e "${RED}Error: Failed to install dependencies.${NC}"
  cd ..
  exit 1
fi

# Build the Electron app for the specified platform
if [ "$PLATFORM" = "mac" ] || [ "$PLATFORM" = "all" ]; then
  echo -e "${YELLOW}Building Electron app for macOS...${NC}"
  npm run build:mac
  if [ $? -ne 0 ]; then
    echo -e "${RED}Warning: Failed to build Electron app for macOS.${NC}"
    echo -e "${YELLOW}This is expected if you're not on a macOS system.${NC}"
  else
    echo -e "${GREEN}macOS build completed successfully!${NC}"
  fi
fi

if [ "$PLATFORM" = "linux" ] || [ "$PLATFORM" = "all" ]; then
  echo -e "${YELLOW}Building Electron app for Linux...${NC}"
  npm run build:linux
  if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to build Electron app for Linux.${NC}"
    cd ..
    exit 1
  else
    echo -e "${GREEN}Linux build completed successfully!${NC}"
  fi
fi

cd ..
echo ""
echo -e "${GREEN}Build process completed!${NC}"
echo -e "${YELLOW}Check the electron-staging/dist-electron directory for the installer(s).${NC}"
echo ""