@ECHO OFF

ECHO Launching Flask application...

set FLASK_APP=index.py

set FLASK_DEBUG=1

python -m flask run