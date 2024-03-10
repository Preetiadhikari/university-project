from flask import Flask, url_for, render_template, request, jsonify
from youtubesearchpython import Playlist, ResultMode, Video, StreamURLFetcher
from pytube import YouTube
import json
from colorama import init, Fore

init(autoreset=True)
# import asyncio


url_fetcher = StreamURLFetcher()

# Change as you wish
temp_genre = {
    "playlist": "https://www.youtube.com/playlist?list=PLqtDR0dCdvEMS_n4bf0jWjX8IddcGpnVU",
    "lega": "https://www.youtube.com/playlist?list=PLqtDR0dCdvENYlQp74ayGl1WjC4tmY53C",
}

app = Flask(__name__, static_url_path="", static_folder="static")


def printx(value):
    print(f"{Fore.LIGHTCYAN_EX}{value}")


def record_object(data):
    with open("data.json", "w") as file:
        file.seek(0)
        file.truncate()

        json.dump(data, file, indent=4)


# OKAY
@app.route("/get_media", methods=["POST"])
def get_media():
    playlist_url = temp_genre[request.get_json(force=True)["genre"]]
    playlists = Playlist.getVideos(playlist_url, mode=ResultMode.dict)
    return playlists


@app.route("/playable_media", methods=["POST"])
def playMedia():
    playurl = (
        YouTube(request.get_json(force=True)["media_link"]).streams.get_audio_only().url
    )
    # video = Video.get(request.get_json(force=True)['media_link'])
    # videoData = url_fetcher.get(video, 139)
    # # record_object(videoData)
    return jsonify({"playable_link": playurl})


@app.route("/")
def main():
    return render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True)
