import partsData from './data.js';

document.addEventListener('DOMContentLoaded', () => {
    renderDashboard();
});

function renderDashboard() {
    const tableBody = document.getElementById('table-body');
    const totalDomainsEl = document.getElementById('total-domains');
    const totalSystemsEl = document.getElementById('total-systems');
    const totalPartsEl = document.getElementById('total-parts');
    const totalCostEl = document.getElementById('total-cost');

    // Summary calculations
    const domains = new Set(partsData.map(item => item.domain));
    const systems = new Set(partsData.map(item => item.system));
    const totalCost = partsData.reduce((sum, item) => sum + item.moldCost, 0);

    totalDomainsEl.textContent = domains.size;
    totalSystemsEl.textContent = systems.size;
    totalPartsEl.textContent = partsData.length;
    totalCostEl.textContent = totalCost.toLocaleString() + ' 억';

    // Calculate Rowspans for hierarchical view
    const rowspans = calculateRowspans(partsData);

    // Generate Table Rows
    let html = '';
    partsData.forEach((item, index) => {
        html += '<tr>';
        
        // Level 2: Domain
        if (rowspans.domain[index]) {
            html += `<td rowspan="${rowspans.domain[index]}">${item.domain}</td>`;
        }
        
        // Level 3: System
        if (rowspans.system[index]) {
            html += `<td rowspan="${rowspans.system[index]}">${item.system}</td>`;
        }
        
        // Level 4: Modular System
        if (rowspans.modularSystem[index]) {
            html += `<td rowspan="${rowspans.modularSystem[index]}">${item.modularSystem}</td>`;
        }
        
        // Level 5: Part
        if (rowspans.part[index]) {
            html += `<td rowspan="${rowspans.part[index]}">${item.part}</td>`;
        }

        // Rest of the columns (Spec and beyond are per row)
        html += `<td>${item.spec}</td>`;
        html += `<td>${item.moldCost.toLocaleString()}</td>`;
        html += `<td>${item.targetVehicle}</td>`;
        html += `<td>${formatSharedVehicles(item.sharedVehicle)}</td>`;
        
        html += '</tr>';
    });

    tableBody.innerHTML = html;
}

/**
 * Calculates how many rows each cell should span based on hierarchy.
 */
function calculateRowspans(data) {
    const spans = {
        domain: Array(data.length).fill(0),
        system: Array(data.length).fill(0),
        modularSystem: Array(data.length).fill(0),
        part: Array(data.length).fill(0)
    };

    const levels = ['domain', 'system', 'modularSystem', 'part'];

    levels.forEach(level => {
        let currentIdx = 0;
        while (currentIdx < data.length) {
            let count = 1;
            for (let i = currentIdx + 1; i < data.length; i++) {
                // Check if all parent levels are also the same
                let isSame = true;
                const levelIdx = levels.indexOf(level);
                for (let j = 0; j <= levelIdx; j++) {
                    if (data[i][levels[j]] !== data[currentIdx][levels[j]]) {
                        isSame = false;
                        break;
                    }
                }

                if (isSame) {
                    count++;
                } else {
                    break;
                }
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
