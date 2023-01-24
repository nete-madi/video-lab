import os
import time
from moviepy.editor import VideoFileClip, concatenate_videoclips, ImageClip, CompositeVideoClip
from config.definitions import ROOT_DIR, VIDEO_SAVE_DIR

video_save_path = ROOT_DIR + VIDEO_SAVE_DIR


def trim_video(videofile: str, start_time: int, end_time: int):
    clip = VideoFileClip(videofile)
    videofile = videofile.replace(video_save_path, "")
    trim_path = video_save_path + "edited_" + str(int(time.time())) + videofile
    file_name = "edited_" + str(int(time.time())) + videofile
    trimmed_clip = clip.subclip(start_time, end_time)
    trimmed_clip.write_videofile(trim_path)
    return VIDEO_SAVE_DIR + file_name


def img_overlay(videofile: str, img: str, start_time: int, duration: int, x_pos: int, y_pos: int):
    clip = VideoFileClip(videofile)
    videofile = videofile.replace(video_save_path, "")
    img = ROOT_DIR + "\\img\\" + img[13:]
    print("videofile is: " + videofile)
    img = ImageClip(img).set_start(start_time).set_duration(duration).set_pos((x_pos, y_pos)).resize(1.52)
    edited_path = video_save_path + "edited_" + str(int(time.time())) + videofile
    file_name = "edited_" + str(int(time.time())) + videofile
    final = CompositeVideoClip([clip, img])
    final.write_videofile(edited_path)
    return VIDEO_SAVE_DIR + file_name


def merge_videos(video_clip_filenames):
    video_clips = []
    # The video clip filenames are the short path. You need the long path
    for filename in video_clip_filenames:
        video_clips.append(VideoFileClip(filename))
    final_clip = concatenate_videoclips(video_clips, method="compose")
    final_path = os.getcwd() + "\\editing\\clips\\finalrender_" + str(int(time.time())) + ".mp4"
    final_clip.write_videofile(final_path)
    return final_path
