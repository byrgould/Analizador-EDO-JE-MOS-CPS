import { PYTHAGOREAN_53, getIntervalsForPythagoreanDegree } from './core/pythagorean';

// DOM Elements
const degreeSelect = document.getElementById('degreeSelect') as HTMLSelectElement;
const ratiosGrid = document.getElementById('ratiosGrid') as HTMLDivElement;

// Initialize
function init() {
    // Populate select
    PYTHAGOREAN_53.forEach((ratio, index) => {
        const option = document.createElement('option');
        option.value = index.toString();
        option.textContent = `Degree ${index}: ${ratio.str}`;
        degreeSelect.appendChild(option);
    });

    // Event listener
    degreeSelect.addEventListener('change', () => {
        renderGrid(parseInt(degreeSelect.value, 10));
    });

    // Initial render (Degree 0)
    degreeSelect.value = "0";
    renderGrid(0);
}

function getDirectionsFromDegree(refDegree: number): { [index: number]: string } {
    const directions: { [index: number]: string } = {};
    directions[refDegree] = 'dir-root';
    
    // Ascending (+31)
    let current = refDegree;
    let limitCount = 0;
    while (current !== 51 && limitCount < 55) {
        current = (current + 31) % 53;
        directions[current] = 'dir-ascending';
        limitCount++;
    }
    
    // Descending (+22)
    current = refDegree;
    limitCount = 0;
    while (current !== 29 && limitCount < 55) {
        current = (current + 22) % 53;
        directions[current] = 'dir-descending';
        limitCount++;
    }
    
    return directions;
}

// Render the grid
function renderGrid(degree: number) {
    const intervals = getIntervalsForPythagoreanDegree(degree);
    const directions = getDirectionsFromDegree(degree);
    
    ratiosGrid.innerHTML = ''; // Clear current grid

    intervals.forEach(info => {
        const card = document.createElement('div');
        const dirClass = directions[info.index] || 'dir-root';
        card.className = `ratio-card ${dirClass}`;
        
        const intervalStr = info.interval.str;
        const originalStr = info.original.str;
        
        // Truncate strings if they are absolutely massive for display, but hover shows full
        const displayIntervalStr = intervalStr.length > 20 ? intervalStr.substring(0, 8) + '...' + intervalStr.substring(intervalStr.length - 8) : intervalStr;
        const displayOriginalStr = originalStr.length > 20 ? originalStr.substring(0, 5) + '...' + originalStr.substring(originalStr.length - 5) : originalStr;
        
        card.title = `Exact Ratio: ${intervalStr}\nOriginal: ${originalStr}`;
        
        let dirLabel = '';
        if (dirClass === 'dir-root') dirLabel = '<div class="ratio-limit">Root</div>';
        
        card.innerHTML = `
            <div style="flex-grow: 1; display: flex; flex-direction: column; justify-content: center;">
                <div style="font-size: ${intervalStr.length > 15 ? '0.85rem' : '1.1rem'}">${displayIntervalStr}</div>
                <div class="ratio-original">Degree ${info.index} (${displayOriginalStr})</div>
            </div>
            ${dirLabel}
        `;
        
        ratiosGrid.appendChild(card);
    });
}

// Boot
init();
