package com.longchauuth.pharmacy.controller;

import com.longchauuth.pharmacy.dto.InventoryDTO;
import com.longchauuth.pharmacy.dto.InventoryStatsDTO;
import com.longchauuth.pharmacy.dto.StockAdjustmentDTO;
import com.longchauuth.pharmacy.dto.StockStatusDTO;
import com.longchauuth.pharmacy.entity.Inventory;
import com.longchauuth.pharmacy.mapper.InventoryMapper;
import com.longchauuth.pharmacy.service.InventoryService;
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
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "*")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    @Autowired
    private InventoryMapper inventoryMapper;

    @GetMapping
    public ResponseEntity<List<InventoryDTO>> getAllInventory() {
        try {
            List<Inventory> inventory = inventoryService.getAllInventory();
            List<InventoryDTO> inventoryDTOs = inventory.stream()
                    .map(inventoryMapper::toDTO)
                    .toList();
            return ResponseEntity.ok(inventoryDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/paged")
    public ResponseEntity<Page<Inventory>> getAllInventoryPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        try {
            Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
            Pageable pageable = PageRequest.of(page, size, sort);
            Page<Inventory> inventory = inventoryService.getAllInventory(pageable);
            return ResponseEntity.ok(inventory);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/in-stock")
    public ResponseEntity<List<InventoryDTO>> getInStockItems() {
        try {
            List<Inventory> inventory = inventoryService.getInStockItems();
            List<InventoryDTO> inventoryDTOs = inventory.stream()
                    .map(inventoryMapper::toDTO)
                    .toList();
            return ResponseEntity.ok(inventoryDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/in-stock/paged")
    public ResponseEntity<Page<Inventory>> getInStockItemsPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        try {
            Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
            Pageable pageable = PageRequest.of(page, size, sort);
            Page<Inventory> inventory = inventoryService.getInStockItems(pageable);
            return ResponseEntity.ok(inventory);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<Inventory>> getLowStockItems() {
        try {
            List<Inventory> inventory = inventoryService.getLowStockItems();
            return ResponseEntity.ok(inventory);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/low-stock/paged")
    public ResponseEntity<Page<Inventory>> getLowStockItemsPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        try {
            Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
            Pageable pageable = PageRequest.of(page, size, sort);
            Page<Inventory> inventory = inventoryService.getLowStockItems(pageable);
            return ResponseEntity.ok(inventory);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/out-of-stock")
    public ResponseEntity<List<Inventory>> getOutOfStockItems() {
        try {
            List<Inventory> inventory = inventoryService.getOutOfStockItems();
            return ResponseEntity.ok(inventory);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/medicine/{medicineId}")
    public ResponseEntity<InventoryDTO> getInventoryByMedicineId(@PathVariable Long medicineId) {
        try {
            Optional<Inventory> inventory = inventoryService.getInventoryByMedicineId(medicineId);
            return inventory.map(inventoryMapper::toDTO)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Inventory>> searchInventoryByMedicine(@RequestParam String keyword) {
        try {
            List<Inventory> inventory = inventoryService.searchInventoryByMedicine(keyword);
            return ResponseEntity.ok(inventory);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/search/paged")
    public ResponseEntity<Page<Inventory>> searchInventoryByMedicinePaged(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        try {
            Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
            Pageable pageable = PageRequest.of(page, size, sort);
            Page<Inventory> inventory = inventoryService.searchInventoryByMedicine(keyword, pageable);
            return ResponseEntity.ok(inventory);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping
    public ResponseEntity<Inventory> createInventory(@RequestBody Inventory inventory) {
        try {
            Inventory savedInventory = inventoryService.createInventory(inventory);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedInventory);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Inventory> updateInventory(@PathVariable Long id, @RequestBody Inventory inventoryDetails) {
        try {
            Inventory updatedInventory = inventoryService.updateInventory(id, inventoryDetails);
            return ResponseEntity.ok(updatedInventory);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/medicine/{medicineId}/stock-levels")
    public ResponseEntity<Inventory> updateStockLevels(
            @PathVariable Long medicineId,
            @RequestParam Integer minStock,
            @RequestParam Integer maxStock) {
        try {
            Inventory updatedInventory = inventoryService.updateStockLevels(medicineId, minStock, maxStock);
            return ResponseEntity.ok(updatedInventory);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/medicine/{medicineId}/add-stock")
    public ResponseEntity<Void> addStock(@PathVariable Long medicineId,
            @RequestBody StockAdjustmentDTO stockAdjustmentDTO) {
        try {
            inventoryService.addStock(medicineId, stockAdjustmentDTO.getQuantity());
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/medicine/{medicineId}/reduce-stock")
    public ResponseEntity<Void> reduceStock(@PathVariable Long medicineId,
            @RequestBody StockAdjustmentDTO stockAdjustmentDTO) {
        try {
            inventoryService.reduceStock(medicineId, stockAdjustmentDTO.getQuantity());
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInventory(@PathVariable Long id) {
        try {
            inventoryService.deleteInventory(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<InventoryStatsDTO> getInventoryStats() {
        try {
            Long lowStockCount = inventoryService.countLowStockItems();
            Long outOfStockCount = inventoryService.countOutOfStockItems();
            Double totalValue = inventoryService.getTotalInventoryValue();

            InventoryStatsDTO statsDTO = new InventoryStatsDTO(lowStockCount, outOfStockCount, totalValue);
            return ResponseEntity.ok(statsDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/medicine/{medicineId}/stock-status")
    public ResponseEntity<StockStatusDTO> getStockStatus(@PathVariable Long medicineId) {
        try {
            Integer currentStock = inventoryService.getCurrentStock(medicineId);
            boolean isLowStock = inventoryService.isLowStock(medicineId);
            boolean isOutOfStock = inventoryService.isOutOfStock(medicineId);

            StockStatusDTO stockStatusDTO = new StockStatusDTO(currentStock, isLowStock, isOutOfStock);
            return ResponseEntity.ok(stockStatusDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
