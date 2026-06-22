# syntax=docker/dockerfile:1

# Stage 1: Assemble only web-servable assets into a clean directory.
# This guarantees that repo metadata (Dockerfile, nginx.conf, README, scripts, etc.)
# never lands in the webroot — regardless of .dockerignore contents.
FROM alpine:3.20 AS assets
ARG APP_VERSION=dev
WORKDIR /assets
COPY index.html .
COPY css/ ./css/
COPY data/ ./data/
COPY images/ ./images/
COPY js/ ./js/
COPY templates/ ./templates/
# Inject version at build time so it's available to the frontend
RUN echo "var APP_VERSION = '${APP_VERSION}';" > ./js/version.js

# Stage 2: Production nginx image with only the web assets.
FROM nginxinc/nginx-unprivileged:stable-alpine
LABEL org.opencontainers.image.authors=asi@dbca.wa.gov.au
LABEL org.opencontainers.image.source=https://github.com/dbca-wa/biodiversityaudit2
LABEL org.opencontainers.image.description="WA Biodiversity Portal"
LABEL org.opencontainers.image.licenses=Apache-2.0,MIT
LABEL org.opencontainers.image.title=biodiversityaudit2
LABEL org.opencontainers.image.url="https://github.com/dbca-wa/biodiversityaudit2"
LABEL org.opencontainers.image.version=1.0.7

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=assets /assets/ /usr/share/nginx/html/
