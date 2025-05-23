package com.familytree.controller;

import com.familytree.model.FamilyTree;
import com.familytree.service.FamilyTreeService;
import com.google.gson.Gson;
import spark.Request;
import spark.Response;
import spark.Spark;

import java.util.List;

/**
 * 家谱控制器，处理家谱相关的Web请求
 */
public class FamilyTreeController extends BaseController {
    private final FamilyTreeService familyTreeService;
    
    public FamilyTreeController(Gson gson) {
        super(gson);
        this.familyTreeService = new FamilyTreeService();
    }
    
    @Override
    public void registerRoutes() {
        // 创建家谱
        Spark.post("/api/trees", this::createFamilyTree);
        
        // 获取所有家谱
        Spark.get("/api/trees", this::getAllFamilyTrees);
        
        // 获取用户创建的家谱
        Spark.get("/api/users/:userId/trees", this::getUserFamilyTrees);
        
        // 获取家谱详情
        Spark.get("/api/trees/:treeId", this::getFamilyTreeById);
        
        // 更新家谱
        Spark.put("/api/trees/:treeId", this::updateFamilyTree);
        
        // 删除家谱
        Spark.delete("/api/trees/:treeId", this::deleteFamilyTree);
    }
    
    /**
     * 创建家谱
     */
    private String createFamilyTree(Request request, Response response) {
        try {
            String name = getRequiredParam(request, "name");
            String creatorId = getRequiredParam(request, "creatorId");
            String description = getParam(request, "description");
            String generation = getParam(request, "generation");
            
            FamilyTree familyTree = familyTreeService.createFamilyTree(name, creatorId, description,generation);
            if (familyTree == null) {
                return error("创建家谱失败");
            }
            
            return success(familyTree);
        } catch (IllegalArgumentException e) {
            setStatus(response, 400);
            return error(e.getMessage());
        } catch (Exception e) {
            setStatus(response, 500);
            return error("创建家谱失败: " + e.getMessage());
        }
    }
    
    /**
     * 获取所有家谱
     */
    private String getAllFamilyTrees(Request request, Response response) {
        try {
            List<FamilyTree> trees = familyTreeService.getAllFamilyTrees();
            return success(trees);
        } catch (Exception e) {
            setStatus(response, 500);
            return error("获取家谱列表失败: " + e.getMessage());
        }
    }
    
    /**
     * 获取用户创建的家谱
     */
    private String getUserFamilyTrees(Request request, Response response) {
        try {
            String userId = getPathParam(request, "userId");
            List<FamilyTree> trees = familyTreeService.getFamilyTreesByCreator(userId);
            return success(trees);
        } catch (Exception e) {
            setStatus(response, 500);
            return error("获取用户家谱列表失败: " + e.getMessage());
        }
    }
    
    /**
     * 获取家谱详情
     */
    private String getFamilyTreeById(Request request, Response response) {
        try {
            String treeId = getPathParam(request, "treeId");
            FamilyTree tree = familyTreeService.getFamilyTreeById(treeId);
            
            if (tree == null) {
                setStatus(response, 404);
                return error("家谱不存在");
            }
            
            return success(tree);
        } catch (Exception e) {
            setStatus(response, 500);
            return error("获取家谱详情失败: " + e.getMessage());
        }
    }
    
    /**
     * 更新家谱
     */
    private String updateFamilyTree(Request request, Response response) {
        try {
            String treeId = getPathParam(request, "treeId");
            String name = getParam(request, "name");
            String description = getParam(request, "description");
            String generation = getParam(request, "generation");
            
            FamilyTree tree = familyTreeService.getFamilyTreeById(treeId);
            if (tree == null) {
                setStatus(response, 404);
                return error("家谱不存在");
            }
            
            if (name != null && !name.trim().isEmpty()) {
                tree.setName(name);
            }
            
            if (description != null) {
                tree.setDescription(description);
            }

            if (generation!= null) {
                tree.setGeneration(generation);
            }
            
            boolean updated = familyTreeService.updateFamilyTree(tree);
            if (!updated) {
                return error("更新家谱失败");
            }
            
            return success(tree);
        } catch (Exception e) {
            setStatus(response, 500);
            return error("更新家谱失败: " + e.getMessage());
        }
    }
    
    /**
     * 删除家谱
     */
    private String deleteFamilyTree(Request request, Response response) {
        try {
            String treeId = getPathParam(request, "treeId");
            boolean deleted = familyTreeService.deleteFamilyTree(treeId);
            
            if (!deleted) {
                setStatus(response, 404);
                return error("家谱不存在或删除失败");
            }
            
            return success("家谱已删除");
        } catch (Exception e) {
            setStatus(response, 500);
            return error("删除家谱失败: " + e.getMessage());
        }
    }
}