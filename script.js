document.addEventListener('DOMContentLoaded', () => {
    const radioListContainer = document.getElementById('radioListContainer');
    const searchInput = document.getElementById('search');
    const header = document.getElementById('header');
    const playerSection = document.getElementById('player');
    const radioListSection = document.getElementById('radioList');

    let stations = [];
    let currentStationIndex = 0;

    // Fetching the radio stations from the local JSON file
    const fetchRadioStations = async () => {
        try {
            const response = await fetch('radio.json');  // Relative path to your local JSON file
            stations = await response.json();
            renderRadioStations(stations);
        } catch (error) {
            console.error('Error fetching radio stations:', error);
            alert('Failed to load radio stations. Please try again later.');
        }
    };

    // Rendering radio stations in the list
    const renderRadioStations = (stations) => {
        radioListContainer.innerHTML = '';  // Clear existing list
        stations.forEach((station, index) => {
            const div = document.createElement('div');
            div.classList.add('radio-item');
            div.innerHTML = `
                <h3>${station.name}</h3>
                <p>${station.description || 'No description available.'}</p>
            `;
            // Add click event to navigate to the player page
            div.addEventListener('click', () => {
                currentStationIndex = index; // Save the selected station index
                showPlayer(station); // Show the player page
            });
            radioListContainer.appendChild(div);
        });
    };

    // Show the player with the selected radio station
    const showPlayer = (station) => {
        header.innerHTML = `
            <button id="backButton">Back to Stations</button>
            <h1 id="stationName">${station.name}</h1>
        `;
        
        // Handle the back button click
        document.getElementById('backButton').addEventListener('click', () => {
            playerSection.style.display = 'none';
            radioListSection.style.display = 'block';
        });

        // Switch to the player section and hide the radio list
        playerSection.style.display = 'block';
        radioListSection.style.display = 'none';

        const audioPlayer = document.getElementById('audioPlayer');
        audioPlayer.src = station.streamUrl; // Use the stream URL from the JSON
        audioPlayer.load(); // Load the audio stream

        // Error handling if the audio fails to load
        audioPlayer.onerror = () => {
            alert('Failed to load audio stream. Please try another station.');
        };

        // Display FM station details without the stream URL in the player section
        const stationDetails = document.getElementById('stationDetails');
        stationDetails.innerHTML = `
            <h2>Station Details</h2>
            <p><strong>Name:</strong> ${station.name}</p>
            <p><strong>Description:</strong> ${station.description || "No description available."}</p>
            <p><strong>Frequency:</strong> ${station.frequency} MHz</p>
            <p><strong>Location:</strong> ${station.address}</p>
        `;

        // Play/Pause Button
        const playPauseButton = document.getElementById('playPause');
        playPauseButton.addEventListener('click', () => {
            if (audioPlayer.paused) {
                audioPlayer.play().catch(error => {
                    console.error('Error playing audio:', error);
                    alert('Error playing the radio stream. Please try again.');
                });
                playPauseButton.textContent = 'Pause';
            } else {
                audioPlayer.pause();
                playPauseButton.textContent = 'Play';
            }
        });

        // Volume Control
        const volumeControl = document.getElementById('volumeControl');
        volumeControl.addEventListener('input', () => {
            audioPlayer.volume = volumeControl.value;
        });

        // Next/Previous Buttons
        document.getElementById('nextButton').addEventListener('click', () => {
            currentStationIndex = (currentStationIndex + 1) % stations.length;
            showPlayer(stations[currentStationIndex]);
        });

        document.getElementById('prevButton').addEventListener('click', () => {
            currentStationIndex = (currentStationIndex - 1 + stations.length) % stations.length;
            showPlayer(stations[currentStationIndex]);
        });
    };

    // Search functionality for filtering the radio stations
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filteredStations = stations.filter(station => station.name.toLowerCase().includes(query));
        renderRadioStations(filteredStations);
    });

    fetchRadioStations(); // Load the radio stations when the page loads
});