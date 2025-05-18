/**
 * 家谱应用前端JavaScript - 家族关系图渲染相关功能
 */

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

/**
 * 显示节点详情
 * @param {string} id 节点ID
 * @param {Object} node 节点对象
 * @param {Object} fullData 完整节点数据
 */
function showNodeDetails(id, node, fullData) {
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