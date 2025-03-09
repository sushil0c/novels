
// script.js

// Main page (index.html) - Render radio stations
document.addEventListener('DOMContentLoaded', () => {
    const radioListContainer = document.getElementById('radioListContainer');
    const searchInput = document.getElementById('search');
    
    // Render radio stations
    const renderRadioStations = (stations) => {
        radioListContainer.innerHTML = ''; // Clear existing list
        stations.forEach((station, index) => {
            const div = document.createElement('div');
            div.classList.add('radio-item');
            div.innerHTML = `<h3>${station.name}</h3>`;
            div.addEventListener('click', () => {
                // Store the station data in localStorage
                localStorage.setItem('currentStation', JSON.stringify(station));
                window.location.href = 'player.html'; // Navigate to the player page
            });
            radioListContainer.appendChild(div);
        });
    };

    // Render stations
    renderRadioStations(radioStations);

    // Search functionality for radio stations
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filteredStations = radioStations.filter(station => station.name.toLowerCase().includes(query));
        renderRadioStations(filteredStations);
    });
});

// Player page (player.html) - Set up the player and controls
document.addEventListener('DOMContentLoaded', () => {
    const playerSection = document.getElementById('player');
    const backButton = document.getElementById('backButton');
    const audioPlayer = document.getElementById('audioPlayer');
    const playPauseButton = document.getElementById('playPause');
    const stationDetails = document.getElementById('stationDetails');
    let currentStation;

    // Load station data from localStorage
    const loadStationData = () => {
        const storedStation = JSON.parse(localStorage.getItem('currentStation'));
        if (!storedStation) {
            alert("No station data found.");
            return;
        }
        currentStation = storedStation;
        showPlayer(currentStation);
    };

    // Show player with selected station
    const showPlayer = (station) => {
        document.getElementById('stationName').textContent = station.name;
        stationDetails.innerHTML = `
            <h2>Station Details</h2>
            <p><strong>Name:</strong> ${station.name}</p>
            <p><strong>Description:</strong> ${station.description || 'No description available.'}</p>
            <p><strong>Location:</strong> ${station.address}</p>
        `;
        audioPlayer.src = station.streamUrl;
        audioPlayer.load();  // Reload the audio player
        audioPlayer.play();  // Play the radio stream
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

    // Back button functionality
    backButton.addEventListener('click', () => {
        window.history.back();  // Go back to the station list page
    });

    // Load station data when the page is loaded
    loadStationData();
});
