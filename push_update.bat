@echo off
setlocal

set GIT_CMD="C:\Program Files\Git\cmd\git.exe"

echo [INFO] Adding all changes...
%GIT_CMD% add .

echo.
echo [INFO] Committing changes...
%GIT_CMD% commit -m "Update: Enhanced Reports page, CSV ingestion, Analytics"

echo.
echo [INFO] Pushing to GitHub...
%GIT_CMD% push origin main

echo.
echo [SUCCESS] Code pushed to GitHub!
pause
