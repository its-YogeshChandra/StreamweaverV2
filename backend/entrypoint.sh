#!/bin/bash

set -e
echo "Running database migrations..."

diesel migration run --migration-dir ./migrations/
echo "Starting backend server"

exec ./backend
