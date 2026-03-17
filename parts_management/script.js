import partsData from './data.js';

let filteredData = [...partsData];

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

function handleFilter() {
    const domain = document.getElementById('domain-filter').value;
    const system = document.getElementById('system-filter').value;
    const modular = document.getElementById('modular-filter').value;
    const partName = document.getElementById('part-filter').value;
    const sort = document.getElementById('sort-order').value;
    const search = document.getElementById('search-input').value.toLowerCase();

    filteredData = partsData.filter(d => {
        const matchesDomain = !domain || d.domain === domain;
        const matchesSystem = !system || d.system === system;
        const matchesModular = !modular || d.modularSystem === modular;
        const matchesPart = !partName || d.part === partName;
        
        // Global Search: Across all text fields
        const matchesSearch = !search || 
            d.domain.toLowerCase().includes(search) ||
            d.system.toLowerCase().includes(search) ||
            d.modularSystem.toLowerCase().includes(search) ||
            d.part.toLowerCase().includes(search) ||
            d.spec.toLowerCase().includes(search) ||
            d.targetVehicle.toLowerCase().includes(search) ||
            d.sharedVehicle.toLowerCase().includes(search);

        return matchesDomain && matchesSystem && matchesModular && matchesPart && matchesSearch;
    });

    if (sort === 'asc') {
        filteredData.sort((a, b) => a.moldCost - b.moldCost);
    } else if (sort === 'desc') {
        filteredData.sort((a, b) => b.moldCost - a.moldCost);
    }

    renderDashboard();
}

function renderDashboard() {
    const tableBody = document.getElementById('table-body');
    const totalDomainsEl = document.getElementById('total-domains');
    const totalSystemsEl = document.getElementById('total-systems');
    const totalModularsEl = document.getElementById('total-modulars');
    const totalPartsEl = document.getElementById('total-parts');
    const totalSpecsEl = document.getElementById('total-specs');
    const totalCostEl = document.getElementById('total-cost');
    const sharingRateEl = document.getElementById('sharing-rate');

    const domainSet = new Set(filteredData.map(d => d.domain));
    const systemSet = new Set(filteredData.map(d => d.system));
    const modularSet = new Set(filteredData.map(d => d.modularSystem));
    const specSet = new Set(filteredData.map(d => d.spec));
    
    // Core Cost Logic
    // Actual Cost: Sum of 'New' entries only
    const actualSpentCost = filteredData.reduce((sum, d) => {
        return d.sharedVehicle === "" ? sum + d.moldCost : sum;
    }, 0);

    // Potential Cost: Sum of all entries as if all were new
    const potentialTotalCost = filteredData.reduce((sum, d) => sum + d.moldCost, 0);

    // Sharing Rate = (Potential - Actual) / Potential
    const sharingRate = potentialTotalCost > 0 
        ? ((potentialTotalCost - actualSpentCost) / potentialTotalCost) * 100 
        : 0;

    // Animate numbers
    animateNumber(totalDomainsEl, domainSet.size);
    animateNumber(totalSystemsEl, systemSet.size);
    animateNumber(totalModularsEl, modularSet.size);
    animateNumber(totalPartsEl, filteredData.length);
    animateNumber(totalSpecsEl, specSet.size);
    animateNumber(totalCostEl, actualSpentCost, true, 600);
    
    sharingRateEl.textContent = `${Math.round(sharingRate)}%`;

    const groupedRows = [];
    const vehicleList = ["NE2", "NV1", "JK2", "JW2", "ME2", "MV2"];

    filteredData.forEach(item => {
        const key = `${item.domain}-${item.system}-${item.modularSystem}-${item.part}-${item.spec}`;
        let existing = groupedRows.find(r => r.key === key);
        if (!existing) {
            existing = { ...item, key, vehicles: {} };
            groupedRows.push(existing);
        }
        existing.vehicles[item.targetVehicle] = item.sharedVehicle === "" ? "신규" : item.sharedVehicle;
    });

    const rowspans = calculateRowspans(groupedRows);
    const groupCounters = { domain: 0, system: 0, modularSystem: 0, part: 0 };
    const lastCellIds = { domain: '', system: '', modularSystem: '', part: '' };

    let html = '';
    groupedRows.forEach((item, index) => {
        const levels = ['domain', 'system', 'modularSystem', 'part'];
        let rowDataAttrs = '';
        levels.forEach(level => {
            if (rowspans[level][index]) {
                lastCellIds[level] = `cell-${level}-${groupCounters[level]++}`;
            }
            rowDataAttrs += ` data-${level}-link="${lastCellIds[level]}"`;
        });

        html += `<tr class="transition-colors group-row" ${rowDataAttrs}>`;
        levels.forEach(level => {
            if (rowspans[level][index]) {
                html += `<td id="${lastCellIds[level]}" rowspan="${rowspans[level][index]}" class="px-6 py-4 font-bold text-foreground underline decoration-border/20 transition-colors">${item[level]}</td>`;
            }
        });
        html += `<td class="px-6 py-4 text-muted-foreground">${item.spec}</td>`;
        html += `<td class="px-6 py-4 font-black text-foreground text-right tabular-nums">${item.moldCost.toLocaleString()}</td>`;
        
        vehicleList.forEach(vCode => {
            const status = item.vehicles[vCode] || "-";
            const statusClass = status === "신규" ? "text-foreground font-bold" : "text-muted-foreground";
            const bgClass = status === "신규" ? "bg-foreground/10" : (status !== "-" ? "bg-foreground/5" : "");
            html += `<td class="px-2 py-4 text-center text-[10px] ${statusClass} ${bgClass}">${status}</td>`;
        });
        
        html += '</tr>';
    });

    tableBody.style.opacity = '0';
    setTimeout(() => {
        tableBody.innerHTML = groupedRows.length > 0 ? html : '<tr><td colspan="12" class="text-center py-12 text-muted-foreground uppercase text-[10px] tracking-widest font-bold">No Data Found</td></tr>';
        tableBody.style.opacity = '1';
        initTableHover();
    }, 50);

    renderChart(filteredData);
    renderSharingChart(sharingRate);
}

function renderSharingChart(rate) {
    const fill = document.getElementById('sharing-rate-fill');
    const text = document.getElementById('sharing-rate-text');
    
    if (fill && text) {
        fill.style.strokeDasharray = `${rate} 100`;
        text.textContent = `${Math.round(rate)}%`;
    }
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
        
        // Always highlight parent merged cells based on the current row
        levels.forEach(level => {
            const cellId = tr.getAttribute(`data-${level}-link`);
            if (cellId) {
                const parentCell = document.getElementById(cellId);
                if (parentCell) parentCell.classList.add('cell-highlight');
            }
        });
        
        // Highlight non-vehicle cells in the current row (columns 0 to total-7)
        const totalCells = allCells.length;
        allCells.forEach((c, idx) => {
            if (idx < totalCells - 6) c.classList.add('cell-highlight');
        });
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

    // High contrast monochrome palette
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
                     stroke="${color}" stroke-width="6" 
                     stroke-dasharray="${percent} ${100 - percent}" 
                     stroke-dashoffset="${-cumulativePercent}"
                     class="transition-all duration-300 hover:stroke-foreground"></circle>`;

        legendHtml += `
            <div class="flex items-center justify-between text-[10px] uppercase font-bold tracking-tight group cursor-default">
                <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full border border-border" style="background:${color}"></span>
                    <span class="text-muted-foreground group-hover:text-foreground transition-colors">${system}</span>
                </div>
                <div class="flex items-center gap-2">
                    <span class="text-foreground">${Math.round(percent)}%</span>
                    <span class="text-muted-foreground">(${cost}억)</span>
                </div>
            </div>`;

        cumulativePercent += percent;
    });

    chart.innerHTML = total > 0 ? svgHtml : '';
    legend.innerHTML = total > 0 ? legendHtml : '<div class="text-center text-muted-foreground py-4 text-[10px] uppercase font-bold tracking-widest">No Data</div>';
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
