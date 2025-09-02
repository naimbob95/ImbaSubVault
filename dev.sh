#!/bin/bash

# Script to manage docker-compose with development config

case "$1" in
  up)
    echo "Starting docker-compose (dev) with build..."
    docker-compose -f docker-compose.dev.yml up --build -d
    ;;
  down)
    echo "Stopping docker-compose (dev)..."
    docker-compose -f docker-compose.dev.yml down
    ;;
  *)
    echo "Usage: $0 {up|down}"
    exit 1
    ;;
esac
