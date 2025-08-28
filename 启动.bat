@echo off
chcp 65001 >nul
echo 正在启动MD转XMind思维导图工具...
echo.

REM 检查是否安装了Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未检测到Node.js，请先安装Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

REM 检查是否安装了依赖
if not exist "node_modules" (
    echo 正在安装依赖...
    npm install
    if %errorlevel% neq 0 (
        echo 依赖安装失败，请检查网络连接
        pause
        exit /b 1
    )
)

REM 启动开发服务器
echo 正在启动开发服务器...
echo 服务器启动后将自动打开浏览器
echo 如果没有自动打开，请访问: http://localhost:3000
echo.
npm run dev

pause