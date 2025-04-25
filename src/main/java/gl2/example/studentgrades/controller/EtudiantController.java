package gl2.example.studentgrades.controller;

import gl2.example.studentgrades.model.Etudiant;
import gl2.example.studentgrades.service.EtudiantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/etudiant")
public class EtudiantController {
    @Autowired
    private EtudiantService etudiantService;

    @GetMapping
    public List<Etudiant> getAllEtudiants() {
        return etudiantService.getAllEtudiants();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Etudiant> getEtudiantById(@PathVariable Long id) {
        Optional<Etudiant> etudiant = etudiantService.getEtudiantById(id);
        if (etudiant.isPresent()) {
            return ResponseEntity.ok(etudiant.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public Etudiant addEtudiant(@RequestBody Etudiant etudiant) {
        return etudiantService.addEtudiant(etudiant);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEtudiant(@PathVariable Long id) {
        etudiantService.deleteEtudiant(id);
        return ResponseEntity.noContent().build();
    }


    @PutMapping("/{id}")
    public ResponseEntity<Etudiant> updateEtudiant(
            @PathVariable Long id,
            @RequestBody Etudiant etudiant) {

        Optional<Etudiant> existingEtudiant = etudiantService.getEtudiantById(id);
        if (existingEtudiant.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        etudiant.setId(id);
        Etudiant updatedEtudiant = etudiantService.updateEtudiant(etudiant);

        return ResponseEntity.ok(updatedEtudiant);
    }
}
