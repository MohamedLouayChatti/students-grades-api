document.addEventListener("DOMContentLoaded", function () {
    fetch("partials/header.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("navbar-container").innerHTML = data;
        });

    const deleteMatiereModalElement = document.createElement("div");
    deleteMatiereModalElement.innerHTML = `
        <div class="modal fade" id="deleteMatiereModal" tabindex="-1" aria-labelledby="deleteMatiereModalLabel" aria-hidden="true" data-bs-backdrop="static">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="deleteMatiereModalLabel">Suppression de la matière</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fermer"></button>
                    </div>
                    <div class="modal-body">
                        Êtes-vous sûr de vouloir supprimer cette matière ? Cette action est irréversible.
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                        <button type="button" class="btn btn-danger" id="confirmDeleteMatiereButton">Supprimer</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(deleteMatiereModalElement);

    const deleteMatiereModal = new bootstrap.Modal(document.getElementById("deleteMatiereModal"));
    let matiereIdToDelete = null;

    async function loadMatieres() {
        try {
            const response = await fetch("/matiere");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const matieres = await response.json();

            const matieresRows = matieres.map(matiere => `
                <tr id="matiere-${matiere.id}">
                    <td>${matiere.nom}</td>
                    <td>${matiere.unite}</td>
                    <td>
                        <button class="btn btn-outline-primary viewBtn" data-id="${matiere.id}">Détails</button>
                        <button class="btn btn-outline-success updateBtn" data-id="${matiere.id}">Modifier</button>
                        <button class="btn btn-outline-danger deleteBtn" data-id="${matiere.id}">Supprimer</button>
                    </td>
                </tr>
            `).join("");

            document.querySelector("#matiereTable tbody").innerHTML = matieresRows;

            document.querySelectorAll(".viewBtn").forEach(button => {
                button.addEventListener("click", function () {
                    const matiereId = this.dataset.id;
                    window.location.href = `../matiereInfo.html?id=${matiereId}`;
                });
            });

            document.querySelectorAll(".updateBtn").forEach(button => {
                button.addEventListener("click", function () {
                    const matiereId = this.dataset.id;
                    window.location.href = `../updateMatiere.html?id=${matiereId}`;
                });
            });

            document.querySelectorAll(".deleteBtn").forEach(button => {
                button.addEventListener("click", function () {
                    matiereIdToDelete = this.dataset.id;
                    deleteMatiereModal.show();
                });
            });
        } catch (error) {
            console.error("Error loading matieres:", error);
        }
    }

    async function deleteMatiereAndNotes(matiereId) {
        try {
            // Fetch the matiere to get its related notes
            const matiereResponse = await fetch(`/matiere/${matiereId}`);
            if (!matiereResponse.ok) {
                throw new Error(`Failed to fetch matiere: ${matiereResponse.statusText}`);
            }
            const matiere = await matiereResponse.json();

            // Delete all notes related to the matiere
            for (const note of matiere.notes) {
                const noteResponse = await fetch(`/notes/${note.id}`, { method: "DELETE" });
                if (!noteResponse.ok) {
                    throw new Error(`Failed to delete note with ID ${note.id}: ${noteResponse.statusText}`);
                }
            }

            // Delete the matiere
            const matiereDeleteResponse = await fetch(`/matiere/${matiereId}`, { method: "DELETE" });
            if (!matiereDeleteResponse.ok) {
                throw new Error(`Failed to delete matiere: ${matiereDeleteResponse.statusText}`);
            }

            // Remove the matiere row from the table
            const matiereRow = document.getElementById(`matiere-${matiereId}`);
            if (matiereRow) {
                matiereRow.remove();
            }

            deleteMatiereModal.hide();
        } catch (error) {
            console.error("Error deleting matiere and notes:", error);
        }
    }

    document.getElementById("confirmDeleteMatiereButton").addEventListener("click", () => {
        if (matiereIdToDelete) {
            deleteMatiereAndNotes(matiereIdToDelete);
        }
    });

    loadMatieres();
});