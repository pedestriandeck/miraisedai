// グラフを形成するデータ
const fileData = [{
    "graphData": [
        {
            // 横軸の色とデータ
            "column": [
                {
                    "data": 0,
                    "color": "#5993EB"
                },
                {
                    "data": 2,
                    "color": "#4DABEF"
                },
                {
                    "data": 9,
                    "color": "#5ECAEC"
                },
                {
                    "data": 18,
                    "color": "#D8DB5F"
                },
                {
                    "data": 22,
                    "color": "#F0D800"
                },
                {
                    "data": 18,
                    "color": "#FABF00"
                },
                {
                    "data": 30,
                    "color": "#F69C00"
                },
                {
                    "data": 8,
                    "color": "#F28300"
                },
                {
                    "data": 5,
                    "color": "#F15D78"
                },
                {
                    "data": 9,
                    "color": "#E53935"
                }
            ],
            // 縦軸ラベル
            "row": [
                {
                    "label": "-10"
                },
                {
                    "label": "0"
                },
                {
                    "label": "10"
                },
                {
                    "label": "20"
                },
                {
                    "label": "30"
                }
            ],
            // Y軸の最大最小値（最小は目盛がないところまで設定）と現在値
            "graph": [
                {
                    "min": -10,
                    "max": 30,
                    "currentValue": 7
                }
            ]
        }
    ]
}]

// =====グラフ生成処理========================================================
// jsonData：JSONファイルデータ
// target：対象グラフ
// ==========================================================================
function createGraph03(jsonData, target) {
    // キャンバス設定
    const graph03_canvas = target.getElementsByClassName('pt_graph03_canvas')[0];
    const context = graph03_canvas.getContext('2d');
    // グラフ領域
    graph03_canvas.width = graph03_canvas.offsetWidth;
    graph03_canvas.height = graph03_canvas.offsetHeight;
    const width = graph03_canvas.offsetWidth;
    const height = graph03_canvas.offsetHeight;

    // 縦軸の値1に対しての高さ
    const heightPerOne = height / (jsonData.graph[0].max - jsonData.graph[0].min);

    // グラフの横線を描画する
    // 一番下の横線は太さが2pxで、線端がroundのため1px調整
    drawStrokeLine(context, 1, height - 1, width - 1, height - 1, '#D5D5D5', 1, 'round', true);
    // 縦軸のデータの個数分繰り返す
    for (let i = 0; i < jsonData.row.length; i++) {
        // 値が0の要素か判定
        if (jsonData.row[i].label == 20) {
            // 0の横線は太さが2pxで、線端がroundのため1px調整
            drawStrokeLine(context, 1, heightPerOne * (jsonData.row[i].label - jsonData.graph[0].min), width - 1, heightPerOne * (jsonData.row[i].label - jsonData.graph[0].min), '#D5D5D5', 2, 'round', false);
        } else {
            drawStrokeLine(context, 0, heightPerOne * (jsonData.row[i].label - jsonData.graph[0].min), width, heightPerOne * (jsonData.row[i].label - jsonData.graph[0].min), '#D5D5D5', 1, 'round', true);
        }
    }

    // 棒グラフを描画する
    const good = target.getElementsByClassName('pt_graph03_goodText')[0].offsetWidth;
    const bad = target.getElementsByClassName('pt_graph03_badText')[0].offsetWidth;
    const fluctuationArea = width - good - bad;   // グラフの変動領域

    // 各横軸ラベルのX座標を左から順に配列に格納
    const XCoordinate = getXCoordinate(jsonData, fluctuationArea, good);

    // 棒グラフの色を設定する
    // 横軸のデータの個数分繰り返す
    for (let i = 0; i < jsonData.column.length; i++) {
        let color;
        // 現在値がi+1と同じか判定
        if ((i + 1) == jsonData.graph[0].currentValue) {
            // 同じ場合、該当の色を設定
            color = jsonData.column[i].color;
        } else {
            color = '#D5D5D5';
        }

        // 棒グラフの縦軸の座標（Y座標）
        let Ycoordinate = heightPerOne * (jsonData.graph[0].max - jsonData.column[i].data);
        // データが最大値か判定
        if (jsonData.column[i].data == jsonData.graph[0].max) {
            // グラフが一番上の横線と重ならないように2px調整
            Ycoordinate = Ycoordinate + 2;
        }

        // データが0以外の場合、棒グラフの線を描画する
        if (jsonData.column[i].data != 0) {
            // 2pxで描画するため7px調整、横線に重ならないように調整（1と3の部分）
            drawTwoCornerRoundedLine(context, XCoordinate[i] + 7, heightPerOne * (jsonData.row[3].label - jsonData.graph[0].min) - 3, XCoordinate[i] - 7, Ycoordinate + 1, 2, color, color, 2, false);
        }
    }
}

// ====線を引く===============================================================
// context：対象キャンバス
// startX：開始点のX座標
// startY：開始点のY座標
// endX：終了点のX座標
// endY：終了点のY座標
// color：線の色
// size：線の太さ
// lineCap：線端の種類
// dotLine：破線か否か
// ==========================================================================
function drawStrokeLine(context, startX, startY, endX, endY, color, size, lineCap, dotLine) {
    context.beginPath();
    context.strokeStyle = color;
    context.lineWidth = size;
    context.lineCap = lineCap;
    // 破線か否か判定
    if (dotLine) {
        context.setLineDash([2, 1]);
    } else {
        context.setLineDash([]);
    }
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    context.stroke();
}

// =====各横軸ラベルのX座標設定================================================
// jsonData：JSONファイルデータ
// fluctuationArea：変動領域
// margin：左右余白
// ==========================================================================
function getXCoordinate(jsonData, fluctuationArea, margin) {
    // 一つの横軸ラベルの幅
    const memWidth = fluctuationArea / jsonData.column.length;
    const memWidthHalf = memWidth / 2;
    // 描画位置（X座標）を順に配列に格納する
    let XCoordinate = [];
    for (let i = 0; i < jsonData.column.length; i++) {
        XCoordinate.push(memWidthHalf + margin + (memWidth * i));
    }
    return XCoordinate;
}

// ====2つの角が角丸の線を引く================================================
// context：対象キャンバス
// x1：開始点のX座標
// y1：開始点のY座標
// x2：開始点の対角のX座標
// y2：開始点の対角のY座標
// strokeColor：線の色
// fillColor：塗りつぶす色
// size：線の太さ
// dotLine：破線か否か
// ==========================================================================
function drawTwoCornerRoundedLine(context, x1, y1, x2, y2, borderRadius, strokeColor, fillColor, size, dotLine) {
    context.beginPath();
    context.strokeStyle = strokeColor;
    context.fillStyle = fillColor;
    context.lineWidth = size;
    // 破線か否か判定
    if (dotLine) {
        context.setLineDash([6, 4]);
    } else {
        context.setLineDash([]);
    }
    context.moveTo(x1, y1);
    context.lineTo(x2, y1);
    context.arcTo(x2, y2, x1, y2, borderRadius);
    context.arcTo(x1, y2, x1, y1, borderRadius);
    context.closePath();
    context.fill();
    context.stroke();
}

// =====Element生成==========================================================
// jsonData：JSONファイルデータ
// target：対象グラフ
// ==========================================================================
function createGraph03_Element(jsonData, target) {

    // X軸ラベルの作成
    const XlabelArea = document.createElement('div');
    XlabelArea.classList.add('pt_graph03_XlabelArea');

    // 「Good」テキスト
    const goodText = document.createElement('div');
    goodText.classList.add('pt_graph03_goodText');
    // タイポ
    let goodText_typo = document.createElement('p');
    goodText_typo.className = 'c_typo_headerXXS c_typo_BLK8 c_typo_align_center';
    goodText_typo.innerText = 'Good';
    goodText.appendChild(goodText_typo);
    XlabelArea.appendChild(goodText);

    // X軸ラベル
    const Xlabel = document.createElement('div');
    Xlabel.classList.add('pt_graph03_Xlabel');
    for (let i = 0; i < jsonData.column.length; i++) {
        // X軸のbar
        const Xlabel_div = document.createElement('div');
        const Xlabel_bar = document.createElement('div');
        Xlabel_bar.classList.add('pt_graph03_bar');
        Xlabel_bar.style.backgroundColor = jsonData.column[i].color;

        Xlabel_div.appendChild(Xlabel_bar);
        Xlabel.appendChild(Xlabel_div);
    }
    XlabelArea.appendChild(Xlabel);

    // 「Bad」テキスト
    const badText = document.createElement('div');
    badText.classList.add('pt_graph03_badText');
    // タイポ
    let badText_typo = document.createElement('p');
    badText_typo.className = 'c_typo_headerXXS c_typo_BLK8 c_typo_align_center';
    badText_typo.innerText = 'Bad';
    badText.appendChild(badText_typo);
    XlabelArea.appendChild(badText);
    target.appendChild(XlabelArea);

    // Y軸ラベルの作成
    const YlabelArea = document.createElement('div');
    YlabelArea.classList.add('pt_graph03_YlabelArea');
    for (let i = jsonData.row.length - 1; i >= 0; i--) {
        const Ylabel = document.createElement('div');
        Ylabel.classList.add('pt_graph03_Ylabel');

        // タイポ
        let Ylabel_typo = document.createElement('p');
        Ylabel_typo.className = 'c_typo_headerXXS c_typo_BLK8 c_typo_align_right';
        Ylabel_typo.innerText = jsonData.row[i].label;

        Ylabel.appendChild(Ylabel_typo);
        YlabelArea.appendChild(Ylabel);
    }
    target.appendChild(YlabelArea);
}

// =====Element位置設定======================================================
// target：対象グラフ
// ==========================================================================
function setGraph03_Element(target) {
    let rootfont = document.documentElement.style.fontSize.replace('px', '');
    if (rootfont == '') {
        rootfont = getComputedStyle(document.documentElement).fontSize.replace('px', '');
    }
    let graph03_canvas = target.getElementsByClassName('pt_graph03_canvas')[0];
    // 縦軸ラベルの位置設定
    target.getElementsByClassName('pt_graph03_YlabelArea')[0].style.right = graph03_canvas.offsetWidth / rootfont + 'rem';
}

const graph03 = document.getElementsByClassName('pt_graph03');
// ページ読み込み時にイベント登録
window.addEventListener('DOMContentLoaded', function () {
    // グラフ生成処理呼び出し
    for (let i = 0; i < graph03.length; i++) {
        createGraph03_Element(fileData[0].graphData[i], graph03[i]);
        setGraph03_Element(graph03[i]);
        createGraph03(fileData[0].graphData[i], graph03[i]);
    }
});
// リサイズ時にイベント登録
window.addEventListener('resize', function () {
    for (let i = 0; i < graph03.length; i++) {
        setGraph03_Element(graph03[i]);
        createGraph03(fileData[0].graphData[i], graph03[i]);
    }
});