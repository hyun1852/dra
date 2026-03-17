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
    // Keep the "All" option
    select.innerHTML = '<option value="">전체</option>';
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

    // Sorting
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

    // Summaries
    const systemSet = new Set(filteredData.map(d => d.system));
    const modularSet = new Set(filteredData.map(d => d.modularSystem));
    const totalCost = filteredData.reduce((sum, d) => sum + d.moldCost, 0);

    totalSystemsEl.textContent = systemSet.size;
    totalModularsEl.textContent = modularSet.size;
    totalPartsEl.textContent = filteredData.length;
    totalCostEl.textContent = totalCost.toLocaleString() + ' 억';

    // Render Table
    const rowspans = calculateRowspans(filteredData);
    let html = '';
    filteredData.forEach((item, index) => {
        html += '<tr>';
        const levels = ['domain', 'system', 'modularSystem', 'part'];
        levels.forEach(level => {
            if (rowspans[level][index]) {
                html += `<td rowspan="${rowspans[level][index]}">${item[level]}</td>`;
            }
        });
        html += `<td>${item.spec}</td>`;
        html += `<td>${item.moldCost.toLocaleString()}</td>`;
        html += `<td>${item.targetVehicle}</td>`;
        html += `<td>${formatSharedVehicles(item.sharedVehicle)}</td>`;
        html += '</tr>';
    });

    tableBody.innerHTML = filteredData.length > 0 ? html : '<tr><td colspan="8">데이터가 없습니다.</td></tr>';

    renderChart(filteredData);
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

// Chart Logic
function renderChart(data) {
    const chart = document.getElementById('mold-chart');
    const legend = document.getElementById('chart-legend');
    const systemCosts = {};
    let total = 0;

    data.forEach(d => {
        systemCosts[d.system] = (systemCosts[d.system] || 0) + d.moldCost;
        total += d.moldCost;
    });

    const colors = ['#002c5f', '#007fa8', '#3a7bd5', '#4fc3f7', '#01579b'];
    let cumulativePercent = 0;
    let svgHtml = '';
    let legendHtml = '';

    Object.keys(systemCosts).forEach((system, i) => {
        const cost = systemCosts[system];
        const percent = (cost / total) * 100;
        const color = colors[i % colors.length];

        // Draw SVG circle segments
        svgHtml += `<circle r="15.9" cx="21" cy="21" fill="transparent" 
                     stroke="${color}" stroke-width="10" 
                     stroke-dasharray="${percent} ${100 - percent}" 
                     stroke-dashoffset="${-cumulativePercent}"></circle>`;

        legendHtml += `<div class="legend-item">
            <span class="legend-color" style="background:${color}"></span>
            <span>${system}: ${Math.round(percent)}% (${cost}억)</span>
        </div>`;

        cumulativePercent += percent;
    });

    chart.innerHTML = total > 0 ? svgHtml : '';
    legend.innerHTML = total > 0 ? legendHtml : '데이터 없음';
}

// Theme
function initTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeBtn(theme);
}
function toggleTheme() {
    const now = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', now);
    localStorage.setItem('theme', now);
    updateThemeBtn(now);
}
function updateThemeBtn(t) {
    document.getElementById('theme-toggle').textContent = t === 'dark' ? 'Light Mode☀️' : 'Dark Mode🌙';
}
