package com.familytree.dao;

import java.util.List;

/**
 * 通用数据访问接口
 * @param <T> 数据模型类型
 */
public interface DataAccess<T> {
    /**
     * 保存单个对象
     * @param t 要保存的对象
     * @return 是否保存成功
     */
    boolean save(T t);
    
    /**
     * 根据ID获取对象
     * @param id 对象ID
     * @return 找到的对象，如果不存在则返回null
     */
    T getById(String id);
    
    /**
     * 获取所有对象
     * @return 对象列表
     */
    List<T> getAll();
    
    /**
     * 更新对象
     * @param t 要更新的对象
     * @return 是否更新成功
     */
    boolean update(T t);
    
    /**
     * 删除对象
     * @param id 要删除的对象ID
     * @return 是否删除成功
     */
    boolean delete(String id);
}