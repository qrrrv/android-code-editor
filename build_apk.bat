@echo off
SETLOCAL EnableDelayedExpansion

echo [1/5] Checking dependencies...
where pnpm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: pnpm is not installed. Please install it first: https://pnpm.io/installation
    pause
    exit /b 1
)

echo [2/5] Installing dependencies...
call pnpm install

echo [3/5] Prebuilding Android project...
echo This will generate the 'android' folder.
call npx expo prebuild --platform android --no-install

echo [4/5] Building APK...
cd android
call gradlew.bat assembleDebug
if %ERRORLEVEL% neq 0 (
    echo Error: Gradle build failed.
    cd ..
    pause
    exit /b 1
)
cd ..

echo [5/5] Organizing output...
if not exist "builds" mkdir builds
copy "android\app\build\outputs\apk\debug\app-debug.apk" "builds\code-editor-debug.apk" /Y

echo.
echo ======================================================
echo Build Successful!
echo Your APK is located in the 'builds' folder:
echo builds\code-editor-debug.apk
echo ======================================================
echo You can now transfer this file to your phone or run it in an emulator.
pause
