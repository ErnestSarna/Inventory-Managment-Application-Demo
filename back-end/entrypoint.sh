#!/bin/bash
set -e

echo "Making migrations for api..."
python manage.py makemigrations api --noinput

echo "Applying migrations..."
python manage.py migrate --noinput

echo "Starting server..."
python manage.py runserver 0.0.0.0:8000