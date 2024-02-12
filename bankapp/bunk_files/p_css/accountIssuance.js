/** アカウント発行 **/
window.addEventListener('DOMContentLoaded', function () {
    // 要素を取得
    const name = document.getElementById('bai_name'); // ニックネームの入力欄
    const confirmBtn = document.getElementById('bai_confirmBtn'); // 発行するボタン

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
                confirmBtn.click();
            }
        }
    });

    // 引数で指定した桁数のハッシュ値を生成する関数
    // （生成したハッシュ値をキーとしてスプレッドシートに保存し、次の画面で取引を照合するため）
    function getHash(length) {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let str = '';
        for (let i = 0; i < length; i++) {
            str += chars[Math.floor(Math.random() * chars.length)];
        }
        return str;
    }

    // 発行ボタン押下時の処理
    confirmBtn.addEventListener('click', function (e) {
        // ローダーを表示
        showLoader();

        // スプレッドシートのウェブアプリURLを定義
        const appUrl = 'https://script.google.com/macros/s/AKfycbzzp0P-lsjnNPbdJTZL3V58TTUAuWov3cRK_Qc0rJgjZY9tYRvTNthoKaptnI7C_AFypQ/exec';
        const hash = getHash(256);

        // 送信データを定義
        let SendDATA = {
            "name": name.value,
            "hash": hash
        };

        // 送信パラメータを定義
        const postparam = {
            "method": "POST",
            "mode": "no-cors",
            "Content-Type": "application/json",
            "body": JSON.stringify(SendDATA)
        };

        // 指定されたURLにリクエストを送信
        fetch(appUrl, postparam).then(function () {
            location.href = setQueryParams('./accountConfirm.html', { "transmission": hash });
        }).catch(function (error) {
            console.log(error);
            window.alert(error);
        });
    });
});

// ブラウザバック時の処理
window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
        // ローダーを非表示
        hideLoader();
    }
});