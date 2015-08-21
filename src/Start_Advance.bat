@echo off
Title Ogar-Plus
:start
node index.js
if errorlevel 11 (
    cls
    echo.
    echo.
    echo.
    echo Restart Command Detected!
    echo.
    echo.
    echo.
    goto start;
)
echo.
echo.
pause