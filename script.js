document.getElementById('stoneForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Предотвращаем отправку формы

    const pieces = [];
    const depths = Array.from(document.querySelectorAll('.depth')).map(elem => parseFloat(elem.value));
    const widths = Array.from(document.querySelectorAll('.width')).map(elem => parseFloat(elem.value));

    for (let i = 0; i < depths.length; i++) {
        pieces.push({depth: depths[i], width: widths[i]});
    }

    const useGlue = confirm("Можно ли склеивать?");
    const sheetSize = {width: 3680, depth: 760};

    const result = calculateMaterial(pieces, useGlue, sheetSize);
    visualizeCutting(pieces, sheetSize);

    document.getElementById('result').innerText = result;
});

function addPieceInputs() {
    const piecesInput = document.getElementById('piecesInput');
    const pieceIndex = piecesInput.children.length / 2 + 1; // Индекс кусочка
    piecesInput.insertAdjacentHTML('beforeend', `
        <label for="pieceDepth${pieceIndex}">Глубина кусочка ${pieceIndex}:</label>
        <input type="number" id="pieceDepth${pieceIndex}" class="depth" required>
        <label for="pieceWidth${pieceIndex}">Ширина кусочка ${pieceIndex}:</label>
        <input type="number" id="pieceWidth${pieceIndex}" class="width" required>
    `);
}

function calculateMaterial(pieces, useGlue, sheetSize) {
    const totalDepth = pieces.reduce((sum, piece) => sum + piece.depth, 0);
    const columns = sheetsRequired(totalDepth, sheetSize.depth);
    return `Потребуется ${columns} листа(ов) по ${sheetSize.width}х${sheetSize.depth} мм.`;
}

function sheetsRequired(totalDepth, sheetDepth) {
    return Math.ceil(totalDepth / sheetDepth);
}

function visualizeCutting(pieces, sheetSize) {
    const visualizationDiv = document.getElementById('visualization');
    visualizationDiv.innerHTML = ''; // Очищаем предыдущие визуализации

    const sheetCount = sheetsRequired(pieces.reduce((sum, piece) => sum + piece.depth, 0), sheetSize.depth);

    // Визуализируем каждый лист
    for (let i = 0; i < sheetCount; i++) {
        const sheetDiv = document.createElement('div');
        sheetDiv.className = 'sheet';
        sheetDiv.style.width = `${sheetSize.width}px`;
        sheetDiv.style.height = `${sheetSize.depth}px`;
        sheetDiv.style.left = `0px`;
        sheetDiv.style.top = `${i * (sheetSize.depth + 10)}px`; // Отступы между листами
        visualizationDiv.appendChild(sheetDiv);

        // Визуализируем кусочки на листе
        let currentHeight = 0;
        pieces.forEach((piece, index) => {
            if (currentHeight + piece.depth <= sheetSize.depth) {
                const pieceDiv = document.createElement('div');
                pieceDiv.className = 'piece';
                pieceDiv.style.width = `${piece.width}px`;
                pieceDiv.style.height = `${piece.depth}px`;
                pieceDiv.style.left = `0px`;
                pieceDiv.style.top = `${currentHeight}px`; // Расположение на листе
                sheetDiv.appendChild(pieceDiv);
                currentHeight += piece.depth; // Подсчет места на листе
            }
        });
    }
}
