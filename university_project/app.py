from flask import Flask, url_for, render_template, request, jsonify, redirect, session
from youtubesearchpython import Playlist, ResultMode
from pytube import YouTube
import json
from colorama import init, Fore

init(autoreset=True)

# Initialize Flask app
app = Flask(__name__, static_url_path="", static_folder="static")
app.secret_key = 'your_secret_key'  # Change this to a more secure secret key

# User database for demonstration purposes (replace with a proper database in production)
users = {
    'preeti': 'preetipreeti',
    'aditya': 'adityaaditya',
    'suraz' : "surazsuraz",
}

# Sample playlist URLs
temp_genre = {
    "playlist": "https://www.youtube.com/playlist?list=PLqtDR0dCdvEMS_n4bf0jWjX8IddcGpnVU",
    "lega": "https://www.youtube.com/playlist?list=PLqtDR0dCdvENYlQp74ayGl1WjC4tmY53C",
}

# Routes for login, signup, and main pages


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form['username']
        password = request.form['password']
        if username in users and users[username] == password:
            # Successful login, store username in session and redirect to main page
            session['username'] = username
            return redirect(url_for('main'))
        else:
            # Failed login, show login page with error message
            return render_template('login.html', error='Invalid username or password')
    else:
        return render_template('login.html', error=None)


@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        username = request.form['username']
        password = request.form['password']
        # Check if username already exists
        if username in users:
            return render_template('signup.html', error="Username already exists")
        else:
            # Add the new user to the user list (for demonstration purposes)
            users[username] = password
            # Redirect to the login page after successful signup
            return redirect(url_for('login'))
    else:
        return render_template('signup.html', error=None)


@app.route("/logout")
def logout():
    # Clear the session and redirect to the login page
    session.pop('username', None)
    return redirect(url_for('login'))


@app.route("/get_media", methods=["POST"])
def get_media():
    if 'username' in session:
        playlist_url = temp_genre[request.get_json(force=True)["genre"]]
        playlists = Playlist.getVideos(playlist_url, mode=ResultMode.dict)
        return playlists
    else:
        return jsonify({'error': 'Unauthorized access'}), 401


@app.route("/playable_media", methods=["POST"])
def playMedia():
    if 'username' in session:
        playurl = YouTube(request.get_json(force=True)["media_link"]).streams.get_audio_only().url
        return jsonify({"playable_link": playurl})
    else:
        return jsonify({'error': 'Unauthorized access'}), 401


@app.route("/")
def main():
    if 'username' in session:
        return render_template("index.html")
    else:
        return redirect(url_for('login'))


if __name__ == "__main__":
    app.run(debug=True)
