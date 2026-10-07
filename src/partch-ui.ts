import { PARTCH_43, getIntervalsForDegree } from './core/ji';
import { PARTCH_COLLECTIONS } from './core/partch-collections';

// DOM Elements
const degreeSelect = document.getElementById('degreeSelect') as HTMLSelectElement;
const ratiosGrid = document.getElementById('ratiosGrid') as HTMLDivElement;
const highlightInput = document.getElementById('highlightInput') as HTMLInputElement;
const btnHighlight = document.getElementById('btnHighlight') as HTMLButtonElement;
const btnClearHighlight = document.getElementById('btnClearHighlight') as HTMLButtonElement;


const collectionStructureSelect = document.getElementById('collection-structure-select') as HTMLSelectElement;
const collectionSetSelect = document.getElementById('collection-set-select') as HTMLSelectElement;


const WILSON_DEGREES = [
    0, 1, 2, 3, 4, 5, 6, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 
    20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 35, 36, 
    37, 38, 39, 40
];

let activeHighlightSet: number[] = [];

// Initialize
function init() {
    // Populate select
    PARTCH_43.forEach((ratio, index) => {
        const option = document.createElement('option');
        option.value = index.toString();
        option.textContent = `Degree ${index}: ${ratio[0]}/${ratio[1]}`;
        degreeSelect.appendChild(option);
    });

    // Event listeners
    degreeSelect.addEventListener('change', () => {
        renderGrid(parseInt(degreeSelect.value, 10));
    });

    
    collectionStructureSelect.addEventListener('change', () => {
        const structure = collectionStructureSelect.value;
        collectionSetSelect.innerHTML = '<option value="">-- Select set --</option>';
        

        if (structure && PARTCH_COLLECTIONS[structure as keyof typeof PARTCH_COLLECTIONS]) {
            const sets = PARTCH_COLLECTIONS[structure as keyof typeof PARTCH_COLLECTIONS];
            sets.forEach((set, i) => {
                const option = document.createElement('option');
                option.value = i.toString();
                option.textContent = set.name;
                collectionSetSelect.appendChild(option);
            });
            collectionSetSelect.disabled = false;
        } else {
            collectionSetSelect.disabled = true;
        }
        renderGrid(parseInt(degreeSelect.value, 10));
    });

    collectionSetSelect.addEventListener('change', () => {
        const structure = collectionStructureSelect.value;
        const setIndex = parseInt(collectionSetSelect.value, 10);
        
        if (structure && !isNaN(setIndex)) {
            const sets = PARTCH_COLLECTIONS[structure as keyof typeof PARTCH_COLLECTIONS];
            highlightInput.value = sets[setIndex].degrees.join(', ');
            btnHighlight.click();
        } else {
            highlightInput.value = '';
            btnHighlight.click();
        }
    });

    btnHighlight.addEventListener('click', () => {
        const inputVal = highlightInput.value;
        if (!inputVal.trim()) {
            activeHighlightSet = [];
        } else {
            const set = inputVal.split(',')
                                .map(s => parseInt(s.trim(), 10))
                                .filter(n => !isNaN(n) && n >= 0 && n <= 42);
            activeHighlightSet = set;
        }
        renderGrid(parseInt(degreeSelect.value, 10));
    });

    btnClearHighlight.addEventListener('click', () => {
        highlightInput.value = '';
        activeHighlightSet = [];
                collectionStructureSelect.value = '';
        collectionSetSelect.innerHTML = '<option value="">-- Select set --</option>';
        collectionSetSelect.disabled = true;
        renderGrid(parseInt(degreeSelect.value, 10));
    });

    // Initial render (Degree 0)
    degreeSelect.value = "0";
    renderGrid(0);
}

// Map limit to CSS class
function getLimitClass(limit: number): string {
    switch (limit) {
        case 1: return 'limit-1';
        case 2: return 'limit-1'; // 2 is basically 1-limit in octave equivalence
        case 3: return 'limit-3';
        case 5: return 'limit-5';
        case 7: return 'limit-7';
        case 11: return 'limit-11';
        default: return 'limit-unknown';
    }
}

// Render the grid
function renderGrid(degree: number) {
    const intervals = getIntervalsForDegree(PARTCH_43, degree);
    
    ratiosGrid.innerHTML = ''; // Clear current grid

    intervals.forEach(info => {
        const card = document.createElement('div');
        card.className = `ratio-card ${getLimitClass(info.limit)}`;
        
        if (activeHighlightSet.includes(info.index)) {
            card.style.border = '3px solid #ffea00';
            card.style.transform = 'scale(1.05)';
            card.style.boxShadow = '0 0 15px rgba(255, 234, 0, 0.5)';
            card.style.zIndex = '10';
        }
        
        const intervalStr = `${info.interval[0]}/${info.interval[1]}`;
        const originalStr = `${info.original[0]}/${info.original[1]}`;
        
        const wilsonDegree = WILSON_DEGREES[info.index];
        card.innerHTML = `
            <div>${intervalStr}</div>
            <div class="ratio-original">Degree ${info.index} (${originalStr})</div>
            <div class="ratio-original" style="font-size: 0.85em; opacity: 0.85; font-weight: 600; margin-top: 2px;">Wilson ${wilsonDegree}</div>
            <div class="ratio-limit">${info.limit}-limit</div>
        `;
        
        ratiosGrid.appendChild(card);
    });
}

// Boot
init();
