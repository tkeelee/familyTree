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
            <div class="list-item" data-id="${person.id}" onclick="viewPersonDetail('${person.id}')">
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
 * 查看族人详情
 * @param {string} personId 族人ID
 */
function viewPersonDetail(personId){
    currentPersonId = personId;
    
    // 加载族人详情
    fetch(`/api/persons/${personId}`)
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const person = data.data;
            
            // 显示区域，但延迟渲染表单内容
            showSection('add-person-section');
            
            // 如果有配偶ID，先加载配偶信息再渲染表单
            if(person.spouseId){
                // 加载配偶详情
                fetch(`/api/persons/${personId}/spouse`)
                .then(responseSp => responseSp.json())
                .then(dataSp => {
                    let spouse = null;
                    if (dataSp.success) {
                        spouse = dataSp.data;
                    } else {    
                        showMessage(dataSp.message || '加载配偶详情失败');
                    }
                    // 在配偶信息加载完成后渲染表单
                    renderPersonToForm(person, spouse);
                    loadFamilyPersonsForSelect();
                })
                .catch(error => {
                    console.error('加载配偶详情出错:', error);
                    showMessage('加载配偶详情出错');
                    // 即使出错也要渲染表单，但不包含配偶信息
                    renderPersonToForm(person, null);
                    loadFamilyPersonsForSelect();
                });
            } else {
                // 没有配偶ID，直接渲染表单
                renderPersonToForm(person, null);
                loadFamilyPersonsForSelect();
            }
        } else {    
            showMessage(data.message || '加载家族详情失败');
        } 
    })
    .catch(error => {
        console.error('加载个人详情出错:', error);
        showMessage('加载个人详情出错');
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
    // 修改标题为'添加成员'
    document.querySelector('#add-person-section h2').innerText = '添加成员';
    if (!currentUser || !currentFamilyId) {
        showMessage('参数错误');
        return;
    }
    
    // 获取表单数据
    const id = document.getElementById('person-id').value;
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
    if (id) formData.append('id', id);
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
            // 添加/更新成功
            showMessage(id ? '更新成员成功' : '添加成员成功');
            loadFamilyPersons(currentFamilyId);
            showSection('family-detail-section');
        } else {
            // 添加/更新失败
            showMessage(data.message || (id ? '更新成员失败' : '添加成员失败'));
        }
    })
    .catch(error => {
        console.error(id ? '更新成员请求出错:' : '添加成员请求出错:', error);
        showMessage(id ? '更新成员请求出错' : '添加成员请求出错');
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
    const id = document.getElementById('person-id').value;
    const name = document.getElementById('person-name').value;
    const gender = document.getElementById('person-gender').value;
    const generation = document.getElementById('person-generation').value;
    const birthDate = document.getElementById('person-birth-date').value;
    const birthPlace = document.getElementById('person-birth-place').value||'';
    const deathDate = document.getElementById('person-death-date').value;
    const description = document.getElementById('person-description').value||'';
    const parentId = document.getElementById('person-parent-id').value;
    
    // 获取配偶表单数据
    const spouseId = document.getElementById('spouse-id').value;
    const spouseName = document.getElementById('spouse-name').value||'';
    const spouseBirthDate = document.getElementById('spouse-birth-date').value;
    const spouseBirthPlace = document.getElementById('spouse-birth-place').value||'';
    const spouseDeathDate = document.getElementById('spouse-death-date').value;
    const spouseDescription = document.getElementById('spouse-description').value||'';
    
    // 构造请求数据
    const formData = new URLSearchParams();
    if (id) formData.append('id', id);
    formData.append('name', name);
    formData.append('gender', gender);
    formData.append('generation', generation);
    formData.append('familyId', currentFamilyId);
    formData.append('spouseName', spouseName);
    
    if (spouseId) formData.append('spouseId', spouseId);
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
            // 添加/更新成功
            showMessage(id ? '更新成员及配偶成功' : '添加成员及配偶成功');
            loadFamilyPersons(currentFamilyId);
            showSection('family-detail-section');
        } else {
            // 添加/更新失败
            showMessage(data.message || (id ? '更新成员及配偶失败' : '添加成员及配偶失败'));
        }
    })
    .catch(error => {
        console.error(id ? '更新成员及配偶请求出错:' : '添加成员及配偶请求出错:', error);
        showMessage(id ? '更新成员及配偶请求出错' : '添加成员及配偶请求出错');
    });
}

/**
 * 渲染成员信息到修改表单
 * 在viewPersonDetail函数中调用
 * @param {Object} person 成员信息
 */
function renderPersonToForm(person,spouse) {
    // 修改标题为'修改成员'
    document.querySelector('#add-person-section h2').innerText = '修改成员';

    document.getElementById('person-id').value = person.id || '';
    document.getElementById('person-name').value = person.name || '';
    document.getElementById('person-gender').value = person.gender || '男';
    document.getElementById('person-generation').value = person.generation || '';
    document.getElementById('person-birth-date').value = person.birthDate || '';
    document.getElementById('person-birth-place').value = person.birthPlace || '';
    document.getElementById('person-death-date').value = person.deathDate || '';
    document.getElementById('person-description').value = person.description || '';
    document.getElementById('person-parent-id').value = person.parentId || '';
    
    // 处理配偶信息
    if(spouse){
        // 有配偶信息，显示配偶区域并填充数据
        document.getElementById('add-spouse-checkbox').checked = true;
        document.getElementById('spouse-info').style.display = 'block';
        document.getElementById('spouse-id').value = spouse.id || '';
        document.getElementById('spouse-name').value = spouse.name || '';
        document.getElementById('spouse-birth-date').value = spouse.birthDate || '';
        document.getElementById('spouse-birth-place').value = spouse.birthPlace|| '';
        document.getElementById('spouse-death-date').value = spouse.deathDate || '';
        document.getElementById('spouse-description').value = spouse.description || '';
    } else {
        // 无配偶信息，清空并隐藏配偶区域
        document.getElementById('add-spouse-checkbox').checked = false;
        document.getElementById('spouse-info').style.display = 'none';
        document.getElementById('spouse-id').value = '';
        document.getElementById('spouse-name').value = '';
        document.getElementById('spouse-birth-date').value = '';
        document.getElementById('spouse-birth-place').value = '';
        document.getElementById('spouse-death-date').value = '';
        document.getElementById('spouse-description').value = '';
    }
}
