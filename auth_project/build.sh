#!/usr/bin/env bash

set -o errexit

# React build
npm install --prefix frontend
npm run build --prefix frontend

# Python dependencies
pip install -r requirements.txt

# Django
python manage.py collectstatic --noinput
python manage.py migrate