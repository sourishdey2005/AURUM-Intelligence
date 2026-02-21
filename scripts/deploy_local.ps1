# AURUM AI - Local Quickstart Script

Write-Host "Starting AURUM AI Local Infrastructure..." -ForegroundColor Gold

# 1. Backend Setup
Write-Host "Setting up Backend..."
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
cd ..

# 2. Frontend Setup
Write-Host "Setting up Frontend..."
cd frontend
npm install
cd ..

# 3. Docker Launch
Write-Host "Orchestrating services via Docker..."
docker-compose up -d

Write-Host "AURUM AI is now initializing at http://localhost:3000" -ForegroundColor Green
Write-Host "Backend API live at http://localhost:8000/docs" -ForegroundColor Cyan
