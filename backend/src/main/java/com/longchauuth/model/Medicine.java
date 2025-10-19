package com.longchauuth.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

@Entity
@Table(name = "medicine")
public class Medicine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String code;
    private String name;
    private String form;
    private String manufacturer;
    private Double price;

    // getters and setters
    public Long getId(){return id;}
    public void setId(Long id){this.id=id;}
    public String getCode(){return code;}
    public void setCode(String code){this.code=code;}
    public String getName(){return name;}
    public void setName(String name){this.name=name;}
    public String getForm(){return form;}
    public void setForm(String form){this.form=form;}
    public String getManufacturer(){return manufacturer;}
    public void setManufacturer(String manufacturer){this.manufacturer=manufacturer;}
    public Double getPrice(){return price;}
    public void setPrice(Double price){this.price=price;}
}
