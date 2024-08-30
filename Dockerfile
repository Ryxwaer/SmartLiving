ARG NODE_VERSION=18.17.1

FROM node:${NODE_VERSION}-slim as base

ARG SERVER_HOST
ARG NODE_ENV

ENV SERVER_HOST=${SERVER_HOST}
ENV NODE_ENV=${NODE_ENV}

WORKDIR /src

# Build
FROM base as build

COPY --link package*.json .
RUN npm install --production=false

COPY --link . .

RUN npm run build
RUN npm prune

# Run
FROM base

ENV PORT=8000

COPY --from=build /src/.output /src/.output

CMD [ "node", ".output/server/index.mjs" ]
