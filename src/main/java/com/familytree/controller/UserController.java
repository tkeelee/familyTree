package com.familytree.controller;

import com.familytree.model.User;
import com.familytree.service.UserService;
import com.google.gson.Gson;
import spark.Request;
import spark.Response;
import spark.Spark;

import java.util.HashMap;
import java.util.Map;

/**
 * 用户控制器，处理用户相关的Web请求
 */
public class UserController extends BaseController {
    private final UserService userService;
    
    public UserController(Gson gson) {
        super(gson);
        this.userService = new UserService();
    }
    
    @Override
    public void registerRoutes() {
        // 在所有路由之前执行
        Spark.before((request, response) -> {
            response.header("Content-Type", "application/json;charset=UTF-8");
        });
        
        // 用户注册
        Spark.post("/api/users/register", this::register);
        
        // 用户登录
        Spark.post("/api/users/login", this::login);
        
        // 获取用户信息
        Spark.get("/api/users/:userId", this::getUserInfo);
    }
    
    /**
     * 处理用户注册请求
     */
    private String register(Request request, Response response) {
        try {
            String username = getRequiredParam(request, "username");
            String password = getRequiredParam(request, "password");
            
            User user = userService.register(username, password);
            if (user == null) {
                return error("用户名已存在");
            }
            
            // 不返回密码
            Map<String, Object> userData = new HashMap<>();
            userData.put("id", user.getId());
            userData.put("username", user.getUsername());
            userData.put("createdAt", user.getCreatedAt());
            
            return success(userData);
        } catch (IllegalArgumentException e) {
            setStatus(response, 400);
            return error(e.getMessage());
        } catch (Exception e) {
            setStatus(response, 500);
            return error("注册失败: " + e.getMessage());
        }
    }
    
    /**
     * 处理用户登录请求
     */
    private String login(Request request, Response response) {
        try {
            String username = getRequiredParam(request, "username");
            String password = getRequiredParam(request, "password");
            
            User user = userService.login(username, password);
            if (user == null) {
                setStatus(response, 401);
                return error("用户名或密码错误");
            }
            
            // 不返回密码
            Map<String, Object> userData = new HashMap<>();
            userData.put("id", user.getId());
            userData.put("username", user.getUsername());
            userData.put("createdAt", user.getCreatedAt());
            
            return success(userData);
        } catch (IllegalArgumentException e) {
            setStatus(response, 400);
            return error(e.getMessage());
        } catch (Exception e) {
            setStatus(response, 500);
            return error("登录失败: " + e.getMessage());
        }
    }
    
    /**
     * 获取用户信息
     */
    private String getUserInfo(Request request, Response response) {
        try {
            String userId = getPathParam(request, "userId");
            User user = userService.getUserById(userId);
            
            if (user == null) {
                setStatus(response, 404);
                return error("用户不存在");
            }
            
            // 不返回密码
            Map<String, Object> userData = new HashMap<>();
            userData.put("id", user.getId());
            userData.put("username", user.getUsername());
            userData.put("createdAt", user.getCreatedAt());
            
            return success(userData);
        } catch (Exception e) {
            setStatus(response, 500);
            return error("获取用户信息失败: " + e.getMessage());
        }
    }
}