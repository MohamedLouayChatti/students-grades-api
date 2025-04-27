document.addEventListener("DOMContentLoaded", function () {
    fetch("partials/header.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("navbar-container").innerHTML = data;
        });

    async function loadMatieres() {
        try {
            const response = await fetch("/matiere");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const matieres = await response.json();

            const matieresRows = matieres.map(matiere => `
                <tr>
                    <td>${matiere.nom}</td>
                    <td>${matiere.unite}</td>
                    <td>
                        <button class="btn btn-outline-primary viewBtn" data-id="${matiere.id}">View</button>
                        <button class="btn btn-outline-success updateBtn" data-id="${matiere.id}">Update</button>
                        <button class="btn btn-outline-danger deleteBtn" data-id="${matiere.id}">Delete</button>
                    </td>
                </tr>
            `).join("");

            document.querySelector("#matiereTable tbody").innerHTML = matieresRows;

        } catch (error) {
            console.error("Error loading students:", error);
        }
    }

    loadMatieres();
});
