package com.longchauuth.pharmacy.controller;

import com.longchauuth.pharmacy.entity.Manufacturer;
import com.longchauuth.pharmacy.repository.ManufacturerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/manufacturers")
@CrossOrigin(origins = "*")
public class ManufacturerController {
    
    @Autowired
    private ManufacturerRepository manufacturerRepository;
    
    @GetMapping
    public ResponseEntity<List<Manufacturer>> getAllManufacturers() {
        try {
            List<Manufacturer> manufacturers = manufacturerRepository.findAll();
            return ResponseEntity.ok(manufacturers);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Manufacturer> getManufacturerById(@PathVariable Long id) {
        try {
            Optional<Manufacturer> manufacturer = manufacturerRepository.findById(id);
            return manufacturer.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping
    public ResponseEntity<Manufacturer> createManufacturer(@RequestBody Manufacturer manufacturer) {
        try {
            Manufacturer savedManufacturer = manufacturerRepository.save(manufacturer);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedManufacturer);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Manufacturer> updateManufacturer(@PathVariable Long id, @RequestBody Manufacturer manufacturerDetails) {
        try {
            Manufacturer manufacturer = manufacturerRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy nhà sản xuất với ID: " + id));
            
            manufacturer.setName(manufacturerDetails.getName());
            manufacturer.setAddress(manufacturerDetails.getAddress());
            manufacturer.setPhone(manufacturerDetails.getPhone());
            manufacturer.setEmail(manufacturerDetails.getEmail());
            
            Manufacturer updatedManufacturer = manufacturerRepository.save(manufacturer);
            return ResponseEntity.ok(updatedManufacturer);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteManufacturer(@PathVariable Long id) {
        try {
            Manufacturer manufacturer = manufacturerRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy nhà sản xuất với ID: " + id));
            
            manufacturerRepository.delete(manufacturer);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
