# syntax=docker/dockerfile:1

# Stage 1: Install the browser libraries and copy them into js/lib/ and css/.
# There's no bundling - RequireJS loads them at runtime.
FROM oven/bun:1-alpine AS deps
WORKDIR /src
# The bun alpine image has no bash, which sync-deps.sh needs.
RUN apk add --no-cache bash
# Manifests first, so the install layer caches when only app code changes.
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY scripts/sync-deps.sh ./scripts/
COPY css/ ./css/
COPY js/ ./js/
RUN bash scripts/sync-deps.sh

# Stage 2: Assemble only web-servable assets into a clean directory, so repo
# metadata (Dockerfile, nginx.conf, README, scripts) can't end up in the webroot
# whatever .dockerignore says. css/ and js/ come from the deps stage; node_modules/
# stays behind in /src.
FROM alpine:3.20 AS assets
ARG APP_VERSION=dev
WORKDIR /assets
COPY index.html .
COPY --from=deps /src/css/ ./css/
COPY --from=deps /src/js/ ./js/
COPY data/ ./data/
COPY images/ ./images/
COPY templates/ ./templates/
# Inject version at build time so it's available to the frontend
RUN echo "var APP_VERSION = '${APP_VERSION}';" > ./js/version.js
# config.js always require()s config.local.js as an optional override. Ship an
# empty AMD module so the request resolves to real JavaScript with a 200 instead
# of falling through to the SPA's index.html - which the browser refuses to
# execute as a script (text/html + nosniff) and logs a MIME type error for on
# every page load. Overrides can replace this file per environment.
RUN echo "define({});" > ./js/config.local.js

# Stage 3: Production nginx image with only the web assets.
FROM nginxinc/nginx-unprivileged:stable-alpine
LABEL org.opencontainers.image.authors=asi@dbca.wa.gov.au
LABEL org.opencontainers.image.source=https://github.com/dbca-wa/biodiversityaudit2
LABEL org.opencontainers.image.description="WA Biodiversity Portal"
LABEL org.opencontainers.image.licenses=Apache-2.0,MIT
LABEL org.opencontainers.image.title=biodiversityaudit2
LABEL org.opencontainers.image.url="https://github.com/dbca-wa/biodiversityaudit2"
LABEL org.opencontainers.image.version=2.0.4

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=assets /assets/ /usr/share/nginx/html/
