@echo off
chcp 65001 >nul
title GLM Mapping Proxy
cd /d "%~dp0"
node proxy.js
pause
