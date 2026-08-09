@echo off
set "PATH=%~dp0node-v20.11.1-win-x64;%PATH%"
cd /d "%~dp0frontend"
call npm run build
echo Syncing dist to backend static...
xcopy /E /Y /I "%~dp0frontend\dist" "%~dp0backend\app\static"
