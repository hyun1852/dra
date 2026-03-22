let currentData = [];
let uploadedData = []; // 원본 데이터 보관용
let filteredData = []; // 화면에 보이는 필터링된 데이터
let charts = {};
let displayMode = 'cost';

document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
    setupEventListeners();
    setupDragAndDrop();
});

function initDashboard() {
    const hasData = currentData.length > 0;
    const emptyState = document.getElementById('emptyState');
    const dashboardContent = document.getElementById('dashboardContent');
    const resetBtn = document.getElementById('resetBtn');

    if (emptyState) emptyState.style.display = hasData ? 'none' : 'flex';
    if (dashboardContent) dashboardContent.style.display = hasData ? 'block' : 'none';
    if (resetBtn) resetBtn.style.display = hasData ? 'flex' : 'none';

    if (hasData) {
        renderKPIs();
        renderCharts();
        renderTable();
        setupFilters();
    }
}

function setupDragAndDrop() {
    const dropZone = document.getElementById('dropZone');
    const emptyState = document.getElementById('emptyState');
    if (!dropZone) return;

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
        }, false);
    });

    dropZone.addEventListener('dragenter', () => emptyState?.classList.add('drag-over'), false);
    dropZone.addEventListener('dragover', () => emptyState?.classList.add('drag-over'), false);
    dropZone.addEventListener('dragleave', () => emptyState?.classList.remove('drag-over'), false);
    dropZone.addEventListener('drop', (e) => {
        emptyState?.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        if (files.length > 0) handleFile(files[0]);
    }, false);
}

function setupEventListeners() {
    const safeAddListener = (id, event, handler) => {
        const el = document.getElementById(id);
        if (el) el.addEventListener(event, handler);
    };

    safeAddListener('viewCost', 'click', () => { 
        displayMode = 'cost'; updateToggleUI('viewCost', 'viewQty'); applyFilters();
    });
    safeAddListener('viewQty', 'click', () => { 
        displayMode = 'qty'; updateToggleUI('viewQty', 'viewCost'); applyFilters();
    });
    safeAddListener('uploadBtn', 'click', () => document.getElementById('fileInput')?.click());
    safeAddListener('fileInput', 'change', (e) => {
        if (e.target.files.length > 0) handleFile(e.target.files[0]);
    });

    ['domainFilter', 'systemFilter', 'modularFilter', 'partFilter', 'sortFilter'].forEach(id => {
        safeAddListener(id, 'change', applyFilters);
    });

    safeAddListener('modelSearch', 'input', applyFilters);
    safeAddListener('resetBtn', 'click', () => {
        if (confirm('시뮬레이션 데이터를 업로드 초기 상태로 되돌리시겠습니까?')) {
            currentData = JSON.parse(JSON.stringify(uploadedData));
            applyFilters();
        }
    });
    safeAddListener('downloadBtn', 'click', downloadExcel);
}

function handleFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            processExcelData(jsonData);
        } catch (err) {
            alert("엑셀 처리 중 오류가 발생했습니다.");
        }
    };
    reader.readAsArrayBuffer(file);
}

function processExcelData(rows) {
    if (rows.length < 2) return;
    const headers = rows[0];
    let lastDomain = "", lastSystem = "", lastModularSystem = "";
    
    const normalized = rows.slice(1).map(row => {
        lastDomain = row[0] || lastDomain;
        lastSystem = row[1] || lastSystem;
        lastModularSystem = row[2] || lastModularSystem;
        
        const item = { 
            domain: lastDomain, 
            system: lastSystem, 
            modularSystem: lastModularSystem, 
            part: row[3] || "", 
            spec: row[4] || "", 
            cost: parseFloat(row[5]) || 0, 
            models: {} 
        };

        for (let i = 6; i < headers.length; i++) {
            const headerName = headers[i];
            if (headerName && !headerName.includes("투자비") && !headerName.includes("합계")) {
                item.models[headerName] = row[i] || "-";
            }
        }
        return item;
    }).filter(item => item.part);

    if (normalized.length > 0) {
        uploadedData = JSON.parse(JSON.stringify(normalized));
        currentData = normalized;
        applyFilters(); 
    }
}

function updateToggleUI(activeId, inactiveId) {
    document.getElementById(activeId)?.classList.add('active');
    document.getElementById(inactiveId)?.classList.remove('active');
}

function applyFilters() {
    const domain = document.getElementById('domainFilter')?.value || 'all';
    const system = document.getElementById('systemFilter')?.value || 'all';
    const modularSystem = document.getElementById('modularFilter')?.value || 'all';
    const part = document.getElementById('partFilter')?.value || 'all';
    const sort = document.getElementById('sortFilter')?.value || 'default';
    const search = document.getElementById('modelSearch')?.value.toUpperCase() || '';

    filteredData = currentData.filter(item => {
        const matchDomain = domain === 'all' || item.domain === domain;
        const matchSystem = system === 'all' || item.system === system;
        const matchModular = modularSystem === 'all' || item.modularSystem === modularSystem;
        const matchPart = part === 'all' || item.part === part;
        const matchSearch = search === '' || Object.keys(item.models).some(m => m.includes(search));
        return matchDomain && matchSystem && matchModular && matchPart && matchSearch;
    });

    if (sort === 'high') filteredData.sort((a, b) => b.cost - a.cost);
    else if (sort === 'low') filteredData.sort((a, b) => a.cost - b.cost);

    initDashboard(); 
}

function calculateMetrics(data) {
    let stats = { domains: new Set(), systems: new Set(), parts: 0, specs: new Set(), base: 0, actual: 0, savings: 0, commonRate: 0, bySystem: {}, byModel: {} };
    data.forEach(item => {
        stats.domains.add(item.domain); stats.systems.add(item.system); stats.parts++; stats.specs.add(item.spec);
        Object.keys(item.models).forEach(m => {
            const status = item.models[m];
            if (status !== '-') {
                const val = (displayMode === 'cost' ? item.cost : 1);
                stats.base += val;
                if (status === '신규') stats.actual += val;
                
                if (!stats.bySystem[item.system]) stats.bySystem[item.system] = { base: 0, actual: 0 };
                stats.bySystem[item.system].base += val;
                if (status === '신규') stats.bySystem[item.system].actual += val;
                
                if (!stats.byModel[m]) stats.byModel[m] = { base: 0, actual: 0 };
                stats.byModel[m].base += val;
                if (status === '신규') stats.byModel[m].actual += val;
            }
        });
    });
    stats.savings = stats.base - stats.actual;
    stats.commonRate = stats.base > 0 ? (stats.savings / stats.base * 100).toFixed(1) : 0;
    return stats;
}

function renderKPIs() {
    const stats = calculateMetrics(filteredData);
    const unit = (displayMode === 'cost' ? '억' : '개');
    const update = (id, val) => {
        const el = document.getElementById(id);
        if (el) { el.innerText = val; const card = el.closest('.kpi-card'); if(card) { card.style.animation = 'none'; card.offsetHeight; card.style.animation = 'fadeIn 0.4s ease-out'; } }
    };
    update('statDomains', stats.domains.size); update('statSystems', stats.systems.size); update('statParts', stats.parts); update('statSpecs', stats.specs.size);
    update('totalBaseInv', `${stats.base.toLocaleString()} ${unit}`); update('totalActualInv', `${stats.actual.toLocaleString()} ${unit}`);
    update('totalSavingsInv', `${stats.savings.toLocaleString()} ${unit}`); update('totalCommonRate', `${stats.commonRate} %`);
}

function renderCharts() {
    const stats = calculateMetrics(filteredData);
    const commonOptions = { 
        responsive: true, 
        maintainAspectRatio: false, 
        animation: { 
            duration: 600, 
            easing: 'easeOutQuart' 
        }, 
        plugins: { legend: { position: 'top' } } 
    };
    
    const donutLabels = Object.keys(stats.bySystem);
    const donutValues = Object.values(stats.bySystem).map(s => s.actual);
    if (!charts.ratio) {
        charts.ratio = new Chart(document.getElementById('systemRatioChart'), { 
            type: 'doughnut', 
            data: { labels: donutLabels, datasets: [{ data: donutValues, backgroundColor: ['#1e40af', '#0891b2', '#059669', '#d97706', '#7c3aed'] }] }, 
            options: { ...commonOptions, plugins: { legend: { position: 'right' } } } 
        });
    } else {
        charts.ratio.data.labels = donutLabels;
        charts.ratio.data.datasets[0].data = donutValues;
        charts.ratio.update();
    }

    if (!charts.total) {
        charts.total = new Chart(document.getElementById('totalCommonChart'), { 
            type: 'bar', 
            data: { labels: ['전체'], datasets: [{ label: '실제', data: [stats.actual], backgroundColor: '#1e40af' }, { label: '절감', data: [stats.savings], backgroundColor: '#10b981' }] }, 
            options: { ...commonOptions, indexAxis: 'y', scales: { x: { stacked: true }, y: { stacked: true } } } 
        });
    } else {
        charts.total.data.datasets[0].data = [stats.actual];
        charts.total.data.datasets[1].data = [stats.savings];
        charts.total.update();
    }

    const sysLabels = Object.keys(stats.bySystem);
    const sysActual = Object.values(stats.bySystem).map(s => s.actual);
    const sysSavings = Object.values(stats.bySystem).map(s => s.base - s.actual);
    if (!charts.sys) {
        charts.sys = new Chart(document.getElementById('systemCommonChart'), { 
            type: 'bar', 
            data: { labels: sysLabels, datasets: [{ label: '실제', data: sysActual, backgroundColor: '#1e40af' }, { label: '절감', data: sysSavings, backgroundColor: '#10b981' }] }, 
            options: { ...commonOptions, scales: { x: { stacked: true }, y: { stacked: true } } } 
        });
    } else {
        charts.sys.data.labels = sysLabels;
        charts.sys.data.datasets[0].data = sysActual;
        charts.sys.data.datasets[1].data = sysSavings;
        charts.sys.update();
    }

    const modelLabels = Object.keys(stats.byModel);
    const modelActual = Object.values(stats.byModel).map(m => m.actual);
    const modelSavings = Object.values(stats.byModel).map(m => m.base - m.actual);
    if (!charts.model) {
        charts.model = new Chart(document.getElementById('modelCommonChart'), { 
            type: 'bar', 
            data: { labels: modelLabels, datasets: [{ label: '실제', data: modelActual, backgroundColor: '#1e40af' }, { label: '절감', data: modelSavings, backgroundColor: '#10b981' }] }, 
            options: { ...commonOptions, scales: { x: { stacked: true }, y: { stacked: true } } } 
        });
    } else {
        charts.model.data.labels = modelLabels;
        charts.model.data.datasets[0].data = modelActual;
        charts.model.data.datasets[1].data = modelSavings;
        charts.model.update();
    }
}

function toggleStatus(rowIndex, modelKey) {
    const item = filteredData[rowIndex];
    if (!item) return;
    const targetStatus = item.models[modelKey] === '신규' ? '공용' : '신규';
    item.models[modelKey] = targetStatus;
    
    const tag = document.querySelector(`[data-row="${rowIndex}"][data-model="${modelKey}"]`);
    if (tag) { tag.innerText = targetStatus; tag.className = 'status-tag ' + (targetStatus === '신규' ? 'status-new' : 'status-common'); }
    
    const actualCell = document.getElementById(`actual-${rowIndex}`);
    if (actualCell) {
        let rowActual = 0;
        Object.keys(item.models).forEach(m => {
            if (item.models[m] === '신규') rowActual += (displayMode === 'cost' ? item.cost : 1);
        });
        actualCell.innerText = rowActual.toLocaleString();
    }

    renderKPIs();
    renderCharts();
}

function renderTable() {
    const headerRow = document.getElementById('tableHeaderRow');
    const tbody = document.getElementById('tableBody');
    if (!headerRow || !tbody || !filteredData.length) return;
    const models = Object.keys(filteredData[0].models);
    
    headerRow.innerHTML = `<th>도메인</th><th>시스템</th><th>모듈러시스템</th><th>부품</th><th>사양</th><th>단가</th><th>실제투자비(억)</th>${models.map(m => `<th>${m}</th>`).join('')}`;
    tbody.innerHTML = filteredData.map((item, idx) => {
        let rowActual = 0;
        Object.keys(item.models).forEach(m => {
            if (item.models[m] === '신규') rowActual += (displayMode === 'cost' ? item.cost : 1);
        });
        return `
        <tr style="animation-delay: ${idx * 0.05}s">
            <td class="text-muted">${item.domain}</td><td>${item.system}</td><td>${item.modularSystem}</td><td style="font-weight:600">${item.part}</td><td class="text-muted">${item.spec}</td><td>${item.cost}</td>
            <td id="actual-${idx}" style="font-weight:700; color:var(--primary)">${rowActual.toLocaleString()}</td>
            ${models.map(m => {
                const status = item.models[m];
                const className = status === '신규' ? 'status-new' : (status !== '-' ? 'status-common' : 'status-none');
                const clickable = status !== '-' ? `onclick="toggleStatus(${idx}, '${m}')" style="cursor:pointer"` : '';
                return `<td><span class="status-tag ${className}" ${clickable} data-row="${idx}" data-model="${m}">${status}</span></td>`;
            }).join('')}
        </tr>`;
    }).join('');
}

function setupFilters() {
    const fields = { domainFilter: 'domain', systemFilter: 'system', modularFilter: 'modularSystem', partFilter: 'part' };
    Object.entries(fields).forEach(([id, key]) => {
        const select = document.getElementById(id);
        if (!select) return;
        const values = [...new Set(currentData.map(d => d[key]))];
        const currentVal = select.value;
        while (select.options.length > 1) select.remove(1);
        values.forEach(v => { const opt = document.createElement('option'); opt.value = v; opt.innerText = v; select.appendChild(opt); });
        select.value = currentVal;
    });
}

function downloadExcel() {
    if (!filteredData.length) return;
    const exportData = filteredData.map(item => {
        let rowBase = 0; let rowActual = 0;
        Object.keys(item.models).forEach(m => {
            if (item.models[m] !== '-') {
                rowBase += item.cost;
                if (item.models[m] === '신규') rowActual += item.cost;
            }
        });
        const row = { '도메인': item.domain, '시스템': item.system, '모듈러시스템': item.modularSystem, '부품': item.part, '사양': item.spec, '단가': item.cost, '기준투자비': rowBase, '실제투자비': rowActual };
        Object.entries(item.models).forEach(([m, s]) => { row[m] = s; });
        return row;
    });
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Analysis");
    XLSX.writeFile(wb, `Strategy_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
}
