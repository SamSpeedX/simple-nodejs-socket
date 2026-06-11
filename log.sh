#!/bin/bash

APP_NAME="cartSocket"

echo "Starting $APP_NAME..."

pm2 start server.js --name $APP_NAME --watch

echo "App started successfully!"
pm2 logs $APP_NAME