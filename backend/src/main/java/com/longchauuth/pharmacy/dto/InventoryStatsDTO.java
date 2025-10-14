package com.longchauuth.pharmacy.dto;

public class InventoryStatsDTO {

    private Long lowStockItems;
    private Long outOfStockItems;
    private Double totalInventoryValue;

    // Constructors
    public InventoryStatsDTO() {
    }

    public InventoryStatsDTO(Long lowStockItems, Long outOfStockItems, Double totalInventoryValue) {
        this.lowStockItems = lowStockItems;
        this.outOfStockItems = outOfStockItems;
        this.totalInventoryValue = totalInventoryValue;
    }

    // Getters and Setters
    public Long getLowStockItems() {
        return lowStockItems;
    }

    public void setLowStockItems(Long lowStockItems) {
        this.lowStockItems = lowStockItems;
    }

    public Long getOutOfStockItems() {
        return outOfStockItems;
    }

    public void setOutOfStockItems(Long outOfStockItems) {
        this.outOfStockItems = outOfStockItems;
    }

    public Double getTotalInventoryValue() {
        return totalInventoryValue;
    }

    public void setTotalInventoryValue(Double totalInventoryValue) {
        this.totalInventoryValue = totalInventoryValue;
    }
}

