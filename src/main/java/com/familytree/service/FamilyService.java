package com.familytree.service;

import com.familytree.dao.FamilyDao;
import com.familytree.model.Family;

import java.util.List;

/**
 * 家族服务类
 */
public class FamilyService {
    private final FamilyDao familyDao;
    
    public FamilyService() {
        this.familyDao = new FamilyDao();
    }
    
    /**
     * 创建家族
     * @param name 家族名称
     * @param creatorId 创建人ID
     * @param description 家族介绍
     * @param treeId 家谱ID
     * @return 创建的家族对象
     */
    public Family createFamily(String name, String creatorId, String description, String treeId) {
        Family family = new Family(name, creatorId, description, treeId);
        if (familyDao.save(family)) {
            return family;
        }
        return null;
    }
    
    /**
     * 获取所有家族
     * @return 家族列表
     */
    public List<Family> getAllFamilies() {
        return familyDao.getAll();
    }
    
    /**
     * 获取指定家谱下的所有家族
     * @param treeId 家谱ID
     * @return 家族列表
     */
    public List<Family> getFamiliesByTreeId(String treeId) {
        return familyDao.getByTreeId(treeId);
    }
    
    /**
     * 获取用户创建的所有家族
     * @param userId 用户ID
     * @return 家族列表
     */
    public List<Family> getFamiliesByCreator(String userId) {
        return familyDao.getByCreatorId(userId);
    }
    
    /**
     * 根据ID获取家族
     * @param familyId 家族ID
     * @return 家族对象
     */
    public Family getFamilyById(String familyId) {
        return familyDao.getById(familyId);
    }
    
    /**
     * 更新家族信息
     * @param family 家族对象
     * @return 是否更新成功
     */
    public boolean updateFamily(Family family) {
        return familyDao.update(family);
    }
    
    /**
     * 删除家族
     * @param familyId 家族ID
     * @return 是否删除成功
     */
    public boolean deleteFamily(String familyId) {
        return familyDao.delete(familyId);
    }
}