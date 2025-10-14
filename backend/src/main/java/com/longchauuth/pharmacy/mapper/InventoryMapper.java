package com.longchauuth.pharmacy.mapper;

import com.longchauuth.pharmacy.dto.InventoryDTO;
import com.longchauuth.pharmacy.dto.StockStatusDTO;
import com.longchauuth.pharmacy.entity.Inventory;
import org.springframework.stereotype.Component;

@Component
public class InventoryMapper {

    public InventoryDTO toDTO(Inventory inventory) {
        if (inventory == null) {
            return null;
        }

        InventoryDTO dto = new InventoryDTO();
        dto.setId(inventory.getId());
        dto.setCurrentStock(inventory.getCurrentStock());
        dto.setMinStock(inventory.getMinStock());
        dto.setMaxStock(inventory.getMaxStock());
        dto.setLastUpdated(inventory.getLastUpdated());

        // Set medicine information
        if (inventory.getMedicine() != null) {
            dto.setMedicineId(inventory.getMedicine().getId());
            dto.setMedicineCode(inventory.getMedicine().getCode());
            dto.setMedicineName(inventory.getMedicine().getName());
            dto.setMedicineGenericName(inventory.getMedicine().getGenericName());
            dto.setMedicineUnit(inventory.getMedicine().getUnit());
        }

        return dto;
    }

    public StockStatusDTO toStockStatusDTO(Inventory inventory) {
        if (inventory == null) {
            return null;
        }

        boolean isLowStock = inventory.isLowStock();
        boolean isOutOfStock = inventory.getCurrentStock() == 0;

        return new StockStatusDTO(
                inventory.getCurrentStock(),
                isLowStock,
                isOutOfStock);
    }
}

