package com.longchauuth.pharmacy.repository;

import com.longchauuth.pharmacy.entity.Inventory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    
    Optional<Inventory> findByMedicineId(Long medicineId);
    
    @Query("SELECT i FROM Inventory i WHERE i.currentStock <= i.minStock")
    List<Inventory> findLowStockItems();
    
    @Query("SELECT i FROM Inventory i WHERE i.currentStock <= i.minStock")
    Page<Inventory> findLowStockItems(Pageable pageable);
    
    @Query("SELECT i FROM Inventory i WHERE i.currentStock = 0")
    List<Inventory> findOutOfStockItems();
    
    @Query("SELECT i FROM Inventory i WHERE i.currentStock > 0")
    List<Inventory> findInStockItems();
    
    @Query("SELECT i FROM Inventory i WHERE i.currentStock > 0")
    Page<Inventory> findInStockItems(Pageable pageable);
    
    @Query("SELECT i FROM Inventory i JOIN i.medicine m WHERE " +
           "LOWER(m.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(m.genericName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(m.code) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Inventory> searchByMedicineKeyword(@Param("keyword") String keyword);
    
    @Query("SELECT i FROM Inventory i JOIN i.medicine m WHERE " +
           "LOWER(m.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(m.genericName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(m.code) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Inventory> searchByMedicineKeyword(@Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT COUNT(i) FROM Inventory i WHERE i.currentStock <= i.minStock")
    Long countLowStockItems();
    
    @Query("SELECT COUNT(i) FROM Inventory i WHERE i.currentStock = 0")
    Long countOutOfStockItems();
    
    @Query("SELECT SUM(i.currentStock * m.costPrice) FROM Inventory i JOIN i.medicine m")
    Double getTotalInventoryValue();
}
