package com.familytree.controller;

import spark.Request;
import spark.Response;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;

import java.util.HashMap;
import java.util.Map;

/**
 * 基础控制器类，提供共享功能
 */
public abstract class BaseController {

    protected final Gson gson;
    
    public BaseController(Gson gson) {
        this.gson = gson;
    }

    /**
     * 注册路由
     */
    public abstract void registerRoutes();
    
    /**
     * 创建成功响应
     * @param data 响应数据
     * @return JSON字符串
     */
    protected String success(Object data) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", data);
        ObjectMapper mapper = new ObjectMapper();
        String jsonStr = "";
        try {
            jsonStr = mapper.writeValueAsString(response);
        } catch (JsonProcessingException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return jsonStr; 
    }
    
    /**
     * 创建错误响应
     * @param message 错误消息
     * @return JSON字符串
     */
    protected String error(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", message);
        ObjectMapper mapper = new ObjectMapper();
        String jsonStr = "";
        try {
            jsonStr = mapper.writeValueAsString(response);
        } catch (JsonProcessingException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return jsonStr; 
    }
    
    /**
     * 从请求中获取参数
     * @param request 请求对象
     * @param paramName 参数名
     * @return 参数值
     */
    protected String getParam(Request request, String paramName) {
        //return request.queryParams(paramName);
        String value = request.queryParams(paramName);
        return (value == null || value.trim().isEmpty()) ? "" : value;
    }
    
    /**
     * 从请求中获取必需参数，如果不存在则抛出异常
     * @param request 请求对象
     * @param paramName 参数名
     * @return 参数值
     * @throws IllegalArgumentException 如果参数不存在
     */
    protected String getRequiredParam(Request request, String paramName) {
        String value = getParam(request, paramName);
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException("缺少必需参数: " + paramName);
        }
        return value;
    }
    
    /**
     * 从请求中获取路径参数
     * @param request 请求对象
     * @param paramName 参数名
     * @return 参数值
     */
    protected String getPathParam(Request request, String paramName) {
        return request.params(paramName);
    }
    
    /**
     * 设置响应状态码
     * @param response 响应对象
     * @param statusCode 状态码
     */
    protected void setStatus(Response response, int statusCode) {
        response.status(statusCode);
    }
}