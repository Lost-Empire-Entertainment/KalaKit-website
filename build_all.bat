@echo off

set "PROJECT_ROOT=%~dp0"
cd "%PROJECT_ROOT%"

set "RELEASE_TARGET=%PROJECT_ROOT%\build-release"
set "DEBUG_TARGET=%PROJECT_ROOT%\build-debug"

set "CONTENT_NAME=content"
set "CONTENT_ORIGIN=%PROJECT_ROOT%\server\%CONTENT_NAME%"

set "CLOUDFLARED_NAME=cloudflared.exe"
set "CLOUDFLARED_ORIGIN=%PROJECT_ROOT%\external\cloudflared\%CLOUDFLARED_NAME%"

set "OPENSSL_DLL1=libcrypto-3-x64.dll"
set "OPENSSL_DLL2=libssl-3-x64.dll"
set "OPENSSL_DLL1_RELEASE_ORIGIN=%PROJECT_ROOT%\external\OpenSSL\release\%OPENSSL_DLL1%"
set "OPENSSL_DLL2_RELEASE_ORIGIN=%PROJECT_ROOT%\external\OpenSSL\release\%OPENSSL_DLL2%"
set "OPENSSL_DLL1_DEBUG_ORIGIN=%PROJECT_ROOT%\external\OpenSSL\debug\%OPENSSL_DLL1%"
set "OPENSSL_DLL2_DEBUG_ORIGIN=%PROJECT_ROOT%\external\OpenSSL\debug\%OPENSSL_DLL2%"

set "EXT_NAME=whitelisted-extensions.txt"
set "EXT_ORIGIN=%PROJECT_ROOT%\server\%EXT_NAME%"

set "EXT_NAME=whitelisted-extensions.txt"
set "EXT_ORIGIN=%PROJECT_ROOT%\server\%EXT_NAME%"

set "WIP_NAME=whitelisted-ips.txt"
set "WIP_ORIGIN=%PROJECT_ROOT%\server\%WIP_NAME%"

set "BIP_NAME=banned-ips.txt"
set "BIP_ORIGIN=%PROJECT_ROOT%\server\%BIP_NAME%"

set "BKW_NAME=blacklisted-keywords.txt"
set "BKW_ORIGIN=%PROJECT_ROOT%\server\%BKW_NAME%"

set "EMA_NAME=email-sender-data.txt"
set "EMA_ORIGIN=%PROJECT_ROOT%\server\%EMA_NAME%"

if not exist "%CONTENT_ORIGIN%" (
	echo Failed to find content folder!
	pause
	exit /b 1
)

if not exist "%CLOUDFLARED_ORIGIN%" (
	echo Failed to find cloudflared.exe!
	pause
	exit /b 1
)

if not exist "%OPENSSL_DLL1_RELEASE_ORIGIN%" (
	echo Failed to find openssl release dll 1!
	pause
	exit /b 1
)
if not exist "%OPENSSL_DLL2_RELEASE_ORIGIN%" (
	echo Failed to find openssl release dll 2!
	pause
	exit /b 1
)
if not exist "%OPENSSL_DLL1_DEBUG_ORIGIN%" (
	echo Failed to find openssl debug dll 1!
	pause
	exit /b 1
)
if not exist "%OPENSSL_DLL2_DEBUG_ORIGIN%" (
	echo Failed to find openssl debug dll 2!
	pause
	exit /b 1
)

if not exist "%EXT_ORIGIN%" (
	echo Failed to find whitelisted-extensions.txt!
	pause
	exit /b 1
)

if not exist "%WIP_ORIGIN%" (
	echo Failed to find whitelisted-ips.txt!
	pause
	exit /b 1
)

if not exist "%BIP_ORIGIN%" (
	echo Failed to find banned-ips.txt!
	pause
	exit /b 1
)

if not exist "%BKW_ORIGIN%" (
	echo Failed to find blacklisted-keywords.txt!
	pause
	exit /b 1
)

if not exist "%EMA_ORIGIN%" (
	echo Failed to find email-sender-data.txt!
	pause
	exit /b 1
)

set "BUILD_DEBUG=%PROJECT_ROOT%build-debug"
if exist "%BUILD_DEBUG%" (
	rmdir /s /q "%BUILD_DEBUG%"
	echo Deleted old debug build folder.
)

set "BUILD_RELEASE=%PROJECT_ROOT%build-release"
if exist "%BUILD_RELEASE%" (
	rmdir /s /q "%BUILD_RELEASE%"
	echo Deleted old release build folder.
)

echo.
echo ========================================
echo.
echo Starting "Build debug"
echo.
echo ========================================
echo.

cmd /c "build_debug.bat"
if errorlevel 1 (
    echo [ERROR] Failed to build in debug mode...
    pause
    exit /b 1
)

echo.
echo ========================================
echo.
echo Starting "Build release"
echo.
echo ========================================
echo.

cmd /c "build_release.bat"
if errorlevel 1 (
    echo [ERROR] Failed to build in release mode...
    pause
    exit /b 1
)

echo.
echo ========================================
echo.
echo Copying server files
echo.
echo ========================================
echo.

:: Copy content folder
xcopy "%CONTENT_ORIGIN%" "%RELEASE_TARGET%\%CONTENT_NAME%" /E /I /Y >nul
xcopy "%CONTENT_ORIGIN%" "%DEBUG_TARGET%\%CONTENT_NAME%" /E /I /Y >nul
echo Copied server content files to targets.

:: Copy cloudflared
copy /Y "%CLOUDFLARED_ORIGIN%" "%RELEASE_TARGET%\%CLOUDFLARED_NAME%"
copy /Y "%CLOUDFLARED_ORIGIN%" "%DEBUG_TARGET%\%CLOUDFLARED_NAME%"
echo Copied cloudflared.exe to targets.

:: Copy openssl dlls
copy /Y "%OPENSSL_DLL1_RELEASE_ORIGIN%" "%RELEASE_TARGET%\%OPENSSL_DLL1%"
copy /Y "%OPENSSL_DLL1_DEBUG_ORIGIN%" "%DEBUG_TARGET%\%OPENSSL_DLL1%"
copy /Y "%OPENSSL_DLL2_RELEASE_ORIGIN%" "%RELEASE_TARGET%\%OPENSSL_DLL2%"
copy /Y "%OPENSSL_DLL2_DEBUG_ORIGIN%" "%DEBUG_TARGET%\%OPENSSL_DLL2%"
echo Copied openssl dlls to targets.

:: Copy whitelisted extensions
copy /Y "%EXT_ORIGIN%" "%RELEASE_TARGET%\%EXT_NAME%"
copy /Y "%EXT_ORIGIN%" "%DEBUG_TARGET%\%EXT_NAME%"
echo Copied whitelisted-extensions.txt to targets.

:: Copy whitelisted ips
copy /Y "%WIP_ORIGIN%" "%RELEASE_TARGET%\%WIP_NAME%"
copy /Y "%WIP_ORIGIN%" "%DEBUG_TARGET%\%WIP_NAME%"
echo Copied whitelisted-ips.txt to targets.

:: Copy banned ips
copy /Y "%BIP_ORIGIN%" "%RELEASE_TARGET%\%BIP_NAME%"
copy /Y "%BIP_ORIGIN%" "%DEBUG_TARGET%\%BIP_NAME%"
echo Copied banned-ips.txt to targets.

:: Copy blacklisted keywords
copy /Y "%BKW_ORIGIN%" "%RELEASE_TARGET%\%BKW_NAME%"
copy /Y "%BKW_ORIGIN%" "%DEBUG_TARGET%\%BKW_NAME%"
echo Copied blacklisted-keywords.txt to targets.

:: Copy email sender data
copy /Y "%EMA_ORIGIN%" "%RELEASE_TARGET%\%EMA_NAME%"
copy /Y "%EMA_ORIGIN%" "%DEBUG_TARGET%\%EMA_NAME%"
echo Copied email-sender-data.txt to targets.

echo.
echo ========================================
echo.
echo Finished building in debug and release mode!

pause
exit /b 0