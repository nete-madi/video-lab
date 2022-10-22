from flask import Flask, render_template
import editing.routes

# TODO: In editing.html: Configure the payload for image overlay.
# TODO: In index.py: Configure the route for "image" actiontype.
# TODO: In video_utils: Write the image overlay function.
# TODO: merged_render editing route is not working

# https://stackoverflow.com/questions/72914568/overlay-image-on-video-using-moviepy
# First: implement frontend for the functionality.
# Next: implement the functionality itself in video_utils.py
# Last: Connect both ends

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
