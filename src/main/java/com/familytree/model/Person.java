package com.familytree.model;

import java.text.SimpleDateFormat;

public class Person {
    private String id;          // 编号
    private String treeId;      // 家谱编号（可空）
    private String familyId;    // 家族编号（可空）
    private String parentId;    // 父节点编号
    private String name;        // 姓名
    private String gender;      // 性别
    private String generation;  // 辈分
    private String birthDate;   // 出生日期
    private String birthPlace;  // 出生地
    private String deathDate;   // 死亡日期
    private String description; // 简介
    private String spouseId;    // 配偶编号
    
    SimpleDateFormat dateformat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    public Person() {
        this.id = String.valueOf(System.currentTimeMillis());
    }
    
    public Person(String id,String name, String gender, String generation, String birthDate, 
                  String birthPlace, String deathDate, String description, 
                  String parentId, String treeId, String familyId,String spouseId) {
        this.id = id.length()>0?id:String.valueOf(System.currentTimeMillis());
        this.name = name;
        this.gender = gender;
        this.generation = generation;
        this.birthDate = birthDate;
        this.birthPlace = birthPlace;
        this.deathDate = deathDate;
        this.description = description;
        this.spouseId = spouseId;
        this.parentId = parentId;
        this.treeId = treeId;
        this.familyId = familyId;
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getTreeId() {
        return treeId;
    }
    
    public void setTreeId(String treeId) {
        this.treeId = treeId;
    }
    
    public String getFamilyId() {
        return familyId;
    }
    
    public void setFamilyId(String familyId) {
        this.familyId = familyId;
    }
    
    public String getParentId() {
        return parentId;
    }
    
    public void setParentId(String parentId) {
        this.parentId = parentId;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getGender() {
        return gender;
    }
    
    public void setGender(String gender) {
        this.gender = gender;
    }
    
    public String getGeneration() {
        return generation;
    }
    
    public void setGeneration(String generation) {
        this.generation = generation;
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
    
    public String getSpouseId() {
        return spouseId;
    }
    
    public void setSpouseId(String spouseId) {
        this.spouseId = spouseId;
    }
    
    @Override
    public String toString() {
        return id + "," + 
               (treeId == null ? "" : treeId) + "," + 
               (familyId == null ? "" : familyId) + "," + 
               (parentId == null ? "" : parentId) + "," + 
               name + "," + 
               gender + "," + 
               generation + "," + 
               birthDate + "," + 
               birthPlace + "," + 
               deathDate + "," + 
               description + "," + 
               (spouseId == null ? "" : spouseId);
    }
    
    public static Person fromString(String str) {
        String[] parts = str.split(",", 12); // 限制分割次数，因为描述中可能包含逗号
        Person person = new Person();
        person.setId(parts[0]);
        person.setTreeId(parts[1].isEmpty() ? null : parts[1]);
        person.setFamilyId(parts[2].isEmpty() ? null : parts[2]);
        person.setParentId(parts[3].isEmpty() ? null : parts[3]);
        person.setName(parts[4]);
        person.setGender(parts[5]);
        person.setGeneration(parts[6]);
        person.setBirthDate(parts[7]);
        person.setBirthPlace(parts[8]);
        person.setDeathDate(parts[9]);
        person.setDescription(parts[10]);
        if (parts.length > 11 && !parts[11].isEmpty()) {
            person.setSpouseId(parts[11]);
        }
        return person;
    }
}