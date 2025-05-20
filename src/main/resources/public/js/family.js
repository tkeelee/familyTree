/**
 * 家谱应用前端JavaScript - 家族管理相关功能
 */

/**
 * 加载家族列表
 */
function loadFamilies() {
    fetch('/api/families')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // 分离我的家族和所有家族
            const allFamilies = data.data;
            const myFamilies = allFamilies.filter(tree => tree.creatorId === currentUser.id);
            
            // 渲染我的家谱和所有家谱
            renderMyFamilies(myFamilies);
            renderAllFamilies(allFamilies);
        }
    })
    .catch(error => {
        console.error('加载家族列表出错:', error);
        showMessage('加载家族列表出错');
    });
}

/**
 * 渲染我的家族列表
 * @param {Array} families 家族列表
 */
function renderMyFamilies(families) {
    const myFamiliesList = document.getElementById('my-families-list');
    
    if (families.length === 0) {
        myFamiliesList.innerHTML = '<p>暂无家族</p>';
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
    
    myFamiliesList.innerHTML = html;
}

/**
 * 渲染全部家族列表
 * @param {Array} families 家族列表
 */
function renderAllFamilies(families) {
    const allFamiliesList = document.getElementById('all-families-list');
    
    if (families.length === 0) {
        allFamiliesList.innerHTML = '<p>暂无家族</p>';
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
    
    allFamiliesList.innerHTML = html;
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