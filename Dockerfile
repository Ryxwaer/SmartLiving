ARG NODE_VERSION=18.17.1

FROM node:${NODE_VERSION}-slim as base

# These ARGs are for the build stage and can be used to pass values during the build.
ARG SERVER_HOST
ARG NODE_ENV
ARG NUXT_SESSION_PASSWORD

# Set ENV variables that will persist in the running container.
ENV SERVER_HOST=${SERVER_HOST}
ENV NODE_ENV=${NODE_ENV}
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
FROM node:${NODE_VERSION}-slim

# Set the environment variables again in the final stage if needed
# This ensures that they persist in the final container.
ENV SERVER_HOST=${SERVER_HOST}
ENV NODE_ENV=${NODE_ENV}
ENV NUXT_SESSION_PASSWORD=${NUXT_SESSION_PASSWORD}
ENV PORT=8000

WORKDIR /src

COPY --from=build /src/.output /src/.output

CMD [ "node", ".output/server/index.mjs" ]
