package com.familytree.model;

import java.text.SimpleDateFormat;

public class Spouse {
    private String id;          // 编号
    private String name;        // 姓名
    private String birthDate;   // 出生日期
    private String birthPlace;  // 出生地
    private String deathDate;   // 死亡日期
    private String description; // 简介
    
    SimpleDateFormat dateformat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    public Spouse() {
        this.id = String.valueOf(System.currentTimeMillis());
    }
    
    public Spouse(String name, String birthDate, String birthPlace, String deathDate, String description) {
        this.id = String.valueOf(System.currentTimeMillis());
        this.name = name;
        this.birthDate = birthDate;
        this.birthPlace = birthPlace;
        this.deathDate = deathDate;
        this.description = description;
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getBirthDate() {
        return birthDate;
    }
    
    public void setBirthDate(String birthDate) {
        this.birthDate = birthDate;
    }
    
    public String getBirthPlace() {
        return birthPlace;
    }
    
    public void setBirthPlace(String birthPlace) {
        this.birthPlace = birthPlace;
    }
    
    public String getDeathDate() {
        return deathDate;
    }
    
    public void setDeathDate(String deathDate) {
        this.deathDate = deathDate;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    @Override
    public String toString() {
        return id + "," + 
               name + "," + 
               birthDate + "," + 
               birthPlace + "," + 
               deathDate + "," + 
               description;
    }
    
    public static Spouse fromString(String str) {
        String[] parts = str.split(",", 6); // 限制分割次数，因为描述中可能包含逗号
        Spouse spouse = new Spouse();
        spouse.setId(parts[0]);
        spouse.setName(parts[1]);
        spouse.setBirthDate(parts[2]);
        spouse.setBirthPlace(parts[3]);
        spouse.setDeathDate(parts[4]);
        if (parts.length > 5) {
            spouse.setDescription(parts[5]);
        }
        return spouse;
    }
}