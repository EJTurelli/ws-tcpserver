#!/bin/bash
#

help () {
    echo Uso: test.sh req_id
    echo 
}

send () {
    curl -v -i -k --request GET --url "http://localhost:3000/$1" -A "Mozilla/5.0 (Linux; Android 6.0.1; RedMi Note 5 Build/RB3N5C; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/68.0.3440.91 Mobile Safari/537.36" -o "out/$1.txt"
}


set +v
len=$#
if [ $len -eq 0 ]; then 
    help
else 
    send $1
fi