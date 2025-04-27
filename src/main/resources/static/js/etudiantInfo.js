document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const studentId = urlParams.get("id");

    async function fetchNoteDetails(noteId) {
        try {
            const response = await fetch(`/notes/${noteId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error fetching note details for note ID ${noteId}:`, error);
        }
    }

    async function fetchMatiereDetails(matiereId) {
        try {
            const response = await fetch(`/matiere/${matiereId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error fetching matiere details for matiere ID ${matiereId}:`, error);
        }
    }

    if (!studentId) {
        console.error("No student ID found in the URL.");
        window.location.href = `../etudiants.html`;
        return;
    }

    try {
        const response = await fetch(`/etudiant/${studentId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const student = await response.json();

        document.getElementById("nom").textContent = student.nom;
        document.getElementById("prenom").textContent = student.prenom;
        document.getElementById("filiere").textContent = student.filiere;
        document.getElementById("numInscri").textContent = student.numInscri;
        document.getElementById("cin").textContent = student.cin;

        const notesList = document.getElementById("notesList");
        for (const note of student.notes) {
            const noteDetails = await fetchNoteDetails(note.id);
            if (noteDetails) {
                const matiereDetails = await fetchMatiereDetails(noteDetails.matiere.id);
                if (matiereDetails) {
                    const listItem = document.createElement("li");
                    listItem.className = "list-group-item";
                    listItem.textContent = `${matiereDetails.nom}: ${noteDetails.note}/20`;
                    notesList.appendChild(listItem);
                }
            }
        }
    } catch (error) {
        console.error("Error fetching student data:", error);
    }
});