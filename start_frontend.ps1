$ErrorActionPreference = "Stop"

# Download Node Portable if it doesn't exist
$NodeDir = "$PWD\node-v20.11.1-win-x64"
if (-Not (Test-Path $NodeDir)) {
    Write-Host "Downloading Portable Node.js..."
    Invoke-WebRequest -Uri "https://nodejs.org/dist/v20.11.1/node-v20.11.1-win-x64.zip" -OutFile "node.zip"
    Write-Host "Extracting Node.js..."
    Expand-Archive -Path "node.zip" -DestinationPath "." -Force
    Remove-Item "node.zip"
}

# Add Node to PATH for this session
$env:PATH = "$NodeDir;$env:PATH"

# Go to frontend and run
cd frontend
Write-Host "Installing npm dependencies..."
npm install
Write-Host "Starting Vite server..."
npm run dev
