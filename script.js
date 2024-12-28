document.addEventListener('DOMContentLoaded', () => {
    const bpmInput = document.getElementById('bpm');
    const beatsInput = document.getElementById('beats');
    const soundSelect = document.getElementById('sound');
    const accentSelect = document.getElementById('accent');
    const startButton = document.getElementById('start');
    const stopButton = document.getElementById('stop');
    const dot = document.getElementById('dot');
    const beatNumber = document.getElementById('beat-number');
    
    let intervalId;
    let currentBeat = 0;
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    startButton.addEventListener('click', startMetronome);
    stopButton.addEventListener('click', stopMetronome);

    function startMetronome() {
        const bpm = parseInt(bpmInput.value);
        const beats = parseInt(beatsInput.value);
        const soundFrequency = parseInt(soundSelect.value);
        const accentBeats = accentSelect.value.split('&').map(Number);

        const interval = 60000 / bpm;

        stopMetronome(); // Stop any existing metronome

        intervalId = setInterval(() => {
            currentBeat = (currentBeat % beats) + 1;

            const angle = (currentBeat - 1) * (360 / beats);
            dot.style.transform = `translate(-50%, -50%) rotate(${angle}deg) translate(0, -90px)`;
            beatNumber.textContent = currentBeat;

            playSound(soundFrequency, accentBeats.includes(currentBeat));
        }, interval);
    }

    function stopMetronome() {
        clearInterval(intervalId);
        currentBeat = 0;
        dot.style.transform = 'translate(-50%, -50%)';
        beatNumber.textContent = '';
    }

    function playSound(frequency, isAccent) {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();

        osc.frequency.value = frequency;
        osc.type = 'sine';
        osc.connect(gain);
        gain.connect(audioContext.destination);

        gain.gain.setValueAtTime(1, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);

        osc.start(audioContext.currentTime);
        osc.stop(audioContext.currentTime + 0.2);

        if (isAccent) {
            flashScreen();
        }
    }

    function flashScreen() {
        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.top = 0;
        flash.style.left = 0;
        flash.style.width = '100%';
        flash.style.height = '100%';
        flash.style.backgroundColor = 'white';
        flash.style.opacity = 0.5;
        flash.style.zIndex = 9999;

        document.body.appendChild(flash);

        setTimeout(() => {
            document.body.removeChild(flash);
        }, 300);
    }
});
