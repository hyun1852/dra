import partsData from './data.js';

let filteredData = [...partsData];

let chartSortStates = {
    system: 'default', // 'default', 'cost', 'rate'
    vehicle: 'default' // 'default', 'cost', 'rate'
};

let chartScaleModes = {
    system: 'fixed', // 'fixed', 'actual'
    vehicle: 'fixed'
};

document.addEventListener('DOMContentLoaded', () => {
    initFilters();
    initTheme();
    renderDashboard();

    // Event Listeners
    document.getElementById('domain-filter').addEventListener('change', handleFilter);
    document.getElementById('system-filter').addEventListener('change', handleFilter);
    document.getElementById('modular-filter').addEventListener('change', handleFilter);
    document.getElementById('part-filter').addEventListener('change', handleFilter);
    document.getElementById('sort-order').addEventListener('change', handleFilter);
    document.getElementById('search-input').addEventListener('input', handleFilter);
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    document.getElementById('download-excel').addEventListener('click', exportToExcel);
    
    // System Chart Controls
    document.getElementById('sort-system-chart').addEventListener('click', () => {
        const states = ['default', 'cost', 'rate'];
        const next = states[(states.indexOf(chartSortStates.system) + 1) % states.length];
        chartSortStates.system = next;
        const labels = { default: '기본순', cost: '금액순', rate: '비율순' };
        document.getElementById('sort-system-chart').textContent = labels[next];
        renderSystemSharingChart(filteredData);
    });
    document.getElementById('toggle-system-scale').addEventListener('click', () => {
        chartScaleModes.system = chartScaleModes.system === 'fixed' ? 'actual' : 'fixed';
        document.getElementById('toggle-system-scale').textContent = chartScaleModes.system === 'fixed' ? '누적' : '기본';
        renderSystemSharingChart(filteredData);
    });

    // Vehicle Chart Controls
    document.getElementById('sort-vehicle-chart').addEventListener('click', () => {
        const states = ['default', 'cost', 'rate'];
        const next = states[(states.indexOf(chartSortStates.vehicle) + 1) % states.length];
        chartSortStates.vehicle = next;
        const labels = { default: '기본순', cost: '금액순', rate: '비율순' };
        document.getElementById('sort-vehicle-chart').textContent = labels[next];
        renderVehicleSharingChart(filteredData);
    });
    document.getElementById('toggle-vehicle-scale').addEventListener('click', () => {
        chartScaleModes.vehicle = chartScaleModes.vehicle === 'fixed' ? 'actual' : 'fixed';
        document.getElementById('toggle-vehicle-scale').textContent = chartScaleModes.vehicle === 'fixed' ? '누적' : '기본';
        renderVehicleSharingChart(filteredData);
    });
});

function initFilters() {
    const domains = [...new Set(partsData.map(d => d.domain))].sort();
    const systems = [...new Set(partsData.map(d => d.system))].sort();
    const modulars = [...new Set(partsData.map(d => d.modularSystem))].sort();
    const parts = [...new Set(partsData.map(d => d.part))].sort();

    fillSelect('domain-filter', domains);
    fillSelect('system-filter', systems);
    fillSelect('modular-filter', modulars);
    fillSelect('part-filter', parts);
}

function fillSelect(id, items) {
    const select = document.getElementById(id);
    let defaultText = '전체 시스템';
    if (id === 'domain-filter') defaultText = '전체 도메인';
    if (id === 'modular-filter') defaultText = '전체 모듈러';
    if (id === 'part-filter') defaultText = '전체 부품';
    
    select.innerHTML = `<option value="">${defaultText}</option>`;
    
    items.forEach(item => {
        const opt = document.createElement('option');
        opt.value = item;
        opt.textContent = item;
        select.appendChild(opt);
    });
}

function handleFilter(e) {
    const domainEl = document.getElementById('domain-filter');
    const systemEl = document.getElementById('system-filter');
    const modularEl = document.getElementById('modular-filter');
    const partNameEl = document.getElementById('part-filter');
    const sortEl = document.getElementById('sort-order');
    const searchEl = document.getElementById('search-input');

    if (!domainEl || !systemEl || !modularEl || !partNameEl || !sortEl || !searchEl) return;

    const domain = domainEl.value;
    const system = systemEl.value;
    const modular = modularEl.value;
    const partName = partNameEl.value;
    const sort = sortEl.value;
    const search = searchEl.value.toLowerCase();

    filteredData = partsData.filter(d => {
        const matchesDomain = !domain || d.domain === domain;
        const matchesSystem = !system || d.system === system;
        const matchesModular = !modular || d.modularSystem === modular;
        const matchesPart = !partName || d.part === partName;
        const matchesSearch = !search || 
            (d.domain && d.domain.toLowerCase().includes(search)) ||
            (d.system && d.system.toLowerCase().includes(search)) ||
            (d.modularSystem && d.modularSystem.toLowerCase().includes(search)) ||
            (d.part && d.part.toLowerCase().includes(search)) ||
            (d.spec && d.spec.toLowerCase().includes(search)) ||
            (d.targetVehicle && d.targetVehicle.toLowerCase().includes(search)) ||
            (d.sharedVehicle && d.sharedVehicle.toLowerCase().includes(search));

        return matchesDomain && matchesSystem && matchesModular && matchesPart && matchesSearch;
    });

    const changedId = e ? e.target.id : null;
    if (changedId === 'domain-filter' || !changedId) {
        const domainFiltered = domain ? partsData.filter(d => d.domain === domain) : partsData;
        updateFilterOptions('system-filter', 'system', domainFiltered);
        updateFilterOptions('modular-filter', 'modularSystem', domainFiltered);
        updateFilterOptions('part-filter', 'part', domainFiltered);
    } else if (changedId === 'system-filter') {
        const systemFiltered = system ? partsData.filter(d => d.system === system) : partsData;
        updateFilterOptions('modular-filter', 'modularSystem', systemFiltered);
        updateFilterOptions('part-filter', 'part', systemFiltered);
    } else if (changedId === 'modular-filter') {
        const modularFiltered = modular ? partsData.filter(d => d.modularSystem === modular) : partsData;
        updateFilterOptions('part-filter', 'part', modularFiltered);
    }

    if (sort === 'asc') filteredData.sort((a, b) => a.moldCost - b.moldCost);
    else if (sort === 'desc') filteredData.sort((a, b) => b.moldCost - a.moldCost);

    renderDashboard();
}

function updateFilterOptions(id, key, data) {
    const select = document.getElementById(id);
    const currentVal = select.value;
    const items = [...new Set(data.map(d => d[key]))].sort();
    let defaultText = '전체 시스템';
    if (id === 'domain-filter') defaultText = '전체 도메인';
    if (id === 'modular-filter') defaultText = '전체 모듈러';
    if (id === 'part-filter') defaultText = '전체 부품';
    select.innerHTML = `<option value="">${defaultText}</option>`;
    items.forEach(item => {
        const opt = document.createElement('option');
        opt.value = item;
        opt.textContent = item;
        if (item === currentVal) opt.selected = true;
        select.appendChild(opt);
    });
}

function renderDashboard() {
    const tableBody = document.getElementById('table-body');
    const totalDomainsEl = document.getElementById('total-domains');
    const totalSystemsEl = document.getElementById('total-systems');
    const totalPartsEl = document.getElementById('total-parts');
    const totalSpecsEl = document.getElementById('total-specs');
    const potentialTotalEl = document.getElementById('potential-total-cost');
    const totalCostEl = document.getElementById('total-cost');
    const costAvoidanceEl = document.getElementById('cost-avoidance');
    const sharingRateEl = document.getElementById('sharing-rate');

    const domainSet = new Set(filteredData.map(d => d.domain));
    const systemSet = new Set(filteredData.map(d => d.system));
    const specSet = new Set(filteredData.map(d => d.spec));
    
    const actualSpentCost = filteredData.reduce((sum, d) => d.sharedVehicle === "" ? sum + d.moldCost : sum, 0);
    const potentialTotalCost = filteredData.reduce((sum, d) => sum + d.moldCost, 0);
    const costAvoidance = potentialTotalCost - actualSpentCost;
    const sharingRate = potentialTotalCost > 0 ? (costAvoidance / potentialTotalCost) * 100 : 0;

    animateNumber(totalDomainsEl, domainSet.size);
    animateNumber(totalSystemsEl, systemSet.size);
    animateNumber(totalPartsEl, filteredData.length);
    animateNumber(totalSpecsEl, specSet.size);
    animateNumber(potentialTotalEl, potentialTotalCost);
    animateNumber(totalCostEl, actualSpentCost);
    animateNumber(costAvoidanceEl, costAvoidance);
    sharingRateEl.textContent = `${Math.round(sharingRate)}%`;

    renderChart(filteredData);
    renderOverallSharingBar(actualSpentCost, potentialTotalCost);
    renderSystemSharingChart(filteredData);
    renderVehicleSharingChart(filteredData);

    const groupedRows = [];
    const vehicleList = ["NE2", "NV1", "JK2", "JW2", "ME2", "MV2"];

    filteredData.forEach(item => {
        const key = `${item.domain}-${item.system}-${item.modularSystem}-${item.part}-${item.spec}`;
        let existing = groupedRows.find(r => r.key === key);
        if (!existing) {
            existing = { ...item, key, vehicles: {}, totalInvestment: 0 };
            groupedRows.push(existing);
        }
        existing.vehicles[item.targetVehicle] = item.sharedVehicle === "" ? "신규" : item.sharedVehicle;
        if (item.sharedVehicle === "") existing.totalInvestment += item.moldCost;
    });

    const rowspans = calculateRowspans(groupedRows);
    const groupCounters = { domain: 0, system: 0, modularSystem: 0, part: 0 };
    const lastCellIds = { domain: '', system: '', modularSystem: '', part: '' };

    let html = '';
    groupedRows.forEach((item, index) => {
        const levels = ['domain', 'system', 'modularSystem', 'part'];
        let rowDataAttrs = '';
        levels.forEach(level => {
            if (rowspans[level][index]) lastCellIds[level] = `cell-${level}-${groupCounters[level]++}`;
            rowDataAttrs += ` data-${level}-link="${lastCellIds[level]}"`;
        });
        html += `<tr class="transition-colors group-row" ${rowDataAttrs}>`;
        levels.forEach(level => {
            if (rowspans[level][index]) html += `<td id="${lastCellIds[level]}" rowspan="${rowspans[level][index]}" class="px-6 py-4 font-bold text-foreground underline decoration-border/20 transition-colors">${item[level]}</td>`;
        });
        html += `<td class="px-6 py-4 text-muted-foreground">${item.spec}</td>`;
        html += `<td class="px-6 py-4 font-bold text-muted-foreground text-right tabular-nums italic border-r border-border/50">${item.moldCost.toLocaleString()}</td>`;
        html += `<td class="px-6 py-4 font-black text-foreground text-right tabular-nums border-r border-border/50">${item.totalInvestment.toLocaleString()}</td>`;
        vehicleList.forEach(vCode => {
            const status = item.vehicles[vCode] || "-";
            const statusClass = status === "신규" ? "text-foreground font-black" : "text-muted-foreground";
            const bgClass = status === "신규" ? "bg-foreground/10" : (status !== "-" ? "bg-foreground/5" : "");
            html += `<td class="px-2 py-4 text-center text-[10px] ${statusClass} ${bgClass}">${status}</td>`;
        });
        html += '</tr>';
    });

    tableBody.style.opacity = '0';
    setTimeout(() => {
        tableBody.innerHTML = groupedRows.length > 0 ? html : '<tr><td colspan="13" class="text-center py-12 text-muted-foreground uppercase text-[10px] tracking-widest font-bold">No Data Found</td></tr>';
        tableBody.style.opacity = '1';
        initTableHover();
    }, 50);
}

function renderOverallSharingBar(actual, potential) {
    const container = document.getElementById('overall-sharing-bar');
    const saved = potential - actual;
    const rate = potential > 0 ? (saved / potential) * 100 : 0;
    const actualWidth = potential > 0 ? (actual / potential) * 100 : 0;
    const savedWidth = potential > 0 ? (saved / potential) * 100 : 0;

    container.innerHTML = `
        <div class="flex justify-between items-end mb-1">
            <span class="text-[9px] font-black text-foreground uppercase tracking-tighter">전체 공용화 현황</span>
            <span class="text-[8px] font-bold text-muted-foreground tabular-nums">기준 ${potential.toLocaleString()}억</span>
        </div>
        <div class="relative w-full h-6 bg-foreground/5 rounded-sm overflow-hidden flex border border-border/50">
            <div class="h-full bg-foreground flex items-center justify-center transition-all duration-700" style="width: ${actualWidth}%">
                ${actualWidth > 15 ? `<span class="text-[8px] font-black text-background">${actual}</span>` : ''}
            </div>
            <div class="h-full bg-emerald-500 flex items-center justify-center transition-all duration-700" style="width: ${savedWidth}%">
                ${savedWidth > 15 ? `<span class="text-[8px] font-black text-white">${saved} (${Math.round(rate)}%)</span>` : ''}
            </div>
        </div>
    `;
}

function renderSystemSharingChart(data) {
    const container = document.getElementById('system-bar-chart');
    const stats = {};
    data.forEach(d => {
        if (!stats[d.system]) stats[d.system] = { potential: 0, actual: 0 };
        stats[d.system].potential += d.moldCost;
        if (d.sharedVehicle === "") stats[d.system].actual += d.moldCost;
    });
    let items = Object.keys(stats).map(s => ({
        name: s,
        ...stats[s],
        saved: stats[s].potential - stats[s].actual,
        rate: stats[s].potential > 0 ? ((stats[s].potential - stats[s].actual) / stats[s].potential) * 100 : 0
    }));
    if (chartSortStates.system === 'cost') items.sort((a, b) => b.potential - a.potential);
    else if (chartSortStates.system === 'rate') items.sort((a, b) => b.rate - a.rate);
    else items.sort((a, b) => a.name.localeCompare(b.name));
    const maxPotential = Math.max(...items.map(i => i.potential), 1);
    renderHorizontalBars(container, items, maxPotential, chartScaleModes.system);
}

function renderVehicleSharingChart(data) {
    const container = document.getElementById('vehicle-bar-chart');
    const stats = {};
    data.forEach(d => {
        if (!stats[d.targetVehicle]) stats[d.targetVehicle] = { potential: 0, actual: 0 };
        stats[d.targetVehicle].potential += d.moldCost;
        if (d.sharedVehicle === "") stats[d.targetVehicle].actual += d.moldCost;
    });
    let items = Object.keys(stats).map(v => ({
        name: v,
        ...stats[v],
        saved: stats[v].potential - stats[v].actual,
        rate: stats[v].potential > 0 ? ((stats[v].potential - stats[v].actual) / stats[v].potential) * 100 : 0
    }));
    if (chartSortStates.vehicle === 'cost') items.sort((a, b) => b.potential - a.potential);
    else if (chartSortStates.vehicle === 'rate') items.sort((a, b) => b.rate - a.rate);
    else items.sort((a, b) => a.name.localeCompare(b.name));
    const maxPotential = Math.max(...items.map(i => i.potential), 1);
    renderHorizontalBars(container, items, maxPotential, chartScaleModes.vehicle);
}

function renderHorizontalBars(container, items, maxPotential, scaleMode) {
    if (items.length === 0) {
        container.innerHTML = '<div class="text-center text-[8px] py-12 text-muted-foreground uppercase font-bold tracking-widest">No Data</div>';
        return;
    }
    container.innerHTML = items.map(item => {
        const actualWidth = item.potential > 0 ? (item.actual / item.potential) * 100 : 0;
        const savedWidth = item.potential > 0 ? (item.saved / item.potential) * 100 : 0;
        const containerWidth = scaleMode === 'actual' ? (item.potential / maxPotential) * 100 : 100;
        return `
            <div class="space-y-1 group">
                <div class="flex justify-between items-end">
                    <span class="text-[9px] font-black text-foreground uppercase tracking-tighter truncate w-24">${item.name}</span>
                    <span class="text-[8px] font-bold text-muted-foreground tabular-nums">${item.potential.toLocaleString()}억</span>
                </div>
                <div class="relative h-6 flex transition-all duration-500" style="width: ${containerWidth}%">
                    <div class="relative flex-1 bg-foreground/5 rounded-sm overflow-hidden flex border border-border/50 group-hover:border-foreground/20 transition-colors">
                        <div class="h-full bg-foreground flex items-center justify-center transition-all duration-700" style="width: ${actualWidth}%">
                            ${actualWidth > 15 ? `<span class="text-[8px] font-black text-background">${item.actual}</span>` : ''}
                        </div>
                        <div class="h-full bg-emerald-500 flex items-center justify-center transition-all duration-700" style="width: ${savedWidth}%">
                            ${savedWidth > 15 ? `<span class="text-[8px] font-black text-white">${item.saved} (${Math.round(item.rate)}%)</span>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function initTableHover() {
    const tableBody = document.getElementById('table-body');
    const levels = ['domain', 'system', 'modularSystem', 'part'];
    tableBody.addEventListener('mouseover', (e) => {
        const cell = e.target.closest('td');
        if (!cell) return;
        const tr = cell.parentElement;
        if (!tr || !tr.classList.contains('group-row')) return;
        const allCells = Array.from(tr.children);
        levels.forEach(level => {
            const cellId = tr.getAttribute(`data-${level}-link`);
            if (cellId) {
                const parentCell = document.getElementById(cellId);
                if (parentCell) parentCell.classList.add('cell-highlight');
            }
        });
        const totalCells = allCells.length;
        allCells.forEach((c, idx) => { if (idx < totalCells - 6) c.classList.add('cell-highlight'); });
    });
    tableBody.addEventListener('mouseout', (e) => {
        const tr = e.target.closest('tr');
        if (!tr) return;
        const allCells = Array.from(tr.children);
        allCells.forEach(c => c.classList.remove('cell-highlight'));
        levels.forEach(level => {
            const cellId = tr.getAttribute(`data-${level}-link`);
            if (cellId) {
                const parentCell = document.getElementById(cellId);
                if (parentCell) parentCell.classList.remove('cell-highlight');
            }
        });
    });
}

function animateNumber(el, target, isCurrency = false, duration = 800) {
    const start = parseInt(el.textContent.replace(/[^0-9]/g, '')) || 0;
    const startTime = performance.now();
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuad = progress * (2 - progress);
        const current = Math.floor(start + (target - start) * easeOutQuad);
        el.textContent = isCurrency ? current.toLocaleString() + ' 억' : current.toLocaleString();
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

function calculateRowspans(data) {
    const spans = { domain: [], system: [], modularSystem: [], part: [] };
    const levels = ['domain', 'system', 'modularSystem', 'part'];
    levels.forEach(level => {
        spans[level] = Array(data.length).fill(0);
        let currentIdx = 0;
        while (currentIdx < data.length) {
            let count = 1;
            for (let i = currentIdx + 1; i < data.length; i++) {
                let isSame = true;
                for (let j = 0; j <= levels.indexOf(level); j++) {
                    if (data[i][levels[j]] !== data[currentIdx][levels[j]]) { isSame = false; break; }
                }
                if (isSame) count++; else break;
            }
            spans[level][currentIdx] = count;
            currentIdx += count;
        }
    });
    return spans;
}

function renderChart(data) {
    const chart = document.getElementById('mold-chart');
    const legend = document.getElementById('chart-legend');
    const systemCosts = {};
    let total = 0;
    data.forEach(d => {
        if (d.sharedVehicle === "") {
            systemCosts[d.system] = (systemCosts[d.system] || 0) + d.moldCost;
            total += d.moldCost;
        }
    });
    const colors = ['#e5e5e5', '#a3a3a3', '#737373', '#404040', '#d4d4d4', '#525252'];
    let cumulativePercent = 0;
    let svgHtml = '';
    let legendHtml = '';
    const systems = Object.keys(systemCosts);
    systems.forEach((system, i) => {
        const cost = systemCosts[system];
        const percent = (cost / total) * 100;
        const color = colors[i % colors.length];
        svgHtml += `<circle r="15.9" cx="21" cy="21" fill="transparent" 
                     stroke="${color}" stroke-width="4" 
                     stroke-dasharray="${percent} ${100 - percent}" 
                     stroke-dashoffset="${-cumulativePercent}"
                     class="transition-all duration-300 hover:stroke-foreground"
                     style="stroke-linecap: butt;"></circle>`;
        legendHtml += `
            <div class="flex items-center justify-between text-[8px] uppercase font-bold tracking-tight group cursor-default">
                <div class="flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full border border-border" style="background:${color}"></span>
                    <span class="text-muted-foreground group-hover:text-foreground transition-colors truncate w-16">${system}</span>
                </div>
                <span class="text-foreground">${Math.round(percent)}%</span>
            </div>`;
        cumulativePercent += percent;
    });
    chart.innerHTML = total > 0 ? svgHtml : '';
    legend.innerHTML = total > 0 ? legendHtml : '<div class="text-center text-muted-foreground py-4 text-[8px] uppercase font-bold tracking-widest">No Data</div>';
}

function initTheme() {
    const theme = localStorage.getItem('theme') || 'dark';
    document.documentElement.className = theme;
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeBtn(theme);
}

function toggleTheme() {
    const isDark = document.documentElement.classList.contains('dark');
    const newTheme = isDark ? 'light' : 'dark';
    document.documentElement.className = newTheme;
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeBtn(newTheme);
}

function updateThemeBtn(t) {
    const btn = document.getElementById('theme-toggle');
    btn.textContent = t === 'dark' ? 'LIGHT' : 'DARK';
}

function exportToExcel() {
    if (!filteredData || filteredData.length === 0) {
        alert("다운로드할 데이터가 없습니다.");
        return;
    }

    // 1. Group data same as table rendering logic
    const groupedRows = [];
    const vehicleList = ["NE2", "NV1", "JK2", "JW2", "ME2", "MV2"];

    filteredData.forEach(item => {
        const key = `${item.domain}-${item.system}-${item.modularSystem}-${item.part}-${item.spec}`;
        let existing = groupedRows.find(r => r.key === key);
        if (!existing) {
            existing = { ...item, key, vehicles: {}, totalInvestment: 0 };
            groupedRows.push(existing);
        }
        existing.vehicles[item.targetVehicle] = item.sharedVehicle === "" ? "신규" : item.sharedVehicle;
        if (item.sharedVehicle === "") {
            existing.totalInvestment += item.moldCost;
        }
    });

    // 2. Format for XLSX
    const excelData = groupedRows.map(r => {
        const row = {
            "도메인": r.domain,
            "시스템": r.system,
            "모듈러시스템": r.modularSystem,
            "부품": r.part,
            "사양": r.spec,
            "금형투자비(억)": r.moldCost,
            "총 금형투자비(억)": r.totalInvestment
        };
        // Add vehicle columns
        vehicleList.forEach(v => {
            row[v] = r.vehicles[v] || "-";
        });
        return row;
    });

    // 3. Create Workbook and Download
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Parts_Data");

    // Auto-size columns (basic)
    const wscols = [
        {wch: 15}, {wch: 15}, {wch: 20}, {wch: 20}, {wch: 15}, {wch: 15}, {wch: 15},
        {wch: 8}, {wch: 8}, {wch: 8}, {wch: 8}, {wch: 8}, {wch: 8}
    ];
    worksheet['!cols'] = wscols;

    const date = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `Mold_Investment_Dashboard_${date}.xlsx`);
}
