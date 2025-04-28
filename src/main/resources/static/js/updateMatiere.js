document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const matiereId = urlParams.get("id");
    const form = document.getElementById("updateMatiereForm");

    if (!matiereId) {
        console.error("No matiere ID found in the URL.");
        window.location.href = "matieres.html";
        return;
    }

    // Fetch and populate matiere data
    async function fetchMatiere() {
        try {
            const response = await fetch(`/matiere/${matiereId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const matiere = await response.json();
            document.getElementById("nomMatiere").value = matiere.nom;
            document.getElementById("uniteEnseignement").value = matiere.unite;
        } catch (error) {
            console.error("Error fetching matiere data:", error);
        }
    }

    // Handle form submission
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const updatedMatiere = {
            nom: document.getElementById("nomMatiere").value,
            unite: document.getElementById("uniteEnseignement").value,
        };

        try {
            const response = await fetch(`/matiere/${matiereId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedMatiere),
            });
            if (!response.ok) {
                throw new Error(`Failed to update matiere: ${response.statusText}`);
            }
            window.location.href = "matieres.html";
        } catch (error) {
            console.error("Error updating matiere:", error);
        }
    });

    fetchMatiere();
});