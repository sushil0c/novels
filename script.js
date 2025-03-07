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
    const backButton = document.getElementById('backButton');
    const stationDetails = document.getElementById('stationDetails');
    const header = document.getElementById('header');

    let currentStationIndex = 0;
    let stationsList = [];

    // Fetch radio stations from the URL
    const fetchRadioStations = async () => {
        try {
            const response = await fetch('https://raw.githubusercontent.com/2shrestha22/radio/main/assets/radio_list.json
');
            stationsList = await response.json();
            renderRadioStations(stationsList);
        } catch (error) {
            console.error('Error fetching radio stations:', error);
            alert('Failed to load radio stations. Please try again later.');
        }
    };

    // Render radio stations on the main page
    const renderRadioStations = (stations) => {
        radioListContainer.innerHTML = ''; // Clear existing list
        stations.forEach((station, index) => {
            const div = document.createElement('div');
            div.classList.add('radio-item');
            div.innerHTML = `
                <h3>${station.name}</h3>
                <!-- Removed Frequency and Location from the main page -->
            `;
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
            <button id="backButton">Back to Stations</button>
            <h1 id="stationName">${station.name}</h1>
        `;
        stationDetails.innerHTML = `
            <h2>Station Details</h2>
            <p><strong>Name:</strong> ${station.name}</p>
            <p><strong>Description:</strong> ${station.description || 'No description available.'}</p>
            <p><strong>Frequency:</strong> ${station.frequency} MHz</p>
            <p><strong>Location:</strong> ${station.address}</p>
        `;

        // Set the audio source and play
        audioPlayer.src = station.streamUrl;
        audioPlayer.load();
        audioPlayer.play();

        // Show player section
        playerSection.style.display = 'block';
        radioListSection.style.display = 'none';
    };

    // Back button to return to the main page
    backButton.addEventListener('click', () => {
        playerSection.style.display = 'none';
        radioListSection.style.display = 'block';
    });

    // Play/Pause button
    playPauseButton.addEventListener('click', () => {
        if (audioPlayer.paused) {
            audioPlayer.play().catch(error => {
                alert('Error playing the radio stream. Please try again.');
            });
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

    // Fetch and load stations when the page loads
    fetchRadioStations();
});