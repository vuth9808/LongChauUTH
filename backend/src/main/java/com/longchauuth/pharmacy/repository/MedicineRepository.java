package com.longchauuth.pharmacy.repository;

import com.longchauuth.pharmacy.entity.Medicine;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long> {
    
    Optional<Medicine> findByCode(String code);
    
    Optional<Medicine> findByBarcode(String barcode);
    
    List<Medicine> findByNameContainingIgnoreCase(String name);
    
    List<Medicine> findByGenericNameContainingIgnoreCase(String genericName);
    
    List<Medicine> findByCategoryId(Long categoryId);
    
    List<Medicine> findByManufacturerId(Long manufacturerId);
    
    List<Medicine> findByStatus(Medicine.MedicineStatus status);
    
    @Query("SELECT m FROM Medicine m WHERE " +
           "LOWER(m.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(m.genericName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(m.code) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Medicine> searchByKeyword(@Param("keyword") String keyword);
    
    @Query("SELECT m FROM Medicine m WHERE " +
           "LOWER(m.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(m.genericName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(m.code) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Medicine> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT m FROM Medicine m WHERE m.status = 'ACTIVE'")
    List<Medicine> findAllActive();
    
    @Query("SELECT m FROM Medicine m WHERE m.status = 'ACTIVE'")
    Page<Medicine> findAllActive(Pageable pageable);
    
    @Query("SELECT COUNT(m) FROM Medicine m WHERE m.status = 'ACTIVE'")
    Long countActiveMedicines();
    
    @Query("SELECT COUNT(m) FROM Medicine m WHERE m.status = 'EXPIRED'")
    Long countExpiredMedicines();
}
