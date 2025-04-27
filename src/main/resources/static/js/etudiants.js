document.addEventListener("DOMContentLoaded", function () {
    fetch("partials/header.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("navbar-container").innerHTML = data;
        });

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
                        <button class="btn btn-outline-primary viewBtn" data-id="${student.id}">View</button>
                        <button class="btn btn-outline-success updateBtn" data-id="${student.id}">Update</button>
                        <button class="btn btn-outline-danger deleteBtn" data-id="${student.id}">Delete</button>
                    </td>
                </tr>
            `).join("");

            document.querySelector("#studentTable tbody").innerHTML = studentRows;

            students.forEach(student => {
                loadMoyenne(student.id);
            });

        } catch (error) {
            console.error("Error loading students:", error);
        }
    }

    async function loadMoyenne(studentId) {
        try {
            const response = await fetch("/etudiant/moyenne/"+studentId);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const moyenne = await response.json();

            const row = document.getElementById("student-"+studentId);
            if (row) {
                row.querySelector(".moyenne-cell").textContent = moyenne.toFixed(2); // 2 decimal places
            }
        } catch (error) {
            console.error(`Error loading moyenne for student ${studentId}:`, error);
        }
    }

    loadStudents();
});
