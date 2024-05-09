const textInput = document.getElementById('text-input');
const convertButton = document.getElementById('convert-button');
const messageElement = document.getElementById('message');
const audioPlayer = document.getElementById('audio-player');
const voiceSelect = document.getElementById('voice-select');

// Replace with your actual ElevenLabs API key (store securely using environment variables)
const apiKey = 'e296c0ba461459ffa38b58619b7a30c1';

// Function to fetch available voices and populate the dropdown
async function fetchVoices() {
  try {
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const voices = await response.json();

    voices.forEach(voice => {
      const option = document.createElement('option');
      option.value = voice.id;
      option.textContent = voice.name;
      voiceSelect.appendChild(option);
    });

  } catch (error) {
    console.error('Error fetching voices:', error);
    messageElement.textContent = 'Failed to load voices. Please try again.';
  }
}

fetchVoices(); // Call the function to fetch voices on page load

convertButton.addEventListener('click', async () => {
  const text = textInput.value.trim();
  const selectedVoiceId = voiceSelect.value;

  if (!text) {
    messageElement.textContent = 'Please enter some text to convert.';
    return;
  }

  messageElement.textContent = 'Converting...';

  try {
    const response = await fetch('https://api.elevenlabs.io/v1/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text,
        voice_id: selectedVoiceId
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const audioUrl = data.audio_url;

    messageElement.textContent = 'Playing audio...';
    audioPlayer.src = audioUrl;
    audioPlayer.play();

  } catch (error) {
    console.error('Error:', error);
    messageElement.textContent = 'Conversion failed. Please try again.';
  } finally {
    messageElement.textContent = '';
  }
});
