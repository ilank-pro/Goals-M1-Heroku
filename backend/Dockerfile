# Use Python slim image
FROM python:3.10-slim
WORKDIR /app

# Install backend dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy backend code
COPY . /app

# Set environment variables
ENV FLASK_APP=app
ENV FLASK_ENV=production
ENV PYTHONPATH=/app

# Expose port
EXPOSE 5001

# Run the application
CMD ["python", "run.py"] 