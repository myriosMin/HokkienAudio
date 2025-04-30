# Hokkien Speech Recorder (Localhost Setup)

This is a **local speech recording app** for **crowdsourcing Hokkien speech recordings**. Users can record phrases and save them locally on their devices.

---

## 📌 Features
✅ **Simple Web Interface** for recording audio.
✅ **Saves recordings locally** (no backend needed).
✅ **Works offline**.
✅ **Supports Windows, Mac, Linux**.

---

## 🔹 Installation Guide (Local Setup)
This app requires **FFmpeg, Node.js, NPM, Express, and Multer**.

### **1️⃣ Install Required Software**
#### **Mac/Linux**
```sh
brew install node npm ffmpeg
```
#### **Windows**
1. Download & install [Node.js](https://nodejs.org/en/download/) (includes npm)
2. Install FFmpeg via **winget**:
```sh
winget install ffmpeg
```
#### **Mac/Linux**
```sh
brew install node ffmpeg
```
#### **Windows**
1. Download & install [Node.js](https://nodejs.org/en/download/)
2. Install FFmpeg via **winget**:
```sh
winget install ffmpeg
```

---

### **2️⃣ Clone the Repository**
```sh
git clone https://github.com/myriosMin/HokkienAudio
cd HokkienAudio
```

---

### **3️⃣ Install Dependencies**
Navigate to the backend folder and install required packages:
```sh
cd backend
npm install express multer
```

---

### **4️⃣ Start the Server**
```sh
node server.js
```
You should see:
```
Server running at http://localhost:5001
```

---

## 🔹 Usage Guide
### **1️⃣ Open the Web App**
Once the server is running, open your browser and go to:
```
http://localhost:5001
```

### **2️⃣ Record Audio**
- Click the **Microphone Button** 🎙 to start recording.
- Click again to **stop** and save the audio.
- The file is **downloaded automatically**.

### **3️⃣ View & Manage Recordings**
- Click **"View Recordings"** to see past recordings.
- Play audio files directly from the web.
- Click **"🗑 Delete"** to remove unwanted recordings.

---

## 📌 Troubleshooting
### **1️⃣ "Cannot GET /" Error**
If the page doesn’t load, check:
```sh
ls backend
```
Make sure **`server.js`** is inside **backend/** and run it again:
```sh
cd backend
node server.js
```

### **2️⃣ Port Already in Use**
Kill the process
```sh
lsof -i :5001
kill -9 <PID>
```
or, change to another port in server.js [line 19]
```js
const PORT = 5002;
```
Then restart the server.

### **3️⃣ Audio Not Downloading on iOS**
- Open in **Safari** (Chrome on iOS does not allow automatic downloads).
- Long press **audio player** > **"Save Audio As..."**.

---

## 🎯 Future Improvements
- **Convert recordings to MP3 automatically**.
- **Sync recordings to a cloud storage system**.

---

## **🔗 Contributors & Contact**
[Year 2, AI Engineering Project, Diploma in AI & Data Engineering, Nanyang Polytechnic]
👤 Developed by [**Min Phyo Thura**](https://github.com/myriosMin)    
📧 Contact: [myriosmin@gmail.com](mailto:myriosmin@example.com)  
🌍 GitHub Repo: [HokkienAudio](https://github.com/myriosMin/HokkienAudio)  
