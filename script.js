document.getElementById('calcForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const sheetWidth = parseFloat(document.getElementById('sheetWidth').value);
    const sheetHeight = parseFloat(document.getElementById('sheetHeight').value);
    const length1 = parseFloat(document.getElementById('length1').value);
    const length2 = parseFloat(document.getElementById('length2').value);
    const length3 = parseFloat(document.getElementById('length3').value);

    const totalLength = length1 + length2 + length3;
    let result;

    // Проверяем возможность склеивания
    if (totalLength <= sheetWidth) {
        const sheetsNeeded = Math.ceil(totalLength / sheetWidth);
        const excessWidth = sheetsNeeded * sheetWidth - totalLength;
        result = `Необходимое количество листов: ${sheetsNeeded}. Остаток: ${excessWidth} мм.`;
    } else {
        // Если нет, то считаем перерасход
        result = 'Склеивание невозможно, необходимо использовать больше листов.';
    }

    document.getElementById('result').innerText = result;
});
