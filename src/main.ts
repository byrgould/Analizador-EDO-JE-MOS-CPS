import './style.css'; // Si Vite la creo
import { analyzeSet } from './core/analyzer';
import { Tn, In } from './core/set-theory';
import { stepsToSet, setToSteps } from './core/mos';

const analyzeBtn = document.getElementById('analyze-btn') as HTMLButtonElement;
const edoSelect = document.getElementById('edo') as HTMLSelectElement;
const pcsetInput = document.getElementById('pcset') as HTMLInputElement;
const tnValueInput = document.getElementById('tn-value') as HTMLInputElement;
const inValueInput = document.getElementById('in-value') as HTMLInputElement;
const resultCard = document.getElementById('result-card') as HTMLDivElement;
const outputPre = document.getElementById('output') as HTMLPreElement;

analyzeBtn.addEventListener('click', () => {
    try {
        const edo = parseInt(edoSelect.value, 10);
        const tnValue = parseInt(tnValueInput.value, 10);
        const inValue = parseInt(inValueInput.value, 10);
        const pcString = pcsetInput.value;
        const inputFormat = (document.querySelector('input[name="input-format"]:checked') as HTMLInputElement).value;
        
        // Parsear el input string a array de numeros
        const parsedInput = pcString.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
        
        if (parsedInput.length === 0) {
            outputPre.innerText = "Error: Input data is empty or invalid.";
            resultCard.style.display = 'block';
            return;
        }

        let pcSet: number[];
        let generatedFromSteps = false;

        if (inputFormat === 'steps') {
            pcSet = stepsToSet(parsedInput, 0, edo);
            generatedFromSteps = true;
        } else {
            pcSet = parsedInput;
        }

        // Ejecutar Análisis General
        const result = analyzeSet(pcSet, edo);
        
        // Ejecutar Tn e In por separado
        const tnResult = Tn(pcSet, tnValue, edo);
        const inResult = In(pcSet, inValue, edo);

        // Conversiones Steps
        const stepsFromSet = setToSteps(pcSet, edo);

        // Armar el texto de salida (estilo console.log)
        let outText = `===== EDO PITCH CLASS SET ANALYSIS =====\n`;
        outText += `Temperament: ${edo} EDO\n`;
        if (generatedFromSteps) {
            outText += `Input Step Pattern: [${parsedInput.join(', ')}]\n`;
            outText += `Derived Pitch Class Set: [${pcSet.join(', ')}]\n`;
        } else {
            outText += `Input set: [${pcSet.join(', ')}]\n`;
        }
        outText += `Normalized set: [${result.normalizedSet.join(', ')}]\n`;
        outText += `Normal form: [${result.normalForm.join(', ')}]\n`;
        outText += `Complement: [${result.complement.join(', ')}]\n`;
        outText += `Prime form: [${result.primeForm.join(', ')}]\n`;
        outText += `Prime form of complement: [${result.primeFormComplement.join(', ')}]\n`;
        outText += `Interval-class vector: [${result.intervalClassVector.join(' ')}]\n\n`;

        outText += `Degree of transpositional symmetry: ${result.transpositionalSymmetry.degree}\n`;
        if (result.transpositionalSymmetry.degree > 1) {
            outText += `  at transpositions: T${result.transpositionalSymmetry.transpositions.join(', T')}\n`;
        }

        outText += `Degree of inversional symmetry: ${result.inversionalSymmetry.degree}\n`;
        if (result.inversionalSymmetry.degree > 0) {
            outText += `  at indices: I${result.inversionalSymmetry.indices.join(', I')}\n`;
        }

        outText += `\n——— MOS (Moment of Symmetry) Analysis ———\n`;
        outText += `Is MOS: ${result.mosAnalysis.isMOS}\n`;
        if (result.mosAnalysis.isMOS) {
            outText += `Generator: ${result.mosAnalysis.generator} steps\n`;
            outText += `Complement generator: ${result.mosAnalysis.complementGenerator} steps\n`;
            outText += `Coprime pair: [${result.mosAnalysis.generatorPair?.join(', ')}]\n`;
            outText += `Step pattern: [${result.mosAnalysis.stepPattern?.join(', ')}]\n`;
            outText += `Small step (s): ${result.mosAnalysis.smallStep} steps\n`;
            outText += `Large step (L): ${result.mosAnalysis.largeStep} steps\n`;
            outText += `Scale type: ${result.mosAnalysis.scaleType}\n`;
            outText += `Note: ${result.mosAnalysis.reason}\n`;
        } else {
            outText += `Reason: ${result.mosAnalysis.reason}\n`;
            if (result.mosAnalysis.intervalSizes) outText += `Interval sizes found: [${result.mosAnalysis.intervalSizes.join(', ')}]\n`;
            if (result.mosAnalysis.stepPattern) outText += `Step pattern: [${result.mosAnalysis.stepPattern.join(', ')}]\n`;
        }

        outText += `\n--- Operaciones Tn e In (Set Theory) ---\n`;
        outText += `T${tnValue} del set (en Normal Form): [${tnResult.join(', ')}]\n`;
        outText += `I${inValue} del set (en Normal Form): [${inResult.join(', ')}]\n`;

        outText += `\n--- Conversión Genérica Steps <-> Set ---\n`;
        outText += `setToSteps del set analizado: [${stepsFromSet.join(', ')}]\n`;

        outputPre.innerText = outText;
        resultCard.style.display = 'block';

    } catch (e: any) {
        outputPre.innerText = `Error fatal: ${e.message}`;
        resultCard.style.display = 'block';
    }
});
