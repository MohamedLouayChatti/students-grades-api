document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const matiereId = urlParams.get("id");

    if (!matiereId) {
        console.error("No matiere ID found in the URL.");
        window.location.href = `../matieres.html`;
        return;
    }

    async function fetchEtudiantDetails(etudiantId) {
        try {
            const response = await fetch(`/etudiant/${etudiantId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error fetching etudiant details for ID ${etudiantId}:`, error);
        }
    }

    try {
        const response = await fetch(`/matiere/${matiereId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const matiere = await response.json();

        // Populate matiere information
        document.getElementById("nomMatiere").textContent = matiere.nom;
        document.getElementById("uniteEnseignement").textContent = matiere.unite;

        // Populate notes and associated etudiants
        const notesTableBody = document.getElementById("notesTableBody");
        for (const note of matiere.notes) {
            const etudiant = await fetchEtudiantDetails(note.etudiant.id);
            if (etudiant) {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${etudiant.nom}</td>
                    <td>${etudiant.prenom}</td>
                    <td>${etudiant.numInscri}</td>
                    <td>${note.note}/20</td>
                `;
                notesTableBody.appendChild(row);
            }
        }
    } catch (error) {
        console.error("Error fetching matiere data:", error);
    }
});