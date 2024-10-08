ARG NODE_VERSION=18.17.1

FROM node:${NODE_VERSION}-slim as base

ARG SERVER_HOST
ARG NUXT_SESSION_PASSWORD

ENV SERVER_HOST=${SERVER_HOST}
ENV NODE_ENV=production
ENV NUXT_SESSION_PASSWORD=${NUXT_SESSION_PASSWORD}

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

ENV PORT=3000

COPY --from=build /src/.output /src/.output
# Optional, only needed if you rely on unbundled dependencies
# COPY --from=build /src/node_modules /src/node_modules

CMD [ "node", ".output/server/index.mjs" ]