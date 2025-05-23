/**
 * 家谱应用前端JavaScript - 成员管理相关功能
 */

// 全局缓存变量
let treeGenerationCache = {};

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
                    // 移除这里的loadFamilyPersonsForSelect调用，因为已经在renderPersonToForm中处理
                })
                .catch(error => {
                    console.error('加载配偶详情出错:', error);
                    showMessage('加载配偶详情出错');
                    // 即使出错也要渲染表单，但不包含配偶信息
                    renderPersonToForm(person, null);
                    // 移除这里的loadFamilyPersonsForSelect调用，因为已经在renderPersonToForm中处理
                });
            } else {
                // 没有配偶ID，直接渲染表单
                renderPersonToForm(person, null);
                // 移除这里的loadFamilyPersonsForSelect调用，因为已经在renderPersonToForm中处理
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
 * 加载家族成员选择列表
 * @param {Function} callback 加载完成后的回调函数
 */
function loadFamilyPersonsForSelect(callback) {
    if (!currentFamilyId) {
        if (callback) callback();
        return;
    }
    
    fetch(`/api/families/${currentFamilyId}/persons`)
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const parentSelect = document.getElementById('person-parent-id');
            // 保留第一个选项（无父节点）
            parentSelect.innerHTML = '<option value="">无（作为根节点）</option>';
            
            // 获取当前选择的辈分
            const currentGeneration = document.getElementById('person-generation').value;
            
            // 如果有辈分选择，则根据辈分筛选父节点
            if (currentGeneration) {
                updateParentSelectByGeneration(currentGeneration, data.data);
            } else {
                // 否则显示所有成员
                data.data.forEach(person => {
                    const option = document.createElement('option');
                    option.value = person.id;
                    option.textContent = `${person.name} (${person.gender}, ${person.generation})`;
                    parentSelect.appendChild(option);
                });
            }
        }
        if (callback) callback();
    })
    .catch(error => {
        console.error('加载家族成员选择出错:', error);
        if (callback) callback();
    });
}

/**
 * 根据辈分更新父节点选择
 * @param {string} generation 当前选择的辈分
 * @param {Array} persons 家族成员数据
 * @param {Function} callback 更新完成后的回调函数
 */
function updateParentSelectByGeneration(generation, persons, callback) {
    if (!currentFamilyId) {
        if (callback) callback();
        return;
    }
    
    // 如果没有提供成员数据，则需要重新加载
    if (!persons) {
        fetch(`/api/families/${currentFamilyId}/persons`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                updateParentSelectWithData(generation, data.data, callback);
            } else if (callback) {
                callback();
            }
        })
        .catch(error => {
            console.error('加载家族成员出错:', error);
            if (callback) callback();
        });
    } else {
        updateParentSelectWithData(generation, persons, callback);
    }
}

/**
 * 使用成员数据更新父节点选择
 * @param {string} generation 当前选择的辈分
 * @param {Array} persons 家族成员数据
 * @param {Function} callback 更新完成后的回调函数
 */
function updateParentSelectWithData(generation, persons, callback) {
    // 检查缓存中是否有家谱数据
    if (treeGenerationCache[currentTreeId]) {
        processGenerationData(treeGenerationCache[currentTreeId], generation, persons);
        if (callback) callback();
        return;
    }
    
    // 获取家谱辈分信息
    fetch(`/api/trees/${currentTreeId}`)
    .then(response => response.json())
    .then(data => {
        if (data.success && data.data.generation) {
            // 缓存家谱数据
            treeGenerationCache[currentTreeId] = data.data.generation;
            processGenerationData(data.data.generation, generation, persons);
        }
        if (callback) callback();
    })
    .catch(error => {
        console.error('加载家谱辈分信息出错:', error);
        if (callback) callback();
    });
}

/**
 * 处理辈分数据并更新UI
 * @param {string} generationData 家谱辈分数据
 * @param {string} currentGeneration 当前选择的辈分
 * @param {Array} persons 家族成员数据
 */
function processGenerationData(generationData, currentGeneration, persons) {
    const generations = generationData.split(':').filter(gen => gen.trim() !== '');
    const currentIndex = generations.findIndex(gen => gen.trim() === currentGeneration);
    
    const parentSelect = document.getElementById('person-parent-id');
    // 保留第一个选项（无父节点）
    parentSelect.innerHTML = '<option value="">无（作为根节点）</option>';
    
    if (currentIndex > 0) {
        // 如果不是顶级辈分，则显示上一级辈分的男性成员
        const parentGeneration = generations[currentIndex - 1].trim();
        
        // 筛选上一级辈分的男性成员
        const parentCandidates = persons.filter(person => 
            person.generation === parentGeneration && person.gender === '男'
        );
        
        parentCandidates.forEach(person => {
            const option = document.createElement('option');
            option.value = person.id;
            option.textContent = `${person.name} (${person.gender}, ${person.generation})`;
            parentSelect.appendChild(option);
        });
    }
    // 如果是顶级辈分，则不需要添加选项，保持默认的"无（作为根节点）"
}

/**
 * 加载家谱辈分选项
 * @param {string} treeId 家谱ID
 * @param {Function} callback 加载完成后的回调函数
 */
function loadGenerationOptions(treeId, callback) {
    if (!treeId) {
        if (callback) callback();
        return;
    }
    
    fetch(`/api/trees/${treeId}`)
    .then(response => response.json())
    .then(data => {
        if (data.success && data.data.generation) {
            const generationSelect = document.getElementById('person-generation');
            generationSelect.innerHTML = '';
            
            // 将辈分字符串按行分割成数组
            const generations = data.data.generation.split(':').filter(gen => gen.trim() !== '');
            
            generations.forEach(gen => {
                const option = document.createElement('option');
                option.value = gen.trim();
                option.textContent = gen.trim();
                generationSelect.appendChild(option);
            });
            
            // 添加辈分选择变更事件监听
            document.getElementById('person-generation').addEventListener('change', function() {
                const selectedGeneration = this.value;
                if (selectedGeneration) {
                    updateParentSelectByGeneration(selectedGeneration);
                }
            });
        }
        if (callback) callback();
    })
    .catch(error => {
        console.error('加载家谱辈分选项出错:', error);
        if (callback) callback();
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

    // 保存原始父节点值，以便后续恢复
    const originalParentId = person.parentId || '';

    document.getElementById('person-id').value = person.id || '';
    document.getElementById('person-name').value = person.name || '';
    document.getElementById('person-gender').value = person.gender || '男';
    
    // 加载家谱辈分选项
    if (person.treeId) {
        currentTreeId = person.treeId;
        loadGenerationOptions(person.treeId, function() {
            // 在辈分选项加载完成后设置辈分值
            document.getElementById('person-generation').value = person.generation || '';
            
            // 先根据辈分加载父节点列表
            updateParentSelectByGeneration(person.generation, null, function() {
                // 在父节点列表加载完成后，设置为原始父节点值
                setTimeout(() => {
                    document.getElementById('person-parent-id').value = originalParentId;
                }, 100);
            });
        });
    } else if (currentFamilyId) {
        // 如果没有treeId，尝试从家族获取treeId
        fetch(`/api/families/${currentFamilyId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success && data.data.treeId) {
                currentTreeId = data.data.treeId;
                loadGenerationOptions(data.data.treeId, function() {
                    // 在辈分选项加载完成后设置辈分值
                    document.getElementById('person-generation').value = person.generation || '';
                    
                    // 先根据辈分加载父节点列表
                    updateParentSelectByGeneration(person.generation, null, function() {
                        // 在父节点列表加载完成后，设置为原始父节点值
                        setTimeout(() => {
                            document.getElementById('person-parent-id').value = originalParentId;
                        }, 100);
                    });
                });
            }
        })
        .catch(error => {
            console.error('获取家族所属家谱出错:', error);
        });
    }
    
    document.getElementById('person-birth-date').value = person.birthDate || '';
    document.getElementById('person-birth-place').value = person.birthPlace || '';

    document.getElementById('person-death-date').value = person.deathDate || '';
    document.getElementById('person-description').value = person.description || '';
    
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
