
# Use a lightweight Python base image
FROM python:3.12-slim

# Prevent Python from creating cache files
ENV PYTHONDONTWRITEBYTECODE=1

# Display Python logs immediately
ENV PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /app

# Copy dependencies first for better caching
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Create a non-root application user
RUN addgroup --system app && adduser --system --ingroup app app

# Copy application files with correct ownership
COPY --chown=app:app . .

# Run application without root privileges
USER app

# Application port
EXPOSE 5000

# Start production server
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
