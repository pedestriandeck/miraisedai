/** アカウント一覧 **/

/* ↓開発用URL */
const IDLIST_GAS_URL = 'https://script.google.com/macros/s/AKfycbyu4JVtJzrqj4oiwhWebuScxrZK8wnCaXJ3ufNQM0If9BWpX4Vj1BJhRUkNIGkC04k/exec';
/* ↑開発用URL */
var userDataList = [];

window.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('bal_searchInput');

    createLoader('よみこみ<ruby>中<rt>ちゅう</rt></ruby>');
    getAllUsers();

    searchInput.addEventListener('input', function () {
        const sujestList = document.getElementById('bal_seachSujestList');
        sujestList.parentElement.classList.add('bal_hideSeachSujest');
        sujestList.innerHTML = '';

        const uniqueNames = Array.from(new Set(userDataList.map(user => user.userName))).sort();

        if (this.value) {
            for (let i = 0; i < uniqueNames.length; i++) {
                if (String(uniqueNames[i]).includes(this.value)) {
                    let li = document.createElement('li');

                    li.innerHTML = `
                        <p>${uniqueNames[i]}</p>
                    `;

                    li.addEventListener('click', clickSujest);
                    sujestList.appendChild(li);
                    sujestList.parentElement.classList.remove('bal_hideSeachSujest');
                }
            }
        }

        function clickSujest() {
            const searchInput = document.getElementById('bal_searchInput');
            const sujestList = document.getElementById('bal_seachSujestList');

            searchInput.value = this.firstElementChild.innerText;
            sujestList.parentElement.classList.add('bal_hideSeachSujest');
        }
    });
});

async function getAllUsers() {
    showLoader();

    const newUrl = setQueryParams(IDLIST_GAS_URL, { action: 'getAllUsers' });

    try {
        const response = await fetch(newUrl);
        const result = await response.json();

        if (result.message) {
            console.log('サーバーエラー発生');
            console.log(result.message);
        } else {
            displayAllUsers(result.result);
        }
    } catch (e) {
        console.log('エラー発生');
        console.log(e);
    } finally {
        hideLoader();
    }
}

// 全てのユーザーを表示する関数
function displayAllUsers(users) {
    const userList = document.getElementById('bal_userList');

    for (let i = 0; i < users.length; i++) {
        userDataList.push(
            {
                userId: users[i].userId,
                userName: users[i].userName,
                birthday: users[i].birthday,
                timestamp: users[i].timestamp
            }
        );

        let li = document.createElement('li');
        li.innerHTML = `
            <div class="bal_userCard">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M31.5 19C31.5 20.9891 30.7098 22.8968 29.3033 24.3033C27.8968 25.7098 25.9891 26.5 24 26.5C22.0109 26.5 20.1032 25.7098 18.6967 24.3033C17.2902 22.8968 16.5 20.9891 16.5 19C16.5 17.0109 17.2902 15.1032 18.6967 13.6967C20.1032 12.2902 22.0109 11.5 24 11.5C25.9891 11.5 27.8968 12.2902 29.3033 13.6967C30.7098 15.1032 31.5 17.0109 31.5 19Z" fill="#585858" />
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M4 24C4 18.6957 6.10714 13.6086 9.85786 9.85786C13.6086 6.10714 18.6957 4 24 4C29.3043 4 34.3914 6.10714 38.1421 9.85786C41.8929 13.6086 44 18.6957 44 24C44 29.3043 41.8929 34.3914 38.1421 38.1421C34.3914 41.8929 29.3043 44 24 44C18.6957 44 13.6086 41.8929 9.85786 38.1421C6.10714 34.3914 4 29.3043 4 24ZM24 6.5C20.7044 6.50018 17.4759 7.43091 14.686 9.18507C11.8961 10.9392 9.65821 13.4455 8.22991 16.4155C6.80161 19.3854 6.24097 22.6983 6.6125 25.9729C6.98403 29.2474 8.27263 32.3505 10.33 34.925C12.105 32.065 16.0125 29 24 29C31.9875 29 35.8925 32.0625 37.67 34.925C39.7274 32.3505 41.016 29.2474 41.3875 25.9729C41.759 22.6983 41.1984 19.3854 39.7701 16.4155C38.3418 13.4455 36.1039 10.9392 33.314 9.18507C30.5241 7.43091 27.2956 6.50018 24 6.5Z" fill="#585858" />
                </svg>
                <div class="bal_userCardRight">
                    <table>
                        <tbody>
                            <tr>
                                <th>
                                    <p class="bal_typo_userCard">ユーザーID</p>
                                </th>
                                <td>
                                    <p class="bal_typo_userCard">${users[i].userId}</p>
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <p class="bal_typo_userCard">ニックネーム</p>
                                </th>
                                <td>
                                    <p class="bal_typo_userCard">${users[i].userName}</p>
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <p class="bal_typo_userCard">誕生日（日）</p>
                                </th>
                                <td>
                                    <p class="bal_typo_userCard">${users[i].birthday}</p>
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <p class="bal_typo_userCard">ID登録日時</p>
                                </th>
                                <td>
                                    <p class="bal_typo_userCard">${formatDate(new Date(users[i].timestamp))}</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        userList.appendChild(li);
    }

    userDataList.sort((a, b) => {
        return b.userId - a.userId;
    });

    const searchBtn = document.getElementById('bal_searchBtn');

    searchBtn.addEventListener('click', function () {
        const searchInput = document.getElementById('bal_searchInput');

        if (!searchInput.value) {
            return;
        }

        showLoader();

        const userList = document.getElementById('bal_userList');
        console.log('userList.className');
        console.log(userList.className);
        
        for (let i = 0; i < userList.children.length; i++) {
            if (!userList.children.items(i).getElementsByClassName('bal_typo_userCard')[0].innerText.incluedes(searchInput.value)) {
                userList.children.items(i).classList.add('bal_userListHidden');
            }
        }

        hideLoader();
    });
}

// 日付をフォーマットする関数
function formatDate(date) {
    // 出力文字列を初期化
    let output = '';

    // 年、月、日、時、分、秒を取得
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    // 出力文字列を組み立て
    output = year + '/' + month + '/' + day + ' ' + hours + ':' + minutes;

    // フォーマット済みの日付文字列を返す
    return output;
}