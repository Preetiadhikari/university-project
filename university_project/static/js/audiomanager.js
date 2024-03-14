console.log("Audio Manager Loaded")

// let $_ = (identifier) => document.querySelector(identifier)

// DOM Selections
const previousBtn = document.querySelector(".arrow_back")
const playpauseBtn = document.querySelector(".playPauseMedia")
const nextBtn = document.querySelector(".arrow_forward")
const expandBtn = document.querySelector(".expand")

const mediaThumbnail = document.querySelector(".master-player .thumbnail img")
const mediaTitle = document.querySelector(".master-player .music-info .mtitle")
const mediaChannel = document.querySelector(".master-player .music-info .aname")

let currentCount = 1
const audioPlayer = new Audio()

// Loading First Audio in the our list
!function preload() {

}()

function stop_audio() {
    audioPlayer.pause()
    audioPlayer.currentTime = 0
}

function loadMedia(domel, media_link) {
    let isPaused = audioPlayer.paused
    stop_audio()
    fetch("/playable_media", {
        method: "POST",
        body: JSON.stringify({
            media_link
        })
    })
        .then(data => data.json())
        .then(data => {
            // console.log(domel)
            const playable_link = data['playable_link']
            audioPlayer.src = playable_link
            mediaThumbnail.src = domel.querySelector("img").src
            mediaTitle.textContent = domel.querySelector("h3").textContent
            mediaTitle.textContent = domel.querySelector("h3").textContent
            mediaChannel.textContent = domel.querySelector(".channel").textContent
            if (!isPaused) {
                audioPlayer.play()
            }
        })
}

audioPlayer.addEventListener("playing", () => {
    playpauseBtn.textContent = "pause"
})

audioPlayer.addEventListener("pause", () => {
    playpauseBtn.textContent = "play_arrow"
})

audioPlayer.addEventListener("change", () => {
    let isPaused = audioPlayer.paused
    audioPlayer.pause()
    audioPlayer.currentTime = 0

    if (!isPaused) {
        audioPlayer.play()
    }
})

audioPlayer.addEventListener("ended", playNext)

function playPausemethod() {
    if (audioPlayer.paused) {
        audioPlayer.play()
    } else {
        audioPlayer.pause()
    }
}

function playNext() {
    const totalCount = document.body.getAttribute("data-total")
    currentCount = (currentCount >= totalCount) ? 1 : currentCount + 1
    nextElement = document.querySelector(`[data-id='${currentCount}']`)
    loadMedia(nextElement, "https://www.youtube.com/watch?v=" + nextElement.getAttribute("data-vid"))
    console.log(nextElement)
}

function playPrevious() {
    const totalCount = document.body.getAttribute("data-total")
    currentCount = (currentCount === 1) ? totalCount : currentCount - 1
    nextElement = document.querySelector(`[data-id='${currentCount}']`)
    loadMedia(nextElement, "https://www.youtube.com/watch?v=" + nextElement.getAttribute("data-vid"))
}


// DOM Selections
const myProgress = document.getElementById("myProgress");
const startTime = document.getElementById("startTime");
const endTime = document.getElementById("endTime");

// Audio metadata loaded event
audioPlayer.addEventListener("loadedmetadata", () => {
    // Set the max value of progress bar to audio duration
    myProgress.max = audioPlayer.duration;
    // Update end time
    endTime.textContent = formatTime(audioPlayer.duration);
});

// Time update event
audioPlayer.addEventListener("timeupdate", () => {
    // Update progress bar value
    myProgress.value = audioPlayer.currentTime;
    // Update start time
    startTime.textContent = formatTime(audioPlayer.currentTime);
});

// Change in progress bar
myProgress.addEventListener("input", () => {
    // Change audio current time based on progress bar value
    audioPlayer.currentTime = myProgress.value;
});

// Function to format time
const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    let formattedTime = "";

    if (hours > 0) {
        formattedTime += `${hours}:`;
    }
    formattedTime += `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    return formattedTime;
};
