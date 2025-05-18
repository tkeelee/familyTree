package com.familytree.model;

import java.text.SimpleDateFormat;

public class User {
    private String id;          // 用户ID
    private String username;    // 用户名
    private String password;    // 密码
    private String createdAt;   // 注册时间
    
    SimpleDateFormat dateformat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    public User() {
        this.id = String.valueOf(System.currentTimeMillis());
        this.createdAt = dateformat.format(System.currentTimeMillis());
    }
    
    public User(String username, String password) {
        this.id = String.valueOf(System.currentTimeMillis());
        this.username = username;
        this.password = password;
        this.createdAt = dateformat.format(System.currentTimeMillis());
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public String getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
    
    @Override
    public String toString() {
        return id + "," + username + "," + password + "," + createdAt;
    }
    
    public static User fromString(String str) {
        String[] parts = str.split(",", 4);
        User user = new User();
        user.setId(parts[0]);
        user.setUsername(parts[1]);
        user.setPassword(parts[2]);
        user.setCreatedAt(parts[3]);
        return user;
    }
}