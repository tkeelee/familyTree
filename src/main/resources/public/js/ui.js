/**
 * 家谱应用前端JavaScript - UI交互和显示相关功能
 */

/**
 * 初始化导航事件
 */
function initNavEvents() {
    // 首页导航
    document.getElementById('nav-home').addEventListener('click', function(e) {
        e.preventDefault();
        showSection('home-section');
    });
    
    // 家谱大厅导航
    document.getElementById('nav-trees').addEventListener('click', function(e) {
        e.preventDefault();
        if (currentUser) {
            loadFamilyTrees();
            showSection('trees-section');
        } else {
            showSection('login-section');
            showMessage('请先登录');
        }
    });
    
    // 家族大厅导航
    document.getElementById('nav-families').addEventListener('click', function(e) {
        e.preventDefault();
        if (currentUser) {
            loadFamilies();
            showSection('families-section');
        } else {
            showSection('login-section');
            showMessage('请先登录');
        }
    });
    
    // 登录导航
    document.getElementById('nav-login').addEventListener('click', function(e) {
        e.preventDefault();
        showSection('login-section');
    });
    
    // 注册导航
    document.getElementById('nav-register').addEventListener('click', function(e) {
        e.preventDefault();
        showSection('register-section');
    });
    
    // 个人中心导航
    document.getElementById('nav-user').addEventListener('click', function(e) {
        e.preventDefault();
        loadUserInfo();
        showSection('user-section');
    });
    
    // 退出导航
    document.getElementById('nav-logout').addEventListener('click', function(e) {
        e.preventDefault();
        logout();
    });
    
    // 登录页面跳转到注册
    document.getElementById('to-register').addEventListener('click', function(e) {
        e.preventDefault();
        showSection('register-section');
    });
    
    // 注册页面跳转到登录
    document.getElementById('to-login').addEventListener('click', function(e) {
        e.preventDefault();
        showSection('login-section');
    });
    
    // 创建家谱按钮
    document.getElementById('create-tree-btn').addEventListener('click', function() {
        showSection('create-tree-section');
    });
    
    // 取消创建家谱
    document.getElementById('cancel-create-tree').addEventListener('click', function() {
        showSection('trees-section');
    });
    
    // 创建家族按钮
    document.getElementById('create-family-btn').addEventListener('click', function() {
        loadTreesForSelect();
        showSection('create-family-section');
    });
    
    // 取消创建家族
    document.getElementById('cancel-create-family').addEventListener('click', function() {
        showSection('families-section');
    });
    
    // 返回家谱大厅
    document.getElementById('back-to-trees-btn').addEventListener('click', function() {
        showSection('trees-section');
    });
    
    // 返回家族大厅
    document.getElementById('back-to-families-btn').addEventListener('click', function() {
        showSection('families-section');
    });
    
    // 添加家族到家谱
    document.getElementById('add-family-to-tree-btn').addEventListener('click', function() {
        document.getElementById('family-tree-id').value = currentTreeId;
        showSection('create-family-section');
    });
    
    // 添加成员按钮
    document.getElementById('add-person-btn').addEventListener('click', function() {
        // 显示加载指示器或禁用按钮
        const btn = this;
        btn.disabled = true;
        showSection('add-person-section');
        
        // 使用Promise.all并行加载数据
        Promise.all([
            new Promise(resolve => {
                loadFamilyPersonsForSelect(resolve);
            }),
            new Promise(resolve => {
                loadGenerationOptions(currentTreeId, resolve);
            })
        ]).finally(() => {
            // 恢复按钮状态
            btn.disabled = false;
        });
    });
    
    // 取消添加成员
    document.getElementById('cancel-add-person').addEventListener('click', function() {
        showSection('family-detail-section');
    });
    
    // 查看家族关系图
    document.getElementById('view-family-tree-btn').addEventListener('click', function() {
        loadFamilyTreeView();
        showSection('family-tree-view-section');
    });
    
    // 返回家族详情
    document.getElementById('back-to-family-detail-btn').addEventListener('click', function() {
        showSection('family-detail-section');
    });
    
    // 添加配偶复选框
    document.getElementById('add-spouse-checkbox').addEventListener('change', function() {
        const spouseInfo = document.getElementById('spouse-info');
        if (this.checked) {
            spouseInfo.style.display = 'block';
        } else {
            spouseInfo.style.display = 'none';
        }
    });
}

/**
 * 初始化表单提交事件
 */
function initFormEvents() {
    // 登录表单提交
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        login(username, password);
    });
    
    // 注册表单提交
    document.getElementById('register-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        
        if (password !== confirmPassword) {
            showMessage('两次输入的密码不一致');
            return;
        }
        
        register(username, password);
    });
    
    // 创建家谱表单提交
    document.getElementById('create-tree-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('tree-name').value;
        const description = document.getElementById('tree-description').value||'';
        createFamilyTree(name, description);
    });
    
    // 创建家族表单提交
    document.getElementById('create-family-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('family-name').value;
        const treeId = document.getElementById('family-tree-id').value;
        const description = document.getElementById('family-description').value||'';
        createFamily(name, treeId, description);
    });
    
    // 添加成员表单提交
    document.getElementById('add-person-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const addSpouse = document.getElementById('add-spouse-checkbox').checked;
        
        if (addSpouse) {
            addPersonWithSpouse();
        } else {
            addPerson();
        }
    });
}

/**
 * 显示指定的页面区域，隐藏其他区域
 * @param {string} sectionId 要显示的区域ID
 */
function showSection(sectionId) {
    // 获取所有section元素
    const sections = document.querySelectorAll('.section');
    
    // 隐藏所有section
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    // 显示指定的section
    document.getElementById(sectionId).style.display = 'block';
    
    // 更新导航栏活动状态
    updateNavActiveState(sectionId);
}

/**
 * 更新导航栏活动状态
 * @param {string} sectionId 当前显示的区域ID
 */
function updateNavActiveState(sectionId) {
    // 移除所有导航项的活动状态
    const navItems = document.querySelectorAll('nav ul li a');
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // 根据当前显示的区域设置对应导航项的活动状态
    switch (sectionId) {
        case 'home-section':
            document.getElementById('nav-home').classList.add('active');
            break;
        case 'trees-section':
        case 'tree-detail-section':
        case 'create-tree-section':
            document.getElementById('nav-trees').classList.add('active');
            break;
        case 'families-section':
        case 'family-detail-section':
        case 'create-family-section':
        case 'add-person-section':
        case 'family-tree-view-section':
            document.getElementById('nav-families').classList.add('active');
            break;
        case 'login-section':
            document.getElementById('nav-login').classList.add('active');
            break;
        case 'register-section':
            document.getElementById('nav-register').classList.add('active');
            break;
        case 'user-section':
            document.getElementById('nav-user').classList.add('active');
            break;
    }
}

/**
 * 显示消息提示
 * @param {string} message 消息内容
 */
function showMessage(message) {
    alert(message);
}