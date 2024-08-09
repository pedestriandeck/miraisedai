/** ログイン画面 **/
// ID一覧スプレッドシートのウェブアプリURLを定義
var IDLIST_GAS_URL = 'https://script.google.com/macros/s/AKfycbyu4JVtJzrqj4oiwhWebuScxrZK8wnCaXJ3ufNQM0If9BWpX4Vj1BJhRUkNIGkC04k/exec';
// ログイン情報スプレッドシートのウェブアプリURLを定義
var LOG_GAS_URL = 'https://script.google.com/macros/s/AKfycbyc2dGW3Rjf51nWKMqmo4cO1jX9HaspnWsZXfU8YVKJh5LsuLrxN_-uX7wKDsIAef9Hfg/exec';

window.addEventListener('DOMContentLoaded', function () {
    // 要素を取得
    const loginBtn = document.getElementById('bl_loginBtn'); // 「ログイン」ボタン
    const agreeBtn = document.getElementById('bl_agreeBtn'); // 「はい」ボタン
    const userId = document.getElementById('bl_userId'); // 「ID」テキストフィールド
    const loginErrorArea = document.getElementsByClassName('bl_loginErrorArea')[0]; // ノーティフィケーションエリア
    const errorMessage = loginErrorArea.getElementsByClassName('c_notification_text')[0].firstElementChild // エラーメッセージ

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

    userId.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            if (this.value.length == 5) {
                this.blur();
                loginBtn.click();
            }
        }
    });

    // 「ログイン」ボタン押下時の処理
    loginBtn.addEventListener('click', function () {
        // 「ID」テキストフィールドの入力値を取得
        const userIdValue = userId.value;

        if (userIdValue != '') {
            getUserName(userIdValue);
        } else {
            // ノーティフィケーションを表示
            loginErrorArea.classList.add('bl_showLoginError');
            // エラーメッセージの文言を入力
            errorMessage.innerText = 'IDをにゅうりょくしてください';
        }
    });

    // 「はい」ボタン押下時の処理
    agreeBtn.addEventListener('click', function () {
        // ローダーを表示
        showLoader();

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
        fetch(LOG_GAS_URL, postparam).then(function (response) {
            if (response.ok) {
                // レスポンスが返ってきた場合
                // レスポンスデータをJSON形式に変換
                return response.json();
            }
        }).then(function (data) {
            if (data.status !== undefined) {
                // レスポンスが返ってきた場合
                // ローカルストレージにuserIdとニックネームを保存
                try {
                    const nickname = document.getElementById('bl_nickname');
                    localStorage.setItem('userId', userIdValue);
                    localStorage.setItem('userName', nickname.innerText);
                } catch (error) {
                    // エラー内容
                    window.alert('')
                } finally {
                    location.href = './menu.html';
                }
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

// ユーザー名を取得する関数
async function getUserName(userId) {
    showLoader();

    const newUrl = setQueryParams(IDLIST_GAS_URL, { action: 'getUser', userId: userId });

    try {
        const response = await fetch(newUrl);
        const result = await response.json();

        if (result.message) {
            console.log('サーバーエラー発生');
            console.log(result.message);
        } else {
            displayUserName(result.result.userName);
        }
    } catch (e) {
        console.log('エラー発生');
        console.log(e);
    } finally {
        hideLoader();
    }
}

// ユーザー名を表示する関数
function displayUserName(userName) {
    if (userName) {
        const nickname = document.getElementById('bl_nickname');
        const inputArea = document.getElementById('bl_inputMode');
        const confirmArea = document.getElementById('bl_confirmMode');

        // ニックネームを表示
        nickname.innerText = userName;
        // 入力⇔確認画面表示切り替え
        inputArea.classList.add('bl_hidden');
        confirmArea.classList.remove('bl_hidden');
    }
}

// ブラウザバック時の処理
window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
        // ローダーを非表示
        hideLoader();
    }
});