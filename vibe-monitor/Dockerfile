FROM python:3.11-slim

WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY app.py .
COPY simulate_traffic.py .
COPY test_setup.py .
COPY container_test.py .
COPY container_simulate_traffic.py .

# Install additional dependencies for scripts
RUN pip install requests

# Expose port
EXPOSE 8000

# Run the application
CMD ["python", "app.py"]
