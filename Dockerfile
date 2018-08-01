FROM httpd:2.4.34-alpine
MAINTAINER asi@dbca.wa.gov.au

COPY . /usr/local/apache2/htdocs/
HEALTHCHECK --interval=10s --timeout=5s --start-period=5s --retries=5 CMD ["wget", "-q", "-O", "-", "http://localhost/"]
