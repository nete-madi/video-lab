from flask import Flask, request, render_template, send_file, Blueprint

import editing.routes
from editing import routes
import os

# TODO: Fix the trimming not working.
# Uploading the video requires the full file path.
# The route /editing/clips/ needs the sliced file path in order for the page to load properly.
# MoviePy also requires the full file path.
# How can we get all three to work?
# https://stackoverflow.com/questions/31725032/can-multiple-webpages-be-implemented-using-a-single-flask-app
# TODO: In editing.html: Configure the payload for image overlay.
# TODO: In index.py: Configure the route for "image" actiontype.
# TODO: In video_utils: Write the image overlay function.

# https://stackoverflow.com/questions/72914568/overlay-image-on-video-using-moviepy
# First: implement frontend for the functionality.
# Next: implement the functionality itself in video_utils.py
# Last: Connect both ends

# Change this to change the saved file path

app = Flask(__name__)  # name for flask app
app.register_blueprint(editing.routes.editing, url_prefix='/editing')


# welcome screen
@app.route("/", methods=['GET'])
def index():
    return render_template('index.html')


@app.route("/goals_and_guidelines")
def goals():
    return render_template('tutorial.html')


if __name__ == "__main__":
    app.run(debug=True)  # runs the app with server, toggle debug on and off
