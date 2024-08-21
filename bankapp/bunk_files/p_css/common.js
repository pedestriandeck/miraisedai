/* バージョン管理 */
// URLからファイル名を取得する関数
function getFileName() {
    // 現在表示されているページのURLを取得
    const currentUrl = new URL(window.location.href);
    // URLのパス部分を取得
    const pathname = currentUrl.pathname;
    // パス名からファイル名を取得
    const filename = pathname.substring(pathname.lastIndexOf('/') + 1);

    return filename;
}

// バージョン情報を表示する関数
function setVersion() {
    /* アップデートを行った場合、VERSIONの数値を増加してください */
    const VERSION = '2.01';
    const body = document.body;

    const versionArea = document.createElement('div');
    versionArea.classList.add('com_versionArea');
    const versionNum = document.createElement('p');
    versionNum.classList.add('com_versionNum');
    versionNum.innerText = 'ver ' + VERSION;
    versionArea.appendChild(versionNum);
    body.appendChild(versionArea);
}

window.addEventListener('DOMContentLoaded', function () {
    // URLからファイル名を取得
    const filename = getFileName();

    // ファイル名が "login.html" の場合、バージョン情報を表示
    if (filename == 'login.html') {
        setVersion();
    }
});

/* 共通 */
/* クエリストリング */
// クエリストリングから指定したkey項目の値を取得
function getQueryParams(key) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(key);
}

// URLにクエリストリングを追加して返却
function setQueryParams(url, queryParams) {
    // URLオブジェクトを作成する
    const urlObj = new URL(url, window.location.href);

    // URLSearchParamsオブジェクトを取得する
    const urlSearchParams = urlObj.searchParams;

    // クエリストリングのオブジェクトをループで処理する
    for (const [key, value] of Object.entries(queryParams)) {
        // クエリストリングのキーと値をURLSearchParamsオブジェクトに追加または更新する
        urlSearchParams.set(key, value);
    }

    // URLオブジェクトのsearchプロパティを更新する
    urlObj.search = urlSearchParams.toString();

    // 新しいURLを文字列として返す
    return urlObj.toString();
}

/* アイコン移動 */
if (document.getElementsByClassName('com_moveIcon')) {
    // アイコン要素の取得
    const icon = document.getElementsByClassName('com_moveIcon_icon');

    for (let i = 0; i < icon.length; i++) {
        // 初期時の座標
        const defaultX = icon[i].getBoundingClientRect().left;
        const defaultY = icon[i].getBoundingClientRect().top;
        // 移動開始時の座標
        let startX;
        let startY;
        // 移動中の座標
        let moveX;
        let moveY;

        // タッチ開始時
        icon[i].addEventListener('touchstart', function (e) {
            // 端末のデフォルト動作をキャンセル
            e.preventDefault();

            // タッチ開始時の座標を取得
            startX = e.touches[0].pageX;
            startY = e.touches[0].pageY;
        });

        // タッチ中
        icon[i].addEventListener('touchmove', function (e) {
            // 端末のデフォルト動作をキャンセル
            e.preventDefault();

            // タッチ中の座標を取得
            moveX = e.changedTouches[0].pageX;
            moveY = e.changedTouches[0].pageY;

            // アイコンの座標を設定
            icon[i].style.top = `${moveY - defaultY - (icon[i].getBoundingClientRect().bottom - icon[i].getBoundingClientRect().top) / 2}px`;
            icon[i].style.left = `${moveX - defaultX - (icon[i].getBoundingClientRect().right - icon[i].getBoundingClientRect().left) / 2}px`;
        });
    }
}