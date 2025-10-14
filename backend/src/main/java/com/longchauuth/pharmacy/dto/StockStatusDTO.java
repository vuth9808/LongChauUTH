package com.longchauuth.pharmacy.dto;

public class StockStatusDTO {

    private Integer currentStock;
    private Boolean isLowStock;
    private Boolean isOutOfStock;
    private String status;

    // Constructors
    public StockStatusDTO() {
    }

    public StockStatusDTO(Integer currentStock, Boolean isLowStock, Boolean isOutOfStock) {
        this.currentStock = currentStock;
        this.isLowStock = isLowStock;
        this.isOutOfStock = isOutOfStock;
        this.status = determineStatus();
    }

    // Getters and Setters
    public Integer getCurrentStock() {
        return currentStock;
    }

    public void setCurrentStock(Integer currentStock) {
        this.currentStock = currentStock;
    }

    public Boolean getIsLowStock() {
        return isLowStock;
    }

    public void setIsLowStock(Boolean isLowStock) {
        this.isLowStock = isLowStock;
    }

    public Boolean getIsOutOfStock() {
        return isOutOfStock;
    }

    public void setIsOutOfStock(Boolean isOutOfStock) {
        this.isOutOfStock = isOutOfStock;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    // Helper method
    private String determineStatus() {
        if (isOutOfStock) {
            return "Hết hàng";
        } else if (isLowStock) {
            return "Sắp hết";
        } else {
            return "Bình thường";
        }
    }
}

