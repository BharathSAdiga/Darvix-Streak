@echo off
title Dravix Development Server
echo Starting Dravix Development Server...
echo Please ensure that this window stays open to keep the server running.
start http://localhost:5173/
call npm run dev
echo.
echo DEV SERVER STOPPED. 
pause
