@echo off
setlocal EnableExtensions
title EMAN EWAIS Labs - publish to GitHub
cd /d "%~dp0"
set REPO_URL=https://github.com/emansalahmof-lang/iam-grc-ai-security-labs.git
echo ==========================================================
echo  Publish EMAN EWAIS Labs to GitHub
echo  Target: %REPO_URL%
echo ==========================================================
echo.
echo START %DATE% %TIME% > publish-log.txt

where git >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Git is not installed. Install it with:
  echo     winget install --id Git.Git -e
  echo GIT_MISSING >> publish-log.txt
  pause & exit /b 1
)

if not exist ".git" (
  git init -b main >> publish-log.txt 2>&1
  echo Created a new local Git repository.
)

rem --- commit identity (asked once, stored only for this repository) ---
for /f "delims=" %%n in ('git config user.name') do set GN=%%n
for /f "delims=" %%e in ('git config user.email') do set GE=%%e
if not defined GN (
  set /p GN=Your name for commits ^(e.g. Eman Ewais^): 
  call git config user.name "%%GN%%"
)
if not defined GE (
  echo Tip: to keep your email private, use the "noreply" address shown in
  echo GitHub ^> Settings ^> Emails.
  set /p GE=Email for commits: 
  call git config user.email "%%GE%%"
)

rem --- safety check: never publish local secrets or logs ---
git add -A >> publish-log.txt 2>&1
git diff --cached --name-only | findstr /i /r "\.env \.pem \.key setup-log publish-log OWNER_REVIEW node_modules" >nul
if not errorlevel 1 (
  echo [STOP] A file that should stay private was staged. Nothing was pushed.
  git diff --cached --name-only | findstr /i /r "\.env \.pem \.key setup-log publish-log OWNER_REVIEW node_modules"
  echo SECRET_GUARD_STOP >> publish-log.txt
  pause & exit /b 1
)

git diff --cached --quiet
if errorlevel 1 (
  git commit -m "Publish EMAN EWAIS Labs v0.7.0" >> publish-log.txt 2>&1
  echo Committed changes.
) else (
  echo No new changes to commit.
)

git remote get-url origin >nul 2>nul
if errorlevel 1 git remote add origin %REPO_URL%

echo.
echo Pushing to GitHub... a browser window may open to sign in to GitHub.
echo (Sign in yourself - this script never sees your password.)
git push -u origin main >> publish-log.txt 2>&1
if errorlevel 1 (
  echo [ERROR] Push failed. Common causes:
  echo   - The repository does not exist yet on GitHub ^(create it first, empty^)
  echo   - You cancelled the GitHub sign-in
  echo See publish-log.txt for details.
  echo PUSH_FAILED >> publish-log.txt
  pause & exit /b 1
)
echo PUSH_OK >> publish-log.txt
echo.
echo SUCCESS. Next:
echo  1. GitHub repo ^> Actions: wait for "Deploy to GitHub Pages" to turn green.
echo  2. Site: https://emansalahmof-lang.github.io/iam-grc-ai-security-labs/
pause
