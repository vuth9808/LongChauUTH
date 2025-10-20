package com.longchauuth.controller;

import com.longchauuth.model.Medicine;
import com.longchauuth.repository.MedicineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/medicines")
public class MedicineController {

    @Autowired
    private MedicineRepository repo;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public List<Medicine> getAll(){ return repo.findAll(); }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public Optional<Medicine> getOne(@PathVariable Long id){ return repo.findById(id); }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Medicine create(@RequestBody Medicine m){ return repo.save(m); }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Medicine update(@PathVariable Long id, @RequestBody Medicine m){
        m.setId(id); return repo.save(m);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id){ repo.deleteById(id); }
}
