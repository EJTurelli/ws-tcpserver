@echo off
IF [%1]==[] goto :help

curl -v -i -k --request GET --url "http://localhost:3000/%1" -A "Mozilla/5.0 (Linux; Android 6.0.1; RedMi Note 5 Build/RB3N5C; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/68.0.3440.91 Mobile Safari/537.36" -o "out/%1.txt"
exit

:help
echo Uso: test.bat req_id
echo:

pause
exit