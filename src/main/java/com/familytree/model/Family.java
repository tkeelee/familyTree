package com.familytree.model;

import java.text.SimpleDateFormat;

public class Family {
    private String id;          // 家族编号
    private String name;        // 家族名称
    private String creatorId;   // 创建人ID
    private String createdAt;   // 创建时间
    private String description; // 家族介绍
    private String treeId;      // 家谱编号
    
    SimpleDateFormat dateformat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    //String dateStr = dateformat.format(System.currentTimeMillis());

    public Family() {
        this.id = String.valueOf(System.currentTimeMillis());
        this.createdAt = dateformat.format(System.currentTimeMillis());
    }
    
    public Family(String name, String creatorId, String description, String treeId) {
        this.id = String.valueOf(System.currentTimeMillis());
        this.name = name;
        this.creatorId = creatorId;
        this.createdAt = dateformat.format(System.currentTimeMillis());
        this.description = description;
        this.treeId = treeId;
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
    
    public String getCreatorId() {
        return creatorId;
    }
    
    public void setCreatorId(String creatorId) {
        this.creatorId = creatorId;
    }
    
    public String getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getTreeId() {
        return treeId;
    }
    
    public void setTreeId(String treeId) {
        this.treeId = treeId;
    }
    
    @Override
    public String toString() {
        return id + "," + name + "," + creatorId + "," + createdAt + "," + description + "," + treeId;
    }
    
    public static Family fromString(String str) {
        String[] parts = str.split(",", 6); // 限制分割次数，因为描述中可能包含逗号
        Family family = new Family();
        family.setId(parts[0]);
        family.setName(parts[1]);
        family.setCreatorId(parts[2]);
        family.setCreatedAt(parts[3]);
        family.setDescription(parts[4]);
        if (parts.length > 5) {
            family.setTreeId(parts[5]);
        }
        return family;
    }
}