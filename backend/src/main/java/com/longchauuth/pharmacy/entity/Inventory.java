package com.longchauuth.pharmacy.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "inventory")
public class Inventory {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medicine_id", nullable = false, unique = true)
    @JsonBackReference
    private Medicine medicine;
    
    @Column(name = "current_stock", nullable = false)
    private Integer currentStock = 0;
    
    @Column(name = "min_stock", nullable = false)
    private Integer minStock = 0;
    
    @Column(name = "max_stock", nullable = false)
    private Integer maxStock = 0;
    
    @UpdateTimestamp
    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;
    
    // Constructors
    public Inventory() {}
    
    public Inventory(Medicine medicine, Integer currentStock, Integer minStock, Integer maxStock) {
        this.medicine = medicine;
        this.currentStock = currentStock;
        this.minStock = minStock;
        this.maxStock = maxStock;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Medicine getMedicine() {
        return medicine;
    }
    
    public void setMedicine(Medicine medicine) {
        this.medicine = medicine;
    }
    
    public Integer getCurrentStock() {
        return currentStock;
    }
    
    public void setCurrentStock(Integer currentStock) {
        this.currentStock = currentStock;
    }
    
    public Integer getMinStock() {
        return minStock;
    }
    
    public void setMinStock(Integer minStock) {
        this.minStock = minStock;
    }
    
    public Integer getMaxStock() {
        return maxStock;
    }
    
    public void setMaxStock(Integer maxStock) {
        this.maxStock = maxStock;
    }
    
    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }
    
    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
    
    // Business methods
    public boolean isLowStock() {
        return currentStock <= minStock;
    }
    
    public boolean isOverStock() {
        return currentStock >= maxStock;
    }
    
    public void addStock(Integer quantity) {
        this.currentStock += quantity;
    }
    
    public void reduceStock(Integer quantity) {
        if (this.currentStock >= quantity) {
            this.currentStock -= quantity;
        } else {
            throw new IllegalArgumentException("Không đủ hàng trong kho");
        }
    }
}
