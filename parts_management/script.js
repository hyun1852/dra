import partsData from './data.js';

let filteredData = [...partsData];

document.addEventListener('DOMContentLoaded', () => {
    initFilters();
    initTheme();
    renderDashboard();

    // Event Listeners for Filtering
    document.getElementById('search-input').addEventListener('input', handleFilter);
    document.getElementById('domain-filter').addEventListener('change', handleFilter);
    document.getElementById('system-filter').addEventListener('change', handleFilter);
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
});

function initFilters() {
    const domainFilter = document.getElementById('domain-filter');
    const systemFilter = document.getElementById('system-filter');

    const domains = [...new Set(partsData.map(item => item.domain))].sort();
    const systems = [...new Set(partsData.map(item => item.system))].sort();

    domains.forEach(d => {
        const opt = document.createElement('option');
        opt.value = d;
        opt.textContent = d;
        domainFilter.appendChild(opt);
    });

    systems.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s;
        opt.textContent = s;
        systemFilter.appendChild(opt);
    });
}

function handleFilter() {
    const searchText = document.getElementById('search-input').value.toLowerCase();
    const domainValue = document.getElementById('domain-filter').value;
    const systemValue = document.getElementById('system-filter').value;

    filteredData = partsData.filter(item => {
        const matchesSearch = item.part.toLowerCase().includes(searchText) || 
                             item.targetVehicle.toLowerCase().includes(searchText) ||
                             item.sharedVehicle.toLowerCase().includes(searchText);
        const matchesDomain = domainValue === "" || item.domain === domainValue;
        const matchesSystem = systemValue === "" || item.system === systemValue;

        return matchesSearch && matchesDomain && matchesSystem;
    });

    renderDashboard();
}

function renderDashboard() {
    const tableBody = document.getElementById('table-body');
    const totalDomainsEl = document.getElementById('total-domains');
    const totalSystemsEl = document.getElementById('total-systems');
    const totalPartsEl = document.getElementById('total-parts');
    const totalCostEl = document.getElementById('total-cost');

    // Summary calculations based on filtered data
    const domains = new Set(filteredData.map(item => item.domain));
    const systems = new Set(filteredData.map(item => item.system));
    const totalCost = filteredData.reduce((sum, item) => sum + item.moldCost, 0);

    totalDomainsEl.textContent = domains.size;
    totalSystemsEl.textContent = systems.size;
    totalPartsEl.textContent = filteredData.length;
    totalCostEl.textContent = totalCost.toLocaleString() + ' 억';

    // Calculate Rowspans for hierarchical view (Only if not searching/filtering significantly, or recalculate for filtered set)
    const rowspans = calculateRowspans(filteredData);

    // Generate Table Rows
    let html = '';
    filteredData.forEach((item, index) => {
        html += '<tr>';
        
        // Level 2 to 5 with Rowspans
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

    tableBody.innerHTML = filteredData.length > 0 ? html : '<tr><td colspan="8">검색 결과가 없습니다.</td></tr>';
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
                const levelIdx = levels.indexOf(level);
                for (let j = 0; j <= levelIdx; j++) {
                    if (data[i][levels[j]] !== data[currentIdx][levels[j]]) {
                        isSame = false;
                        break;
                    }
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

// Theme Logic
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeButton(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeButton(newTheme);
}

function updateThemeButton(theme) {
    const btn = document.getElementById('theme-toggle');
    btn.textContent = theme === 'dark' ? 'Light Mode☀️' : 'Dark Mode🌙';
}
