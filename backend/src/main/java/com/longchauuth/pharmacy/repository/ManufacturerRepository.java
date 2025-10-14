package com.longchauuth.pharmacy.repository;

import com.longchauuth.pharmacy.entity.Manufacturer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ManufacturerRepository extends JpaRepository<Manufacturer, Long> {
    
    List<Manufacturer> findByNameContainingIgnoreCase(String name);
    
    Optional<Manufacturer> findByName(String name);
    
    boolean existsByName(String name);
}
