from flask import request, render_template, send_file, Blueprint, session
from video_utils import *
import os

editing = Blueprint('editing', __name__, template_folder='templates')
fullpath = os.getcwd()


@editing.route("/", methods=['GET'])
def edit_video():
    return render_template('editing.html')


@editing.route("/static/video.js", methods=['GET'])
def vue_file():
    return send_file("\\static\\" + "video.js")


@editing.route("/static/style.css", methods=['GET'])
def css():
    return send_file(fullpath + "static\\" + "style.css")


@editing.route("/clips/<filename>")
def render_clip(filename):
    path = fullpath + "\\clips\\" + filename
    print(path)
    return send_file(path)


@editing.route("/img/<filename>")
def render_img(filename):
    path = fullpath + "\\img\\" + filename
    print(path)
    session['img_file'] = path
    return send_file(session.get('img_file', str))


@editing.route("/upload", methods=['POST'])
def upload_video():
    # check if video save path exists
    if not os.path.isdir("./clips"):
        os.mkdir("./clips")
    try:
        video_file = request.files['videofile']
        longfilepath = fullpath + "\\clips\\" + video_file.filename
        # filepath = longfilepath[35:]
        video_file.save(longfilepath)
    except Exception as e:
        print(e)
    return str(longfilepath[27:])


# Main video editing pipeline
@editing.route('/edit_video/<actiontype>', methods=['POST'])
def editor(actiontype):
    if actiontype == "trim":
        try:
            video_file = request.form['videofile']
            path = fullpath + video_file
            edited_video_path = trim_video(path, int(request.form['trim_start']), int(request.form['trim_end']))
            return {
                "status": "success",
                "message": "video edit success",
                "edited_video_path": edited_video_path[35:]
            }
        except Exception as e:
            return {
                "status": "error",
                "message": "video edit failure: " + str(e),
            }
    elif actiontype == "image":
        try:
            video_file = request.form['videofile']
            path = fullpath + video_file
            edited_video_path = img_overlay(path, str(request.form['img_src']),
                                            int(request.form['start_time']),
                                            int(request.form['duration']), int(float(request.form['x_pos'])),
                                            int(float(request.form['y_pos'])))
            return {
                "status": "success",
                "message": "video edit success",
                "edited_video_path": edited_video_path[35:]
            }
        except Exception as e:
            return {
                "status": "error",
                "message": "video edit failure: " + str(e),
            }


@editing.route('/merged_render', methods=['POST'])
def merged_render():
    try:
        videoscount = int(request.form['videoscount'])
        if videoscount > 0:
            video_clip_filenames = []
            for i in range(videoscount):
                path = fullpath + request.form['video' + str(i)]
                video_clip_filenames.append(path)
            final_render_video_path = merge_videos(video_clip_filenames)[35:]
            print("final path is " + final_render_video_path)
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
