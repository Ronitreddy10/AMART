@echo off
setlocal

REM Try standard installation path first
set GIT_CMD="C:\Program Files\Git\cmd\git.exe"

REM Check if it exists and works
%GIT_CMD% --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARN] Git not found at default location. Trying system PATH...
    set GIT_CMD=git
) else (
    echo [INFO] Found Git at default location.
)

echo [INFO] Using Git command: %GIT_CMD%
echo.

echo [INFO] Initializing Git repository...
%GIT_CMD% init

echo.
echo [INFO] Configuring Git Identity (Local)...
%GIT_CMD% config user.email "user@amart.local"
%GIT_CMD% config user.name "AMART User"

echo.
echo [INFO] Adding files...
%GIT_CMD% add .

echo.
echo [INFO] Committing files...
%GIT_CMD% commit -m "Initial commit: AMART-RAG Red Team Suite"

echo.
echo [INFO] Renaming branch to main...
%GIT_CMD% branch -M main

echo.
echo [INFO] Adding remote origin...
%GIT_CMD% remote add origin https://github.com/Ronitreddy10/AMART.git

echo.
echo [INFO] Pushing to GitHub...
%GIT_CMD% push -u origin main

echo.
echo [SUCCESS] Done!
pause
