// Add event listener to play audio for each sub-item
const allPTags = document.querySelectorAll('.sub-item p');
let audioPlayer = null;
allPTags.forEach(tag => {
    tag.addEventListener('click', function() {
        const audioSrc = this.getAttribute('data-src');
        if (audioPlayer) {
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
        }
        audioPlayer = new Audio(audioSrc);
        audioPlayer.play();
    });
});

// Add event listeners for control buttons
const playPauseBtn = document.getElementById('playPauseBtn');
const stopBtn = document.getElementById('stopBtn');
const backwardBtn = document.getElementById('backwardBtn');
const forwardBtn = document.getElementById('forwardBtn');

playPauseBtn.addEventListener('click', function() {
  if (audioPlayer) {
    if (audioPlayer.paused) {
      audioPlayer.play();
      playPauseBtn.textContent = 'Pause';
    } else {
      audioPlayer.pause();
      playPauseBtn.textContent = 'Play';
    }
  }
});

stopBtn.addEventListener('click', function() {
  if (audioPlayer) {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    playPauseBtn.textContent = 'Play';
  }
});

backwardBtn.addEventListener('click', function() {
  if (audioPlayer) {
    audioPlayer.currentTime -= 10; // Move 10 seconds backward
  }
});

forwardBtn.addEventListener('click', function() {
  if (audioPlayer) {
    audioPlayer.currentTime += 10; // Move 10 seconds forward
  }
});
