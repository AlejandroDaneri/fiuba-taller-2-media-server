# pull official base image
FROM postgres:12.2-alpine

# run init.sql on init
ADD init.sql /docker-entrypoint-initdb.d
