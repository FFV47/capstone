#!/usr/bin/env bash

shopt -s extglob
rm -rf solution/migrations/!(__init__.py)
rm -f db.sqlite3
echo "Migrations and DB deleted"

source .venv/bin/activate
echo "Migrating..."
python manage.py makemigrations solution
python manage.py migrate

echo "Copying fill DB migration"
cp 0002_fill_db.py solution/migrations/

echo "Migrating..."
python manage.py migrate
echo "Done"