FROM nginxinc/nginx-unprivileged:stable-alpine
MAINTAINER asi@dbca.wa.gov.au
LABEL org.opencontainers.image.source https://github.com/dbca-wa/biodiversityaudit2

COPY . /usr/share/nginx/html
