FROM httpd:2.4.34-alpine
MAINTAINER asi@dbca.wa.gov.au

COPY . /usr/local/apache2/htdocs/
