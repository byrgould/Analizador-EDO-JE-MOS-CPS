import { DALESSANDRO_42, DALESSANDRO_FREQS, DALESSANDRO_TEXTS, DALESSANDRO_WILSON_DEGREES, DALESSANDRO_IS_PIGTAIL, DALESSANDRO_CPS_CATEGORIES, DALESSANDRO_NOTE_NAMES, getIntervalsForDegree } from './core/ji';
import { EIKOSANY_DATA } from './core/eikosany-data';
import { PENTADEKANY_2_6, PENTADEKANY_4_6 } from './core/pentadekany-data';
import { HEXANY_1_6, HEXANY_5_6 } from './core/hexany-data';
import { MONANY_0_6, MONANY_6_6 } from './core/monany-data';
import { OTHER_COLLECTIONS } from './core/other-collections';
import { getEikosanyLattice } from './core/eikosany-lattice';
import { getPentadekany2_6Lattice, getPentadekany4_6Lattice } from './core/pentadekany-lattice';
import { getHexany1_6Lattice, getHexany5_6Lattice } from './core/hexany-lattice';
import { getMonany0_6Lattice, getMonany6_6Lattice } from './core/monany-lattice';

// DOM Elements
const degreesGrid = document.getElementById('degreesGrid') as HTMLDivElement;
const degreeSelect = document.getElementById('degreeSelect') as HTMLSelectElement;
const categoryFilters = document.getElementById('categoryFilters') as HTMLDivElement;

const cpsStructureSelect = document.getElementById('cps-structure-select') as HTMLSelectElement;
const cpsTypeSelect = document.getElementById('cps-type-select') as HTMLSelectElement;
const cpsSetSelect = document.getElementById('cps-set-select') as HTMLSelectElement;

const eikosanyContainer = document.getElementById('eikosany-container') as HTMLElement;
const eikosanyEdges = document.getElementById('eikosany-edges') as unknown as SVGGElement;
const eikosanyNodes = document.getElementById('eikosany-nodes') as unknown as SVGGElement;

const penta26Container = document.getElementById('penta-2-6-container') as HTMLElement;
const penta26Edges = document.getElementById('penta-2-6-edges') as unknown as SVGGElement;
const penta26Nodes = document.getElementById('penta-2-6-nodes') as unknown as SVGGElement;

const penta46Container = document.getElementById('penta-4-6-container') as HTMLElement;
const penta46Edges = document.getElementById('penta-4-6-edges') as unknown as SVGGElement;
const penta46Nodes = document.getElementById('penta-4-6-nodes') as unknown as SVGGElement;

const hexa16Container = document.getElementById('hexa-1-6-container') as HTMLElement;
const hexa16Edges = document.getElementById('hexa-1-6-edges') as unknown as SVGGElement;
const hexa16Nodes = document.getElementById('hexa-1-6-nodes') as unknown as SVGGElement;

const hexa56Container = document.getElementById('hexa-5-6-container') as HTMLElement;
const hexa56Edges = document.getElementById('hexa-5-6-edges') as unknown as SVGGElement;
const hexa56Nodes = document.getElementById('hexa-5-6-nodes') as unknown as SVGGElement;

const mona06Container = document.getElementById('mona-0-6-container') as HTMLElement;
const mona06Edges = document.getElementById('mona-0-6-edges') as unknown as SVGGElement;
const mona06Nodes = document.getElementById('mona-0-6-nodes') as unknown as SVGGElement;

const mona66Container = document.getElementById('mona-6-6-container') as HTMLElement;
const mona66Edges = document.getElementById('mona-6-6-edges') as unknown as SVGGElement;
const mona66Nodes = document.getElementById('mona-6-6-nodes') as unknown as SVGGElement;

const manualHighlightInput = document.getElementById('manualHighlightInput') as HTMLInputElement;
const btnManualHighlight = document.getElementById('btnManualHighlight') as HTMLButtonElement;
const btnManualClear = document.getElementById('btnManualClear') as HTMLButtonElement;

// Estado
let referenceDegree = 0;
const activeCategories = new Set<string>();

let activeManualHighlightSet: number[] = [];

interface DegreeData {
    index: number;
    wilsonDegree: number;
    isPigtail: boolean;
    cpsCategory: string;
    freq: number;
    noteName: string;
    ratioStr: string;
    text: string;
}

let degreesData: DegreeData[] = [];

function init() {
    // Preparar data
    degreesData = DALESSANDRO_FREQS.map((freq, i) => {
        const ratio = DALESSANDRO_42[i];
        return {
            index: i,
            wilsonDegree: DALESSANDRO_WILSON_DEGREES[i],
            isPigtail: DALESSANDRO_IS_PIGTAIL[i],
            cpsCategory: DALESSANDRO_CPS_CATEGORIES[i],
            freq: freq[0] / freq[1],
            noteName: DALESSANDRO_NOTE_NAMES[i],
            ratioStr: `${ratio[0]}/${ratio[1]}`,
            text: DALESSANDRO_TEXTS[i]
        };
    });

    // Preparar opciones del selector
    degreesData.forEach(d => {
        const option = document.createElement('option');
        option.value = d.index.toString();
        option.textContent = `Grado ${d.index} (${d.freq.toFixed(2)} Hz)`;
        degreeSelect.appendChild(option);
    });

    // First render
    renderGrid();
    renderLattice();

    // Event listeners de filtros de categoría
    if (categoryFilters) {
        const toggles = categoryFilters.querySelectorAll('.factor-toggle');
        toggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                const btn = e.target as HTMLButtonElement;
                const category = btn.dataset.category || "";
                
                if (activeCategories.has(category)) {
                    activeCategories.delete(category);
                    btn.classList.remove('active');
                } else {
                    activeCategories.add(category);
                    btn.classList.add('active');
                }
                
                updateFilters();
            });
        });
    }

    // Event listener para el selector de grado
    degreeSelect.addEventListener('change', (e) => {
        referenceDegree = parseInt((e.target as HTMLSelectElement).value, 10);
        renderGrid(); // Re-renderizar la grilla con los nuevos intervalos
    });

    // Manual Highlight Listeners
    if (btnManualHighlight && btnManualClear && manualHighlightInput) {
        btnManualHighlight.addEventListener('click', () => {
            const inputVal = manualHighlightInput.value;
            if (!inputVal.trim()) return;
            
            const set = inputVal.split(',')
                                .map(s => parseInt(s.trim(), 10))
                                .filter(n => !isNaN(n) && n >= 0 && n <= 41);
                                
            activeManualHighlightSet = set;
            updateHighlights();
        });

        btnManualClear.addEventListener('click', () => {
            manualHighlightInput.value = '';
            activeManualHighlightSet = [];
            
            
            if (cpsStructureSelect) {
                cpsStructureSelect.value = '';
                cpsStructureSelect.dispatchEvent(new Event('change'));
            } else {
                updateHighlights();
            }
        });
    }

    // Eikosany & Pentadekany Cascade Listeners
    if (cpsStructureSelect && cpsTypeSelect && cpsSetSelect) {
        
        cpsStructureSelect.addEventListener('change', (e) => {
            const structure = (e.target as HTMLSelectElement).value;
            
            // Mostrar contenedores correctos
            if (structure === 'Eikosany') {
                eikosanyContainer.style.display = 'flex';
                penta26Container.style.display = 'none';
                penta46Container.style.display = 'none';
                hexa16Container.style.display = 'none';
                hexa56Container.style.display = 'none';
                mona06Container.style.display = 'none';
                mona66Container.style.display = 'none';
            } else if (structure === '2_6_Pentadekany' || structure === '4_6_Pentadekany') {
                eikosanyContainer.style.display = 'none';
                penta26Container.style.display = 'flex';
                penta46Container.style.display = 'flex';
                hexa16Container.style.display = 'none';
                hexa56Container.style.display = 'none';
                mona06Container.style.display = 'none';
                mona66Container.style.display = 'none';
            } else if (structure === '1_6_Hexany' || structure === '5_6_Hexany') {
                eikosanyContainer.style.display = 'none';
                penta26Container.style.display = 'none';
                penta46Container.style.display = 'none';
                hexa16Container.style.display = 'flex';
                hexa56Container.style.display = 'flex';
                mona06Container.style.display = 'none';
                mona66Container.style.display = 'none';
            } else if (structure === '0_6_Monany' || structure === '6_6_Monany') {
                eikosanyContainer.style.display = 'none';
                penta26Container.style.display = 'none';
                penta46Container.style.display = 'none';
                hexa16Container.style.display = 'none';
                hexa56Container.style.display = 'none';
                mona06Container.style.display = 'flex';
                mona66Container.style.display = 'flex';
            } else {
                eikosanyContainer.style.display = 'none';
                penta26Container.style.display = 'none';
                penta46Container.style.display = 'none';
                hexa16Container.style.display = 'none';
                hexa56Container.style.display = 'none';
                mona06Container.style.display = 'none';
                mona66Container.style.display = 'none';
            }

            renderLattice(); // Re-dibujar el lattice de la estructura elegida

            // Reset Subsets
            
            updateHighlights();
            cpsSetSelect.innerHTML = '<option value="">-- Select Set --</option>';
            cpsSetSelect.disabled = true;

            // Populate Types based on structure
            cpsTypeSelect.innerHTML = '<option value="">-- Type --</option>';
            if (structure === 'Eikosany') {
                cpsTypeSelect.innerHTML += `
                    <option value="Dyanies">Dyanies (90)</option>
                    <option value="Trianies">Trianies (120)</option>
                    <option value="Tetranies">Tetranies (30)</option>
                    <option value="Hexanies">Hexanies (30)</option>
                    <option value="Dekanies">Dekanies (12)</option>
                `;
            } else if (structure === '2_6_Pentadekany') {
                cpsTypeSelect.innerHTML += `
                    <option value="Dyanies">Dyanies (60)</option>
                    <option value="Trianies">Trianies (20)</option>
                    <option value="Pentanies">Pentanies (6)</option>
                    <option value="Hexanies">Hexanies (15)</option>
                    <option value="Dekanies">Dekanies (6)</option>
                `;
            } else if (structure === '4_6_Pentadekany') {
                cpsTypeSelect.innerHTML += `
                    <option value="Dyanies">Dyanies (60)</option>
                    <option value="Trianies">Trianies (20)</option>
                    <option value="Pentanies">Pentanies (6)</option>
                    <option value="Hexanies">Hexanies (15)</option>
                    <option value="Dekanies">Dekanies (6)</option>
                `;
            } else if (structure === '1_6_Hexany') {
                cpsTypeSelect.innerHTML += `
                    <option value="Dyanies">Dyanies (15)</option>
                    <option value="Trianies">Trianies (20)</option>
                    <option value="Tetranies">Tetranies (15)</option>
                    <option value="Pentanies">Pentanies (6)</option>
                `;
            } else if (structure === '5_6_Hexany') {
                cpsTypeSelect.innerHTML += `
                    <option value="Dyanies">Dyanies (15)</option>
                    <option value="Trianies">Trianies (20)</option>
                    <option value="Tetranies">Tetranies (15)</option>
                    <option value="Pentanies">Pentanies (6)</option>
                `;
            } else if (structure === '0_6_Monany' || structure === '6_6_Monany') {
                cpsTypeSelect.innerHTML += `
                    <option value="Monanies">Monanies (1)</option>
                `;
            } else if (OTHER_COLLECTIONS[structure as keyof typeof OTHER_COLLECTIONS]) {
                const count = OTHER_COLLECTIONS[structure as keyof typeof OTHER_COLLECTIONS].length;
                const optionLabel = (cpsStructureSelect.options[cpsStructureSelect.selectedIndex].text).split('> ').pop() || structure;
                cpsTypeSelect.innerHTML += `
                    <option value="${structure}">${optionLabel} (${count})</option>
                `;
            }
        });

        cpsTypeSelect.addEventListener('change', (e) => {
            const structure = cpsStructureSelect.value;
            const type = (e.target as HTMLSelectElement).value;
            
            cpsSetSelect.innerHTML = '<option value="">-- Select Set --</option>';
            
            updateHighlights();

            let sets: any = null;
            if (structure === 'Eikosany' && EIKOSANY_DATA[type as keyof typeof EIKOSANY_DATA]) {
                sets = EIKOSANY_DATA[type as keyof typeof EIKOSANY_DATA];
            } else if (structure === '2_6_Pentadekany' && PENTADEKANY_2_6[type as keyof typeof PENTADEKANY_2_6]) {
                sets = PENTADEKANY_2_6[type as keyof typeof PENTADEKANY_2_6];
            } else if (structure === '4_6_Pentadekany' && PENTADEKANY_4_6[type as keyof typeof PENTADEKANY_4_6]) {
                sets = PENTADEKANY_4_6[type as keyof typeof PENTADEKANY_4_6];
                if (structure === '4_6_Pentadekany' && type === 'Pentanies') {
                    console.log("DEBUG 4_6_Pentadekany > Pentanies:");
                    console.log("sets:", sets);
                    console.log("Length:", sets ? sets.length : 'null/undefined');
                }
            } else if (structure === '1_6_Hexany' && HEXANY_1_6[type as keyof typeof HEXANY_1_6]) {
                sets = HEXANY_1_6[type as keyof typeof HEXANY_1_6];
            } else if (structure === '5_6_Hexany' && HEXANY_5_6[type as keyof typeof HEXANY_5_6]) {
                sets = HEXANY_5_6[type as keyof typeof HEXANY_5_6];
            } else if (structure === '0_6_Monany' && MONANY_0_6[type as keyof typeof MONANY_0_6]) {
                sets = MONANY_0_6[type as keyof typeof MONANY_0_6];
            } else if (structure === '6_6_Monany' && MONANY_6_6[type as keyof typeof MONANY_6_6]) {
                sets = MONANY_6_6[type as keyof typeof MONANY_6_6];
            } else if (OTHER_COLLECTIONS[structure as keyof typeof OTHER_COLLECTIONS]) {
                // If it's a collection, type selection value is equal to structure key
                sets = OTHER_COLLECTIONS[structure as keyof typeof OTHER_COLLECTIONS];
            }

            if (type && sets) {
                cpsSetSelect.disabled = false;
                
                let currentGroup = '';
                let optGroup: HTMLOptGroupElement | null = null;
                
                sets.forEach((set: any, idx: number) => {
                    if (set.group !== currentGroup) {
                        currentGroup = set.group;
                        optGroup = document.createElement('optgroup');
                        optGroup.label = currentGroup;
                        cpsSetSelect.appendChild(optGroup);
                    }
                    const option = document.createElement('option');
                    option.value = idx.toString();
                    option.textContent = set.name;
                    option.dataset.degrees = JSON.stringify(set.degrees);
                    
                    if (optGroup) {
                        optGroup.appendChild(option);
                    } else {
                        cpsSetSelect.appendChild(option);
                    }
                });
            } else {
                cpsSetSelect.disabled = true;
            }
        });

        cpsSetSelect.addEventListener('change', () => {
            const option = cpsSetSelect.options[cpsSetSelect.selectedIndex];
            if (option && option.dataset.degrees) {
                const degrees = JSON.parse(option.dataset.degrees);
                if (manualHighlightInput) {
                    const structure = cpsStructureSelect ? cpsStructureSelect.value : '';
                    let realDegrees = degrees;
                    if (structure === 'Eikosany') {
                        realDegrees = degrees.map((wd: number) => {
                            const node = degreesData.find(d => d.wilsonDegree === wd && d.cpsCategory.includes("Eikosany"));
                            return node ? node.index : wd;
                        });
                    }
                    manualHighlightInput.value = realDegrees.join(', ');
                    if (btnManualHighlight) btnManualHighlight.click();
                }
            } else {
                if (manualHighlightInput) {
                    manualHighlightInput.value = '';
                    if (btnManualHighlight) btnManualHighlight.click();
                }
            }
            updateHighlights();
        });
    }
}

// Utilidades de matemáticas para el límite primo
function getLargestPrimeFactor(n: number): number {
    if (n <= 1) return 1;
    let maxPrime = 1;
    while (n % 2 === 0) {
        maxPrime = 2;
        n /= 2;
    }
    for (let i = 3; i <= Math.sqrt(n); i += 2) {
        while (n % i === 0) {
            maxPrime = i;
            n /= i;
        }
    }
    if (n > 2) {
        maxPrime = n;
    }
    return maxPrime;
}

function getPrimeLimit(num: number, den: number): number {
    return Math.max(getLargestPrimeFactor(num), getLargestPrimeFactor(den));
}

function renderGrid() {
    degreesGrid.innerHTML = '';
    
    // Obtener los intervalos relativos al grado de referencia actual
    const relativeIntervals = getIntervalsForDegree(DALESSANDRO_42, referenceDegree);

    degreesData.forEach((data, i) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.id = `card-${i}`; // ID for easy access
        
        // Aplicar estilo de pigtail o de base CPS
        const borderColor = data.isPigtail ? '#ec4899' : '#3b82f6';
        const bgStyle = data.isPigtail ? 'rgba(236, 72, 153, 0.1)' : 'rgba(59, 130, 246, 0.05)';
        
        card.style.borderLeft = `4px solid ${borderColor}`;
        card.style.background = bgStyle;

        const relInt = relativeIntervals[i].interval;
        const relativeRatioStr = `${relInt[0]}/${relInt[1]}`;
        const limit = getPrimeLimit(relInt[0], relInt[1]);

        card.innerHTML = `
            <div class="card-header" style="flex-direction: column; align-items: flex-start; gap: 0.5rem;">
                <div style="display: flex; justify-content: space-between; width: 100%;">
                    <div style="display: flex; gap: 0.5rem;">
                        <span class="degree-num" style="background: #4b5563;" title="Grado Real">Real: ${data.index}</span>
                        <span class="degree-num" style="background: ${borderColor};" title="Grado Wilson">Wilson: ${data.wilsonDegree}.</span>
                    </div>
                    <span class="frequency" style="font-size: 1.1rem; font-weight: bold; color: #f472b6;">${data.noteName}</span>
                </div>
                <div style="font-size: 0.8rem; color: #e4e4e7; background: rgba(255,255,255,0.1); font-weight: 500; padding: 0.2rem 0.5rem; border-radius: 4px; border: 1px solid rgba(255,255,255,0.15); width: 100%; box-sizing: border-box; text-align: center;">
                    ${data.cpsCategory}
                </div>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 0.5rem;">
                <div class="ratio" style="font-size: 1.2rem; font-weight: bold; color: #60a5fa; text-align: left;">${relativeRatioStr}</div>
                <div style="font-size: 0.8rem; color: #a78bfa; font-weight: 600; background: rgba(139,92,246,0.1); padding: 0.1rem 0.4rem; border-radius: 4px; border: 1px solid rgba(139,92,246,0.2);">${limit}-limit</div>
            </div>
            <div class="ratio" style="font-size: 0.85rem; color: #d4d4d8; font-weight: 500; margin-top: 0.2rem; text-align: left;">Orig: ${data.ratioStr}</div>
            <div class="symbol" style="margin-top: 0.5rem; font-size: 1rem; color: #fff; text-align: center; border: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.5);">
                ${data.text}
            </div>
        `;
        
        degreesGrid.appendChild(card);
    });
    
    updateFilters();
    updateHighlights();
}

function updateFilters() {
    degreesData.forEach((data, i) => {
        const card = document.getElementById(`card-${i}`);
        if (!card) return;

        if (activeCategories.size === 0) {
            // Si no hay filtros, mostrar todos los grados base, pero ocultar pigtails
            if (data.isPigtail) {
                card.classList.add('dimmed');
            } else {
                card.classList.remove('dimmed');
            }
        } else {
            // Verificar si el cpsCategory de la nota contiene ALGUNA de las categorías activas
            let isVisible = Array.from(activeCategories).some(activeCat => 
                data.cpsCategory.includes(activeCat)
            );
            
            // Si '1)6 Hexany' está activo, incluir siempre el grado real 0 (∅)
            if (activeCategories.has('1)6 Hexany') && data.index === 0) {
                isVisible = true;
            }
            
            if (isVisible) {
                card.classList.remove('dimmed');
            } else {
                card.classList.add('dimmed');
            }
        }
    });
}

function updateHighlights() {
    const structure = cpsStructureSelect ? cpsStructureSelect.value : 'Eikosany';

    degreesData.forEach((data, i) => {
        const card = document.getElementById(`card-${i}`);
        if (!card) return;

        if (activeManualHighlightSet.includes(data.index)) {
            card.classList.add('highlighted');
        } else {
            card.classList.remove('highlighted');
        }
    });

    // Actualizar Lattice
    // Primero, limpiar todos los lattices
    document.querySelectorAll('.lattice-node').forEach(node => {
        node.classList.remove('active');
    });

    // Luego, iluminar SOLO el lattice activo
    let activeContainer = null;
    if (structure === 'Eikosany') {
        activeContainer = document.getElementById('eikosany-container');
    } else if (structure === '2_6_Pentadekany') {
        activeContainer = document.getElementById('penta-2-6-container');
    } else if (structure === '4_6_Pentadekany') {
        activeContainer = document.getElementById('penta-4-6-container');
    } else if (structure === '1_6_Hexany') {
        activeContainer = document.getElementById('hexa-1-6-container');
    } else if (structure === '5_6_Hexany') {
        activeContainer = document.getElementById('hexa-5-6-container');
    } else if (structure === '0_6_Monany') {
        activeContainer = document.getElementById('mona-0-6-container');
    } else if (structure === '6_6_Monany') {
        activeContainer = document.getElementById('mona-6-6-container');
    }

    if (activeContainer) {
        const svgNodes = activeContainer.querySelectorAll('.lattice-node');
        svgNodes.forEach(svgNode => {
            const degree = parseInt((svgNode as SVGGElement).dataset.degree || '-1', 10);
            let isNodeHighlighted = false;
            
            if (structure === 'Eikosany') {
                const matchingReals = degreesData.filter(d => d.wilsonDegree === degree).map(d => d.index);
                isNodeHighlighted = matchingReals.some(r => activeManualHighlightSet.includes(r));
            } else {
                isNodeHighlighted = activeManualHighlightSet.includes(degree);
            }

            if (isNodeHighlighted) {
                svgNode.classList.add('active');
            }
        });
    }
}

function renderLattice() {
    // Dibujamos todos los lattices para que estén listos
    
    // EIKOSANY
    if (eikosanyEdges && eikosanyNodes) {
        const { nodes, edges } = getEikosanyLattice(150, 150, 125, 55);
        drawLattice(nodes, edges, eikosanyEdges, eikosanyNodes);
    }
    
    // 2)6 PENTADEKANY
    if (penta26Edges && penta26Nodes) {
        const { nodes, edges } = getPentadekany2_6Lattice(150, 150, 125);
        drawLattice(nodes, edges, penta26Edges, penta26Nodes);
    }

    // 4)6 PENTADEKANY
    if (penta46Edges && penta46Nodes) {
        const { nodes, edges } = getPentadekany4_6Lattice(150, 150, 125);
        drawLattice(nodes, edges, penta46Edges, penta46Nodes);
    }

    // 1)6 HEXANY
    if (hexa16Edges && hexa16Nodes) {
        const { nodes, edges } = getHexany1_6Lattice(150, 150, 125);
        drawLattice(nodes, edges, hexa16Edges, hexa16Nodes);
    }

    // 5)6 HEXANY
    if (hexa56Edges && hexa56Nodes) {
        const { nodes, edges } = getHexany5_6Lattice(150, 150, 125);
        drawLattice(nodes, edges, hexa56Edges, hexa56Nodes);
    }

    // 0)6 MONANY
    if (mona06Edges && mona06Nodes) {
        const { nodes, edges } = getMonany0_6Lattice(150, 150);
        drawLattice(nodes, edges, mona06Edges, mona06Nodes);
    }

    // 6)6 MONANY
    if (mona66Edges && mona66Nodes) {
        const { nodes, edges } = getMonany6_6Lattice(150, 150);
        drawLattice(nodes, edges, mona66Edges, mona66Nodes);
    }
}

function drawLattice(nodes: any[], edges: any[], edgesContainer: SVGGElement, nodesContainer: SVGGElement) {
    edgesContainer.innerHTML = '';
    nodesContainer.innerHTML = '';

    // Dibujar aristas
    edges.forEach(edge => {
        const source = nodes.find(n => n.degree === edge.sourceDegree);
        const target = nodes.find(n => n.degree === edge.targetDegree);
        if (source && target) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', source.x.toString());
            line.setAttribute('y1', source.y.toString());
            line.setAttribute('x2', target.x.toString());
            line.setAttribute('y2', target.y.toString());
            line.setAttribute('class', 'lattice-edge');
            edgesContainer.appendChild(line);
        }
    });

    // Dibujar nodos
    nodes.forEach(node => {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('class', 'lattice-node');
        g.dataset.degree = node.degree.toString();
        
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', node.x.toString());
        circle.setAttribute('cy', node.y.toString());
        circle.setAttribute('r', '20');

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', node.x.toString());
        text.setAttribute('y', node.y.toString());
        text.textContent = node.label;

        g.appendChild(circle);
        g.appendChild(text);
        nodesContainer.appendChild(g);
    });
}

init();
