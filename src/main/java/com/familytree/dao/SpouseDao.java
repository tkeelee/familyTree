package com.familytree.dao;

import com.familytree.model.Spouse;
import com.familytree.util.FileUtil;

import java.util.ArrayList;
import java.util.List;

/**
 * 配偶数据访问类
 */
public class SpouseDao implements DataAccess<Spouse> {
    private static final String FILE_NAME = "spouses.txt";
    
    @Override
    public boolean save(Spouse spouse) {
        return FileUtil.writeToFile(FILE_NAME, spouse.toString(), true);
    }
    
    @Override
    public Spouse getById(String id) {
        List<String> lines = FileUtil.readAllLines(FILE_NAME);
        for (String line : lines) {
            Spouse spouse = Spouse.fromString(line);
            if (spouse.getId().equals(id)) {
                return spouse;
            }
        }
        return null;
    }
    
    @Override
    public List<Spouse> getAll() {
        List<String> lines = FileUtil.readAllLines(FILE_NAME);
        List<Spouse> spouses = new ArrayList<>();
        for (String line : lines) {
            spouses.add(Spouse.fromString(line));
        }
        return spouses;
    }
    
    @Override
    public boolean update(Spouse spouse) {
        Spouse existingSpouse = getById(spouse.getId());
        if (existingSpouse == null) {
            return false;
        }
        return FileUtil.updateLine(FILE_NAME, existingSpouse.toString(), spouse.toString());
    }
    
    @Override
    public boolean delete(String id) {
        Spouse spouse = getById(id);
        if (spouse == null) {
            return false;
        }
        return FileUtil.removeLine(FILE_NAME, spouse.toString());
    }
}