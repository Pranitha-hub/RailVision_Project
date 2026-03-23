@echo off
title RailVision Launcher
echo ==============================================
echo  🚂 Starting the RailVision Full-Stack Platform
echo ==============================================

cd /d "%~dp0"

echo.
echo [1] Starting FastAPI Backend on port 8000...
start "RailVision Backend (FastAPI)" cmd /k "cd backend && venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000"

echo [2] Starting Vite Frontend on port 5173...
start "RailVision Frontend (Vite)" cmd /k "npm run dev"

echo.
echo ==============================================
echo  ✅ Both servers have been launched!
echo  🌐 Frontend: http://localhost:5173
echo  📡 Backend API: http://localhost:8000
echo  📚 API Docs: http://localhost:8000/docs
echo ==============================================
echo.
echo  Demo Accounts:
echo    Admin:     admin@railvision.in / admin123
echo    Passenger: passenger@railvision.in / pass123
echo ==============================================
pause
