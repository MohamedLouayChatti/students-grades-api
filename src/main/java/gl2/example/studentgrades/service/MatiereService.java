package gl2.example.studentgrades.service;

import gl2.example.studentgrades.model.Matiere;
import gl2.example.studentgrades.repository.MatiereRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MatiereService {

    @Autowired
    private MatiereRepository matiereRepository;

    public List<Matiere> getAllMatieres() {
        return matiereRepository.findAll();
    }

    public Optional<Matiere> getMatiereById(Long id) {
        return matiereRepository.findById(id);
    }

    public Matiere addMatiere(Matiere matiere) {
        return matiereRepository.save(matiere);
    }

    public Matiere updateMatiere(Matiere matiere) {
        return matiereRepository.save(matiere);
    }

    public void deleteMatiere(Long id) {
        matiereRepository.deleteById(id);
    }
}