FROM python:3.12-slim

WORKDIR /app

# Install system dependencies if needed (e.g., for some python packages)
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Default command (will be overridden by docker-compose for celery)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
