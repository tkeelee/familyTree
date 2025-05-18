package com.familytree.dao;

import com.familytree.model.Person;
import com.familytree.util.FileUtil;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 人员数据访问类
 */
public class PersonDao implements DataAccess<Person> {
    private static final String FILE_NAME = "persons.txt";
    
    @Override
    public boolean save(Person person) {
        return FileUtil.writeToFile(FILE_NAME, person.toString(), true);
    }
    
    @Override
    public Person getById(String id) {
        List<String> lines = FileUtil.readAllLines(FILE_NAME);
        for (String line : lines) {
            Person person = Person.fromString(line);
            if (person.getId().equals(id)) {
                return person;
            }
        }
        return null;
    }
    
    @Override
    public List<Person> getAll() {
        List<String> lines = FileUtil.readAllLines(FILE_NAME);
        List<Person> persons = new ArrayList<>();
        for (String line : lines) {
            persons.add(Person.fromString(line));
        }
        return persons;
    }
    
    @Override
    public boolean update(Person person) {
        Person existingPerson = getById(person.getId());
        if (existingPerson == null) {
            return false;
        }
        return FileUtil.updateLine(FILE_NAME, existingPerson.toString(), person.toString());
    }
    
    @Override
    public boolean delete(String id) {
        Person person = getById(id);
        if (person == null) {
            return false;
        }
        return FileUtil.removeLine(FILE_NAME, person.toString());
    }
    
    /**
     * 获取指定家族下的所有成员
     * @param familyId 家族ID
     * @return 成员列表
     */
    public List<Person> getByFamilyId(String familyId) {
        return getAll().stream()
                .filter(person -> familyId.equals(person.getFamilyId()))
                .collect(Collectors.toList());
    }
    
    /**
     * 获取指定家谱下的所有成员
     * @param treeId 家谱ID
     * @return 成员列表
     */
    public List<Person> getByTreeId(String treeId) {
        return getAll().stream()
                .filter(person -> treeId.equals(person.getTreeId()))
                .collect(Collectors.toList());
    }
    
    /**
     * 获取指定父节点的所有子节点
     * @param parentId 父节点ID
     * @return 子节点列表
     */
    public List<Person> getByParentId(String parentId) {
        return getAll().stream()
                .filter(person -> parentId.equals(person.getParentId()))
                .collect(Collectors.toList());
    }
    
    /**
     * 根据配偶ID获取人员
     * @param spouseId 配偶ID
     * @return 人员对象
     */
    public Person getBySpouseId(String spouseId) {
        return getAll().stream()
                .filter(person -> spouseId.equals(person.getSpouseId()))
                .findFirst()
                .orElse(null);
    }
}