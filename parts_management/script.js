import partsData from './data.js';

let filteredData = [...partsData];

document.addEventListener('DOMContentLoaded', () => {
    initFilters();
    initTheme();
    renderDashboard();
    initTracingBeam();

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
    select.innerHTML = '<option value="">전체 시스템</option>';
    if (id === 'modular-filter') select.innerHTML = '<option value="">전체 모듈러</option>';
    if (id === 'part-filter') select.innerHTML = '<option value="">전체 부품</option>';
    
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
    const totalSystemsEl = document.getElementById('total-systems');
    const totalModularsEl = document.getElementById('total-modulars');
    const totalPartsEl = document.getElementById('total-parts');
    const totalCostEl = document.getElementById('total-cost');

    const systemSet = new Set(filteredData.map(d => d.system));
    const modularSet = new Set(filteredData.map(d => d.modularSystem));
    const totalCost = filteredData.reduce((sum, d) => sum + d.moldCost, 0);

    // Animate numbers
    animateNumber(totalSystemsEl, systemSet.size);
    animateNumber(totalModularsEl, modularSet.size);
    animateNumber(totalPartsEl, filteredData.length);
    animateNumber(totalCostEl, totalCost, true);

    const rowspans = calculateRowspans(filteredData);
    let html = '';
    filteredData.forEach((item, index) => {
        html += '<tr class="transition-colors hover:bg-primary/5">';
        const levels = ['domain', 'system', 'modularSystem', 'part'];
        levels.forEach(level => {
            if (rowspans[level][index]) {
                html += `<td rowspan="${rowspans[level][index]}" class="px-6 py-4 font-medium text-foreground/80">${item[level]}</td>`;
            }
        });
        html += `<td class="px-6 py-4 text-muted-foreground">${item.spec}</td>`;
        html += `<td class="px-6 py-4 font-bold text-primary">${item.moldCost.toLocaleString()}</td>`;
        html += `<td class="px-6 py-4"><span class="px-2 py-1 rounded bg-accent/50 text-xs border border-border">${item.targetVehicle}</span></td>`;
        html += `<td class="px-6 py-4">${formatSharedVehicles(item.sharedVehicle)}</td>`;
        html += '</tr>';
    });

    tableBody.innerHTML = filteredData.length > 0 ? html : '<tr><td colspan="8" class="text-center py-12 text-muted-foreground">검색 결과가 없습니다.</td></tr>';

    renderChart(filteredData);
}

function animateNumber(el, target, isCurrency = false) {
    const start = parseInt(el.textContent.replace(/[^0-9]/g, '')) || 0;
    const duration = 1000;
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

    // Modern color palette
    const colors = ['#6366f1', '#a855f7', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'];
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
                     class="transition-all duration-500 hover:stroke-white"></circle>`;

        legendHtml += `
            <div class="flex items-center justify-between text-sm group cursor-default">
                <div class="flex items-center gap-3">
                    <span class="w-3 h-3 rounded-full" style="background:${color}"></span>
                    <span class="text-muted-foreground group-hover:text-foreground transition-colors">${system}</span>
                </div>
                <div class="flex items-center gap-2">
                    <span class="font-bold text-foreground">${Math.round(percent)}%</span>
                    <span class="text-xs text-muted-foreground">(${cost}억)</span>
                </div>
            </div>`;

        cumulativePercent += percent;
    });

    chart.innerHTML = total > 0 ? svgHtml : '';
    legend.innerHTML = total > 0 ? legendHtml : '<div class="text-center text-muted-foreground py-4">데이터 없음</div>';
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
    btn.textContent = t === 'dark' ? 'Light Mode ☀️' : 'Dark Mode 🌙';
}

// Tracing Beam Logic
function initTracingBeam() {
    const beamPoint = document.getElementById('tracing-beam-point');
    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        beamPoint.style.top = `${scrollPercent}%`;
    });
}
