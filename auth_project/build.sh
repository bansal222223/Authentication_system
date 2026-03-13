set -o errexit
npm install --prefix frontend
npm run build --prefix frontend
pip install -r requirements.txt
python manage.py collectstatic --noinput
python manage.py migrate