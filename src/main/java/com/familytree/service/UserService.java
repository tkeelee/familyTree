package com.familytree.service;

import com.familytree.dao.UserDao;
import com.familytree.model.User;

/**
 * 用户服务类
 */
public class UserService {
    private final UserDao userDao;
    
    public UserService() {
        this.userDao = new UserDao();
    }
    
    /**
     * 用户注册
     * @param username 用户名
     * @param password 密码
     * @return 注册成功返回用户对象，失败返回null
     */
    public User register(String username, String password) {
        // 检查用户名是否已存在
        if (userDao.getByUsername(username) != null) {
            return null; // 用户名已存在
        }
        
        // 创建新用户
        User user = new User(username, password);
        if (userDao.save(user)) {
            return user;
        }
        return null;
    }
    
    /**
     * 用户登录
     * @param username 用户名
     * @param password 密码
     * @return 登录成功返回用户对象，失败返回null
     */
    public User login(String username, String password) {
        return userDao.authenticate(username, password);
    }
    
    /**
     * 根据ID获取用户
     * @param userId 用户ID
     * @return 用户对象
     */
    public User getUserById(String userId) {
        return userDao.getById(userId);
    }
}