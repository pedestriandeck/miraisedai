/** アカウント発行 **/
// スプレッドシートのウェブアプリURLを定義
const WEBAPPURL = 'https://script.google.com/macros/s/AKfycbzzp0P-lsjnNPbdJTZL3V58TTUAuWov3cRK_Qc0rJgjZY9tYRvTNthoKaptnI7C_AFypQ/exec';

window.addEventListener('DOMContentLoaded', function () {
    // 要素を取得
    const name = document.getElementById('bai_name'); // ニックネームの入力欄
    const confirmBtn = document.getElementById('bai_confirmBtn'); // 発行するボタン

    // ローダーの生成
    createLoader('よみこみ<ruby>中<rt>ちゅう</rt></ruby>');

    // 画面読込完了時の処理
    window.addEventListener('load', function () {
        // ローダーを非表示
        hideLoader();
    });


    // ニックネームの入力欄に入力時の処理
    name.addEventListener('input', function () {
        if (this.value.trim().length != 0) {
            confirmBtn.tabIndex = 0;
            confirmBtn.classList.remove('bai_confirmBtn_disabled');
        } else {
            confirmBtn.tabIndex = -1;
            confirmBtn.classList.add('bai_confirmBtn_disabled');
        }
    });

    // ニックネームの入力欄フォーカス時にキー押下時の処理
    name.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            if (this.value.trim().length != 0) {
                this.blur();
                confirmBtn.click();
            }
        }
    });

    // 発行ボタン押下時の処理
    confirmBtn.addEventListener('click', function () {
        if (!this.classList.contains('bai_confirmBtn_disabled')) {
            // ローダーを表示
            showLoader();

            // テキストフィールドの値（入力されたニックネーム）を取得
            const nameValue = name.value;

            // 送信データを定義
            let sendData = {
                "name": nameValue
            };

            // 送信パラメータを定義
            const postparam = {
                "method": "POST",
                // "mode": "no-cors",
                "Content-Type": "application/json",
                "body": JSON.stringify(sendData)
            };

            // 指定されたURLにリクエストを送信
            fetch(WEBAPPURL, postparam).then(function (response) {
                if (response.ok) {
                    // レスポンスが返ってきた場合
                    // レスポンスデータをJSON形式に変換
                    return response.json();
                }
            }).then(function (data) {
                if (data.newId !== undefined) {
                    // レスポンスがちゃんと返ってきた場合
                    location.href = setQueryParams('./accountConfirm.html', { "id": data.newId });
                } else {
                    // レスポンスが返ってこなかった場合
                    hideLoader();
                    console.log('レスポンス返ってこない、、、');
                }
            }).catch(function (error) {
                hideLoader();
                console.log(error);
            });
        }
    });
});

// ブラウザバック時の処理
window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
        // ローダーを非表示
        hideLoader();
    }
});