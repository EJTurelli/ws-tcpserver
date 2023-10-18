#!/bin/bash
#

for a in {1..10} 
do 
    sh ./test.sh $a &
done
