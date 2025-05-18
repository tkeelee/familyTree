/**
 * 家谱应用前端JavaScript - 成员管理相关功能
 */

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