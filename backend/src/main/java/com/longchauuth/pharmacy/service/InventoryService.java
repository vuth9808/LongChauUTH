package com.longchauuth.pharmacy.service;

import com.longchauuth.pharmacy.entity.Inventory;
import com.longchauuth.pharmacy.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class InventoryService {

    @Autowired
    private InventoryRepository inventoryRepository;

    public List<Inventory> getAllInventory() {
        return inventoryRepository.findAll();
    }

    public Page<Inventory> getAllInventory(Pageable pageable) {
        return inventoryRepository.findAll(pageable);
    }

    public List<Inventory> getInStockItems() {
        return inventoryRepository.findInStockItems();
    }

    public Page<Inventory> getInStockItems(Pageable pageable) {
        return inventoryRepository.findInStockItems(pageable);
    }

    public List<Inventory> getLowStockItems() {
        return inventoryRepository.findLowStockItems();
    }

    public Page<Inventory> getLowStockItems(Pageable pageable) {
        return inventoryRepository.findLowStockItems(pageable);
    }

    public List<Inventory> getOutOfStockItems() {
        return inventoryRepository.findOutOfStockItems();
    }

    public Optional<Inventory> getInventoryByMedicineId(Long medicineId) {
        return inventoryRepository.findByMedicineId(medicineId);
    }

    public List<Inventory> searchInventoryByMedicine(String keyword) {
        return inventoryRepository.searchByMedicineKeyword(keyword);
    }

    public Page<Inventory> searchInventoryByMedicine(String keyword, Pageable pageable) {
        return inventoryRepository.searchByMedicineKeyword(keyword, pageable);
    }

    public Inventory createInventory(Inventory inventory) {
        return inventoryRepository.save(inventory);
    }

    public Inventory updateInventory(Long id, Inventory inventoryDetails) {
        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tồn kho với ID: " + id));

        inventory.setCurrentStock(inventoryDetails.getCurrentStock());
        inventory.setMinStock(inventoryDetails.getMinStock());
        inventory.setMaxStock(inventoryDetails.getMaxStock());

        return inventoryRepository.save(inventory);
    }

    public Inventory updateStockLevels(Long medicineId, Integer minStock, Integer maxStock) {
        Inventory inventory = inventoryRepository.findByMedicineId(medicineId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tồn kho cho thuốc ID: " + medicineId));

        inventory.setMinStock(minStock);
        inventory.setMaxStock(maxStock);

        return inventoryRepository.save(inventory);
    }

    public void addStock(Long medicineId, Integer quantity) {
        Inventory inventory = inventoryRepository.findByMedicineId(medicineId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tồn kho cho thuốc ID: " + medicineId));

        inventory.addStock(quantity);
        inventoryRepository.save(inventory);
    }

    public void reduceStock(Long medicineId, Integer quantity) {
        Inventory inventory = inventoryRepository.findByMedicineId(medicineId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tồn kho cho thuốc ID: " + medicineId));

        inventory.reduceStock(quantity);
        inventoryRepository.save(inventory);
    }

    public void deleteInventory(Long id) {
        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tồn kho với ID: " + id));

        inventoryRepository.delete(inventory);
    }

    public Long countLowStockItems() {
        return inventoryRepository.countLowStockItems();
    }

    public Long countOutOfStockItems() {
        return inventoryRepository.countOutOfStockItems();
    }

    public Double getTotalInventoryValue() {
        return inventoryRepository.getTotalInventoryValue();
    }

    public boolean isLowStock(Long medicineId) {
        Optional<Inventory> inventory = inventoryRepository.findByMedicineId(medicineId);
        return inventory.map(Inventory::isLowStock).orElse(false);
    }

    public boolean isOutOfStock(Long medicineId) {
        Optional<Inventory> inventory = inventoryRepository.findByMedicineId(medicineId);
        return inventory.map(inv -> inv.getCurrentStock() == 0).orElse(true);
    }

    public Integer getCurrentStock(Long medicineId) {
        Optional<Inventory> inventory = inventoryRepository.findByMedicineId(medicineId);
        return inventory.map(Inventory::getCurrentStock).orElse(0);
    }
}
