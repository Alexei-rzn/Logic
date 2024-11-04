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

    document.getElementById('result').innerText = result;
});

function addPieceInputs() {
    const piecesInput = document.getElementById('piecesInput');
    const pieceIndex = piecesInput.children.length / 2 + 1; // Индекс кусочка
    piecesInput.insertAdjacentHTML('beforeend', `
        <label for="pieceDeph${pieceIndex}">Глубина кусочка ${pieceIndex}:</label>
        <input type="number" id="pieceDepth${pieceIndex}" class="depth" required>
        <label for="pieceWidth${pieceIndex}">Ширина кусочка ${pieceIndex}:</label>
        <input type="number" id="pieceWidth${pieceIndex}" class="width" required>
    `);
}

function calculateMaterial(pieces, useGlue, sheetSize) {
    const totalDepth = pieces.reduce((sum, piece) => sum + piece.depth, 0);
    let remaining;

    if (useGlue) {
        const columns = sheetsRequired(totalDepth, sheetSize.depth);
        const excess = columns * sheetSize.depth - totalDepth;
        remaining = `Потребуется ${columns} листа(ов), остаток: ${excess} мм`;
        return remaining;
    } else {
        let totalExcess = 0;
        
        pieces.forEach(piece => {
            let excess = piece.depth > sheetSize.depth ? Math.ceil(piece.depth / sheetSize.depth) * sheetSize.depth - piece.depth : 0;
            totalExcess += excess;
        });
        
        return `Потребуется ${sheetsRequired(totalDepth, sheetSize.depth)} листа(ов), общий перерасход: ${totalExcess} мм`;
    }
}

function sheetsRequired(totalDepth, sheetDepth) {
    return Math.ceil(totalDepth / sheetDepth);
}
