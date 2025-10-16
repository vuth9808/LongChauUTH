package com.longchauuth.pharmacy.dto;

import java.time.LocalDateTime;

public class InventoryDTO {

    private Long id;
    private Long medicineId;
    private String medicineCode;
    private String medicineName;
    private String medicineGenericName;
    private String medicineUnit;
    private Integer currentStock;
    private Integer minStock;
    private Integer maxStock;
    private LocalDateTime lastUpdated;

    // Constructors
    public InventoryDTO() {
    }

    public InventoryDTO(Long id, Long medicineId, String medicineCode, String medicineName,
            Integer currentStock, Integer minStock, Integer maxStock) {
        this.id = id;
        this.medicineId = medicineId;
        this.medicineCode = medicineCode;
        this.medicineName = medicineName;
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

    public Long getMedicineId() {
        return medicineId;
    }

    public void setMedicineId(Long medicineId) {
        this.medicineId = medicineId;
    }

    public String getMedicineCode() {
        return medicineCode;
    }

    public void setMedicineCode(String medicineCode) {
        this.medicineCode = medicineCode;
    }

    public String getMedicineName() {
        return medicineName;
    }

    public void setMedicineName(String medicineName) {
        this.medicineName = medicineName;
    }

    public String getMedicineGenericName() {
        return medicineGenericName;
    }

    public void setMedicineGenericName(String medicineGenericName) {
        this.medicineGenericName = medicineGenericName;
    }

    public String getMedicineUnit() {
        return medicineUnit;
    }

    public void setMedicineUnit(String medicineUnit) {
        this.medicineUnit = medicineUnit;
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

    public boolean isOutOfStock() {
        return currentStock == 0;
    }

    public String getStockStatus() {
        if (isOutOfStock()) {
            return "Hết hàng";
        } else if (isLowStock()) {
            return "Sắp hết";
        } else if (isOverStock()) {
            return "Đầy kho";
        } else {
            return "Bình thường";
        }
    }
}
