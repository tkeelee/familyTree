/**
 * 家谱应用前端JavaScript - 家谱管理相关功能
 */

/**
 * 加载家谱列表
 */
function loadFamilyTrees() {
    // 加载所有家谱
    fetch('/api/trees')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // 分离我的家谱和所有家谱
            const allTrees = data.data;
            const myTrees = allTrees.filter(tree => tree.creatorId === currentUser.id);
            
            // 渲染我的家谱和所有家谱
            renderMyFamilyTrees(myTrees);
            renderAllFamilyTrees(allTrees);
        }
    })
    .catch(error => {
        console.error('加载家谱列表出错:', error);
        showMessage('加载家谱列表出错');
    });
}

/**
 * 渲染我的家谱列表
 * @param {Array} trees 家谱列表
 */
function renderMyFamilyTrees(trees) {
    const myTreesList = document.getElementById('my-trees-list');
    
    if (trees.length === 0) {
        myTreesList.innerHTML = '<p>暂无家谱</p>';
        return;
    }
    
    let html = '';
    trees.forEach(tree => {
        html += `
            <div class="list-item" data-id="${tree.id}" onclick="viewTreeDetail('${tree.id}')">
                <h3>${tree.name}</h3>
                <p>创建者: 我</p>
                <p>创建时间: ${tree.createdAt}</p>
                <p>${tree.description || '暂无介绍'}</p>
            </div>
        `;
    });
    
    myTreesList.innerHTML = html;
}

/**
 * 渲染所有家谱列表
 * @param {Array} trees 家谱列表
 */
function renderAllFamilyTrees(trees) {
    const allTreesList = document.getElementById('all-trees-list');
    
    if (trees.length === 0) {
        allTreesList.innerHTML = '<p>暂无家谱</p>';
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
    
    allTreesList.innerHTML = html;
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