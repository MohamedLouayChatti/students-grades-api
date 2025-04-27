document.getElementById('addMatiereForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    const matiereData = {};

    formData.forEach((value, key) => {
        matiereData[key] = value;
    });

    try {
        const matiereResponse = await fetch('/matiere', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(matiereData),
        });
        if (matiereResponse.ok) {
            window.location.replace('../matieres.html');
        } else {
            console.error('Failed to add matiere:', matiereResponse.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});