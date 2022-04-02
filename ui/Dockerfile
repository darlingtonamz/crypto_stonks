# Local environments stop at this stage
FROM node:15.7.0-buster-slim as base-stage

ENV WORKDIR /app

WORKDIR $WORKDIR

RUN apt-get update && apt-get install -y \
    wget \
    python3 \
    make \
    g++ \
    git \
    openssh-client \
 && rm -rf /var/lib/apt/lists/*

COPY package.json yarn.lock ./

# COPY .yarn .yarn

RUN yarn --immutable

COPY docker-entrypoint.sh /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]

RUN chmod +x /docker-entrypoint.sh

CMD ["start"]

COPY . .