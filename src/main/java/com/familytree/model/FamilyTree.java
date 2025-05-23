package com.familytree.model;

import java.text.SimpleDateFormat;

public class FamilyTree {
    private String id;          // 家谱编号
    private String name;        // 家谱名称
    private String creatorId;   // 创建人ID
    private String createdAt;   // 创建时间
    private String description; // 家谱介绍
    private String generation;   //家谱辈分
    
    SimpleDateFormat dateformat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    public FamilyTree() {
        this.id = String.valueOf(System.currentTimeMillis());
        this.createdAt = dateformat.format(System.currentTimeMillis());
    }
    
    public FamilyTree(String name, String creatorId, String description,String generation) {
        this.id = String.valueOf(System.currentTimeMillis());
        this.name = name;
        this.creatorId = creatorId;
        this.createdAt = dateformat.format(System.currentTimeMillis());
        this.description = description;
        this.generation = generation;
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

    public String getGeneration() {
        return generation;
    }

    public void setGeneration(String generation) {
        this.generation = generation;
    }
    
    @Override
    public String toString() {
        return id + "," + name + "," + creatorId + "," + createdAt + "," + description  + "," + generation;
    }
    
    public static FamilyTree fromString(String str) {
        String[] parts = str.split(",", 6); // 限制分割次数，因为描述中可能包含逗号
        FamilyTree tree = new FamilyTree();
        tree.setId(parts[0]);
        tree.setName(parts[1]);
        tree.setCreatorId(parts[2]);
        tree.setCreatedAt(parts[3]);
        if (parts.length > 4) {
            tree.setDescription(parts[4]);
        }
        if (parts.length > 5) {
            tree.setGeneration(parts[5]);
        }
        return tree;
    }
}