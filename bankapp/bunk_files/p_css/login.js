/** ログイン画面 **/
// ID一覧スプレッドシートのウェブアプリURLを定義
const WEBAPPURL = 'https://script.google.com/macros/s/AKfycbyZktHo5yEeM3MRwe8CQ_Ym4c8MNV1GIM1qF01ViLEgCFV4l2sSYiepJkVac2so4f4L/exec';

window.addEventListener('DOMContentLoaded', function () {
    // 要素を取得
    const loginBtn = document.getElementById('bl_loginBtn'); // 「ログイン」ボタン
    const agreeBtn = document.getElementById('bl_agreeBtn'); // 「はい」ボタン
    const userId = document.getElementById('bl_userId'); // 「ID」テキストフィールド
    const loginErrorArea = document.getElementsByClassName('bl_loginErrorArea')[0]; // ノーティフィケーションエリア
    const errorMessage = loginErrorArea.getElementsByClassName('c_notification_text')[0].firstElementChild // エラーメッセージ
    const nickname = document.getElementById('bl_nickname');
    const inputArea = document.getElementById('bl_inputMode');
    const confirmArea = document.getElementById('bl_confirmMode');

    // ローダーの生成
    createLoader('よみこみ<ruby>中<rt>ちゅう</rt></ruby>');

    // 画面読込完了時の処理
    window.addEventListener('load', function () {
        // ローダーを非表示
        hideLoader();
    });

    // 「ID」テキストフィールド入力時の処理
    userId.addEventListener('input', function () {
        if (this.value.length == 5) {
            // 5桁入力した場合
            // ログインボタンにフォーカス
            loginBtn.focus();
        }
    });

    // 「ログイン」ボタン押下時の処理
    loginBtn.addEventListener('click', function () {
        // 「ID」テキストフィールドの入力値を取得
        const userIdValue = userId.value;

        if (userIdValue != '') {
            // ローダーを表示
            showLoader();

            // クエリパラメータをURLに追加
            const getNameUrl = setQueryParams(WEBAPPURL, { id: userIdValue });

            // GASへGET送信
            fetch(getNameUrl).then(function (response) {
                if (response.ok) {
                    // レスポンスが返ってきた場合
                    // レスポンスデータをJSON形式に変換
                    return response.json();
                }
            }).then(function (data) {
                if (data.content !== undefined) {
                    // レスポンスが返ってきた場合
                    // ニックネームを表示
                    nickname.innerText = data.name;
                    // 入力⇔確認画面表示切り替え
                    inputArea.classList.add('bl_hidden');
                    confirmArea.classList.remove('bl_hidden');
                }
            }).catch(function (error) {
                // レスポンスが返ってこなかった場合
                // ノーティフィケーションを表示
                loginErrorArea.classList.add('bl_showLoginError');
                // エラーメッセージの文言を入力
                errorMessage.innerHTML = 'ネットワークに<ruby>接続<rt>せつぞく</rt></ruby>されているか<ruby>確認<rt>かくにん</rt></ruby>してください<br>' + error;
            }).then(function () {
                // ローダーを非表示
                hideLoader();
            });
        } else {
            // ノーティフィケーションを表示
            loginErrorArea.classList.add('bl_showLoginError');
            // エラーメッセージの文言を入力
            errorMessage.innerText = 'IDをにゅうりょくしてください';
        }
    });

    // 「はい」ボタン押下時の処理
    agreeBtn.addEventListener('click', function () {
        // テキストフィールドの値（入力されたID）を取得
        const userIdValue = userId.value;

        // 送信データを定義
        let sendData = {
            "userId": userIdValue
        };

        // 送信パラメータを定義
        const postparam = {
            "method": "POST",
            "Content-Type": "application/json",
            "body": JSON.stringify(sendData)
        };

        // GASのウェブアプリURLにPOSTリクエストを送信
        fetch(WEBAPPURL, postparam).then(function (response) {
            if (response.ok) {
                // レスポンスが返ってきた場合
                // レスポンスデータをJSON形式に変換
                return response.json();
            }
        }).then(function (data) {
            if (data.status !== undefined) {
                // レスポンスが返ってきた場合
                // URLにクエリパラメータを付与して遷移
                location.href = setQueryParams('./menu.html', { id: userIdValue });
            }
        }).catch(function (error) {
            // レスポンスが返ってこなかった場合
            // ノーティフィケーションを表示
            loginErrorArea.classList.add('bl_showLoginError');
            // エラーメッセージの文言を入力
            errorMessage.innerHTML = 'ネットワークに<ruby>接続<rt>せつぞく</rt></ruby>されているか<ruby>確認<rt>かくにん</rt></ruby>してください<br>' + error;
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