package com.familytree.dao;

import com.familytree.model.User;
import com.familytree.util.FileUtil;

import java.util.ArrayList;
import java.util.List;

/**
 * 用户数据访问类
 */
public class UserDao implements DataAccess<User> {
    private static final String FILE_NAME = "users.txt";
    
    @Override
    public boolean save(User user) {
        return FileUtil.writeToFile(FILE_NAME, user.toString(), true);
    }
    
    @Override
    public User getById(String id) {
        List<String> lines = FileUtil.readAllLines(FILE_NAME);
        for (String line : lines) {
            User user = User.fromString(line);
            if (user.getId().equals(id)) {
                return user;
            }
        }
        return null;
    }
    
    @Override
    public List<User> getAll() {
        List<String> lines = FileUtil.readAllLines(FILE_NAME);
        List<User> users = new ArrayList<>();
        for (String line : lines) {
            users.add(User.fromString(line));
        }
        return users;
    }
    
    @Override
    public boolean update(User user) {
        User existingUser = getById(user.getId());
        if (existingUser == null) {
            return false;
        }
        return FileUtil.updateLine(FILE_NAME, existingUser.toString(), user.toString());
    }
    
    @Override
    public boolean delete(String id) {
        User user = getById(id);
        if (user == null) {
            return false;
        }
        return FileUtil.removeLine(FILE_NAME, user.toString());
    }
    
    /**
     * 根据用户名查找用户
     * @param username 用户名
     * @return 找到的用户，如果不存在则返回null
     */
    public User getByUsername(String username) {
        List<String> lines = FileUtil.readAllLines(FILE_NAME);
        for (String line : lines) {
            User user = User.fromString(line);
            if (user.getUsername().equals(username)) {
                return user;
            }
        }
        return null;
    }
    
    /**
     * 验证用户登录
     * @param username 用户名
     * @param password 密码
     * @return 登录成功返回用户对象，失败返回null
     */
    public User authenticate(String username, String password) {
        User user = getByUsername(username);
        if (user != null && user.getPassword().equals(password)) {
            return user;
        }
        return null;
    }
}