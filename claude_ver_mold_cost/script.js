// ===== STATE =====
let uploadedData = [];   // immutable snapshot of loaded data
let currentData = [];    // mutable data (toggled via simulation)
let filteredData = [];
let displayMode = 'cost'; // 'cost' | 'qty'
let charts = {};

window.toggleStatus = toggleStatus;

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    setupEvents();
    setupDragDrop();
    loadDefaultData();
});

function loadDefaultData() {
    if (typeof MOLD_DATA === 'undefined') return;
    uploadedData = deepClone(MOLD_DATA);
    currentData = deepClone(MOLD_DATA);
    showDashboard();
}

function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// ===== EVENTS =====
function setupEvents() {
    on('uploadBtn', 'click', () => id('fileInput').click());
    on('fileInput', 'change', e => { if (e.target.files[0]) readFile(e.target.files[0]); });

    on('resetBtn', 'click', () => {
        if (!confirm('시뮬레이션 데이터를 초기 상태로 되돌리시겠습니까?')) return;
        currentData = deepClone(uploadedData);
        applyFilters();
    });

    on('btnCost', 'click', () => { displayMode = 'cost'; setToggle('btnCost', 'btnQty'); applyFilters(); });
    on('btnQty', 'click', () => { displayMode = 'qty'; setToggle('btnQty', 'btnCost'); applyFilters(); });

    ['filterDomain','filterSystem','filterModular','filterPart','filterSort'].forEach(
        fid => on(fid, 'change', applyFilters)
    );
    on('searchModel', 'input', applyFilters);
    on('downloadBtn', 'click', downloadExcel);
}

function setupDragDrop() {
    const app = id('dropZone');
    const empty = id('emptyState');

    ['dragenter','dragover','dragleave','drop'].forEach(ev =>
        app.addEventListener(ev, e => { e.preventDefault(); e.stopPropagation(); })
    );

    app.addEventListener('dragenter', () => empty?.classList.add('drag-active'));
    app.addEventListener('dragover',  () => empty?.classList.add('drag-active'));
    app.addEventListener('dragleave', () => empty?.classList.remove('drag-active'));
    app.addEventListener('drop', e => {
        empty?.classList.remove('drag-active');
        if (e.dataTransfer.files[0]) readFile(e.dataTransfer.files[0]);
    });
}

// ===== FILE HANDLING =====
function readFile(file) {
    const reader = new FileReader();
    reader.onload = e => {
        try {
            const wb = XLSX.read(new Uint8Array(e.target.result), { type: 'array' });
            const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1 });
            parseExcel(rows);
        } catch {
            alert('엑셀 처리 중 오류가 발생했습니다. 파일 형식을 확인해주세요.');
        }
    };
    reader.readAsArrayBuffer(file);
}

function parseExcel(rows) {
    if (rows.length < 2) return;
    const headers = rows[0];
    let lastDomain = '', lastSystem = '', lastModular = '';

    const parsed = rows.slice(1).map(row => {
        lastDomain  = row[0] || lastDomain;
        lastSystem  = row[1] || lastSystem;
        lastModular = row[2] || lastModular;

        const item = {
            domain: lastDomain,
            system: lastSystem,
            modularSystem: lastModular,
            part: String(row[3] || '').trim(),
            spec: String(row[4] || '').trim(),
            cost: parseFloat(row[5]) || 0,
            models: {}
        };

        for (let i = 6; i < headers.length; i++) {
            const h = headers[i];
            if (h && !String(h).includes('투자비') && !String(h).includes('합계')) {
                item.models[h] = normalizeStatus(row[i]);
            }
        }
        return item;
    }).filter(item => item.part);

    if (!parsed.length) {
        alert('유효한 부품 데이터를 찾지 못했습니다. 컬럼 구조를 확인해주세요.');
        return;
    }

    uploadedData = deepClone(parsed);
    currentData  = deepClone(parsed);
    applyFilters();
    showDashboard();
}

function normalizeStatus(val) {
    if (!val || val === '-') return '-';
    if (val === '신규') return '신규';
    if (val === '공용') return '공용';
    return '공용'; // 차종 코드처럼 문자열이 들어온 경우 공용으로 처리
}

// ===== UI STATE =====
function showDashboard() {
    id('emptyState').style.display = 'none';
    id('dashboard').style.display = 'block';
    id('resetBtn').style.display = 'flex';
    buildFilterOptions();
    applyFilters();
}

function setToggle(activeId, inactiveId) {
    id(activeId)?.classList.add('active');
    id(inactiveId)?.classList.remove('active');
}

// ===== FILTERS =====
function applyFilters() {
    const domain  = val('filterDomain');
    const system  = val('filterSystem');
    const modular = val('filterModular');
    const part    = val('filterPart');
    const sort    = val('filterSort');
    const search  = (val('searchModel') || '').toUpperCase();

    filteredData = currentData.filter(item => {
        if (domain  && item.domain !== domain)  return false;
        if (system  && item.system !== system)  return false;
        if (modular && item.modularSystem !== modular) return false;
        if (part    && item.part !== part)      return false;
        if (search  && !Object.keys(item.models).some(m => m.toUpperCase().includes(search))) return false;
        return true;
    });

    if (sort === 'high') filteredData.sort((a, b) => b.cost - a.cost);
    if (sort === 'low')  filteredData.sort((a, b) => a.cost - b.cost);

    renderKPIs();
    renderCharts();
    renderTable();
    buildFilterOptions();
}

function buildFilterOptions() {
    const fields = {
        filterDomain:  'domain',
        filterSystem:  'system',
        filterModular: 'modularSystem',
        filterPart:    'part',
    };

    Object.entries(fields).forEach(([fid, key]) => {
        const el = id(fid);
        if (!el) return;
        const cur = el.value;
        const opts = [...new Set(currentData.map(d => d[key]).filter(Boolean))].sort();
        while (el.options.length > 1) el.remove(1);
        opts.forEach(v => {
            const o = document.createElement('option');
            o.value = o.textContent = v;
            el.appendChild(o);
        });
        el.value = cur;
    });
}

// ===== METRICS =====
function calcMetrics(data) {
    const m = {
        domains: new Set(), systems: new Set(), parts: 0, specs: new Set(),
        base: 0, actual: 0, bySystem: {}, byModel: {}
    };

    data.forEach(item => {
        m.domains.add(item.domain);
        m.systems.add(item.system);
        m.parts++;
        m.specs.add(`${item.part}__${item.spec}`);

        Object.entries(item.models).forEach(([model, status]) => {
            if (status === '-') return;
            const v = displayMode === 'cost' ? item.cost : 1;

            m.base += v;
            if (status === '신규') m.actual += v;

            if (!m.bySystem[item.system]) m.bySystem[item.system] = { base: 0, actual: 0 };
            m.bySystem[item.system].base += v;
            if (status === '신규') m.bySystem[item.system].actual += v;

            if (!m.byModel[model]) m.byModel[model] = { base: 0, actual: 0 };
            m.byModel[model].base += v;
            if (status === '신규') m.byModel[model].actual += v;
        });
    });

    m.savings = m.base - m.actual;
    m.rate = m.base > 0 ? ((m.savings / m.base) * 100).toFixed(1) : '0.0';
    return m;
}

// ===== KPIs =====
function renderKPIs() {
    const m = calcMetrics(filteredData);
    const unit = displayMode === 'cost' ? '억' : '개';

    setText('kpiDomains', m.domains.size);
    setText('kpiSystems', m.systems.size);
    setText('kpiParts',   m.parts);
    setText('kpiSpecs',   m.specs.size);

    setText('kpiBase',    m.base.toLocaleString());
    setText('kpiActual',  m.actual.toLocaleString());
    setText('kpiSavings', m.savings.toLocaleString());
    setText('kpiRate',    m.rate);

    ['kpiBaseUnit','kpiActualUnit','kpiSavingsUnit'].forEach(i => setText(i, unit));
}

// ===== CHARTS =====
const PALETTE = ['#2563eb','#0891b2','#059669','#d97706','#7c3aed','#db2777','#ea580c','#65a30d'];
const PALETTE_GREEN = '#10b981';

function renderCharts(deltaOnly = false) {
    const m = calcMetrics(filteredData);

    // 1) Donut: 시스템별 투자비 비중 (실제 기준)
    updateChart('chartSystemRatio', 'doughnut',
        Object.keys(m.bySystem),
        [{ data: Object.values(m.bySystem).map(s => s.actual), backgroundColor: PALETTE }],
        { plugins: { legend: { position: 'right' } } },
        deltaOnly
    );

    // 2) Bar: 전체 공용화
    updateChart('chartTotal', 'bar',
        ['전체'],
        [
            { label: '실제', data: [m.actual], backgroundColor: '#2563eb' },
            { label: '절감', data: [m.savings], backgroundColor: PALETTE_GREEN },
        ],
        { indexAxis: 'y', scales: { x: { stacked: true }, y: { stacked: true } } },
        deltaOnly
    );

    // 3) Bar: 시스템별
    const sysLabels = Object.keys(m.bySystem);
    updateChart('chartSystem', 'bar',
        sysLabels,
        [
            { label: '실제', data: sysLabels.map(k => m.bySystem[k].actual), backgroundColor: '#2563eb' },
            { label: '절감', data: sysLabels.map(k => m.bySystem[k].base - m.bySystem[k].actual), backgroundColor: PALETTE_GREEN },
        ],
        { scales: { x: { stacked: true }, y: { stacked: true } } },
        deltaOnly
    );

    // 4) Bar: 차종별
    const modLabels = Object.keys(m.byModel);
    updateChart('chartModel', 'bar',
        modLabels,
        [
            { label: '실제', data: modLabels.map(k => m.byModel[k].actual), backgroundColor: '#2563eb' },
            { label: '절감', data: modLabels.map(k => m.byModel[k].base - m.byModel[k].actual), backgroundColor: PALETTE_GREEN },
        ],
        { scales: { x: { stacked: true }, y: { stacked: true } } },
        deltaOnly
    );
}

function updateChart(canvasId, type, labels, datasets, extraOptions = {}, deltaOnly = false) {
    const canvas = id(canvasId);
    if (!canvas) return;

    const base = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top', labels: { boxWidth: 10, font: { size: 11 } } } },
        animation: { duration: 300 },
    };
    const options = mergeDeep(base, extraOptions);

    if (charts[canvasId]) {
        // 라벨은 그대로, 데이터 값만 in-place 업데이트 → Chart.js가 delta 애니메이션 적용
        charts[canvasId].data.labels = labels;
        datasets.forEach((ds, i) => {
            if (charts[canvasId].data.datasets[i]) {
                charts[canvasId].data.datasets[i].data = ds.data;
            }
        });
        // deltaOnly(토글)일 때는 변경된 요소만 부드럽게 전환
        charts[canvasId].update(deltaOnly ? 'active' : undefined);
    } else {
        charts[canvasId] = new Chart(canvas, { type, data: { labels, datasets }, options });
    }
}

function mergeDeep(target, source) {
    const out = Object.assign({}, target);
    for (const key of Object.keys(source)) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            out[key] = mergeDeep(target[key] || {}, source[key]);
        } else {
            out[key] = source[key];
        }
    }
    return out;
}

// ===== TABLE =====
function renderTable() {
    const head = id('tableHead');
    const body = id('tableBody');
    if (!head || !body) return;

    if (!filteredData.length) {
        head.innerHTML = '';
        body.innerHTML = '<tr><td colspan="20" style="text-align:center;padding:40px;color:#94a3b8">검색 결과가 없습니다.</td></tr>';
        id('tableInfo').textContent = '';
        return;
    }

    const models = Object.keys(filteredData[0].models);
    const unit = displayMode === 'cost' ? '억' : '개';

    head.innerHTML = `
        <th>도메인</th>
        <th>시스템</th>
        <th>모듈러</th>
        <th>부품명</th>
        <th>사양</th>
        <th style="text-align:right">단가</th>
        <th style="text-align:right">실제투자비(${unit})</th>
        ${models.map(m => `<th>${m}</th>`).join('')}
    `;

    body.innerHTML = filteredData.map((item, idx) => {
        const rowActual = calcRowActual(item);
        const cells = models.map(m => {
            const st = item.models[m];
            const cls = st === '신규' ? 'tag-new' : st === '공용' ? 'tag-common' : 'tag-none';
            return `<td><span class="tag ${cls}" data-row="${idx}" data-model="${m}" onclick="toggleStatus(${idx},'${m}')">${st}</span></td>`;
        }).join('');

        return `<tr>
            <td class="col-domain">${item.domain}</td>
            <td>${item.system}</td>
            <td>${item.modularSystem}</td>
            <td class="col-part">${item.part}</td>
            <td style="color:var(--text-muted)">${item.spec}</td>
            <td class="col-cost">${item.cost.toLocaleString()}</td>
            <td class="col-actual" id="row-actual-${idx}">${rowActual.toLocaleString()}</td>
            ${cells}
        </tr>`;
    }).join('');

    id('tableInfo').textContent = `총 ${filteredData.length}개 항목`;
}

function calcRowActual(item) {
    let sum = 0;
    Object.values(item.models).forEach(st => {
        if (st === '신규') sum += displayMode === 'cost' ? item.cost : 1;
    });
    return sum;
}

// ===== SIMULATION TOGGLE =====
function toggleStatus(rowIdx, model) {
    const item = filteredData[rowIdx];
    if (!item) return;

    const cycle = { '-': '신규', '신규': '공용', '공용': '-' };
    item.models[model] = cycle[item.models[model]] ?? '-';

    // DOM 업데이트 (partial, no full re-render)
    const tag = document.querySelector(`.tag[data-row="${rowIdx}"][data-model="${model}"]`);
    if (tag) {
        const st = item.models[model];
        tag.textContent = st;
        tag.className = `tag ${st === '신규' ? 'tag-new' : st === '공용' ? 'tag-common' : 'tag-none'}`;
    }

    const actualEl = id(`row-actual-${rowIdx}`);
    if (actualEl) actualEl.textContent = calcRowActual(item).toLocaleString();

    renderKPIs();
    renderCharts(true); // deltaOnly: 변경된 값만 전환 애니메이션
}

// ===== EXCEL DOWNLOAD =====
function downloadExcel() {
    if (!filteredData.length) return;

    const exportRows = filteredData.map(item => {
        const row = {
            '도메인': item.domain,
            '시스템': item.system,
            '모듈러시스템': item.modularSystem,
            '부품명': item.part,
            '사양': item.spec,
            '단가(억)': item.cost,
        };
        Object.entries(item.models).forEach(([m, st]) => { row[m] = st; });
        return row;
    });

    const ws = XLSX.utils.json_to_sheet(exportRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Analysis');
    XLSX.writeFile(wb, `MoldCost_Report_${today()}.xlsx`);
}

function today() {
    return new Date().toISOString().slice(0, 10);
}

// ===== HELPERS =====
function id(elId) { return document.getElementById(elId); }
function val(elId) { return id(elId)?.value || ''; }
function setText(elId, text) { const el = id(elId); if (el) el.textContent = text; }
function on(elId, event, fn) { id(elId)?.addEventListener(event, fn); }
