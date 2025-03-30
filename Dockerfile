# syntax=docker/dockerfile:1
FROM nginxinc/nginx-unprivileged:stable-alpine
LABEL org.opencontainers.image.authors=asi@dbca.wa.gov.au
LABEL org.opencontainers.image.source=https://github.com/dbca-wa/biodiversityaudit2
LABEL org.opencontainers.image.description="WA Biodiversity Portal"
LABEL org.opencontainers.image.licenses=Apache-2.0,MIT
LABEL org.opencontainers.image.title=biodiversityaudit2
LABEL org.opencontainers.image.url="https://github.com/dbca-wa/biodiversityaudit2"
LABEL org.opencontainers.image.version=1.0.1

COPY . /usr/share/nginx/html
