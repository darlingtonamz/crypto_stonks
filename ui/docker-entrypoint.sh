#!/bin/bash

set -e

if [ "$1" = "start" ]; then
  if [ "$VUE_APP_ENVIRONMENT" = "local" ] || [ "$VUE_APP_ENVIRONMENT" = "test" ]; then
    # echo "Installing modules for development..."
    # yarn up shared-ui@https://bitbucket.org/evenito/shared-ui.git
    # if [ -d /shared-ui ]; then
    #   cd /shared-ui && yarn && cd /app
    # fi
    # exec yarn serve
    # exec yarn run dev --host 0.0.0.0:3000
    exec yarn run dev --host
  else
    cd /usr/share/nginx/html
    cp ops/config/$CONFIG.js config.js
    cd /
    confd -onetime -backend env -confdir='/srv/confd'
    exec nginx
  fi
fi

exec "$@"