document.addEventListener('DOMContentLoaded', () => {
    const radioListContainer = document.getElementById('radioListContainer');
    const searchInput = document.getElementById('search');
    const playerSection = document.getElementById('player');
    const radioListSection = document.getElementById('radioList');
    const playPauseButton = document.getElementById('playPause');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const volumeControl = document.getElementById('volumeControl');
    const audioPlayer = document.getElementById('audioPlayer');
    const stationDetails = document.getElementById('stationDetails');
    const header = document.getElementById('header');
    const backButton = document.getElementById('backButton');
    const recordButton = document.getElementById('recordButton');
    const stopButton = document.getElementById('stopButton');
    let currentStationIndex = 0;
    let stationsList = radioStations; // Assuming radioStations is defined globally in radio.js
    let mediaRecorder;
    let audioChunks = [];

    // Render radio stations on the main page
    const renderRadioStations = (stations) => {
        radioListContainer.innerHTML = ''; // Clear existing list
        stations.forEach((station, index) => {
            const div = document.createElement('div');
            div.classList.add('radio-item');
            div.innerHTML = `<h3>${station.name}</h3>`;
            div.addEventListener('click', () => {
                localStorage.setItem('currentStation', JSON.stringify(station));
                window.location.href = 'player.html';
            });
            radioListContainer.appendChild(div);
        });
    };

    // Show player with selected station
    const showPlayer = (station) => {
        header.innerHTML = `
            <button id="backButton">Back</button>
            <h1 id="stationName">${station.name}</h1>
        `;
        stationDetails.innerHTML = `
            <h2>Station Details</h2>
            <p><strong>Name:</strong> ${station.name}</p>
            <p><strong>Description:</strong> ${station.description || 'No description available.'}</p>
            <p><strong>Location:</strong> ${station.address}</p>
        `;
        audioPlayer.src = station.streamUrl;
        audioPlayer.load();
        audioPlayer.play();
        playerSection.style.display = 'block';
        radioListSection.style.display = 'none';

        // Back button functionality
        backButton.addEventListener('click', () => {
            playerSection.style.display = 'none';
            radioListSection.style.display = 'block';
            window.history.back(); // Go back to the main page
        });
    };

    // Play/Pause button functionality
    playPauseButton.addEventListener('click', () => {
        if (audioPlayer.paused) {
            audioPlayer.play();
            playPauseButton.textContent = 'Pause';
        } else {
            audioPlayer.pause();
            playPauseButton.textContent = 'Play';
        }
    });

    // Previous button functionality
    prevButton.addEventListener('click', () => {
        currentStationIndex = (currentStationIndex - 1 + stationsList.length) % stationsList.length;
        const previousStation = stationsList[currentStationIndex];
        showPlayer(previousStation);
    });

    // Next button functionality
    nextButton.addEventListener('click', () => {
        currentStationIndex = (currentStationIndex + 1) % stationsList.length;
        const nextStation = stationsList[currentStationIndex];
        showPlayer(nextStation);
    });

    // Volume control
    volumeControl.addEventListener('input', () => {
        audioPlayer.volume = volumeControl.value;
    });

    // Search functionality for radio stations
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filteredStations = stationsList.filter(station => station.name.toLowerCase().includes(query));
        renderRadioStations(filteredStations);
    });

    // Handle the page load and render appropriate content based on the current page
    if (window.location.pathname.includes('index.html')) {
        // If on the main page (index.html)
        renderRadioStations(stationsList);
    } else if (window.location.pathname.includes('player.html')) {
        // If on the player page (player.html)
        const storedStation = JSON.parse(localStorage.getItem('currentStation'));
        if (storedStation) {
            showPlayer(storedStation);
        }
    }

    // Record button functionality
    recordButton.addEventListener('click', () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    const mediaStream = audioPlayer.captureStream(); // Capture the audio stream from the player
                    mediaRecorder = new MediaRecorder(mediaStream);

                    mediaRecorder.ondataavailable = (event) => {
                        audioChunks.push(event.data);
                    };

                    mediaRecorder.onstop = () => {
                        const blob = new Blob(audioChunks, { type: 'audio/webm' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${station.name}-recording.webm`;
                        a.click();
                    };

                    mediaRecorder.start();
                    recordButton.disabled = true;
                    stopButton.disabled = false;
                })
                .catch(err => console.error("Error capturing audio:", err));
        } else {
            alert('Audio recording is not supported on this browser.');
        }
    });

    // Stop recording button functionality
    stopButton.addEventListener('click', () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            recordButton.disabled = false;
            stopButton.disabled = true;
        }
    });
});