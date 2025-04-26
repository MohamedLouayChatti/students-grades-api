package gl2.example.studentgrades.model;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import java.util.List;

@Entity
public class Etudiant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String prenom;
    private String filiere;
    private int numInscri; // Changed to int
    private int cin; // Changed to int

    @OneToMany(mappedBy = "etudiant", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("etudiant-notes")
    private List<Note> notes;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getFiliere() {
        return filiere;
    }

    public void setFiliere(String filiere) {
        this.filiere = filiere;
    }

    public int getNumInscri() { // Updated getter
        return numInscri;
    }

    public void setNumInscri(int numInscri) { // Updated setter
        this.numInscri = numInscri;
    }

    public int getCin() { // Updated getter
        return cin;
    }

    public void setCin(int cin) { // Updated setter
        this.cin = cin;
    }

    public List<Note> getNotes() {
        return notes;
    }

    public void setNotes(List<Note> notes) {
        this.notes = notes;
    }

    public float calculMoyenne() {
        if (notes == null || notes.isEmpty()) {
            return 0;
        }
        float somme = 0;
        for (Note note : notes) {
            somme += note.getNote();
        }
        return somme / notes.size();
    }
}