document.getElementById('addPieceBtn').addEventListener('click', () => {
    const piecesContainer = document.getElementById('piecesContainer');
    const newPieceInput = document.createElement('input');
    newPieceInput.type = 'number';
    newPieceInput.className = 'pieceLength';
    newPieceInput.value = '0';
    piecesContainer.appendChild(newPieceInput);
});

document.getElementById('calculateBtn').addEventListener('click', () => {
    const sheetWidth = parseFloat(document.getElementById('sheetWidth').value);
    const sheetLength = parseFloat(document.getElementById('sheetLength').value);
    const pieceLengths = Array.from(document.getElementsByClassName('pieceLength')).map(input => parseFloat(input.value));
    const canGlue = document.getElementById('canGlue').checked;

    const result = calculateStone(sheetWidth, sheetLength, pieceLengths, canGlue);
    displayResult(result);
});

function calculateStone(sheetWidth, sheetLength, pieces, canGlue) {
    const totalLength = pieces.reduce((sum, piece) => sum + piece, 0);
    let sheetsNeeded = Math.ceil(totalLength / sheetLength);
    let remainder = totalLength % sheetLength;

    if (canGlue) {
        // Если можно склеивать
        let joints = Math.floor(remainder / 500);
        return { sheetsNeeded, remainder, joints, waste: remainder };
    } else {
        // Если нельзя склеивать, перебор всех комбинаций
        const combinations = getCombinations(pieces, sheetLength);
        const bestCombination = findBestCombination(combinations, sheetLength);
        return {
            sheetsNeeded: bestCombination.sheets,
            totalWaste: bestCombination.waste,
            joints: bestCombination.joints,
            details: bestCombination.details
        };
    }
}

function getCombinations(pieces, sheetLength) {
    const results = [];
    const totalPieces = pieces.length;

    // Рекурсивная функция для создания комбинаций
    function combine(startIndex, currentCombination) {
        const currentLength = currentCombination.reduce((sum, piece) => sum + piece, 0);
        if (currentLength <= sheetLength) {
            results.push(currentCombination.slice());
        }
        for (let i = startIndex; i < totalPieces; i++) {
            currentCombination.push(pieces[i]);
            combine(i + 1, currentCombination);
            currentCombination.pop();
        }
    }

    combine(0, []);
    return results;
}

function findBestCombination(combinations, sheetLength) {
    let bestWaste = Infinity;
    let bestDetails = [];
    let sheets = 0;

    combinations.forEach(combination => {
        const totalLength = combination.reduce((sum, piece) => sum + piece, 0);
        const waste = sheetLength - totalLength;
        if (waste >= 0 && waste < bestWaste) {
            bestWaste = waste;
            bestDetails = combination;
        }
    });

    sheets = Math.ceil(bestDetails.reduce((sum, piece) => sum + piece, 0) / sheetLength);

    return { sheets, waste: bestWaste, joints: 0, details: bestDetails }; // Здесь можно добавить логику для стыков
}

function displayResult(result) {
    const resultContainer = document.getElementById('result');
    resultContainer.innerHTML = `
        <h2>Результаты:</h2>
        <p>Необходимо листов: ${result.sheetsNeeded}</p>
        <p>Остаток: ${result.waste} мм</p>
        <p>Количество стыков: ${result.joints}</p>
        <p>Детали: ${result.details.join(', ')}</p>
    `;
}
