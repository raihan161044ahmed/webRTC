let mediaRecorder;
let audioChunks = [];
let startTime;

document.getElementById('start').addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();
        startTime = Date.now(); 

        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstart = () => {
            document.getElementById('start').disabled = true;
            document.getElementById('stop').disabled = false;
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
            const audioUrl = URL.createObjectURL(audioBlob);
            document.getElementById('audio').src = audioUrl;

            const duration = (Date.now() - startTime) / 1000;
            document.getElementById('audio').setAttribute('duration', duration.toFixed(2));

            audioChunks = [];

            document.getElementById('start').disabled = false;
            document.getElementById('stop').disabled = true;
        };
    } catch (error) {
        console.error('Error accessing media devices.', error);
        if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
            alert('No audio input device found.');
        } else if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
            alert('Permission to access microphone denied.');
        } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
            alert('Microphone is already in use.');
        } else {
            alert('Error accessing microphone.');
        }
    }
});


document.getElementById('stop').addEventListener('click', () => {
    mediaRecorder.stop();
});
