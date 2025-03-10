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

# Use Heroku's PORT environment variable
ENV PORT=5001

# Expose port
EXPOSE $PORT

# Run the application
CMD python init_db.py && python run.py 