@echo off
title EMAN EWAIS Labs - local server
cd /d "%~dp0"
echo ================================================
echo  EMAN EWAIS Labs - local setup
echo ================================================
where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js is not installed.
  echo Install it with:  winget install --id OpenJS.NodeJS.LTS -e
  echo NODE_MISSING > setup-log.txt
  pause
  exit /b 1
)
for /f %%v in ('node -v') do set NODEV=%%v
echo Node.js %NODEV% found.
echo NODE=%NODEV% > setup-log.txt

set NEEDINSTALL=0
if not exist node_modules set NEEDINSTALL=1
if not exist node_modules\.installed-lock.json set NEEDINSTALL=1
if exist node_modules\.installed-lock.json (
  fc /b package-lock.json node_modules\.installed-lock.json >nul 2>nul || set NEEDINSTALL=1
)
if "%NEEDINSTALL%"=="1" (
  echo Installing dependencies - this takes 1-3 minutes...
  call npm ci >> setup-log.txt 2>&1
  if errorlevel 1 (
    echo [ERROR] npm ci failed. See setup-log.txt
    echo NPM_CI_FAILED >> setup-log.txt
    pause
    exit /b 1
  )
  copy /y package-lock.json node_modules\.installed-lock.json >nul
  echo NPM_CI_OK >> setup-log.txt
)
echo.
echo Starting the site at http://localhost:3000/iam-grc-ai-security-labs/
echo Keep this window open. Press Ctrl+C to stop the server.
echo START_INVOKED >> setup-log.txt
call npm start
pause
