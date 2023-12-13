/** ログイン **/
/* ログインボタン押下時の処理 */
function clickLoginBtn() {
    const loginBtn = this;
    const textField = document.getElementById('bl_textField');
    const inputId = textField.value;

    // ログインボタンを非活性化
    loginBtn.classList.add('bl_clickedLoginBtn');
    // ノーティフィケーションエリアの要素を取得
    const loginErrorArea = document.getElementsByClassName('bl_loginErrorArea')[0];
    // エラーメッセージの要素を取得
    const errorMessage = document.getElementsByClassName('c_notification_typo_text')[0];

    if (inputId != '') {
        // ローダーの表示
        showLoader();

        const deployUrl = 'https://script.google.com/macros/s/AKfycbyZktHo5yEeM3MRwe8CQ_Ym4c8MNV1GIM1qF01ViLEgCFV4l2sSYiepJkVac2so4f4L/exec';

        // クエリパラメータをURLに追加
        let getNameUrl = setQueryParams(deployUrl, { id: inputId });

        fetch(getNameUrl).then(function (response) {
            if (response.ok) {
                // レスポンスデータをJSON形式に変換
                return response.json();
            } else {
                // ローダーの非表示
                hideLoader();
                // ログインボタンの活性化
                loginBtn.classList.remove('bl_clickedLoginBtn');
                // ノーティフィケーションを表示
                loginErrorArea.classList.add('bl_showLoginError');
                // エラーメッセージの文言を入力
                errorMessage.innerHTML = `ネットワークに<ruby>接続<rt>せつぞく</rt></ruby>されているか<ruby>確認<rt>かくにん</rt></ruby>してください`;
            }
        }).then(function (data) {
            if (data.content == '') {
                // ローダーの非表示
                hideLoader();
                // ログインボタンの活性化
                loginBtn.classList.remove('bl_clickedLoginBtn');
                // ノーティフィケーションを表示
                loginErrorArea.classList.add('bl_showLoginError');
                // エラーメッセージの文言を入力
                errorMessage.innerHTML = `にゅうりょくされたIDがありません。<br>ただしいIDをにゅうりょくしてください`;
            } else {
                const nickname = document.getElementById('bl_nickname');
                const inputArea = document.getElementById('bl_inputMode');
                const confirmArea = document.getElementById('bl_confirmMode');

                // ニックネームを表示
                nickname.innerText = data.content;
                // 入力⇔確認画面表示切り替え
                inputArea.classList.add('bl_hidden');
                confirmArea.classList.remove('bl_hidden');
            }
            // ログインボタンの活性化
            loginBtn.classList.remove('bl_clickedLoginBtn');
            // ローダーの非表示
            hideLoader();
        }).catch(function (error) {
            // ローダーの非表示
            hideLoader();
            // ログインボタンの活性化
            loginBtn.classList.remove('bl_clickedLoginBtn');
            // ノーティフィケーションを表示
            loginErrorArea.classList.add('bl_showLoginError');
            // エラーメッセージの文言を入力
            errorMessage.innerHTML = `ネットワークに<ruby>接続<rt>せつぞく</rt></ruby>されているか<ruby>確認<rt>かくにん</rt></ruby>してください`;
        });
    } else {
        // ローダーの非表示
        hideLoader();
        // ノーティフィケーションを表示
        loginErrorArea.classList.add('bl_showLoginError');
        // エラーメッセージの文言を入力
        errorMessage.innerText = 'IDをにゅうりょくしてください';
        // ログインボタンの活性化
        loginBtn.classList.remove('bl_clickedLoginBtn');
    }
}

const loginBtn = document.getElementById('bl_loginBtn');

loginBtn.addEventListener('click', clickLoginBtn);

/* 「はい」ボタン押下時の処理 */
function clickAgreeBtn() {
    // ローダーの表示
    showLoader();
    // フォーム内のテキストフィールド要素を取得
    const textField = document.getElementById('bl_textField');
    // テキストフィールドの値（入力されたID）を取得
    const inputId = textField.value;
    // URLにクエリパラメータを付与して遷移
    location.href = setQueryParams('./menu.html', { id: inputId });
}

const agreeBtn = document.getElementById('bl_agreeBtn');

agreeBtn.addEventListener('click', clickAgreeBtn);

// ユーザーが"Disagree"ボタンをクリックした際に呼ばれる関数
function clickDisagreeBtn() {
    // ローダーの表示
    showLoader();
    // 警告画面へ遷移
    location.href = './alert.html';
}

const disagreeBtn = document.getElementById('bl_disagreeBtn');

disagreeBtn.addEventListener('click', clickDisagreeBtn);

/* ブラウザバック時のローダー非表示 */
window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
        hideLoader();
    }
});