document.getElementById('addPiece').addEventListener('click', function () {
    const productSizes = document.getElementById('productSizes');
    productSizes.innerHTML += `
        <div class="product-size">
            <label>Размер изделия (длина, м):</label>
            <input type="number" class="length" step="0.01" required>
            <label>Размер изделия (ширина, м):</label>
            <input type="number" class="width" step="0.01" required>
        </div>`;
});

document.getElementById('calcForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const piecesCount = parseInt(document.getElementById('pieces').value);
    let totalArea = 0;
    let jointCount = 0;

    const lengths = Array.from(document.querySelectorAll('.length')).map(input => parseFloat(input.value));
    const widths = Array.from(document.querySelectorAll('.width')).map(input => parseFloat(input.value));

    for (let i = 0; i < piecesCount; i++) {
        const areaProduct = lengths[i] * widths[i];
        totalArea += areaProduct;
        if (document.getElementById('gluing').value === "Да") {
            jointCount++; // Увеличиваем количество стыков, если можно склеивать
        }
    }

    const sheetLength = parseFloat(document.getElementById('sheetLength').value);
    const sheetWidth = parseFloat(document.getElementById('sheetWidth').value);
    const leafFraction = parseFloat(document.getElementById('leafFraction').value);
    const sheetArea = sheetLength * sheetWidth * leafFraction;

    let sheetsNeeded = Math.ceil(totalArea / sheetArea);
    let wasteLoss = (sheetsNeeded * sheetArea) - totalArea;

    // Добавляем стыки, если длина изделия больше 0.75м
    if (document.getElementById('gluing').value === "Нет") {
        jointCount = Math.ceil(totalArea / 2400); // Примерная формула для подсчета стыков
    }

    const sheetsDetails = [];
    for (let i = 1; i <= sheetsNeeded; i++) {
        sheetsDetails.push(`Лист ${i}: ${sheetLength} м x ${sheetWidth} м`);
    }

    document.getElementById('sheetsDetails').innerHTML = sheetsDetails.map(detail => `<div class="sheet-detail">${detail}</div>`).join('');

    document.getElementById('totalArea').innerText = `Общая площадь (м²): ${totalArea.toFixed(2)}`;
    document.getElementById('sheetsNeeded').innerText = `Количество листов: ${sheetsNeeded}`;
    document.getElementById('wasteLoss').innerText = `Потери из-за остатков (м²): ${wasteLoss.toFixed(2)}`;
    document.getElementById('jointCount').innerText = `Количество стыков: ${jointCount}`;
    document.getElementById('totalWaste').innerText = `Общий перерасход (мм): ${(wasteLoss * 1000).toFixed(2)}`;

    document.getElementById('results').classList.remove('hidden');
});
