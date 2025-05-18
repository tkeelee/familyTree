package com.familytree.dao;

import com.familytree.model.Family;
import com.familytree.util.FileUtil;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 家族数据访问类
 */
public class FamilyDao implements DataAccess<Family> {
    private static final String FILE_NAME = "families.txt";
    
    @Override
    public boolean save(Family family) {
        return FileUtil.writeToFile(FILE_NAME, family.toString(), true);
    }
    
    @Override
    public Family getById(String id) {
        List<String> lines = FileUtil.readAllLines(FILE_NAME);
        for (String line : lines) {
            Family family = Family.fromString(line);
            if (family.getId().equals(id)) {
                return family;
            }
        }
        return null;
    }
    
    @Override
    public List<Family> getAll() {
        List<String> lines = FileUtil.readAllLines(FILE_NAME);
        List<Family> families = new ArrayList<>();
        for (String line : lines) {
            families.add(Family.fromString(line));
        }
        return families;
    }
    
    @Override
    public boolean update(Family family) {
        Family existingFamily = getById(family.getId());
        if (existingFamily == null) {
            return false;
        }
        return FileUtil.updateLine(FILE_NAME, existingFamily.toString(), family.toString());
    }
    
    @Override
    public boolean delete(String id) {
        Family family = getById(id);
        if (family == null) {
            return false;
        }
        return FileUtil.removeLine(FILE_NAME, family.toString());
    }
    
    /**
     * 获取指定家谱下的所有家族
     * @param treeId 家谱ID
     * @return 家族列表
     */
    public List<Family> getByTreeId(String treeId) {
        return getAll().stream()
                .filter(family -> family.getTreeId().equals(treeId))
                .collect(Collectors.toList());
    }
    
    /**
     * 获取用户创建的所有家族
     * @param userId 用户ID
     * @return 家族列表
     */
    public List<Family> getByCreatorId(String userId) {
        return getAll().stream()
                .filter(family -> family.getCreatorId().equals(userId))
                .collect(Collectors.toList());
    }
}