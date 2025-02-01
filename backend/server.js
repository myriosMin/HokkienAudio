
// Install the required packages
// Mac: brew install node, brew install ffmpeg
// Linux: sudo apt install nodejs npm -y, sudo apt install ffmpeg -y
// Windows: https://nodejs.org/en/download/, winget install ffmpeg

// Run the server instructions
// cd backend
// npm install express multer
// node server.js

const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

const app = express();
const PORT = 5001;

const recordingsDir = path.join(__dirname, "recordings");
const phrasesPath = path.join(__dirname, "../phrases.json");
app.use("/recordings", express.static(path.join(__dirname, "recordings")));

// Ensure recordings directory exists
const uploadDir = path.join(__dirname, "recordings");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for temporary `.webm` upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, file.originalname.replace(".wav", ".webm")),
});
const upload = multer({ storage });

app.use(express.static("../frontend")); // Serve frontend
app.get("/phrases", (req, res) => res.sendFile(path.join(__dirname, "../phrases.json")));

// Handle file uploads and convert to `.mp3`
app.post("/upload", upload.single("audio"), (req, res) => {
    const webmPath = path.join(uploadDir, req.file.filename);
    const mp3Path = webmPath.replace(".webm", ".mp3");

    // Convert `.webm` to `.mp3`
    exec(`ffmpeg -i "${webmPath}" -q:a 3 "${mp3Path}"`, { timeout: 5000 }, (err) => {
        if (err) {
            console.error("FFmpeg error:", err);
            return res.status(500).json({ success: false, error: "Conversion failed" });
        }
        fs.unlinkSync(webmPath); // Delete the `.webm` file after conversion
        res.json({ success: true, filename: path.basename(mp3Path) });
    });
});

// Start the server
app.use(express.static("../frontend")); // Serve frontend
app.get("/phrases", (req, res) => {
    res.sendFile(path.join(__dirname, "../phrases.json"));
});

// API to List Recordings
app.get("/recordings", (req, res) => {
    fs.readdir(recordingsDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: "Failed to read recordings" });
        }

        // Load phrases.json to match filenames with transcripts
        const phrases = JSON.parse(fs.readFileSync(phrasesPath, "utf8"));

        const recordings = files
            .filter(file => file.endsWith(".mp3"))
            .map(file => {
                const phraseObj = phrases.find(p => p.file_name.replace(".wav", ".mp3") === file);
                return {
                    fileName: file,
                    transcript: phraseObj ? phraseObj.transcript : "Unknown"
                };
            });

        res.json(recordings);
    });
});

// API to Delete a Recording
app.delete("/delete-recording/:fileName", (req, res) => {
    const filePath = path.join(recordingsDir, req.params.fileName);

    fs.unlink(filePath, err => {
        if (err) {
            return res.status(500).json({ error: "Failed to delete file" });
        }
        res.json({ success: true });
    });
});

app.listen(PORT, () => console.log(`Please copy and paste this link in Chrome: http://localhost:${PORT}`));