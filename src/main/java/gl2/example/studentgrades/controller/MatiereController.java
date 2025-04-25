package gl2.example.studentgrades.controller;

import gl2.example.studentgrades.model.Matiere;
import gl2.example.studentgrades.service.MatiereService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/matiere")
public class MatiereController {
    @Autowired
    private MatiereService matiereService;

    @GetMapping
    public List<Matiere> getAllMatieres() {
        return matiereService.getAllMatieres();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Matiere> getMatiereById(@PathVariable Long id) {
        Optional<Matiere> matiere = matiereService.getMatiereById(id);
        if (matiere.isPresent()) {
            return ResponseEntity.ok(matiere.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public Matiere addMatiere(@RequestBody Matiere matiere) {
        return matiereService.addMatiere(matiere);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMatiere(@PathVariable Long id) {
        matiereService.deleteMatiere(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Matiere> updateMatiere(
            @PathVariable Long id,
            @RequestBody Matiere matiere) {

        Optional<Matiere> existingMatiere = matiereService.getMatiereById(id);
        if (existingMatiere.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        matiere.setId(id);
        Matiere updatedMatiere = matiereService.updateMatiere(matiere);

        return ResponseEntity.ok(updatedMatiere);
    }
}