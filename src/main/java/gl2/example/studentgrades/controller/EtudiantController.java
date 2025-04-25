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
    public List<Etudiant> getAllEmployees() {
        return etudiantService.getAllEtudiants();
    }
}
