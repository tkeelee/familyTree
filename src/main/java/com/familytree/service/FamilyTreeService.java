package com.familytree.service;

import com.familytree.dao.FamilyTreeDao;
import com.familytree.model.FamilyTree;

import java.util.List;

/**
 * 家谱服务类
 */
public class FamilyTreeService {
    private final FamilyTreeDao familyTreeDao;
    
    public FamilyTreeService() {
        this.familyTreeDao = new FamilyTreeDao();
    }
    
    /**
     * 创建家谱
     * @param name 家谱名称
     * @param creatorId 创建人ID
     * @param description 家谱介绍
     * @return 创建的家谱对象
     */
    public FamilyTree createFamilyTree(String name, String creatorId, String description,String generation) {
        FamilyTree familyTree = new FamilyTree(name, creatorId, description,generation);
        if (familyTreeDao.save(familyTree)) {
            return familyTree;
        }
        return null;
    }
    
    /**
     * 获取所有家谱
     * @return 家谱列表
     */
    public List<FamilyTree> getAllFamilyTrees() {
        return familyTreeDao.getAll();
    }
    
    /**
     * 获取用户创建的所有家谱
     * @param userId 用户ID
     * @return 家谱列表
     */
    public List<FamilyTree> getFamilyTreesByCreator(String userId) {
        return familyTreeDao.getByCreatorId(userId);
    }
    
    /**
     * 根据ID获取家谱
     * @param treeId 家谱ID
     * @return 家谱对象
     */
    public FamilyTree getFamilyTreeById(String treeId) {
        return familyTreeDao.getById(treeId);
    }
    
    /**
     * 更新家谱信息
     * @param familyTree 家谱对象
     * @return 是否更新成功
     */
    public boolean updateFamilyTree(FamilyTree familyTree) {
        return familyTreeDao.update(familyTree);
    }
    
    /**
     * 删除家谱
     * @param treeId 家谱ID
     * @return 是否删除成功
     */
    public boolean deleteFamilyTree(String treeId) {
        return familyTreeDao.delete(treeId);
    }
}