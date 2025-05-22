#!/bin/bash

# Find MongoDB PID and kill it
MONGO_PID=$(pgrep mongod)
if [ -n "$MONGO_PID" ]; then
  kill $MONGO_PID
  echo "MongoDB stopped successfully."
else
  echo "MongoDB is not running."
fi