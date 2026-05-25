@echo off
cd /d "%~dp0"
echo.
echo === Push Course Funnel to GitHub (public) ===
echo.

gh auth status >nul 2>&1
if errorlevel 1 (
  echo Step 1: Sign in to GitHub
  echo   - A one-time code will appear below
  echo   - Open https://github.com/login/device in your browser
  echo   - Paste the code when asked, then approve access
  echo.
  gh auth login -h github.com -p https -s repo --skip-ssh-key --clipboard
  if errorlevel 1 (
    echo.
    echo Login failed. Try again, or use a token:
    echo   gh auth login -h github.com -p https --with-token
    echo   (paste a token from https://github.com/settings/tokens with repo scope)
    pause
    exit /b 1
  )
)

echo.
echo Step 2: Create public repo and push...
gh repo create course-funnel --public --source=. --remote=origin --push
if errorlevel 1 (
  echo.
  echo If the repo already exists, try:
  echo   git remote add origin https://github.com/YOUR_USERNAME/course-funnel.git
  echo   git push -u origin master
  pause
  exit /b 1
)

echo.
echo Done. Repo is public — change to private in GitHub Settings if you want.
pause
