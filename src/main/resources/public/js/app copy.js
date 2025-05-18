/**
 * 家谱应用前端JavaScript
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
        loadFamilyPersonsForSelect();
        showSection('add-person-section');
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

/**
 * 检查登录状态
 */
function checkLoginStatus() {
    // 从localStorage获取用户信息
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
        currentUser = JSON.parse(userJson);
        updateUIAfterLogin();
    }
}

/**
 * 更新登录后的UI
 */
function updateUIAfterLogin() {
    // 显示用户相关导航，隐藏登录注册导航
    document.getElementById('nav-user').style.display = 'block';
    document.getElementById('nav-logout').style.display = 'block';
    document.getElementById('nav-login').style.display = 'none';
    document.getElementById('nav-register').style.display = 'none';
}

/**
 * 更新登出后的UI
 */
function updateUIAfterLogout() {
    // 显示登录注册导航，隐藏用户相关导航
    document.getElementById('nav-user').style.display = 'none';
    document.getElementById('nav-logout').style.display = 'none';
    document.getElementById('nav-login').style.display = 'block';
    document.getElementById('nav-register').style.display = 'block';
}

/**
 * 用户登录
 * @param {string} username 用户名
 * @param {string} password 密码
 */
function login(username, password) {
    // 表单验证
    if(!username || !password) {
        showMessage('用户名和密码不能为空');
        return;
    }

    // 使用URLSearchParams构造表单数据
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);
    
    fetch('/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            currentUser = data.data;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            updateUIAfterLogin();
            showSection('home-section');
            showMessage('登录成功');
        } else {
            showMessage(data.message || '登录失败');
        }
    })
    .catch(error => {
        console.error('登录请求出错:', error);
        showMessage('登录请求出错');
    });
}

/**
 * 用户注册
 * @param {string} username 用户名
 * @param {string} password 密码
 */
function register(username, password) {
    // 表单验证
    if(!username || !password) {
        showMessage('用户名和密码不能为空');
        return;
    }
    
    // 使用URLSearchParams构造表单数据
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);
    
    fetch('/api/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showMessage('注册成功，请登录');
            showSection('login-section');
        } else {
            showMessage(data.message || '注册失败');
        }
    })
    .catch(error => {
        console.error('注册请求出错:', error);
        showMessage('注册请求出错');
    });
}

/**
 * 用户登出
 */
function logout() {
    // 清除用户信息
    currentUser = null;
    localStorage.removeItem('currentUser');
    
    // 更新UI
    updateUIAfterLogout();
    showSection('home-section');
    showMessage('已退出登录');
}

/**
 * 加载用户信息
 */
function loadUserInfo() {
    if (!currentUser) return;
    
    // 显示用户基本信息
    const userInfo = document.getElementById('user-info');
    userInfo.innerHTML = `
        <p><strong>用户名:</strong> ${currentUser.username}</p>
        <p><strong>注册时间:</strong> ${currentUser.createdAt}</p>
    `;
    
    // 加载用户创建的家谱
    fetch(`/api/users/${currentUser.id}/trees`)
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            renderUserTrees(data.data);
        }
    })
    .catch(error => {
        console.error('加载用户家谱出错:', error);
    });
    
    // 加载用户创建的家族
    fetch(`/api/users/${currentUser.id}/families`)
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            renderUserFamilies(data.data);
        }
    })
    .catch(error => {
        console.error('加载用户家族出错:', error);
    });
}

/**
 * 渲染用户创建的家谱
 * @param {Array} trees 家谱列表
 */
function renderUserTrees(trees) {
    const treesList = document.getElementById('user-trees-list');
    
    if (trees.length === 0) {
        treesList.innerHTML = '<p>暂无家谱</p>';
        return;
    }
    
    let html = '';
    trees.forEach(tree => {
        html += `
            <div class="list-item" data-id="${tree.id}" onclick="viewTreeDetail('${tree.id}')">
                <h3>${tree.name}</h3>
                <p>创建时间: ${tree.createdAt}</p>
                <p>${tree.description || '暂无介绍'}</p>
            </div>
        `;
    });
    
    treesList.innerHTML = html;
}

/**
 * 渲染用户创建的家族
 * @param {Array} families 家族列表
 */
function renderUserFamilies(families) {
    const familiesList = document.getElementById('user-families-list');
    
    if (families.length === 0) {
        familiesList.innerHTML = '<p>暂无家族</p>';
        return;
    }
    
    let html = '';
    families.forEach(family => {
        html += `
            <div class="list-item" data-id="${family.id}" onclick="viewFamilyDetail('${family.id}')">
                <h3>${family.name}</h3>
                <p>创建时间: ${family.createdAt}</p>
                <p>${family.description || '暂无介绍'}</p>
            </div>
        `;
    });
    
    familiesList.innerHTML = html;
}

/**
 * 加载家谱列表
 */
function loadFamilyTrees() {
    fetch('/api/trees')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            renderFamilyTrees(data.data);
        }
    })
    .catch(error => {
        console.error('加载家谱列表出错:', error);
        showMessage('加载家谱列表出错');
    });
}

/**
 * 渲染家谱列表
 * @param {Array} trees 家谱列表
 */
function renderFamilyTrees(trees) {
    const treesList = document.getElementById('trees-list');
    
    if (trees.length === 0) {
        treesList.innerHTML = '<p>暂无家谱</p>';
        return;
    }
    
    let html = '';
    trees.forEach(tree => {
        html += `
            <div class="list-item" data-id="${tree.id}" onclick="viewTreeDetail('${tree.id}')">
                <h3>${tree.name}</h3>
                <p>创建者: ${tree.creatorId === currentUser.id ? '我' : tree.creatorId}</p>
                <p>创建时间: ${tree.createdAt}</p>
                <p>${tree.description || '暂无介绍'}</p>
            </div>
        `;
    });
    
    treesList.innerHTML = html;
}

/**
 * 查看家谱详情
 * @param {string} treeId 家谱ID
 */
function viewTreeDetail(treeId) {
    currentTreeId = treeId;
    
    // 加载家谱详情
    fetch(`/api/trees/${treeId}`)
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const tree = data.data;
            document.getElementById('tree-detail-title').textContent = tree.name;
            document.getElementById('tree-detail-info').innerHTML = `
                <p><strong>创建时间:</strong> ${tree.createdAt}</p>
                <p><strong>介绍:</strong> ${tree.description || '暂无介绍'}</p>
            `;
            
            // 加载家谱下的家族
            loadTreeFamilies(treeId);
            
            showSection('tree-detail-section');
        } else {
            showMessage(data.message || '加载家谱详情失败');
        }
    })
    .catch(error => {
        console.error('加载家谱详情出错:', error);
        showMessage('加载家谱详情出错');
    });
}

/**
 * 加载家谱下的家族
 * @param {string} treeId 家谱ID
 */
function loadTreeFamilies(treeId) {
    fetch(`/api/trees/${treeId}/families`)
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            renderTreeFamilies(data.data);
        }
    })
    .catch(error => {
        console.error('加载家谱家族出错:', error);
        showMessage('加载家谱家族出错');
    });
}

/**
 * 渲染家谱下的家族
 * @param {Array} families 家族列表
 */
function renderTreeFamilies(families) {
    const familiesList = document.getElementById('tree-families-list');
    
    if (families.length === 0) {
        familiesList.innerHTML = '<p>暂无家族</p>';
        return;
    }
    
    let html = '';
    families.forEach(family => {
        html += `
            <div class="list-item" data-id="${family.id}" onclick="viewFamilyDetail('${family.id}')">
                <h3>${family.name}</h3>
                <p>创建者: ${family.creatorId === currentUser.id ? '我' : family.creatorId}</p>
                <p>创建时间: ${family.createdAt}</p>
                <p>${family.description || '暂无介绍'}</p>
            </div>
        `;
    });
    
    familiesList.innerHTML = html;
}

/**
 * 创建家谱
 * @param {string} name 家谱名称
 * @param {string} description 家谱介绍
 */
function createFamilyTree(name, description) {
    if (!currentUser) {
        showMessage('请先登录');
        return;
    }
    
    // 构造请求数据
    const formData = new URLSearchParams();
    formData.append('name', name);
    formData.append('creatorId', currentUser.id);
    if (description) {
        formData.append('description', description);
    }
    
    // 发送创建家谱请求
    fetch('/api/trees', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // 创建成功
            showMessage('家谱创建成功');
            if (currentTreeId) {
                loadTreeFamilies(currentTreeId);
                showSection('tree-detail-section');
            } else {
                loadFamilies();
                showSection('families-section');
            }
        } else {
            // 创建失败
            showMessage(data.message || '创建家谱失败');
        }
    })
    .catch(error => {
        console.error('创建家谱请求出错:', error);
        showMessage('创建家谱请求出错');
    });
}

/**
 * 加载家族列表
 */
function loadFamilies() {
    fetch('/api/families')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            renderFamilies(data.data);
        }
    })
    .catch(error => {
        console.error('加载家族列表出错:', error);
        showMessage('加载家族列表出错');
    });
}

/**
 * 渲染家族列表
 * @param {Array} families 家族列表
 */
function renderFamilies(families) {
    const familiesList = document.getElementById('families-list');
    
    if (families.length === 0) {
        familiesList.innerHTML = '<p>暂无家族</p>';
        return;
    }
    
    let html = '';
    families.forEach(family => {
        html += `
            <div class="list-item" data-id="${family.id}" onclick="viewFamilyDetail('${family.id}')">
                <h3>${family.name}</h3>
                <p>创建者: ${family.creatorId === currentUser.id ? '我' : family.creatorId}</p>
                <p>创建时间: ${family.createdAt}</p>
                <p>${family.description || '暂无介绍'}</p>
            </div>
        `;
    });
    
    familiesList.innerHTML = html;
}

/**
 * 查看家族详情
 * @param {string} familyId 家族ID
 */
function viewFamilyDetail(familyId) {
    currentFamilyId = familyId;
    
    // 加载家族详情
    fetch(`/api/families/${familyId}`)
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const family = data.data;
            document.getElementById('family-detail-title').textContent = family.name;
            document.getElementById('family-detail-info').innerHTML = `
                <p><strong>创建时间:</strong> ${family.createdAt}</p>
                <p><strong>介绍:</strong> ${family.description || '暂无介绍'}</p>
            `;
            
            // 加载家族成员
            loadFamilyPersons(familyId);
            
            showSection('family-detail-section');
        } else {
            showMessage(data.message || '加载家族详情失败');
        }
    })
    .catch(error => {
        console.error('加载家族详情出错:', error);
        showMessage('加载家族详情出错');
    });
}

/**
 * 加载家族成员
 * @param {string} familyId 家族ID
 */
function loadFamilyPersons(familyId) {
    fetch(`/api/families/${familyId}/persons`)
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            renderFamilyPersons(data.data);
        }
    })
    .catch(error => {
        console.error('加载家族成员出错:', error);
        showMessage('加载家族成员出错');
    });
}

/**
 * 渲染家族成员
 * @param {Array} persons 成员列表
 */
function renderFamilyPersons(persons) {
    const personsList = document.getElementById('family-persons-list');
    
    if (persons.length === 0) {
        personsList.innerHTML = '<p>暂无成员</p>';
        return;
    }
    
    let html = '';
    persons.forEach(person => {
        html += `
            <div class="list-item" data-id="${person.id}">
                <h3>${person.name}</h3>
                <p><strong>性别:</strong> ${person.gender}</p>
                <p><strong>辈分:</strong> ${person.generation}</p>
                <p><strong>出生日期:</strong> ${person.birthDate || '未知'}</p>
                <p><strong>出生地:</strong> ${person.birthPlace || '未知'}</p>
                <p><strong>简介:</strong> ${person.description || '暂无'}</p>
            </div>
        `;
    });
    
    personsList.innerHTML = html;
}

/**
 * 加载家谱选择下拉框
 */
function loadTreesForSelect() {
    fetch('/api/trees')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const treeSelect = document.getElementById('family-tree-id');
            treeSelect.innerHTML = '';
            
            data.data.forEach(tree => {
                const option = document.createElement('option');
                option.value = tree.id;
                option.textContent = tree.name;
                treeSelect.appendChild(option);
            });
            
            // 如果有当前选中的家谱，则设置为选中状态
            if (currentTreeId) {
                treeSelect.value = currentTreeId;
            }
        }
    })
    .catch(error => {
        console.error('加载家谱选择出错:', error);
    });
}

/**
 * 创建家族
 * @param {string} name 家族名称
 * @param {string} treeId 家谱ID
 * @param {string} description 家族介绍
 */
function createFamily(name, treeId, description) {
    if (!currentUser) {
        showMessage('请先登录');
        return;
    }
    
    // 构造请求数据
    const formData = new URLSearchParams();
    formData.append('name', name);
    formData.append('creatorId', currentUser.id);
    formData.append('treeId', treeId);
    if (description) {
        formData.append('description', description);
    }
    
    // 发送创建家族请求
    fetch('/api/families', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // 创建成功
            showMessage('家族创建成功');
            if (currentTreeId) {
                loadTreeFamilies(currentTreeId);
                showSection('tree-detail-section');
            } else {
                loadFamilies();
                showSection('families-section');
            }
        } else {
            // 创建失败
            showMessage(data.message || '创建家族失败');
        }
    })
    .catch(error => {
        console.error('创建家族请求出错:', error);
        showMessage('创建家族请求出错');
    });
}

/**
 * 加载家族成员作为父节点选择
 */
function loadFamilyPersonsForSelect() {
    if (!currentFamilyId) return;
    
    fetch(`/api/families/${currentFamilyId}/persons`)
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const parentSelect = document.getElementById('person-parent-id');
            // 保留第一个选项（无父节点）
            parentSelect.innerHTML = '<option value="">无（作为根节点）</option>';
            
            data.data.forEach(person => {
                const option = document.createElement('option');
                option.value = person.id;
                option.textContent = `${person.name} (${person.gender}, ${person.generation})`;
                parentSelect.appendChild(option);
            });
        }
    })
    .catch(error => {
        console.error('加载家族成员选择出错:', error);
    });
}

/**
 * 添加人员
 */
function addPerson() {
    if (!currentUser || !currentFamilyId) {
        showMessage('参数错误');
        return;
    }
    
    // 获取表单数据
    const name = document.getElementById('person-name').value;
    const gender = document.getElementById('person-gender').value;
    const generation = document.getElementById('person-generation').value;
    const birthDate = document.getElementById('person-birth-date').value;
    const birthPlace = document.getElementById('person-birth-place').value||'';
    const deathDate = document.getElementById('person-death-date').value;
    const description = document.getElementById('person-description').value||'';
    const parentId = document.getElementById('person-parent-id').value;
    
    // 构造请求数据
    const formData = new URLSearchParams();
    formData.append('name', name);
    formData.append('gender', gender);
    formData.append('generation', generation);
    formData.append('familyId', currentFamilyId);
    
    if (birthDate) formData.append('birthDate', birthDate);
    if (birthPlace) formData.append('birthPlace', birthPlace);
    if (deathDate) formData.append('deathDate', deathDate);
    if (description) formData.append('description', description);
    if (parentId) formData.append('parentId', parentId);
    
    // 获取家族所属的家谱ID
    fetch(`/api/families/${currentFamilyId}`)
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const treeId = data.data.treeId;
            if (treeId) formData.append('treeId', treeId);
            
            // 发送添加人员请求
            return fetch('/api/persons', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formData
            });
        } else {
            throw new Error('获取家族信息失败');
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // 添加成功
            showMessage('添加成员成功');
            loadFamilyPersons(currentFamilyId);
            showSection('family-detail-section');
        } else {
            // 添加失败
            showMessage(data.message || '添加成员失败');
        }
    })
    .catch(error => {
        console.error('添加成员请求出错:', error);
        showMessage('添加成员请求出错');
    });
}

/**
 * 添加人员及其配偶
 */
function addPersonWithSpouse() {
    if (!currentUser || !currentFamilyId) {
        showMessage('参数错误');
        return;
    }
    
    // 获取人员表单数据
    const name = document.getElementById('person-name').value;
    const gender = document.getElementById('person-gender').value;
    const generation = document.getElementById('person-generation').value;
    const birthDate = document.getElementById('person-birth-date').value;
    const birthPlace = document.getElementById('person-birth-place').value||'';
    const deathDate = document.getElementById('person-death-date').value;
    const description = document.getElementById('person-description').value||'';
    const parentId = document.getElementById('person-parent-id').value;
    
    // 获取配偶表单数据
    const spouseName = document.getElementById('spouse-name').value||'';
    const spouseBirthDate = document.getElementById('spouse-birth-date').value;
    const spouseBirthPlace = document.getElementById('spouse-birth-place').value||'';
    const spouseDeathDate = document.getElementById('spouse-death-date').value;
    const spouseDescription = document.getElementById('spouse-description').value||'';
    
    // 构造请求数据
    const formData = new URLSearchParams();
    formData.append('name', name);
    formData.append('gender', gender);
    formData.append('generation', generation);
    formData.append('familyId', currentFamilyId);
    formData.append('spouseName', spouseName);
    
    if (birthDate) formData.append('birthDate', birthDate);
    if (birthPlace) formData.append('birthPlace', birthPlace);
    if (deathDate) formData.append('deathDate', deathDate);
    if (description) formData.append('description', description);
    if (parentId) formData.append('parentId', parentId);
    if (spouseBirthDate) formData.append('spouseBirthDate', spouseBirthDate);
    if (spouseBirthPlace) formData.append('spouseBirthPlace', spouseBirthPlace);
    if (spouseDeathDate) formData.append('spouseDeathDate', spouseDeathDate);
    if (spouseDescription) formData.append('spouseDescription', spouseDescription);
    
    // 获取家族所属的家谱ID
    fetch(`/api/families/${currentFamilyId}`)
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const treeId = data.data.treeId;
            if (treeId) formData.append('treeId', treeId);
            
            // 发送添加人员及配偶请求
            return fetch('/api/persons/with-spouse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formData
            });
        } else {
            throw new Error('获取家族信息失败');
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // 添加成功
            showMessage('添加成员及配偶成功');
            loadFamilyPersons(currentFamilyId);
            showSection('family-detail-section');
        } else {
            // 添加失败
            showMessage(data.message || '添加成员及配偶失败');
        }
    })
    .catch(error => {
        console.error('添加成员及配偶请求出错:', error);
        showMessage('添加成员及配偶请求出错');
    });
}

/**
 * 加载家族关系图
 */
function loadFamilyTreeView() {
    if (!currentFamilyId) return;
    
    // 设置标题
    const family = document.getElementById('family-detail-title').textContent;
    document.getElementById('family-tree-view-title').textContent = `${family} - 家族关系图`;
    
    // 加载家族成员
    fetch(`/api/families/${currentFamilyId}/persons`)
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            let persons = data.data;

            // 使用 Promise.all 处理所有异步请求
            const personPromises = persons.map(async node => {
                let spouseData = null;
                if (node.spouseId) {
                    try {
                        const response = await fetch(`/api/persons/${node.id}/spouse`);
                        const result = await response.json();
                        if (result.success) {
                            spouseData = result.data;
                        }
                    } catch (error) {
                        console.error('获取配偶信息失败:', error);
                    }
                }
                // 返回合并后的对象
                return {
                    ...node,
                    spouseData
                };
            });
            
            // 等待所有请求完成
            Promise.all(personPromises)
                .then(updatedPersons => {
                    renderFamilyTreeViewNew(updatedPersons);
                })
                .catch(error => {
                    console.error('处理配偶信息失败:', error);
                });
        }
    })
    .catch(error => {
        console.error('加载家族关系图出错:', error);
        showMessage('加载家族关系图出错');
    });
}

/**
 * 渲染家族关系图
 * @param {Array} data 成员列表
 */
function renderFamilyTreeViewNew(data) {
    const g = new dagreD3.graphlib.Graph().setGraph({});
    
    data.forEach(node => {

        g.setNode(node.id, {
            label: node.name+"("+node.generation+")",
            class: "node-style",
            width: 120,
            height: 40,
            rx: 5,
            ry: 5,
            // 存储完整节点数据
            nodeData: {
                person: node,
                spouse: node.spouseData
            }
        });
        
        if (node.parentId) {
            g.setEdge(node.parentId, node.id, {
                class: "edge-style",
                curve: d3.curveBasis
            });
        }
    });

    const svg = d3.select("#family-tree-container")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "600");
        
    const inner = svg.append("g");

    const zoom = d3.zoom().on("zoom", function(event) {
        inner.attr("transform", event.transform);
    });
    
    svg.call(zoom);

    const render = new dagreD3.render();
    render(inner, g);

    const initialScale = 0.75;
    // 获取SVG容器的实际宽度
    const svgWidth = svg.node().getBoundingClientRect().width;

    svg.call(zoom.transform, d3.zoomIdentity
        .translate((svgWidth - g.graph().width * initialScale) / 2, 20) 
        .scale(initialScale));

    inner.selectAll("g.node")
        .on("click", function(_, id) {
            const node = g.node(id);
            const fullData = node.nodeData; // 获取完整节点数据
            showNodeDetails(id, node,fullData);
        });
}

function showNodeDetails(id, node,fullData) {
    const spouseInfo = fullData.spouse ? 
    `姓名: ${fullData.spouse.name || '未知'}<br>
     出生日期: ${fullData.spouse.birthDate || '未知'}<br>
     描述: ${fullData.spouse.description || '无'}` : 
    '';
    const personInfo = fullData.person ? 
    `姓名: ${fullData.person.name || '未知'}<br>
     出生日期: ${fullData.person.birthDate || '未知'}<br>
     描述: ${fullData.person.description || '无'}` : 
    '';


    const modal = d3.select("body")
        .append("div")
        .attr("class", "node-modal")
        .style("position", "fixed")
        .style("top", "50%")
        .style("left", "50%")
        .style("transform", "translate(-50%, -50%)");

    modal.append("div")
        .html(`
            <h3>${node.label}</h3>
            <p>族人编号: ${id}</p>
            <p>个人信息: ${personInfo}</p>
            <p>配偶信息: ${spouseInfo}</p>
            <button onclick="this.parentElement.parentElement.remove()">关闭</button>
        `);
}