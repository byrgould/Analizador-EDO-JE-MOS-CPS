import { generateNarushimaTree, generateAllMOS, type SubMosLevel } from './core/mos';

document.addEventListener('DOMContentLoaded', () => {
    const edoInput = document.getElementById('edo-input') as HTMLInputElement;
    const genInput = document.getElementById('gen-input') as HTMLInputElement;
    const parentInput = document.getElementById('parent-input') as HTMLSelectElement;
    const generateBtn = document.getElementById('generate-btn') as HTMLButtonElement;
    
    const resultsContainer = document.getElementById('results-container') as HTMLDivElement;
    const emptyState = document.getElementById('empty-state') as HTMLDivElement;

    function populateParentMosSizes() {
        const edo = parseInt(edoInput.value, 10);
        const generator = parseInt(genInput.value, 10);
        
        if (isNaN(edo) || isNaN(generator) || edo < 2 || generator < 1 || generator >= edo) {
            parentInput.innerHTML = '';
            return;
        }

        const mosList = generateAllMOS(edo, generator);
        // Only keep sizes >= 4 as Narushima tree goes down to 3
        const validSizes = mosList.map(m => m.numNotes).filter(s => s >= 4);
        
        parentInput.innerHTML = '';
        validSizes.forEach(size => {
            const option = document.createElement('option');
            option.value = size.toString();
            option.textContent = size.toString();
            parentInput.appendChild(option);
        });
        
        // Select the largest by default
        if (validSizes.length > 0) {
            parentInput.value = validSizes[validSizes.length - 1].toString();
        }
    }

    edoInput.addEventListener('input', populateParentMosSizes);
    genInput.addEventListener('input', populateParentMosSizes);

    // Initial population
    populateParentMosSizes();

    generateBtn.addEventListener('click', () => {
        const edo = parseInt(edoInput.value, 10);
        const generator = parseInt(genInput.value, 10);
        const parentSize = parseInt(parentInput.value, 10);

        if (isNaN(edo) || isNaN(generator) || isNaN(parentSize) || edo < 2 || generator < 1 || parentSize < 4) {
            alert("Please enter valid numbers. Parent MOS size must be at least 4 to generate sublevels down to 3.");
            return;
        }

        if (parentSize > edo) {
            alert("Parent MOS Size cannot be greater than Period (EDO).");
            return;
        }

        const tree = generateNarushimaTree(edo, generator, parentSize);
        renderTree(tree);
    });

    function renderTree(levels: SubMosLevel[]) {
        resultsContainer.innerHTML = ''; // Clear previous
        
        if (levels.length === 0) {
            emptyState.classList.remove('hidden');
            resultsContainer.classList.add('hidden');
            return;
        }

        emptyState.classList.add('hidden');
        resultsContainer.classList.remove('hidden');

        levels.forEach((level, levelIndex) => {
            const section = document.createElement('div');
            section.className = 'level-section';
            section.style.animationDelay = `${levelIndex * 0.1}s`;

            // Sort groups: Pure MOS first
            const sortedGroups = [...level.groups].sort((a, b) => {
                if (a.isPure && !b.isPure) return -1;
                if (!a.isPure && b.isPure) return 1;
                return 0;
            });

            let gridHtml = '';
            sortedGroups.forEach(group => {
                // Visualization blocks
                const steps = group.stepPattern;
                // Identify unique step sizes to color them
                const uniqueSizes = Array.from(new Set(steps)).sort((a, b) => a - b);
                
                const blocksHtml = steps.map(step => {
                    let typeClass = 'block-large';
                    if (step === uniqueSizes[0]) typeClass = 'block-small';
                    else if (uniqueSizes.length > 2 && step === uniqueSizes[uniqueSizes.length - 1]) typeClass = 'block-huge';
                    
                    return `<div class="step-block ${typeClass}" style="flex-grow: ${step}" title="Step size: ${step}">${step}</div>`;
                }).join('');

                const badgePure = group.isPure ? `<span class="badge badge-pure">Pure MOS</span>` : `<span class="badge badge-disj">Disjunction MOS</span>`;
                const badgeZ = group.isZRelated ? `<span class="badge badge-z" title="Shares ICV with another Prime Form">Z-Related</span>` : '';

                gridHtml += `
                    <div class="mos-item ${group.isPure ? 'pure' : ''}">
                        <div class="mos-title">
                            <h3>Prime Form Set</h3>
                            <div class="badges">
                                ${badgePure}
                                ${badgeZ}
                            </div>
                        </div>
                        
                        <div class="set-details-container">
                            <div class="set-detail">
                                <span class="set-label">Prime Form:</span>
                                <span class="set-value">[${group.primeFormStr}]</span>
                            </div>
                            <div class="set-detail">
                                <span class="set-label">IC Vector:</span>
                                <span class="set-value icv-value">&lt;${group.icv.join(' ')}&gt;</span>
                            </div>
                        </div>

                        <div class="step-pattern-container">
                            <div class="set-label">Step Pattern</div>
                            <div class="step-blocks">
                                ${blocksHtml}
                            </div>
                            <div class="raw-pattern">[${steps.join(', ')}]</div>
                        </div>
                    </div>
                `;
            });

            section.innerHTML = `
                <div class="level-header">
                    <h2>Level ${level.size}</h2>
                    <span class="level-count">${level.groups.length} unique sets</span>
                </div>
                <div class="mos-grid">
                    ${gridHtml}
                </div>
            `;
            
            resultsContainer.appendChild(section);
        });
    }
});
