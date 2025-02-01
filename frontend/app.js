  let phrases = [];
let currentIndex = localStorage.getItem("currentIndex") ? parseInt(localStorage.getItem("currentIndex")) : 0;
let mediaRecorder;
let audioChunks = [];
let recording = false;

// Load JSON data
fetch("/phrases")
    .then(response => response.json())
    .then(data => {
        phrases = data;
        displayPhrase();
    })
    .catch(error => console.error("Error loading phrases:", error));

function displayPhrase() {
    if (currentIndex < phrases.length) {
        const phraseCard = document.getElementById("phrase-card");
        phraseCard.classList.add("shuffle");

        setTimeout(() => {
            document.getElementById("phrase").innerText = phrases[currentIndex].transcript;
            phraseCard.classList.remove("shuffle");
            updateProgressBar(); // Update progress bar
        }, 500);
    } else {
        document.getElementById("phrase").innerText = "All phrases recorded!";
        document.getElementById("recordBtn").disabled = true;
    }

}

function updateProgressBar() {
    let progressInSet = (currentIndex % 25) / 25 * 100;
    document.getElementById("progressBar").style.width = `${progressInSet}%`;

    // Show checkpoint message every 25 phrases
    if (currentIndex > 0 && currentIndex % 25 === 0) {
        showCheckpointMessage();
    }
}

function showCheckpointMessage() {
    const message = document.getElementById("checkpointMessage");
    message.style.display = "block";

    setTimeout(() => {
        message.style.display = "none";
    }, 2000);
}

// Toggle Recording
document.getElementById("recordBtn").addEventListener("click", async () => {
    if (!recording) {
        startRecording();
    } else {
        stopRecording();
    }
});

async function startRecording() {
    let stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
    audioChunks = [];

    mediaRecorder.start();
    mediaRecorder.ondataavailable = event => audioChunks.push(event.data);

    document.getElementById("recordBtn").classList.add("recording");
    recording = true;
}

async function stopRecording() {
    mediaRecorder.stop();
    mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        const fileName = phrases[currentIndex].file_name.replace(".wav", ".webm");

        await uploadRecording(audioBlob, fileName);
        currentIndex++;
        localStorage.setItem("currentIndex", currentIndex);
        displayPhrase();
    };

    document.getElementById("recordBtn").classList.remove("recording");
    recording = false;
}

// Upload Recording to Server
async function uploadRecording(blob, fileName) {
    const formData = new FormData();
    formData.append("audio", blob, fileName);

    try {
        await fetch("/upload", { method: "POST", body: formData });
    } catch (error) {
        console.error("Upload failed:", error);
    }
}

// Skip Button
document.getElementById("skipBtn").addEventListener("click", () => {
    currentIndex++;
    localStorage.setItem("currentIndex", currentIndex);
    displayPhrase();
});