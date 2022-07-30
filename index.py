from flask import Flask, request, render_template, send_file
import os


# Change this to change the saved file path
video_save_path = "clips/"

app = Flask(__name__)  # name for flask app


# welcome screen
@app.route("/", methods=['GET', 'POST', 'PUT'])
def index():
    return render_template('index.html', )


@app.route("/goals_and_guidelines")
def goals():
    return render_template('tutorial.html')


@app.route("/editing", methods=['POST', 'GET'])
def edit_video():
    return render_template('editing.html')


@app.route("/editing/clips/<filename>")
def render_clip(filename):
    return send_file(video_save_path + filename)


@app.route("/editing/upload", methods=['POST'])
def upload_video():
    # check if video savepath exists
    if not os.path.isdir("./clips"):
        os.mkdir("./clips")
    try:
        video_file = request.files['video_file']
        filepath = video_save_path + video_file.filename
        video_file.save(filepath)
    except:
        return "ERROR"

    return str(filepath)


if __name__ == "__main__":
    app.run(debug=True)  # runs the app with server, toggle debug on and off
