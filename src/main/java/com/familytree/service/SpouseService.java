package com.familytree.service;

import com.familytree.dao.SpouseDao;
import com.familytree.model.Spouse;

import java.util.List;

/**
 * 配偶服务类
 */
public class SpouseService {
    private final SpouseDao spouseDao;
    
    public SpouseService() {
        this.spouseDao = new SpouseDao();
    }
    
    /**
     * 添加配偶
     * @param name 姓名
     * @param birthDate 出生日期
     * @param birthPlace 出生地
     * @param deathDate 死亡日期
     * @param description 简介
     * @return 添加的配偶对象
     */
    public Spouse addSpouse(String name, String birthDate, String birthPlace, String deathDate, String description) {
        Spouse spouse = new Spouse(name, birthDate, birthPlace, deathDate, description);
        if (spouseDao.save(spouse)) {
            return spouse;
        }
        return null;
    }
    
    /**
     * 获取所有配偶
     * @return 配偶列表
     */
    public List<Spouse> getAllSpouses() {
        return spouseDao.getAll();
    }
    
    /**
     * 根据ID获取配偶
     * @param spouseId 配偶ID
     * @return 配偶对象
     */
    public Spouse getSpouseById(String spouseId) {
        return spouseDao.getById(spouseId);
    }
    
    /**
     * 更新配偶信息
     * @param spouse 配偶对象
     * @return 是否更新成功
     */
    public boolean updateSpouse(Spouse spouse) {
        return spouseDao.update(spouse);
    }
    
    /**
     * 删除配偶
     * @param spouseId 配偶ID
     * @return 是否删除成功
     */
    public boolean deleteSpouse(String spouseId) {
        return spouseDao.delete(spouseId);
    }
}