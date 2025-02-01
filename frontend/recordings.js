document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.querySelector("#recordingsTable tbody");

    // Fetch recordings from the backend
    const response = await fetch("/recordings");
    const recordings = await response.json();

    tableBody.innerHTML = ""; // Clear existing content

    recordings.forEach(recording => {
        const row = document.createElement("tr");

        // Phrase Column
        const phraseCell = document.createElement("td");
        phraseCell.textContent = recording.transcript;
        row.appendChild(phraseCell);

        // Audio Player Column
        const audioCell = document.createElement("td");
        const audioPlayer = document.createElement("audio");
        audioPlayer.controls = true;
        audioPlayer.src = `/recordings/${recording.fileName}`;
        audioPlayer.onerror = () => {
            audioPlayer.src = "";
            audioPlayer.innerHTML = "⚠️ Audio Not Found";
        };
        audioCell.appendChild(audioPlayer);
        row.appendChild(audioCell);

        // Delete Button Column
        const actionCell = document.createElement("td");
        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = "🗑 Delete";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", async () => {
            if (confirm(`Delete recording: ${recording.fileName}?`)) {
                await fetch(`/delete-recording/${recording.fileName}`, { method: "DELETE" });
                row.remove();
            }
        });
        actionCell.appendChild(deleteBtn);
        row.appendChild(actionCell);

        tableBody.appendChild(row);
    });
});
