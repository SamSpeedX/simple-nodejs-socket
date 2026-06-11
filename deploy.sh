#!/bin/bash

APP_NAME="cartSocket"

echo "Checking if $APP_NAME is already running..."

pm2 describe $APP_NAME > /dev/null

if [ $? -eq 0 ]; then
    echo "Restarting existing process..."
    pm2 restart $APP_NAME
else
    echo "Starting new process..."
    pm2 start server.js --name $APP_NAME --watch
fi

echo "Done."