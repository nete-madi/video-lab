from flask import Flask, request, render_template, send_file
from video_utils import *
import os

# TODO: Fix the trimming not working.
# TODO: In editing.html: Configure the payload for image overlay.
# TODO: In index.py: Configure the route for "image" actiontype.
# TODO: In video_utils: Write the image overlay function.

# https://stackoverflow.com/questions/72914568/overlay-image-on-video-using-moviepy
# First: implement frontend for the functionality.
# Next: implement the functionality itself in video_utils.py
# Last: Connect both ends

# Change this to change the saved file path
video_save_path = "\clips\\"
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
    import os
    path = os.getcwd() + video_save_path + filename
    print(path)
    return send_file(path)


@app.route("/editing/upload", methods=['POST'])
def upload_video():
    # check if video save path exists
    if not os.path.isdir("./clips"):
        os.mkdir("./clips")
    try:
        video_file = request.files['videofile']
        filepath = video_save_path + video_file.filename
        print("*** Your filepath is: " + filepath + "***")
        # This line is giving you trouble!
        video_file.save(filepath)
    except Exception as e:
        print(e)

    return str(filepath)


# Main video editing pipeline
@app.route('/editing/edit_video/<actiontype>', methods=['POST'])
def editVideo(actiontype):
    if actiontype == "trim":
        try:
            edited_videopath = trimVideo(request.form['videofile'], int(request.form['trim_start']),
                                         int(request.form['trim_end']))
            return {
                "status": "success",
                "message": "video edit success",
                "edited_videopath": edited_videopath
            }
        except Exception as e:
            return {
                "status": "error",
                "message": "video edit failure: " + str(e),
            }
    elif actiontype == "image":
        print("image!")


@app.route('/editing/merged_render', methods=['POST'])
def mergedRender():
    try:
        videoscount = int(request.form['videoscount'])
        if videoscount > 0:
            videoclip_filenames = []
            for i in range(videoscount):
                videoclip_filenames.append(request.form['video' + str(i)])

            finalrender_videopath = mergeVideos(videoclip_filenames)
            return {
                "status": "success",
                "message": "merged render success",
                "finalrender_videopath": finalrender_videopath
            }
        else:
            return {
                "status": "error",
                "message": "merged render error. Invalid videos count"
            }

    except Exception as e:
        return {
            "status": "error",
            "message": "video merge failure: " + str(e),
        }


if __name__ == "__main__":
    app.run(debug=True)  # runs the app with server, toggle debug on and off
