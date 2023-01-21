import os
import time
from moviepy.editor import VideoFileClip, concatenate_videoclips, ImageClip, CompositeVideoClip

video_save_path = os.getcwd() + "\\editing\\clips\\"


def trim_video(videofile: str, start_time: int, end_time: int):
    clip = VideoFileClip(videofile)
    videofile = videofile.replace(video_save_path, "")
    trim_path = video_save_path + "edited_" + str(int(time.time())) + videofile
    trimmed_clip = clip.subclip(start_time, end_time)
    trimmed_clip.write_videofile(trim_path)
    return trim_path


def img_overlay(videofile: str, img: str, start_time: int, duration: int, x_pos: int, y_pos: int):
    clip = VideoFileClip(videofile)
    img = ImageClip(img).set_start(start_time).set_duration(duration).set_pos((x_pos, y_pos)).resize(1.52)
    edited_path = video_save_path + "edited_" + str(int(time.time())) + videofile[41:]
    final = CompositeVideoClip([clip, img])
    final.write_videofile(edited_path)
    return edited_path


def merge_videos(video_clip_filenames):
    video_clips = []
    # The video clip filenames are the short path. You need the long path
    for filename in video_clip_filenames:
        video_clips.append(VideoFileClip(filename))
    final_clip = concatenate_videoclips(video_clips, method="compose")
    final_path = os.getcwd() + "\\editing\\clips\\finalrender_" + str(int(time.time())) + ".mp4"
    final_clip.write_videofile(final_path)
    return final_path
