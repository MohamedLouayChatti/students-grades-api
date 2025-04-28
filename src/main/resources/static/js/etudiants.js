document.addEventListener("DOMContentLoaded", function () {
    fetch("partials/header.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("navbar-container").innerHTML = data;
        });

    const deleteStudentModalElement = document.createElement("div");
    deleteStudentModalElement.innerHTML = `
        <div class="modal fade" id="deleteStudentModal" tabindex="-1" aria-labelledby="deleteStudentModalLabel" aria-hidden="true" data-bs-backdrop="static">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="deleteStudentModalLabel">Suppression de l'étudiant</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fermer"></button>
                    </div>
                    <div class="modal-body">
                        Êtes-vous sûr de vouloir supprimer cet étudiant ? Cette action est irréversible.
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                        <button type="button" class="btn btn-danger" id="confirmDeleteStudentButton">Supprimer</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(deleteStudentModalElement);

    const deleteStudentModal = new bootstrap.Modal(document.getElementById("deleteStudentModal"));
    let studentIdToDelete = null;

    async function loadStudents() {
        try {
            const response = await fetch("/etudiant");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const students = await response.json();

            const studentRows = students.map(student => `
                <tr id="student-${student.id}">
                    <td>${student.nom}</td>
                    <td>${student.prenom}</td>
                    <td>${student.filiere}</td>
                    <td>${student.numInscri}</td>
                    <td>${student.cin}</td>
                    <td class="moyenne-cell"></td>
                    <td>
                        <button class="btn btn-outline-primary viewBtn" data-id="${student.id}">Détails</button>
                        <button class="btn btn-outline-success updateBtn" data-id="${student.id}">Modifier</button>
                        <button class="btn btn-outline-danger deleteBtn" data-id="${student.id}">Supprimer</button>
                    </td>
                </tr>
            `).join("");

            document.querySelector("#studentTable tbody").innerHTML = studentRows;

            students.forEach(student => {
                loadMoyenne(student.id);
            });

            document.querySelectorAll(".viewBtn").forEach(button => {
                button.addEventListener("click", function () {
                    const studentId = this.dataset.id;
                    window.location.href = `../etudiantInfo.html?id=${studentId}`;
                });
            });

            document.querySelectorAll(".updateBtn").forEach(button => {
                button.addEventListener("click", function () {
                    const studentId = this.dataset.id;
                    window.location.href = `../updateEtudiant.html?id=${studentId}`;
                });
            });

            document.querySelectorAll(".deleteBtn").forEach(button => {
                button.addEventListener("click", function () {
                    studentIdToDelete = this.dataset.id;
                    deleteStudentModal.show();
                });
            });
        } catch (error) {
            console.error("Error loading students:", error);
        }
    }

    async function deleteStudentAndNotes(studentId) {
        try {
            // Fetch the student to get their notes
            const studentResponse = await fetch(`/etudiant/${studentId}`);
            if (!studentResponse.ok) {
                throw new Error(`Failed to fetch student: ${studentResponse.statusText}`);
            }
            const student = await studentResponse.json();

            // Delete all notes of the student
            for (const note of student.notes) {
                const noteResponse = await fetch(`/notes/${note.id}`, {method: "DELETE"});
                if (!noteResponse.ok) {
                    throw new Error(`Failed to delete note with ID ${note.id}: ${noteResponse.statusText}`);
                }
            }

            // Delete the student
            const studentDeleteResponse = await fetch(`/etudiant/${studentId}`, {method: "DELETE"});
            if (!studentDeleteResponse.ok) {
                throw new Error(`Failed to delete student: ${studentDeleteResponse.statusText}`);
            }

            // Remove the student row from the table
            const studentRow = document.getElementById(`student-${studentId}`);
            if (studentRow) {
                studentRow.remove();
            }

            deleteStudentModal.hide();
        } catch (error) {
            console.error("Error deleting student and notes:", error);
        }
    }

    document.getElementById("confirmDeleteStudentButton").addEventListener("click", () => {
        if (studentIdToDelete) {
            deleteStudentAndNotes(studentIdToDelete);
        }
    });

    async function loadMoyenne(studentId) {
        try {
            const response = await fetch(`/etudiant/moyenne/${studentId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const moyenne = await response.json();

            const row = document.getElementById(`student-${studentId}`);
            if (row) {
                row.querySelector(".moyenne-cell").textContent = moyenne.toFixed(2); // 2 decimal places
            }
        } catch (error) {
            console.error(`Error loading moyenne for student ${studentId}:`, error);
        }
    }

    loadStudents();
});