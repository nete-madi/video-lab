@ECHO OFF

ECHO Launching Flask application...

set FLASK_APP=index.py

set FLASK_DEBUG=0

set FLASK_ENV=development

python -m flask run