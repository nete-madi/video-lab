from flask import Flask, render_template
import editing.routes

# TODO: In editing.html: Configure the payload for image overlay. Here is the payload and console output:
# editor_payload
# Object { img_src: undefined, start_time: "0", duration: "10", videofile: "clips\\sample-mp4-file.mp4" }
# editing:317:13
# video edit failure: 400 Bad Request: The browser (or proxy) sent a request that this server could not understand.
# TODO: merged_render editing route is not working

# https://stackoverflow.com/questions/72914568/overlay-image-on-video-using-moviepy

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
