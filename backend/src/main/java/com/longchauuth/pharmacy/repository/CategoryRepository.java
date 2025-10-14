package com.longchauuth.pharmacy.repository;

import com.longchauuth.pharmacy.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    Optional<Category> findByName(String name);
    
    List<Category> findByNameContainingIgnoreCase(String name);
    
    boolean existsByName(String name);
}
