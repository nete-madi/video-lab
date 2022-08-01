from flask import Flask, request, render_template, send_file
import os

# TODO: fix the broken media upload route

# Change this to change the saved file path
video_save_path = "/clips/"
app = Flask(__name__)  # name for flask app


# welcome screen
@app.route("/", methods=['GET', 'POST', 'PUT'])
def index():
    return render_template('index.html')


@app.route("/goals_and_guidelines")
def goals():
    return render_template('tutorial.html')


@app.route("/editing", methods=['POST', 'GET'])
def edit_video():
    return render_template('editing.html')


@app.route("/editing/clips/<filename>")
def render_clip(filename):
    return send_file(".//" + video_save_path + filename)


# This route is returning ERROR and causing media upload to fail. Figure out why it's failing.
@app.route("/editing/upload", methods=['POST'])
def upload_video():
    # check if video save path exists
    if not os.path.isdir("./clips"):
        os.mkdir("./clips")
    try:
        video_file = request.files['videofile']
        filepath = video_save_path + video_file.filename
        video_file.save(filepath)
    except Exception as e:
        print(e)

    return str(filepath)


if __name__ == "__main__":
    app.run(debug=True)  # runs the app with server, toggle debug on and off
