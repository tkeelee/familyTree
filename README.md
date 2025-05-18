# 家谱管理系统

## 项目介绍
一个基于Web的家族谱系管理系统，用于记录和管理家族成员信息及其关系。

## 主要功能
1. 家族管理
   - 创建新的家族
   - 编辑家族基本信息
   - 删除家族记录

2. 成员管理
   - 添加家族成员
   - 编辑成员信息（姓名、出生日期、描述等）
   - 设置成员关系（父子关系、配偶关系）
   - 删除成员记录

3. 家族关系图
   - 可视化展示家族成员关系
   - 支持缩放和拖拽
   - 点击查看成员详细信息
   - 展示配偶信息

## 技术栈
- 后端：Java + Spark 框架
- 前端：HTML, CSS, JavaScript
- 数据存储：文件系统（txt文件）
- 图形化：D3.js

## 使用说明
1. 访问系统首页 http://localhost:8080
2. 创建或选择家族
3. 添加家族成员信息
4. 设置成员之间的关系
5. 查看家族关系图

## 系统架构

### 后端架构
1. **模型层（Model）**
   - FamilyTree：家谱模型，包含家谱基本信息
   - Family：家族模型，隶属于家谱
   - Person：人员模型，包含个人信息和关系
   - Spouse：配偶模型，记录配偶信息

2. **数据访问层（DAO）**
   - FamilyTreeDao：家谱数据访问
   - FamilyDao：家族数据访问
   - PersonDao：人员数据访问
   - SpouseDao：配偶数据访问

3. **服务层（Service）**
   - FamilyTreeService：家谱业务逻辑
   - FamilyService：家族业务逻辑
   - PersonService：人员业务逻辑
   - SpouseService：配偶业务逻辑

4. **控制器层（Controller）**
   - FamilyTreeController：处理家谱相关请求
   - FamilyController：处理家族相关请求
   - PersonController：处理人员相关请求
   - UserController：处理用户相关请求

### 前端架构
1. **页面组件**
   - 登录/注册页面
   - 家谱管理页面
   - 家族管理页面
   - 成员管理页面
   - 家族关系图展示页面

2. **JavaScript功能模块**
   - 用户认证模块
   - 家谱/家族数据管理模块
   - 成员数据管理模块
   - 关系图渲染模块

### 数据存储
系统采用文本文件存储数据：
- family_trees.txt：存储家谱信息
- families.txt：存储家族信息
- persons.txt：存储人员信息
- spouses.txt：存储配偶信息

## API接口说明

### 家谱相关接口
- POST /api/trees：创建家谱
- GET /api/trees：获取所有家谱
- GET /api/users/:userId/trees：获取用户创建的家谱
- GET /api/trees/:treeId：获取家谱详情
- PUT /api/trees/:treeId：更新家谱
- DELETE /api/trees/:treeId：删除家谱

### 家族相关接口
- POST /api/families：创建家族
- GET /api/families：获取所有家族
- GET /api/trees/:treeId/families：获取指定家谱下的家族
- GET /api/users/:userId/families：获取用户创建的家族
- GET /api/families/:familyId：获取家族详情
- PUT /api/families/:familyId：更新家族
- DELETE /api/families/:familyId：删除家族

### 人员相关接口
- POST /api/persons：添加人员
- GET /api/persons：获取所有人员
- GET /api/families/:familyId/persons：获取指定家族的人员
- GET /api/trees/:treeId/persons：获取指定家谱的人员
- GET /api/persons/:personId：获取人员详情
- PUT /api/persons/:personId：更新人员信息
- DELETE /api/persons/:personId：删除人员

## 版本历史
v1.0.0 基础功能实现
- 用户登录注册
- 家谱/家族/成员的增删改查
- 家族关系图的可视化展示


/*
开发一个家谱应用，技术语言后台java，前台js/html，数据存储在本地文本文件中，可实现如下功能
支持注册登录。需要先创建家谱，在家谱里创建家族，在家族里添加成员。

登录后进入家谱大厅，可以看到自己创建的家谱，别人创建的家谱。可以创建家谱
点击一个家谱可以加入该家谱的家族大厅，可以看到自己创建的家族，别人创建的家族。可以在家谱内创建家族。
点击一个家族，进入家族视图，家族视图分左右两个区域，右侧展示成员列表【支持添加、查看、编辑】，左侧展示成员关系图。
可以添加成员，添加成员同时若添加配偶信息，则后台同步创建配偶信息。
可以查看修改成员，修改成员同时若修改配偶信息，则后台同步创建或更新配偶数据。
可以查看观修图，切换成员则关系图按此成员纬度刷新。

数据结构定义严格按照如下定义和存储
家谱定义：家谱编号，家谱名称，创建人，创建时间，家谱介绍
家族定义：家族编号，家族名称，创建人，创建时间，家族介绍，家谱编号
人员定义：编号，家谱编号【可空】，家族编号【可空】，父节点编号，姓名，性别，辈分，出生日期，出生地，死亡日期，简介，配偶编号
配偶定义：编号，姓名，出生日期，出生地，死亡日期，简介

*/