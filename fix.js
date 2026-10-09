const fs = require('fs');
let code = fs.readFileSync('src/core/set-theory.ts', 'utf8');
code = code.replace(/<<<<<<< HEAD[\s\S]*?>>>>>>> pr-1/, `    const transposedNormal = transposeSet(nf, -nf[0], edo);
    const transposedInverted = transposeSet(invertedNF, -invertedNF[0], edo);

    for (let i = 1; i < transposedNormal.length; i++) {
        if (transposedNormal[i] < transposedInverted[i]) return transposedNormal;
        if (transposedInverted[i] < transposedNormal[i]) return transposedInverted;
    }

    return transposedNormal;`);
fs.writeFileSync('src/core/set-theory.ts', code);
