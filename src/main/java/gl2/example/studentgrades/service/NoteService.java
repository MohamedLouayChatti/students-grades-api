package gl2.example.studentgrades.service;

import gl2.example.studentgrades.model.Matiere;
import gl2.example.studentgrades.model.Note;
import gl2.example.studentgrades.model.Etudiant;
import gl2.example.studentgrades.repository.EtudiantRepository;
import gl2.example.studentgrades.repository.NoteRepository;
import gl2.example.studentgrades.repository.MatiereRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NoteService {

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private EtudiantRepository etudiantRepository;

    @Autowired
    private MatiereRepository matiereRepository;

    public Optional<Note> getNoteById(Long id) {
        return noteRepository.findById(id);
    }

    public Optional<Note> addNote(Note note) {
        if (note.getEtudiant() == null || note.getMatiere() == null) {
            return Optional.empty();
        }
        Optional<Etudiant> etudiant = etudiantRepository.findById(note.getEtudiant().getId());
        Optional<Matiere> matiere = matiereRepository.findById(note.getMatiere().getId());

        if (etudiant.isPresent() && matiere.isPresent()) {
            note.setEtudiant(etudiant.get());
            note.setMatiere(matiere.get());
            return Optional.of(noteRepository.save(note));
        } else {
            return Optional.empty();
        }
    }

    public void deleteNote(Long id) {
        noteRepository.deleteById(id);
    }

    public Note updateNote(Note note) {
        return noteRepository.save(note);
    }

}