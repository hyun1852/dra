import partsData from './data.js';

let filteredData = [...partsData];

document.addEventListener('DOMContentLoaded', () => {
    initFilters();
    initTheme();
    renderDashboard();

    // Event Listeners
    document.getElementById('system-filter').addEventListener('change', handleFilter);
    document.getElementById('modular-filter').addEventListener('change', handleFilter);
    document.getElementById('part-filter').addEventListener('change', handleFilter);
    document.getElementById('sort-order').addEventListener('change', handleFilter);
    document.getElementById('search-input').addEventListener('input', handleFilter);
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
});

function initFilters() {
    const systems = [...new Set(partsData.map(d => d.system))].sort();
    const modulars = [...new Set(partsData.map(d => d.modularSystem))].sort();
    const parts = [...new Set(partsData.map(d => d.part))].sort();

    fillSelect('system-filter', systems);
    fillSelect('modular-filter', modulars);
    fillSelect('part-filter', parts);
}

function fillSelect(id, items) {
    const select = document.getElementById(id);
    let defaultText = '전체 시스템';
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
    const system = document.getElementById('system-filter').value;
    const modular = document.getElementById('modular-filter').value;
    const partName = document.getElementById('part-filter').value;
    const sort = document.getElementById('sort-order').value;
    const search = document.getElementById('search-input').value.toLowerCase();

    filteredData = partsData.filter(d => {
        const matchesSystem = !system || d.system === system;
        const matchesModular = !modular || d.modularSystem === modular;
        const matchesPart = !partName || d.part === partName;
        const matchesSearch = !search || d.targetVehicle.toLowerCase().includes(search) || d.sharedVehicle.toLowerCase().includes(search);
        return matchesSystem && matchesModular && matchesPart && matchesSearch;
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

    const domainSet = new Set(filteredData.map(d => d.domain));
    const systemSet = new Set(filteredData.map(d => d.system));
    const modularSet = new Set(filteredData.map(d => d.modularSystem));
    const specSet = new Set(filteredData.map(d => d.spec));
    const totalCost = filteredData.reduce((sum, d) => sum + d.moldCost, 0);

    // Animate numbers
    animateNumber(totalDomainsEl, domainSet.size);
    animateNumber(totalSystemsEl, systemSet.size);
    animateNumber(totalModularsEl, modularSet.size);
    animateNumber(totalPartsEl, filteredData.length);
    animateNumber(totalSpecsEl, specSet.size);
    animateNumber(totalCostEl, totalCost, true, 600); // Updated to 600ms

    const rowspans = calculateRowspans(filteredData);
    const groupCounters = { domain: 0, system: 0, modularSystem: 0, part: 0 };
    const lastCellIds = { domain: '', system: '', modularSystem: '', part: '' };

    let html = '';
    filteredData.forEach((item, index) => {
        const levels = ['domain', 'system', 'modularSystem', 'part'];
        
        // Prepare data attributes for the row to link to its parent merged cells
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
        html += `<td class="px-6 py-4 text-center"><span class="px-2 py-1 rounded bg-foreground/5 text-[10px] font-bold border border-border uppercase">${item.targetVehicle}</span></td>`;
        html += `<td class="px-6 py-4 text-center">${formatSharedVehicles(item.sharedVehicle)}</td>`;
        html += '</tr>';
    });

    // Fade effect for content update
    tableBody.style.opacity = '0';
    setTimeout(() => {
        tableBody.innerHTML = filteredData.length > 0 ? html : '<tr><td colspan="8" class="text-center py-12 text-muted-foreground uppercase text-[10px] tracking-widest font-bold">No Data Found</td></tr>';
        tableBody.style.opacity = '1';
        initTableHover(); // Re-initialize hover listeners
    }, 50);

    renderChart(filteredData);
}

function initTableHover() {
    const tableBody = document.getElementById('table-body');
    const levels = ['domain', 'system', 'modularSystem', 'part'];

    tableBody.addEventListener('mouseover', (e) => {
        const tr = e.target.closest('tr');
        if (!tr || !tr.classList.contains('group-row')) return;

        levels.forEach(level => {
            const cellId = tr.getAttribute(`data-${level}-link`);
            if (cellId) {
                const cell = document.getElementById(cellId);
                if (cell) cell.classList.add('cell-highlight');
            }
        });
    });

    tableBody.addEventListener('mouseout', (e) => {
        const tr = e.target.closest('tr');
        if (!tr) return;

        levels.forEach(level => {
            const cellId = tr.getAttribute(`data-${level}-link`);
            if (cellId) {
                const cell = document.getElementById(cellId);
                if (cell) cell.classList.remove('cell-highlight');
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

        if (progress < 1) {
            requestAnimationFrame(update);
        }
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

function formatSharedVehicles(str) {
    if (!str) return '-';
    return str.split(',').map(v => `<span class="shared-vehicle">${v.trim()}</span>`).join('');
}

function renderChart(data) {
    const chart = document.getElementById('mold-chart');
    const legend = document.getElementById('chart-legend');
    const systemCosts = {};
    let total = 0;

    data.forEach(d => {
        systemCosts[d.system] = (systemCosts[d.system] || 0) + d.moldCost;
        total += d.moldCost;
    });

    // Monochrome palette with higher contrast
    const colors = ['#ffffff', '#bbbbbb', '#888888', '#555555', '#333333', '#111111'];
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

// Theme Toggle
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
