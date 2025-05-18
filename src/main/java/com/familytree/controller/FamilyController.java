package com.familytree.controller;

import com.familytree.model.Family;
import com.familytree.service.FamilyService;
import com.google.gson.Gson;
import spark.Request;
import spark.Response;
import spark.Spark;

import java.util.List;

/**
 * 家族控制器，处理家族相关的Web请求
 */
public class FamilyController extends BaseController {
    private final FamilyService familyService;
    
    public FamilyController(Gson gson) {
        super(gson);
        this.familyService = new FamilyService();
    }
    
    @Override
    public void registerRoutes() {
        // 创建家族
        Spark.post("/api/families", this::createFamily);
        
        // 获取所有家族
        Spark.get("/api/families", this::getAllFamilies);
        
        // 获取指定家谱下的家族
        Spark.get("/api/trees/:treeId/families", this::getFamiliesByTreeId);
        
        // 获取用户创建的家族
        Spark.get("/api/users/:userId/families", this::getFamiliesByCreator);
        
        // 获取家族详情
        Spark.get("/api/families/:familyId", this::getFamilyById);
        
        // 更新家族
        Spark.put("/api/families/:familyId", this::updateFamily);
        
        // 删除家族
        Spark.delete("/api/families/:familyId", this::deleteFamily);
    }
    
    /**
     * 创建家族
     */
    private String createFamily(Request request, Response response) {
        try {
            String name = getRequiredParam(request, "name");
            String creatorId = getRequiredParam(request, "creatorId");
            String description = getParam(request, "description");
            String treeId = getRequiredParam(request, "treeId");
            
            Family family = familyService.createFamily(name, creatorId, description, treeId);
            if (family == null) {
                return error("创建家族失败");
            }
            
            return success(family);
        } catch (IllegalArgumentException e) {
            setStatus(response, 400);
            return error(e.getMessage());
        } catch (Exception e) {
            setStatus(response, 500);
            return error("创建家族失败: " + e.getMessage());
        }
    }
    
    /**
     * 获取所有家族
     */
    private String getAllFamilies(Request request, Response response) {
        try {
            List<Family> families = familyService.getAllFamilies();
            return success(families);
        } catch (Exception e) {
            setStatus(response, 500);
            return error("获取家族列表失败: " + e.getMessage());
        }
    }
    
    /**
     * 获取指定家谱下的家族
     */
    private String getFamiliesByTreeId(Request request, Response response) {
        try {
            String treeId = getPathParam(request, "treeId");
            List<Family> families = familyService.getFamiliesByTreeId(treeId);
            return success(families);
        } catch (Exception e) {
            setStatus(response, 500);
            return error("获取家谱下的家族列表失败: " + e.getMessage());
        }
    }
    
    /**
     * 获取用户创建的家族
     */
    private String getFamiliesByCreator(Request request, Response response) {
        try {
            String userId = getPathParam(request, "userId");
            List<Family> families = familyService.getFamiliesByCreator(userId);
            return success(families);
        } catch (Exception e) {
            setStatus(response, 500);
            return error("获取用户创建的家族列表失败: " + e.getMessage());
        }
    }
    
    /**
     * 获取家族详情
     */
    private String getFamilyById(Request request, Response response) {
        try {
            String familyId = getPathParam(request, "familyId");
            Family family = familyService.getFamilyById(familyId);
            
            if (family == null) {
                setStatus(response, 404);
                return error("家族不存在");
            }
            
            return success(family);
        } catch (Exception e) {
            setStatus(response, 500);
            return error("获取家族详情失败: " + e.getMessage());
        }
    }
    
    /**
     * 更新家族
     */
    private String updateFamily(Request request, Response response) {
        try {
            String familyId = getPathParam(request, "familyId");
            String name = getParam(request, "name");
            String description = getParam(request, "description");
            
            Family family = familyService.getFamilyById(familyId);
            if (family == null) {
                setStatus(response, 404);
                return error("家族不存在");
            }
            
            if (name != null && !name.trim().isEmpty()) {
                family.setName(name);
            }
            
            if (description != null) {
                family.setDescription(description);
            }
            
            boolean updated = familyService.updateFamily(family);
            if (!updated) {
                return error("更新家族失败");
            }
            
            return success(family);
        } catch (Exception e) {
            setStatus(response, 500);
            return error("更新家族失败: " + e.getMessage());
        }
    }
    
    /**
     * 删除家族
     */
    private String deleteFamily(Request request, Response response) {
        try {
            String familyId = getPathParam(request, "familyId");
            boolean deleted = familyService.deleteFamily(familyId);
            
            if (!deleted) {
                setStatus(response, 404);
                return error("家族不存在或删除失败");
            }
            
            return success("家族已删除");
        } catch (Exception e) {
            setStatus(response, 500);
            return error("删除家族失败: " + e.getMessage());
        }
    }
}