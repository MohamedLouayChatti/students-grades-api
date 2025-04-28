document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const studentId = urlParams.get('id');
    const notesList = document.getElementById('notesList');
    const addNoteButton = document.getElementById('addNoteButton');
    const form = document.getElementById('updateStudentForm');
    const deleteNoteModalElement = document.getElementById('deleteNoteModal');
    const deleteNoteModal = new bootstrap.Modal(deleteNoteModalElement);
    const confirmDeleteButton = document.getElementById('confirmDeleteButton');
    let noteRowToDelete = null;
    let noteIdToDelete = null;

    if (!studentId) {
        console.error('No student ID found in the URL.');
        return;
    }

    async function fetchStudent() {
        try {
            const response = await fetch(`/etudiant/${studentId}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const student = await response.json();

            document.getElementById('nom').value = student.nom;
            document.getElementById('prenom').value = student.prenom;
            document.getElementById('filiere').value = student.filiere;
            document.getElementById('numeroInscription').value = student.numInscri;
            document.getElementById('cin').value = student.cin;

            for (const note of student.notes) {
                const noteRow = createNoteRow(note.matiere.id, note.matiere.nom, note.note, note.id);
                notesList.appendChild(noteRow);
            }
        } catch (error) {
            console.error('Error fetching student data:', error);
        }
    }

    function createNoteRow(matiereId, matiereNom, noteValue, noteId = null) {
        const noteRow = document.createElement('div');
        noteRow.className = 'row mb-2 align-items-center';
        noteRow.dataset.noteId = noteId;

        noteRow.innerHTML = `
            <div class="col-md-5">
                <select name="matiere" class="form-select" required>
                    <option value="${matiereId}" selected>${matiereNom}</option>
                </select>
            </div>
            <div class="col-md-5">
                <input type="number" class="form-control" name="note" value="${noteValue}" placeholder="Note" step="0.01" min="0" max="20" required>
            </div>
            <div class="col-md-2 text-end">
                <button type="button" class="btn btn-danger btn-sm remove-note-button">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;

        noteRow.querySelector('.remove-note-button').addEventListener('click', () => {
            noteRowToDelete = noteRow;
            noteIdToDelete = noteId;
            deleteNoteModal.show();
        });

        return noteRow;
    }

    confirmDeleteButton.addEventListener('click', async () => {
        if (noteIdToDelete) {
            try {
                const response = await fetch(`/notes/${noteIdToDelete}`, { method: 'DELETE' });
                if (!response.ok) throw new Error(`Failed to delete note: ${response.statusText}`);
            } catch (error) {
                console.error('Error deleting note:', error);
            }
        }
        if (noteRowToDelete) {
            noteRowToDelete.remove();
        }
        deleteNoteModal.hide();
    });

    // Fix for aria-hidden warning: Move focus to a safe element when modal is closed
    deleteNoteModalElement.addEventListener('hidden.bs.modal', () => {
        addNoteButton.focus(); // Move focus to the "Ajouter une note" button
    });

    async function loadMatieres(selectElement) {
        try {
            const response = await fetch('/matiere');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const matieres = await response.json();

            selectElement.innerHTML = `
                <option value="" disabled selected>Choisir une matière</option>
            `;
            matieres.forEach(matiere => {
                const option = document.createElement('option');
                option.value = matiere.id;
                option.textContent = matiere.nom;
                selectElement.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading matieres:', error);
        }
    }

    addNoteButton.addEventListener('click', () => {
        const noteRow = createNoteRow('', '', '');
        const selectElement = noteRow.querySelector('select');
        loadMatieres(selectElement);
        notesList.appendChild(noteRow);
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const studentData = {
            nom: formData.get('nom'),
            prenom: formData.get('prenom'),
            filiere: formData.get('filiere'),
            numInscri: formData.get('numeroInscription'),
            cin: formData.get('cin'),
        };

        try {
            // Update student
            const response = await fetch(`/etudiant/${studentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(studentData),
            });
            if (!response.ok) throw new Error(`Failed to update student: ${response.statusText}`);

            // Process notes
            const noteRows = notesList.querySelectorAll('.row');
            for (const row of noteRows) {
                const matiereId = row.querySelector('select').value;
                const noteValue = row.querySelector('input[name="note"]').value;
                let noteId = row.dataset.noteId;

                if (noteId === "null") {
                    noteId = null;
                }

                const notePayload = {
                    etudiant: { id: studentId },
                    matiere: { id: matiereId },
                    note: parseFloat(noteValue),
                };

                if (noteId === null) {
                    const noteResponse = await fetch('/notes', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(notePayload),
                    });
                    if (!noteResponse.ok) throw new Error(`Failed to add note: ${noteResponse.statusText}`);
                } else {
                    const noteResponse = await fetch(`/notes/${noteId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(notePayload),
                    });
                    if (!noteResponse.ok) throw new Error(`Failed to update note: ${noteResponse.statusText}`);
                }
            }

            window.location.replace('../etudiants.html');
        } catch (error) {
            console.error('Error updating student:', error);
        }
    });

    fetchStudent();
});