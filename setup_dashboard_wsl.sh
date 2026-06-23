#!/bin/bash
set -e

echo "==========================================================="
echo "⚡ Setting up Native Node.js in WSL for React Dashboard ⚡"
echo "==========================================================="

# Install NVM (Node Version Manager)
echo "Installing NVM..."
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Load NVM into the current shell session
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install Node.js 20 (LTS)
echo "Installing Node.js v20..."
nvm install 20
nvm use 20

# Verify installation
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Install Dashboard Dependencies
echo "Installing Dashboard Dependencies..."
cd react-dashboard
npm install

echo "==========================================================="
echo "✅ Node.js and Dashboard Dependencies Installed Natively in WSL!"
echo "To start the dashboard, run the following commands in your terminal:"
echo "source ~/.bashrc"
echo "cd react-dashboard"
echo "npm run dev"
echo "==========================================================="
