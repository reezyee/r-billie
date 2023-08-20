// load sound via <audio tag
const audioElement = document.querySelector("audio");
const audioCtx = new AudioContext();
const track = audioCtx.createMediaElementSource(audioElement);

// Player controls and attributes
const playButton = document.querySelector(".player-play-btn");
const playIcon = playButton.querySelector(".player-icon-play");
const pauseIcon = playButton.querySelector(".player-icon-pause");
const progress = document.querySelector(".player-progress");
const progressFilled = document.querySelector(".player-progress-filled");
const playerCurrentTime = document.querySelector(".player-time-current");
const playerDuration = document.querySelector(".player-time-duration");
const volumeControl = document.querySelector(".player-volume")

window.addEventListener("load", () => {
  // Set times after page load
  setTimes();

  // Update progress bar and time values as audio plays
  audioElement.addEventListener("timeupdate", () => {
    progressUpdate();
    setTimes();
  });

  // Play button toggle
  playButton.addEventListener("click", () => {
    // check if context is in suspended state (autoplay policy)
    // By default browsers won't allow you to autoplay audio.
    // You can overide by finding the AudioContext state and resuming it after a user interaction like a "click" event.
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    // Play or pause track depending on state
    if (playButton.dataset.playing === "false") {
      audioElement.play();

      playButton.dataset.playing = "true";
      playIcon.classList.add("hidden");
      pauseIcon.classList.remove("hidden");
    } else if (playButton.dataset.playing === "true") {
      audioElement.pause();
      playButton.dataset.playing = "false";
      pauseIcon.classList.add("hidden");
      playIcon.classList.remove("hidden");
    }
  });

  // if the track ends reset the player
  audioElement.addEventListener("ended", () => {
    playButton.dataset.playing = "false";
    pauseIcon.classList.add("hidden");
    playIcon.classList.remove("hidden");
    progressFilled.style.flexBasis = "0%";
    audioElement.currentTime = 0;
    audioElement.duration = audioElement.duration;
  });

  // Bridge the gap between gainNode and AudioContext so we can manipulate volume (gain)
  const gainNode = audioCtx.createGain();
  const volumeControl = document.querySelector(".player-volume");
  volumeControl.addEventListener("change", () => {
    gainNode.gain.value = volumeControl.value;
  });

  track.connect(gainNode).connect(audioCtx.destination);

  // Display currentTime and duration properties in real time
  function setTimes() {
    playerCurrentTime.textContent = new Date(audioElement.currentTime * 1000)
      .toISOString()
      .substr(11, 8);
    playerDuration.textContent = new Date(audioElement.duration * 1000)
      .toISOString()
      .substr(11, 8);
  }

  // Update player timeline progress visually
  function progressUpdate() {
    const percent = (audioElement.currentTime / audioElement.duration) * 100;
    progressFilled.style.flexBasis = `${percent}%`;
  }

  // Scrub player timeline to skip forward and back on click for easier UX
  let mousedown = false;

  function scrub(event) {
    const scrubTime =
      (event.offsetX / progress.offsetWidth) * audioElement.duration;
    audioElement.currentTime = scrubTime;
  }

  progress.addEventListener("click", scrub);
  progress.addEventListener("mousemove", (e) => mousedown && scrub(e));
  progress.addEventListener("mousedown", () => (mousedown = true));
  progress.addEventListener("mouseup", () => (mousedown = false));

  // Track credit: Outfoxing the Fox by Kevin MacLeod under Creative Commons

}, false)