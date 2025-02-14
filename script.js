function generateRandomMatrix(rows, cols){
    return Array.from({length:rows}, () =>      // satırları oluşturuyor
        Array.from({length:cols}, () => Math.floor(Math.random() * 10))     // her satırın içindeki sütunları oluşturuyor
    );
}

function createMatrix(matrix, matrixContId, label){
    let container = d3.select("#" + matrixContId);
    container.html("");     // önceki içerik varsa temizliyor

    let table = container.append("table").attr("class", "matrix-table");    // html içine tablo ekliyor
    matrix.forEach((row, i) => {
        let tr = table.append("tr");    // her satır için yeni bir satır ekliyor
        row.forEach((value, j) => {
            tr.append("td")     // her hücre için yeni bir hücre ekliyor
                .attr("id", `${label}-${i}-${j}`)    // her bir hücreye unique id ekliyor, template literals deniliyormuş bu ifadeye
                .text(value);       // hücreye değeri ekliyor
        });
    });
}

let isAnimating = false;    // spamı engellemek için

function multiplyMatrices(A, B){
    if (isAnimating) return;
    isAnimating = true; 

    let rowsA = A.length, colsA_rowsB = A[0].length, colsB = B[0].length;
    let C = Array.from({length: rowsA}, () => new Array(colsB).fill(0));
    let step = 0;

    function animateMultiplication(){
        if (step >= rowsA * colsB){
            isAnimating = false;
            document.getElementById("btn").disabled = false;    // animasyon bitince butonu aktif hale getiriyor
            return;}

        let i = Math.floor(step / colsB);
        let j = step % colsB;

        for (let k = 0; k < colsA_rowsB; k++){
            let elemA = d3.select(`#A-${i}-${k}`).classed("highlight", true);   // A matrisindeki hücreyi seçip highlight classını ekliyor
            let elemB = d3.select(`#B-${k}-${j}`).classed("highlight", true);   // B matrisindeki hücreyi seçip highlight classını ekliyor

            setTimeout(() => {
                elemA.classed("highlight", false);   // highlight classını kaldırıyor
                elemB.classed("highlight", false);
                C[i][j] += A[i][k] * B[k][j];   // C matrisinin değerini hesaplıyor
                d3.select(`#C-${i}-${j}`).text(C[i][j])     // C matrisindeki hücreye id'yi kullanarak, değeri ekliyor
                .classed("result", true);   // result classını ekliyor, renk değişikliği için
            }, 500 * (k + 1));  // 0.5 sn bekleme süresi
        }
        step++;
        setTimeout(animateMultiplication, colsA_rowsB * 500);
    }
    animateMultiplication();
}

function initializeMatrices(){
    let rowsA = parseInt(document.getElementById("rowsA").value);   // inputlardan değerleri alıyor
    let colsA_rowsB = parseInt(document.getElementById("colsA_rowsB").value);
    let colsB = parseInt(document.getElementById("colsB").value);

    if (isNaN(rowsA) || isNaN(colsA_rowsB) || isNaN(colsB) || 
    rowsA < 2 || colsA_rowsB < 1 || colsB < 1) {   // inputlardan biri boşsa veya değerler uygun değilse uyarı veriyor
        alert("Please enter valid values for matrix dimensions.");
        return;
    }

    document.getElementById("btn").disabled = true;   // animasyon boyunca butonu devre dışı bırakıyor

    let A = generateRandomMatrix(rowsA, colsA_rowsB);   // random matrisler oluşturuyor
    let B = generateRandomMatrix(colsA_rowsB, colsB);
    let C = Array.from({length: rowsA}, () => new Array(colsB).fill(0));

    createMatrix(A, "matrixA", "A");    // matrisleri oluşturuyor
    if (!document.querySelector(".operator-x")){
        d3.select("#matrixA").node().insertAdjacentHTML("afterend", '<div class="operator operator-x">x</div>');}
    createMatrix(B, "matrixB", "B");
    if (!document.querySelector(".operator-equals")){
        d3.select("#matrixB").node().insertAdjacentHTML("afterend", '<div class="operator operator-equals">=</div>');}
    createMatrix(C, "matrixC", "C");
    
    setTimeout(() => multiplyMatrices(A, B), 500);  // 0.5 sn bekleme süresi
}