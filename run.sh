#!/bin/bash
sudo apt update
sudo apt install curl

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

source ~/.bashrc

npm install

echo "Starting Hospital App..."
# Open URL in default browser (works on Linux/macOS)
xdg-open http://localhost:5173/ || open http://localhost:5173/
npm run dev
read -p "Press enter to continue..."
