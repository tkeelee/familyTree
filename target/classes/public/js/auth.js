/**
 * 家谱应用前端JavaScript - 用户认证相关功能
 */

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