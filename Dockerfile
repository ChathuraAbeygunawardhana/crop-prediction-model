# Use the official Python image.
# https://hub.docker.com/_/python
FROM python:3.11-slim

# Allow statements and log messages to immediately appear in the Knative logs
ENV PYTHONUNBUFFERED True

# Set the working directory
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
# Since we have a .dockerignore, only necessary files (e.g. models/, api/) will be copied
COPY . ./

# Run the web service on container startup. 
# Cloud Run injects the PORT environment variable.
CMD exec uvicorn api.app:app --host 0.0.0.0 --port ${PORT:-8000}
