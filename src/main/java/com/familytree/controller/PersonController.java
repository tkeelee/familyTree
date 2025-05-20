package com.familytree.controller;

import com.familytree.model.Person;
import com.familytree.model.Spouse;
import com.familytree.service.PersonService;
import com.familytree.service.SpouseService;
import com.google.gson.Gson;
import spark.Request;
import spark.Response;
import spark.Spark;

import java.util.List;

/**
 * 人员控制器，处理人员相关的Web请求
 */
public class PersonController extends BaseController {
    private final PersonService personService;
    private final SpouseService spouseService;
    
    public PersonController(Gson gson) {
        super(gson);
        this.personService = new PersonService();
        this.spouseService = new SpouseService();
    }
    
    @Override
    public void registerRoutes() {
        // 添加人员
        Spark.post("/api/persons", this::addPerson);
        
        // 添加人员及其配偶
        Spark.post("/api/persons/with-spouse", this::addPersonWithSpouse);
        
        // 获取所有人员
        Spark.get("/api/persons", this::getAllPersons);
        
        // 获取指定家族下的所有成员
        Spark.get("/api/families/:familyId/persons", this::getPersonsByFamilyId);
        
        // 获取指定家谱下的所有成员
        Spark.get("/api/trees/:treeId/persons", this::getPersonsByTreeId);
        
        // 获取指定父节点的所有子节点
        Spark.get("/api/persons/:parentId/children", this::getChildrenByParentId);
        
        // 获取人员详情
        Spark.get("/api/persons/:personId", this::getPersonById);
        
        // 获取人员的配偶
        Spark.get("/api/persons/:personId/spouse", this::getPersonSpouse);
        
        // 更新人员信息
        Spark.put("/api/persons/:personId", this::updatePerson);
        
        // 删除人员
        Spark.delete("/api/persons/:personId", this::deletePerson);
    }
    
    /**
     * 添加人员
     */
    private String addPerson(Request request, Response response) {
        try {
            // 人员信息，有id则为更新，无则为添加
            String id = getParam(request, "id");
            String name = getRequiredParam(request, "name");
            String gender = getRequiredParam(request, "gender");
            String generation = getRequiredParam(request, "generation");
            String birthDate = getParam(request, "birthDate");
            String birthPlace = getParam(request, "birthPlace");
            String deathDate = getParam(request, "deathDate");
            String description = getParam(request, "description");
            String parentId = getParam(request, "parentId");
            String treeId = getParam(request, "treeId");
            String familyId = getParam(request, "familyId");
            
            Person person = personService.addPerson(id,name, gender, generation, birthDate, birthPlace, 
                    deathDate, description, parentId, treeId, familyId,"");
            
            if (person == null) {
                return error("添加人员失败");
            }
            
            return success(person);
        } catch (IllegalArgumentException e) {
            setStatus(response, 400);
            return error(e.getMessage());
        } catch (Exception e) {
            setStatus(response, 500);
            return error("添加人员失败: " + e.getMessage());
        }
    }
    
    /**
     * 添加人员及其配偶
     */
    private String addPersonWithSpouse(Request request, Response response) {
        try {
            // 人员信息，有id则为更新，无则为添加
            String id = getParam(request, "id");
            String name = getRequiredParam(request, "name");
            String gender = getRequiredParam(request, "gender");
            String generation = getRequiredParam(request, "generation");
            String birthDate = getParam(request, "birthDate");
            String birthPlace = getParam(request, "birthPlace");
            String deathDate = getParam(request, "deathDate");
            String description = getParam(request, "description");
            String parentId = getParam(request, "parentId");
            String treeId = getParam(request, "treeId");
            String familyId = getParam(request, "familyId");
            
            String spouseIdNew = "";
            String spouseName = getRequiredParam(request, "spouseName");
            // 配偶信息，有spouseId则为更新，无且spouseName不为空则为添加
            if(spouseName.length()>0){
                String spouseId = getParam(request, "spouseId");

                String spouseBirthDate = getParam(request, "spouseBirthDate");
                String spouseBirthPlace = getParam(request, "spouseBirthPlace");
                String spouseDeathDate = getParam(request, "spouseDeathDate");
                String spouseDescription = getParam(request, "spouseDescription");
                
                Spouse result = personService.addSpouse(spouseId,spouseName,spouseBirthDate,spouseBirthPlace,spouseDeathDate,spouseDescription);
                // 获取配偶id
                spouseIdNew = result.getId();
            }
            // 创建人员对象
            Person person = personService.addPerson(id,name, gender, generation, birthDate, birthPlace, 
                    deathDate, description, parentId, treeId, familyId,spouseIdNew);
            
            if (person == null) {
                return error("添加人员及其配偶失败");
            }
            
            return success(person);
        } catch (IllegalArgumentException e) {
            setStatus(response, 400);
            return error(e.getMessage());
        } catch (Exception e) {
            setStatus(response, 500);
            return error("添加人员及其配偶失败: " + e.getMessage());
        }
    }
    
    /**
     * 获取所有人员
     */
    private String getAllPersons(Request request, Response response) {
        try {
            List<Person> persons = personService.getAllPersons();
            return success(persons);
        } catch (Exception e) {
            setStatus(response, 500);
            return error("获取人员列表失败: " + e.getMessage());
        }
    }
    
    /**
     * 获取指定家族下的所有成员
     */
    private String getPersonsByFamilyId(Request request, Response response) {
        try {
            String familyId = getPathParam(request, "familyId");
            List<Person> persons = personService.getPersonsByFamilyId(familyId);
            
            return success(persons);
        } catch (Exception e) {
            setStatus(response, 500);
            return error("获取家族成员列表失败: " + e.getMessage());
        }
    }
    
    /**
     * 获取指定家谱下的所有成员
     */
    private String getPersonsByTreeId(Request request, Response response) {
        try {
            String treeId = getPathParam(request, "treeId");
            List<Person> persons = personService.getPersonsByTreeId(treeId);
            return success(persons);
        } catch (Exception e) {
            setStatus(response, 500);
            return error("获取家谱成员列表失败: " + e.getMessage());
        }
    }
    
    /**
     * 获取指定父节点的所有子节点
     */
    private String getChildrenByParentId(Request request, Response response) {
        try {
            String parentId = getPathParam(request, "parentId");
            List<Person> children = personService.getPersonsByParentId(parentId);
            return success(children);
        } catch (Exception e) {
            setStatus(response, 500);
            return error("获取子节点列表失败: " + e.getMessage());
        }
    }
    
    /**
     * 获取人员详情
     */
    private String getPersonById(Request request, Response response) {
        try {
            String personId = getPathParam(request, "personId");
            Person person = personService.getPersonById(personId);
            
            if (person == null) {
                setStatus(response, 404);
                return error("人员不存在");
            }
            
            return success(person);
        } catch (Exception e) {
            setStatus(response, 500);
            return error("获取人员详情失败: " + e.getMessage());
        }
    }
    
    /**
     * 获取人员的配偶
     */
    private String getPersonSpouse(Request request, Response response) {
        try {
            String personId = getPathParam(request, "personId");
            Person person = personService.getPersonById(personId);
            
            if (person == null) {
                setStatus(response, 404);
                return error("人员不存在");
            }
            
            String spouseId = person.getSpouseId();
            if (spouseId == null || spouseId.trim().isEmpty()) {
                return success(null); // 没有配偶
            }
            
            Spouse spouse = spouseService.getSpouseById(spouseId);
            return success(spouse);
        } catch (Exception e) {
            setStatus(response, 500);
            return error("获取配偶信息失败: " + e.getMessage());
        }
    }
    
    /**
     * 更新人员信息
     */
    private String updatePerson(Request request, Response response) {
        try {
            String personId = getPathParam(request, "personId");
            Person person = personService.getPersonById(personId);
            
            if (person == null) {
                setStatus(response, 404);
                return error("人员不存在");
            }
            
            // 更新可修改的字段
            String name = getParam(request, "name");
            String gender = getParam(request, "gender");
            String generation = getParam(request, "generation");
            String birthDate = getParam(request, "birthDate");
            String birthPlace = getParam(request, "birthPlace");
            String deathDate = getParam(request, "deathDate");
            String description = getParam(request, "description");
            String parentId = getParam(request, "parentId");
            String spouseId = getParam(request, "spouseId");
            
            if (name != null && !name.trim().isEmpty()) {
                person.setName(name);
            }
            
            if (gender != null && !gender.trim().isEmpty()) {
                person.setGender(gender);
            }
            
            if (generation != null && !generation.trim().isEmpty()) {
                person.setGeneration(generation);
            }
            
            if (birthDate != null) {
                person.setBirthDate(birthDate);
            }
            
            if (birthPlace != null) {
                person.setBirthPlace(birthPlace);
            }
            
            if (deathDate != null) {
                person.setDeathDate(deathDate);
            }
            
            if (description != null) {
                person.setDescription(description);
            }
            
            if (parentId != null) {
                person.setParentId(parentId);
            }
            
            if (spouseId != null) {
                person.setSpouseId(spouseId);
            }
            
            boolean updated = personService.updatePerson(person);
            if (!updated) {
                return error("更新人员信息失败");
            }
            
            return success(person);
        } catch (Exception e) {
            setStatus(response, 500);
            return error("更新人员信息失败: " + e.getMessage());
        }
    }
    
    /**
     * 删除人员
     */
    private String deletePerson(Request request, Response response) {
        try {
            String personId = getPathParam(request, "personId");
            boolean deleted = personService.deletePerson(personId);
            
            if (!deleted) {
                setStatus(response, 404);
                return error("人员不存在或删除失败");
            }
            
            return success("人员已删除");
        } catch (Exception e) {
            setStatus(response, 500);
            return error("删除人员失败: " + e.getMessage());
        }
    }
}