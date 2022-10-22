from flask import Flask, request, render_template, send_file, Blueprint
from editing.video_utils import *
import os

editing = Blueprint('editing', __name__, template_folder='templates')


@editing.route("/", methods=['GET'])
def edit_video():
    return render_template('editing.html')


@editing.route("/clips/<filename>")
def render_clip(filename):
    import os
    path = os.getcwd() + "\\editing\\clips\\" + filename
    print(path)
    return send_file(path)


@editing.route("/upload", methods=['POST'])
def upload_video():
    # check if video save path exists
    if not os.path.isdir("./editing/clips"):
        os.mkdir("./editing/clips")
    try:
        video_file = request.files['videofile']
        longfilepath = os.getcwd() + "\\editing\\clips\\" + video_file.filename
        filepath = longfilepath[35:]
        print("*** Your filepath is: " + filepath + "***")
        video_file.save(longfilepath)
    except Exception as e:
        print(e)

    return str(filepath)


# Main video editing pipeline
@editing.route('/edit_video/<actiontype>', methods=['POST'])
def editVideo(actiontype):
    if actiontype == "trim":
        try:
            video_file =  request.form['videofile']
            path = os.getcwd() + "\\editing\\" + video_file
            edited_videopath = trim_video(path, int(request.form['trim_start']),
                                         int(request.form['trim_end']))
            return {
                "status": "success",
                "message": "video edit success",
                "edited_videopath": edited_videopath[35:]
            }
        except Exception as e:
            return {
                "status": "error",
                "message": "video edit failure: " + str(e),
            }
    elif actiontype == "image":
        print("image!")


@editing.route('/merged_render', methods=['POST'])
def mergedRender():
    try:
        videoscount = int(request.form['videoscount'])
        if videoscount > 0:
            video_clip_filenames = []
            for i in range(videoscount):
                video_clip_filenames.append(request.form['video' + str(i)])

            final_render_video_path = merge_videos(video_clip_filenames)
            return {
                "status": "success",
                "message": "merged render success",
                "final_render_video_path": final_render_video_path
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
