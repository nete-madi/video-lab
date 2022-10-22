import os
from moviepy.editor import VideoFileClip, clips_array, vfx, concatenate_videoclips, ImageClip
import time

video_save_path = os.getcwd() + "\\editing\\clips\\";


def trim_video(videofile: str, start_time: int, end_time: int):
    clip = VideoFileClip(videofile)
    videofile = videofile.replace(video_save_path, "")
    trim_path = video_save_path + "edited_" + str(int(time.time())) + videofile
    trimmed_clip = clip.subclip(start_time, end_time)
    trimmed_clip.write_videofile(trim_path)
    return trim_path


def img_overlay(videofile: str, start_time:int, duration: int, img:str):
    clip = VideoFileClip(videofile);
    img = ImageClip(img)
    '''video = VideoFileClip("base_video.mp4")

    title = ImageClip("title.png").set_start(3).set_duration(7).set_pos(("center", "center"))
    # .resize(height=50) # if you need to resize...

    final = CompositeVideoClip([video, title])
    final.write_videofile("test.mp4")'''


def merge_videos(video_clip_filenames):
    video_clips = []
    for filename in video_clip_filenames:
        video_clips.append(VideoFileClip(filename))

    final_clip = concatenate_videoclips(video_clips, method="compose")
    final_path = "clips/finalrender_" + str(int(time.time())) + ".mp4"
    final_clip.write_videofile(final_path)
    return final_path
