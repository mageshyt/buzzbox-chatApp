# Use the official PostgreSQL image from Docker Hub
FROM postgres:latest

# Set the environment variables
ENV POSTGRES_DB buzzboxdb
ENV POSTGRES_USER buzzboxuser
ENV POSTGRES_PASSWORD bablu007

# Expose the default PostgreSQL port
EXPOSE 5432
