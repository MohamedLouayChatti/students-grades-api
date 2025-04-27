document.addEventListener('DOMContentLoaded', () => {
    const notesList = document.getElementById('notesList');
    const addNoteButton = document.getElementById('addNoteButton');

    async function loadMatieres(selectElement) {
        try {
            const response = await fetch("/matiere");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const matieres = await response.json();

            selectElement.innerHTML = `
            <option value="" disabled selected>Choisir une matière</option>
        `;

            // Append new options
            matieres.forEach(matiere => {
                const option = document.createElement('option');
                option.value = matiere.nom;
                option.textContent = matiere.nom;
                option.dataset.id = matiere.id;
                selectElement.appendChild(option);
            });

        } catch (error) {
            console.error("Error loading subjects:", error);
        }
    }

    addNoteButton.addEventListener('click', () => {
        const noteRow = document.createElement('div');
        noteRow.className = 'row mb-2 align-items-center';

        noteRow.innerHTML = `
        <div class="col-md-5">
            <select name="note" class="form-select" required>
            </select>
        </div>
        <div class="col-md-5">
            <input type="number" class="form-control" name="note" placeholder="Note" step="0.01" min="0" max="20" required>
        </div>
        <div class="col-md-2 text-end">
            <button type="button" class="btn btn-danger btn-sm remove-note-button">
                <i class="bi bi-trash"></i>
            </button>
        </div>
    `;

        const selectElement = noteRow.querySelector('select');
        loadMatieres(selectElement);

        notesList.appendChild(noteRow);

        noteRow.querySelector('.remove-note-button').addEventListener('click', () => {
            notesList.removeChild(noteRow);
        });
    });
});

document.getElementById('addStudentForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    // Separate student data and notes
    const studentData = {};
    const notes = [];

    // Collect student data (exclude notes)
    formData.forEach((value, key) => {
        if (key !== 'note') {
            studentData[key] = value; // Add to student data
        }
    });

    // Collect notes data from the notesList
    const noteRows = document.querySelectorAll('#notesList .row');
    noteRows.forEach(row => {
        const matiereId = row.querySelector('select').selectedOptions[0].dataset.id;
        const noteValue = row.querySelector('input[type="number"]').value; // Get note value
        if (matiereId && noteValue) {
            notes.push({ matiereId, noteValue });
        }
    });

    try {
        // Send student data
        const studentResponse = await fetch('/etudiant', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(studentData),
        });

        if (studentResponse.ok) {
            const student = await studentResponse.json(); // Get the added student data
            console.log('Student added successfully');

            // Send notes data
            for (const note of notes) {
                const notePayload = {
                    etudiant: { id: student.id }, // Use the added student's ID
                    matiere: { id: note.matiereId }, // Use the matiere ID
                    note: parseFloat(note.noteValue), // Convert note value to float
                };

                const noteResponse = await fetch('/notes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(notePayload),
                });

                if (!noteResponse.ok) {
                    console.error('Failed to add note:', noteResponse.statusText);
                }
            }

            // Optionally, reset the form or redirect
            form.reset();
        } else {
            console.error('Failed to add student:', studentResponse.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});