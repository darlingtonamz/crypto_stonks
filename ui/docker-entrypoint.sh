#!/bin/bash

set -e

if [ "$1" = "start" ]; then
  if [ "$VUE_APP_ENVIRONMENT" = "local" ] || [ "$VUE_APP_ENVIRONMENT" = "test" ]; then
    exec yarn run dev --host
  # else
    # no config for prod yet
  fi
fi

exec "$@"