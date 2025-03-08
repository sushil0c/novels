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

    let currentStationIndex = 0;
    let stationsList = radioStations; // Use the global variable from radio.js

    // Render radio stations on the main page
    const renderRadioStations = (stations) => {
        radioListContainer.innerHTML = ''; // Clear existing list
        stations.forEach((station, index) => {
            const div = document.createElement('div');
            div.classList.add('radio-item');
            div.innerHTML = `<h3>${station.name}</h3>`;
            div.addEventListener('click', () => {
                showPlayer(station, index);
            });
            radioListContainer.appendChild(div);
        });
    };

    // Show the player with selected station
    const showPlayer = (station, index) => {
        currentStationIndex = index; // Save the current station index
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

        // Set the audio source and play
        audioPlayer.src = station.streamUrl;
        audioPlayer.load();
        audioPlayer.play();

        // Show player section
        playerSection.style.display = 'block';
        radioListSection.style.display = 'none';

        // Add event listener to back button dynamically
        document.getElementById('backButton').addEventListener('click', () => {
            playerSection.style.display = 'none';
            radioListSection.style.display = 'block';
        });
    };

    // Play/Pause button
    playPauseButton.addEventListener('click', () => {
        if (audioPlayer.paused) {
            audioPlayer.play();
            playPauseButton.textContent = 'Pause';
        } else {
            audioPlayer.pause();
            playPauseButton.textContent = 'Play';
        }
    });

    // Previous button
    prevButton.addEventListener('click', () => {
        currentStationIndex = (currentStationIndex - 1 + stationsList.length) % stationsList.length;
        showPlayer(stationsList[currentStationIndex], currentStationIndex);
    });

    // Next button
    nextButton.addEventListener('click', () => {
        currentStationIndex = (currentStationIndex + 1) % stationsList.length;
        showPlayer(stationsList[currentStationIndex], currentStationIndex);
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

    // Load stations when the page loads
    renderRadioStations(stationsList);
});