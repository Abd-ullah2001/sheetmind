#!/bin/bash
source venv/bin/activate
celery -A app.tasks.celery_app worker --loglevel=info
