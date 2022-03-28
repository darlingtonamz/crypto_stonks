# WIP - Please ignore
#!/usr/bin/env sh
# This is meant to be run with the main Makefile and in a Bitbucket pipeline,
# but should work just as well in a local shell as long as the necessary
# environment variables exist (refer to `docker-compose.test.yml`).
set -e

VERBOSE='false'
MARKERS=

while getopts "vm:" opt
do
  case "$opt" in
    v)
      VERBOSE='true'
      ;;
    m)
      MARKERS="$OPTARG"
      ;;
  esac
done

shift $((OPTIND-1))

RUNNING=$(docker ps -q --filter name="stonk-platform-be-api-${env}")

if [ -z "$RUNNING" ]; then
  make run-d ${env}
fi

CMD="wait-for-it localhost:\$PORT --timeout=0"

if [ "$CLEAN" = "true" ]; then
  CMD="$CMD && yarn prebuild && yarn run build"
fi

CMD="$CMD && VERBOSE=$VERBOSE MARKERS=\"$MARKERS\" yarn test $@"

echo "Running: $CMD"

docker exec -t "stonk-platform-be-api-${env}" ash -c "$CMD"

exit $?