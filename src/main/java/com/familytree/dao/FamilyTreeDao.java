package com.familytree.dao;

import com.familytree.model.FamilyTree;
import com.familytree.util.FileUtil;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 家谱数据访问类
 */
public class FamilyTreeDao implements DataAccess<FamilyTree> {
    private static final String FILE_NAME = "family_trees.txt";
    
    @Override
    public boolean save(FamilyTree familyTree) {
        return FileUtil.writeToFile(FILE_NAME, familyTree.toString(), true);
    }
    
    @Override
    public FamilyTree getById(String id) {
        List<String> lines = FileUtil.readAllLines(FILE_NAME);
        for (String line : lines) {
            FamilyTree tree = FamilyTree.fromString(line);
            if (tree.getId().equals(id)) {
                return tree;
            }
        }
        return null;
    }
    
    @Override
    public List<FamilyTree> getAll() {
        List<String> lines = FileUtil.readAllLines(FILE_NAME);
        List<FamilyTree> trees = new ArrayList<>();
        for (String line : lines) {
            trees.add(FamilyTree.fromString(line));
        }
        return trees;
    }
    
    @Override
    public boolean update(FamilyTree familyTree) {
        FamilyTree existingTree = getById(familyTree.getId());
        if (existingTree == null) {
            return false;
        }
        return FileUtil.updateLine(FILE_NAME, existingTree.toString(), familyTree.toString());
    }
    
    @Override
    public boolean delete(String id) {
        FamilyTree tree = getById(id);
        if (tree == null) {
            return false;
        }
        return FileUtil.removeLine(FILE_NAME, tree.toString());
    }
    
    /**
     * 获取用户创建的所有家谱
     * @param userId 用户ID
     * @return 家谱列表
     */
    public List<FamilyTree> getByCreatorId(String userId) {
        return getAll().stream()
                .filter(tree -> tree.getCreatorId().equals(userId))
                .collect(Collectors.toList());
    }
}