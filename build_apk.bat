@echo off
SETLOCAL EnableDelayedExpansion

echo [1/5] Checking dependencies...

:: Check for Node.js
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: Node.js is not installed. Please install it from https://nodejs.org/
    pause
    exit /b 1
)

:: Check for pnpm and install if missing
where pnpm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo pnpm not found. Attempting to install pnpm via npm...
    call npm install -g pnpm
    if %ERRORLEVEL% neq 0 (
        echo Failed to install pnpm automatically. 
        echo Please run 'npm install -g pnpm' manually in a terminal with Administrator rights.
        pause
        exit /b 1
    )
    echo pnpm installed successfully!
)

echo [2/5] Installing dependencies...
call pnpm install

echo [3/5] Prebuilding Android project...
echo This will generate the 'android' folder.
call npx expo prebuild --platform android --no-install

echo [4/5] Building APK...
if not exist "android" (
    echo Error: 'android' directory was not created. Prebuild failed.
    pause
    exit /b 1
)

cd android
:: Check if gradlew exists
if not exist "gradlew.bat" (
    echo Error: gradlew.bat not found in android folder.
    cd ..
    pause
    exit /b 1
)

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
if exist "android\app\build\outputs\apk\debug\app-debug.apk" (
    copy "android\app\build\outputs\apk\debug\app-debug.apk" "builds\code-editor-debug.apk" /Y
    echo.
    echo ======================================================
    echo Build Successful!
    echo Your APK is located in the 'builds' folder:
    echo builds\code-editor-debug.apk
    echo ======================================================
) else (
    echo Error: APK file was not found after build.
)

pause
