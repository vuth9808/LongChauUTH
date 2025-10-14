package com.longchauuth.pharmacy.controller;

import com.longchauuth.pharmacy.dto.MedicineCreateDTO;
import com.longchauuth.pharmacy.dto.MedicineDTO;
import com.longchauuth.pharmacy.dto.MedicineStatsDTO;
import com.longchauuth.pharmacy.dto.MedicineUpdateDTO;
import com.longchauuth.pharmacy.entity.Medicine;
import com.longchauuth.pharmacy.mapper.MedicineMapper;
import com.longchauuth.pharmacy.service.MedicineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/medicines")
@CrossOrigin(origins = "*")
public class MedicineController {

    @Autowired
    private MedicineService medicineService;

    @Autowired
    private MedicineMapper medicineMapper;

    @GetMapping
    public ResponseEntity<List<MedicineDTO>> getAllMedicines() {
        try {
            List<Medicine> medicines = medicineService.getAllMedicines();
            List<MedicineDTO> medicineDTOs = medicines.stream()
                    .map(medicineMapper::toDTO)
                    .toList();
            return ResponseEntity.ok(medicineDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/paged")
    public ResponseEntity<Page<Medicine>> getAllMedicinesPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        try {
            Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
            Pageable pageable = PageRequest.of(page, size, sort);
            Page<Medicine> medicines = medicineService.getAllMedicines(pageable);
            return ResponseEntity.ok(medicines);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/active")
    public ResponseEntity<List<MedicineDTO>> getAllActiveMedicines() {
        try {
            List<Medicine> medicines = medicineService.getAllActiveMedicines();
            List<MedicineDTO> medicineDTOs = medicines.stream()
                    .map(medicineMapper::toDTO)
                    .toList();
            return ResponseEntity.ok(medicineDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/active/paged")
    public ResponseEntity<Page<Medicine>> getAllActiveMedicinesPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        try {
            Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
            Pageable pageable = PageRequest.of(page, size, sort);
            Page<Medicine> medicines = medicineService.getAllActiveMedicines(pageable);
            return ResponseEntity.ok(medicines);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicineDTO> getMedicineById(@PathVariable Long id) {
        try {
            Optional<Medicine> medicine = medicineService.getMedicineById(id);
            return medicine.map(medicineMapper::toDTO)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<Medicine> getMedicineByCode(@PathVariable String code) {
        try {
            Optional<Medicine> medicine = medicineService.getMedicineByCode(code);
            return medicine.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/barcode/{barcode}")
    public ResponseEntity<Medicine> getMedicineByBarcode(@PathVariable String barcode) {
        try {
            Optional<Medicine> medicine = medicineService.getMedicineByBarcode(barcode);
            return medicine.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Medicine>> searchMedicines(@RequestParam String keyword) {
        try {
            List<Medicine> medicines = medicineService.searchMedicines(keyword);
            return ResponseEntity.ok(medicines);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/search/paged")
    public ResponseEntity<Page<Medicine>> searchMedicinesPaged(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        try {
            Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
            Pageable pageable = PageRequest.of(page, size, sort);
            Page<Medicine> medicines = medicineService.searchMedicines(keyword, pageable);
            return ResponseEntity.ok(medicines);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Medicine>> getMedicinesByCategory(@PathVariable Long categoryId) {
        try {
            List<Medicine> medicines = medicineService.getMedicinesByCategory(categoryId);
            return ResponseEntity.ok(medicines);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/manufacturer/{manufacturerId}")
    public ResponseEntity<List<Medicine>> getMedicinesByManufacturer(@PathVariable Long manufacturerId) {
        try {
            List<Medicine> medicines = medicineService.getMedicinesByManufacturer(manufacturerId);
            return ResponseEntity.ok(medicines);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Medicine>> getMedicinesByStatus(@PathVariable String status) {
        try {
            Medicine.MedicineStatus medicineStatus = Medicine.MedicineStatus.valueOf(status.toUpperCase());
            List<Medicine> medicines = medicineService.getMedicinesByStatus(medicineStatus);
            return ResponseEntity.ok(medicines);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping
    public ResponseEntity<MedicineDTO> createMedicine(@RequestBody MedicineCreateDTO medicineCreateDTO) {
        try {
            // Kiểm tra mã thuốc đã tồn tại chưa
            if (medicineService.existsByCode(medicineCreateDTO.getCode())) {
                return ResponseEntity.badRequest().build();
            }

            // Kiểm tra barcode đã tồn tại chưa (nếu có)
            if (medicineCreateDTO.getBarcode() != null && !medicineCreateDTO.getBarcode().isEmpty()
                    && medicineService.existsByBarcode(medicineCreateDTO.getBarcode())) {
                return ResponseEntity.badRequest().build();
            }

            Medicine medicine = medicineMapper.toEntity(medicineCreateDTO);
            Medicine savedMedicine = medicineService.saveMedicine(medicine);
            MedicineDTO medicineDTO = medicineMapper.toDTO(savedMedicine);
            return ResponseEntity.status(HttpStatus.CREATED).body(medicineDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<MedicineDTO> updateMedicine(@PathVariable Long id,
            @RequestBody MedicineUpdateDTO medicineUpdateDTO) {
        try {
            Medicine existingMedicine = medicineService.getMedicineById(id)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy thuốc với ID: " + id));

            medicineMapper.updateEntity(existingMedicine, medicineUpdateDTO);
            Medicine updatedMedicine = medicineService.saveMedicine(existingMedicine);
            MedicineDTO medicineDTO = medicineMapper.toDTO(updatedMedicine);
            return ResponseEntity.ok(medicineDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedicine(@PathVariable Long id) {
        try {
            medicineService.deleteMedicine(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/stats/count")
    public ResponseEntity<MedicineStatsDTO> getMedicineStats() {
        try {
            Long activeCount = medicineService.countActiveMedicines();
            Long expiredCount = medicineService.countExpiredMedicines();

            MedicineStatsDTO statsDTO = new MedicineStatsDTO(activeCount, expiredCount, activeCount + expiredCount);
            return ResponseEntity.ok(statsDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
