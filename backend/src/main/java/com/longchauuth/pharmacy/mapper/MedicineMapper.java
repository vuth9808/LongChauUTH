package com.longchauuth.pharmacy.mapper;

import com.longchauuth.pharmacy.dto.MedicineCreateDTO;
import com.longchauuth.pharmacy.dto.MedicineDTO;
import com.longchauuth.pharmacy.dto.MedicineUpdateDTO;
import com.longchauuth.pharmacy.entity.Category;
import com.longchauuth.pharmacy.entity.Medicine;
import com.longchauuth.pharmacy.entity.Manufacturer;
import org.springframework.stereotype.Component;

@Component
public class MedicineMapper {

    public MedicineDTO toDTO(Medicine medicine) {
        if (medicine == null) {
            return null;
        }

        MedicineDTO dto = new MedicineDTO();
        dto.setId(medicine.getId());
        dto.setCode(medicine.getCode());
        dto.setName(medicine.getName());
        dto.setGenericName(medicine.getGenericName());
        dto.setImageUrl(medicine.getImageUrl());
        dto.setUnit(medicine.getUnit());
        dto.setDosageForm(medicine.getDosageForm());
        dto.setStrength(medicine.getStrength());
        dto.setDescription(medicine.getDescription());
        dto.setPrice(medicine.getPrice());
        dto.setCostPrice(medicine.getCostPrice());
        dto.setBarcode(medicine.getBarcode());
        dto.setExpiryDate(medicine.getExpiryDate());
        dto.setBatchNumber(medicine.getBatchNumber());
        dto.setStatus(medicine.getStatus());
        dto.setCreatedAt(medicine.getCreatedAt());
        dto.setUpdatedAt(medicine.getUpdatedAt());

        // Set category information
        if (medicine.getCategory() != null) {
            dto.setCategoryId(medicine.getCategory().getId());
            dto.setCategoryName(medicine.getCategory().getName());
        }

        // Set manufacturer information
        if (medicine.getManufacturer() != null) {
            dto.setManufacturerId(medicine.getManufacturer().getId());
            dto.setManufacturerName(medicine.getManufacturer().getName());
        }

        return dto;
    }

    public Medicine toEntity(MedicineCreateDTO dto) {
        if (dto == null) {
            return null;
        }

        Medicine medicine = new Medicine();
        medicine.setCode(dto.getCode());
        medicine.setName(dto.getName());
        medicine.setGenericName(dto.getGenericName());
        medicine.setImageUrl(dto.getImageUrl());
        medicine.setUnit(dto.getUnit());
        medicine.setDosageForm(dto.getDosageForm());
        medicine.setStrength(dto.getStrength());
        medicine.setDescription(dto.getDescription());
        medicine.setPrice(dto.getPrice());
        medicine.setCostPrice(dto.getCostPrice());
        medicine.setBarcode(dto.getBarcode());
        medicine.setExpiryDate(dto.getExpiryDate());
        medicine.setBatchNumber(dto.getBatchNumber());
        medicine.setStatus(Medicine.MedicineStatus.ACTIVE);

        // Set category
        if (dto.getCategoryId() != null) {
            Category category = new Category();
            category.setId(dto.getCategoryId());
            medicine.setCategory(category);
        }

        // Set manufacturer
        if (dto.getManufacturerId() != null) {
            Manufacturer manufacturer = new Manufacturer();
            manufacturer.setId(dto.getManufacturerId());
            medicine.setManufacturer(manufacturer);
        }

        return medicine;
    }

    public void updateEntity(Medicine medicine, MedicineUpdateDTO dto) {
        if (medicine == null || dto == null) {
            return;
        }

        medicine.setName(dto.getName());
        medicine.setGenericName(dto.getGenericName());
        medicine.setImageUrl(dto.getImageUrl());
        medicine.setUnit(dto.getUnit());
        medicine.setDosageForm(dto.getDosageForm());
        medicine.setStrength(dto.getStrength());
        medicine.setDescription(dto.getDescription());
        medicine.setPrice(dto.getPrice());
        medicine.setCostPrice(dto.getCostPrice());
        medicine.setBarcode(dto.getBarcode());
        medicine.setExpiryDate(dto.getExpiryDate());
        medicine.setBatchNumber(dto.getBatchNumber());

        // Update category
        if (dto.getCategoryId() != null) {
            Category category = new Category();
            category.setId(dto.getCategoryId());
            medicine.setCategory(category);
        }

        // Update manufacturer
        if (dto.getManufacturerId() != null) {
            Manufacturer manufacturer = new Manufacturer();
            manufacturer.setId(dto.getManufacturerId());
            medicine.setManufacturer(manufacturer);
        }
    }
}
