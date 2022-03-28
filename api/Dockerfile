FROM node:lts-alpine3.11

RUN apk add --no-cache \
    shadow \
    bash

ENV WORKDIR /app

ENV PROJECT_USER node

WORKDIR ${WORKDIR}

ENV GOSU_VERSION 1.11

RUN wget -O /usr/local/bin/gosu \
    https://github.com/tianon/gosu/releases/download/$GOSU_VERSION/gosu-amd64 \
 && chmod +x /usr/local/bin/gosu

ENV WAIT_FOR_IT_VERSION 55c54a5

RUN wget -O /usr/local/bin/wait-for-it \
    https://raw.githubusercontent.com/vishnubob/wait-for-it/$WAIT_FOR_IT_VERSION/wait-for-it.sh \
 && chmod +x /usr/local/bin/wait-for-it

COPY package.json yarn.lock ./

RUN chown ${PROJECT_USER} ${WORKDIR} \
 && gosu ${PROJECT_USER} yarn --pure-lockfile

COPY docker-entrypoint.sh /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]

COPY --chown=node:node . .

RUN yarn add typescript && yarn run build \
 && chmod +x /docker-entrypoint.sh \
 && chown ${PROJECT_USER}:${PROJECT_USER} /docker-entrypoint.sh

CMD ["start"]
