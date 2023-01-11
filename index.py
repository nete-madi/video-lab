# TODO: Drag and drop the circle onto the video.
# Get the position of the circle from wherever you dropped it
# and re-render your video with the circle in the position you dragged it on.
# You may have to re-implement some things.
# See here: https://www.openshot.org/blog/2008/09/12/drag-drop-with-gtk-and-python/
# https://dataanalyticsireland.ie/2021/12/13/how-to-pass-a-javascript-variable-to-python-using-json/
from flask import Flask, render_template, send_from_directory
import editing.routes
import os

app = Flask(__name__)  # name for flask app
app.register_blueprint(editing.routes.editing, url_prefix='/editing')


# welcome screen
@app.route("/", methods=['GET'])
def index():
    return render_template('index.html')


@app.route("/img/favicon.ico", methods=['GET'])
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'), 'favicon.ico', mimetype='image/vnd.microsoft.icon')


@app.route("/goals_and_guidelines")
def goals():
    return render_template('tutorial.html')


if __name__ == "__main__":
    app.run(debug=True)  # runs the app with server, toggle debug on and off
