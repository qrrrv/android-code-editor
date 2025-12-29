@echo off
SETLOCAL EnableDelayedExpansion

echo ==========================================
echo    CHECKING YOUR BUILD ENVIRONMENT
echo ==========================================
echo.

set "READY=yes"

:: Check Node.js
echo [1] Checking Node.js...
where node >nul 2>nul
if %ERRORLEVEL% equ 0 (
    for /f "tokens=*" %%i in ('node -v') do set NODE_VER=%%i
    echo     OK: Node.js is installed (!NODE_VER!)
) else (
    echo     MISSING: Node.js is not installed.
    echo     ACTION: Download and install from https://nodejs.org/ (LTS version recommended)
    set "READY=no"
)

:: Check pnpm
echo.
echo [2] Checking pnpm...
where pnpm >nul 2>nul
if %ERRORLEVEL% equ 0 (
    for /f "tokens=*" %%i in ('pnpm -v') do set PNPM_VER=%%i
    echo     OK: pnpm is installed (!PNPM_VER!)
) else (
    echo     MISSING: pnpm is not installed.
    echo     ACTION: Run 'npm install -g pnpm' after installing Node.js
    set "READY=no"
)

:: Check Java
echo.
echo [3] Checking Java (JDK)...
where java >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo     OK: Java is installed.
) else (
    echo     MISSING: Java is not installed.
    echo     ACTION: Install JDK 17 from https://adoptium.net/
    set "READY=no"
)

:: Check Android SDK
echo.
echo [4] Checking Android SDK...
if defined ANDROID_HOME (
    if exist "%ANDROID_HOME%" (
        echo     OK: ANDROID_HOME is set to %ANDROID_HOME%
    ) else (
        echo     WARNING: ANDROID_HOME is set but path does not exist.
        set "READY=no"
    )
) else (
    echo     MISSING: ANDROID_HOME environment variable is not set.
    echo     ACTION: Install Android Studio and set ANDROID_HOME variable.
    set "READY=no"
)

echo.
echo ==========================================
if "%READY%"=="yes" (
    echo  STATUS: EVERYTHING IS READY! 
    echo  You can now run build_apk.bat
) else (
    echo  STATUS: SOME COMPONENTS ARE MISSING.
    echo  Please follow the "ACTION" steps above.
)
echo ==========================================
pause
