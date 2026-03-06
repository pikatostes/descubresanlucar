@echo off
title DescubreSanlucar - Dev Server
echo.
echo  Iniciando DescubreSanlucar...
echo.

start /B "" npm run dev > nul 2>&1
start /B "" php artisan serve --host=0.0.0.0 --port=8000 > nul 2>&1

echo  Servidores iniciados en segundo plano:
echo   - Laravel: http://localhost:8000
echo   - Vite:    http://localhost:5173
echo.
pause