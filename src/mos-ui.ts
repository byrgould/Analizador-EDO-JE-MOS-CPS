import { generateAllMOS, stepsToSet, type MosResult } from './core/mos';
import { primeForm } from './core/set-theory';

document.addEventListener('DOMContentLoaded', () => {
    const edoInput = document.getElementById('edo-input') as HTMLInputElement;
    const genInput = document.getElementById('gen-input') as HTMLInputElement;
    const generateBtn = document.getElementById('generate-btn') as HTMLButtonElement;
    
    const resultsContainer = document.getElementById('results-container') as HTMLDivElement;
    const emptyState = document.getElementById('empty-state') as HTMLDivElement;
    const mosGrid = document.getElementById('mos-grid') as HTMLDivElement;
    const resultsCount = document.getElementById('results-count') as HTMLSpanElement;

    generateBtn.addEventListener('click', () => {
        const edo = parseInt(edoInput.value, 10);
        const generator = parseInt(genInput.value, 10);

        if (isNaN(edo) || isNaN(generator) || edo < 2 || generator < 1) {
            alert("Please enter valid positive numbers for EDO and Generator.");
            return;
        }

        if (generator >= edo) {
            alert("Generator must be less than Period (EDO).");
            return;
        }

        // Calculate all MOS
        const mosList = generateAllMOS(edo, generator);
        
        renderResults(mosList, edo, generator);
    });

    function renderResults(mosList: MosResult[], edo: number, generator: number) {
        mosGrid.innerHTML = ''; // Clear previous

        if (mosList.length === 0) {
            emptyState.classList.remove('hidden');
            resultsContainer.classList.add('hidden');
            emptyState.innerHTML = `
                <div class="empty-icon">😢</div>
                <h3>No MOS found</h3>
                <p>This combination does not generate any Moments of Symmetry.</p>
            `;
            return;
        }

        emptyState.classList.add('hidden');
        resultsContainer.classList.remove('hidden');
        resultsCount.textContent = `${mosList.length} MOS found`;

        mosList.forEach((mos, index) => {
            const delay = index * 0.05; // Staggered animation
            
            // Create blocks proportional to step sizes
            // We use flex-grow based on step size to visually represent the pattern
            const blocksHtml = mos.stepPattern.map(step => {
                const typeClass = step === mos.smallStep ? 'block-small' : 'block-large';
                return `<div class="step-block ${typeClass}" style="flex-grow: ${step}" title="Step size: ${step}">${step}</div>`;
            }).join('');

            const lCount = mos.stepPattern.filter(s => s === mos.largeStep).length;
            const sCount = mos.stepPattern.filter(s => s === mos.smallStep).length;
            const signature = `${lCount}L ${sCount}s`;
            
            const pcSet = stepsToSet(mos.stepPattern, 0, edo);
            const prime = primeForm(pcSet, edo);
            
            // Calculamos la notación de Wilson (ej. MOS 2/5)
            // El numerador es el número de grado donde se ubica el generador en el MOS ordenado
            const wilsonNum = pcSet.indexOf(generator);

            const card = document.createElement('div');
            card.className = 'mos-item';
            card.style.animationDelay = `${delay}s`;
            
            card.innerHTML = `
                <div class="mos-title">
                    <h3>${mos.numNotes} Notes (MOS ${wilsonNum}/${mos.numNotes})</h3>
                    <span class="mos-badge">${signature}</span>
                </div>
                <div class="mos-stats">
                    <div>Large: <span class="mos-stat-val">${mos.largeStep}</span></div>
                    <div>Small: <span class="mos-stat-val">${mos.smallStep}</span></div>
                </div>
                <div class="step-pattern-container">
                    <div class="step-pattern-label">Step Pattern</div>
                    <div class="step-blocks">
                        ${blocksHtml}
                    </div>
                    <div class="raw-pattern">[${mos.stepPattern.join(', ')}]</div>
                </div>
                <div class="set-details-container">
                    <div class="set-detail">
                        <span class="set-label">Set:</span>
                        <span class="set-value">[${pcSet.join(', ')}]</span>
                    </div>
                    <div class="set-detail">
                        <span class="set-label">Prime Form:</span>
                        <span class="set-value">[${prime.join(', ')}]</span>
                    </div>
                </div>
            `;
            
            mosGrid.appendChild(card);
        });
    }
});
