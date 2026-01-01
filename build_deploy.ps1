Write-Host "🚧 Starting Build for GitHub Pages..."

# 1. Clean dist
if (Test-Path dist) { Remove-Item dist -Recurse -Force }
New-Item -ItemType Directory -Force -Path dist

# 2. Build Core (Required for Types)
Write-Host "📦 Building Core..."
Push-Location packages/core
npm run build
if ($LASTEXITCODE -ne 0) { Write-Error "Core build failed"; exit 1 }
Pop-Location

# 3. Build React
Write-Host "📦 Building React..."
Push-Location packages/react
# Vite build will clean dist by default, but we're in packages/react source
npm run build:demo
if ($LASTEXITCODE -ne 0) { Write-Error "React build failed"; exit 1 }
Pop-Location
Copy-Item -Recurse -Path packages/react/dist -Destination dist/react

# 4. Build Vue
Write-Host "📦 Building Vue..."
Push-Location packages/vue
npm run build:demo
if ($LASTEXITCODE -ne 0) { Write-Error "Vue build failed"; exit 1 }
Pop-Location
Copy-Item -Recurse -Path packages/vue/dist -Destination dist/vue

# 5. Copy Index
Write-Host "📄 Copying Landing Page..."
Copy-Item index.html -Destination dist/index.html

Write-Host "✅ Build Complete! The 'dist' folder is ready for GitHub Pages deployment."
