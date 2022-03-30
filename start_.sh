file="logs/$(date -Is).log"
screen -dmS chonker bash -c "node chonker.js >> $file 2>> $file"
