package com.longchauuth.pharmacy.service;

import com.longchauuth.pharmacy.entity.Medicine;
import com.longchauuth.pharmacy.repository.MedicineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class MedicineService {
    
    @Autowired
    private MedicineRepository medicineRepository;
    
    public List<Medicine> getAllMedicines() {
        return medicineRepository.findAll();
    }
    
    public Page<Medicine> getAllMedicines(Pageable pageable) {
        return medicineRepository.findAll(pageable);
    }
    
    public List<Medicine> getAllActiveMedicines() {
        return medicineRepository.findAllActive();
    }
    
    public Page<Medicine> getAllActiveMedicines(Pageable pageable) {
        return medicineRepository.findAllActive(pageable);
    }
    
    public Optional<Medicine> getMedicineById(Long id) {
        return medicineRepository.findById(id);
    }
    
    public Optional<Medicine> getMedicineByCode(String code) {
        return medicineRepository.findByCode(code);
    }
    
    public Optional<Medicine> getMedicineByBarcode(String barcode) {
        return medicineRepository.findByBarcode(barcode);
    }
    
    public List<Medicine> searchMedicines(String keyword) {
        return medicineRepository.searchByKeyword(keyword);
    }
    
    public Page<Medicine> searchMedicines(String keyword, Pageable pageable) {
        return medicineRepository.searchByKeyword(keyword, pageable);
    }
    
    public List<Medicine> getMedicinesByCategory(Long categoryId) {
        return medicineRepository.findByCategoryId(categoryId);
    }
    
    public List<Medicine> getMedicinesByManufacturer(Long manufacturerId) {
        return medicineRepository.findByManufacturerId(manufacturerId);
    }
    
    public List<Medicine> getMedicinesByStatus(Medicine.MedicineStatus status) {
        return medicineRepository.findByStatus(status);
    }
    
    public Medicine saveMedicine(Medicine medicine) {
        return medicineRepository.save(medicine);
    }
    
    public Medicine updateMedicine(Long id, Medicine medicineDetails) {
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thuốc với ID: " + id));
        
        medicine.setName(medicineDetails.getName());
        medicine.setGenericName(medicineDetails.getGenericName());
        medicine.setCategory(medicineDetails.getCategory());
        medicine.setManufacturer(medicineDetails.getManufacturer());
        medicine.setUnit(medicineDetails.getUnit());
        medicine.setDosageForm(medicineDetails.getDosageForm());
        medicine.setStrength(medicineDetails.getStrength());
        medicine.setDescription(medicineDetails.getDescription());
        medicine.setPrice(medicineDetails.getPrice());
        medicine.setCostPrice(medicineDetails.getCostPrice());
        medicine.setBarcode(medicineDetails.getBarcode());
        medicine.setExpiryDate(medicineDetails.getExpiryDate());
        medicine.setBatchNumber(medicineDetails.getBatchNumber());
        medicine.setStatus(medicineDetails.getStatus());
        
        return medicineRepository.save(medicine);
    }
    
    public void deleteMedicine(Long id) {
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thuốc với ID: " + id));
        
        medicineRepository.delete(medicine);
    }
    
    public boolean existsByCode(String code) {
        return medicineRepository.findByCode(code).isPresent();
    }
    
    public boolean existsByBarcode(String barcode) {
        return medicineRepository.findByBarcode(barcode).isPresent();
    }
    
    public Long countActiveMedicines() {
        return medicineRepository.countActiveMedicines();
    }
    
    public Long countExpiredMedicines() {
        return medicineRepository.countExpiredMedicines();
    }
}
