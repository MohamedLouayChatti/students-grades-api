package gl2.example.studentgrades.controller;

import gl2.example.studentgrades.model.Note;
import gl2.example.studentgrades.service.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/notes")
public class NoteController {

    @Autowired
    private NoteService noteService;

    @GetMapping("{id}")
    public ResponseEntity<Note> getNoteById(@PathVariable Long id) {
        Optional<Note> note = noteService.getNoteById(id);
        if (note.isPresent()) {
            return ResponseEntity.ok(note.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Note> addNote(@RequestBody Note note) {
        return noteService.addNote(note)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.badRequest().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Note> updateNote(
            @PathVariable Long id,
            @RequestBody Note note) {

        Optional<Note> existingNote = noteService.getNoteById(id);
        if (existingNote.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        note.setId(id);
        Note updatedNote = noteService.updateNote(note);

        return ResponseEntity.ok(updatedNote);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable Long id) {
        noteService.deleteNote(id);
        return ResponseEntity.noContent().build();
    }

}
