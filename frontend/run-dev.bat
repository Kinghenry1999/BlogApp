@echo off
REM Run Vite dev server via Node to avoid PowerShell npm.ps1 execution policy issues
cd /d %~dp0
if exist node_modules\vite\bin\vite.js (
  node node_modules\vite\bin\vite.js
) else (
  echo vite not installed locally. Run `npm install` first.
  pause
)
