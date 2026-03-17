@echo off

call npm install

echo Starting Hospital App...
start http://localhost:5173/
call npm run dev
pause
Agent            