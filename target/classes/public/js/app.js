/**
 * 家谱应用前端JavaScript - 主文件
 * 负责初始化和协调其他模块
 */

// 全局变量
let currentUser = null;
let currentTreeId = null;
let currentFamilyId = null;

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化导航事件
    initNavEvents();
    
    // 初始化表单提交事件
    initFormEvents();
    
    // 检查登录状态
    checkLoginStatus();
});