@echo off
Title Ogar-Plus

color 0B

:START
node index.js
if errorlevel 11 (
    cls
    echo.
    echo Restarting!
    echo.
    echo.
    GOTO START;
)
if errorlevel 1 (
	if not errorlevel 2 (
		color 0A
		GOTO END;
	)
)
if errorlevel 2 (
	if not errorlevel 3 (
		color 0C
		GOTO END
	)
)
:END
echo.
echo.
pause