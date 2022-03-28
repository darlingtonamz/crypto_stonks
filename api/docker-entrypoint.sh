#!/bin/ash
set -e

if [ "$1" = "start" ]; then
  wait-for-it $DB_HOST:$DB_PORT --timeout=0

  # exec yarn run migration:run
  if [ "$ENVIRONMENT" = "local" ]; then
    if [ -z "${NO_INSTALL}" ]; then
      echo "Installing modules for development..."
      yarn
    fi
    exec yarn run dev
  else
    exec yarn run start
  fi
fi

exec "$@"
