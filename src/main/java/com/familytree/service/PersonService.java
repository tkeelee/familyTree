package com.familytree.service;

import com.familytree.dao.PersonDao;
import com.familytree.dao.SpouseDao;
import com.familytree.model.Person;
import com.familytree.model.Spouse;

import java.util.List;

/**
 * 人员服务类
 */
public class PersonService {
    private final PersonDao personDao;
    private final SpouseDao spouseDao;
    
    public PersonService() {
        this.personDao = new PersonDao();
        this.spouseDao = new SpouseDao();
    }
    
    /**
     * 添加人员
     * @param id 人员ID
     * @param name 姓名
     * @param gender 性别
     * @param generation 辈分
     * @param birthDate 出生日期
     * @param birthPlace 出生地
     * @param deathDate 死亡日期
     * @param description 简介
     * @param parentId 父节点ID
     * @param treeId 家谱ID
     * @param familyId 家族ID
     * @return 添加的人员对象
     */
    public Person addPerson(String id,String name, String gender, String generation, String birthDate, 
                           String birthPlace, String deathDate, String description, 
                           String parentId, String treeId, String familyId,String spouseId) {

        Person person = new Person(id,name, gender, generation, birthDate, birthPlace, deathDate, 
                                  description, parentId, treeId, familyId,spouseId);
        if(id.length()>0){
            if (personDao.update(person)) {
                return person;
            }
        }
        else if (personDao.save(person)) {
            return person;
        }
        return null;
    }

    /*
     * 添加配偶
     * @param id 配偶ID
     * @param spouseName 配偶姓名
     * @param spouseBirthDate 配偶出生日期
     * @param spouseBirthPlace 配偶出生地
     * @param spouseDeathDate 配偶死亡日期
     * @param spouseDescription 配偶简介
     * @return 添加的配偶对象
    */
    public Spouse addSpouse(String id, String spouseName, String spouseBirthDate, 
              String spouseBirthPlace, String spouseDeathDate, String spouseDescription) {
        // 创建配偶
        Spouse spouse = new Spouse(id,spouseName, spouseBirthDate, spouseBirthPlace, spouseDeathDate, spouseDescription);
        if(id.length()>0){
            if (spouseDao.update(spouse)) {
                return spouse;
            }
        }
        else if (spouseDao.save(spouse)) {
            return spouse;
        }
        return null;
    }
    
    /**
     * 添加人员及其配偶
     * @param person 人员对象
     * @param spouseName 配偶姓名
     * @param spouseBirthDate 配偶出生日期
     * @param spouseBirthPlace 配偶出生地
     * @param spouseDeathDate 配偶死亡日期
     * @param spouseDescription 配偶简介
     * @return 添加的人员对象
     */
    public Person addPersonWithSpouse(Person person, String spouseName, String spouseBirthDate, 
                                     String spouseBirthPlace, String spouseDeathDate, String spouseDescription) {
        // 创建配偶
        Spouse spouse = new Spouse("",spouseName, spouseBirthDate, spouseBirthPlace, spouseDeathDate, spouseDescription);
        if (spouseDao.save(spouse)) {
            // 设置人员的配偶ID
            person.setSpouseId(spouse.getId());
            if (personDao.save(person)) {
                return person;
            }
        }
        return null;
    }
    
    /**
     * 获取所有人员
     * @return 人员列表
     */
    public List<Person> getAllPersons() {
        return personDao.getAll();
    }
    
    /**
     * 获取指定家族下的所有成员
     * @param familyId 家族ID
     * @return 成员列表
     */
    public List<Person> getPersonsByFamilyId(String familyId) {
        return personDao.getByFamilyId(familyId);
    }
    
    /**
     * 获取指定家谱下的所有成员
     * @param treeId 家谱ID
     * @return 成员列表
     */
    public List<Person> getPersonsByTreeId(String treeId) {
        return personDao.getByTreeId(treeId);
    }
    
    /**
     * 获取指定父节点的所有子节点
     * @param parentId 父节点ID
     * @return 子节点列表
     */
    public List<Person> getPersonsByParentId(String parentId) {
        return personDao.getByParentId(parentId);
    }
    
    /**
     * 根据ID获取人员
     * @param personId 人员ID
     * @return 人员对象
     */
    public Person getPersonById(String personId) {
        return personDao.getById(personId);
    }
    
    /**
     * 获取人员的配偶
     * @param personId 人员ID
     * @return 配偶对象
     */
    public Spouse getSpouseByPersonId(String personId) {
        Person person = personDao.getById(personId);
        if (person != null && person.getSpouseId() != null) {
            return spouseDao.getById(person.getSpouseId());
        }
        return null;
    }
    
    /**
     * 更新人员信息
     * @param person 人员对象
     * @return 是否更新成功
     */
    public boolean updatePerson(Person person) {
        return personDao.update(person);
    }
    
    /**
     * 更新人员及其配偶信息
     * @param person 人员对象
     * @param spouse 配偶对象
     * @return 是否更新成功
     */
    public boolean updatePersonWithSpouse(Person person, Spouse spouse) {
        // 先检查人员是否有配偶
        if (person.getSpouseId() == null) {
            // 没有配偶，创建新配偶
            if (spouseDao.save(spouse)) {
                person.setSpouseId(spouse.getId());
                return personDao.update(person);
            }
            return false;
        } else {
            // 有配偶，更新配偶信息
            spouse.setId(person.getSpouseId());
            if (spouseDao.update(spouse)) {
                return personDao.update(person);
            }
            return false;
        }
    }
    
    /**
     * 删除人员
     * @param personId 人员ID
     * @return 是否删除成功
     */
    public boolean deletePerson(String personId) {
        Person person = personDao.getById(personId);
        if (person == null) {
            return false;
        }
        
        // 如果有配偶，也删除配偶
        if (person.getSpouseId() != null) {
            spouseDao.delete(person.getSpouseId());
        }
        
        return personDao.delete(personId);
    }
}