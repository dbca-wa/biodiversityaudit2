FROM nginxinc/nginx-unprivileged:stable-alpine
LABEL org.opencontainers.image.authors=asi@dbca.wa.gov.au
LABEL org.opencontainers.image.source=https://github.com/dbca-wa/biodiversityaudit2

COPY . /usr/share/nginx/html
