/** アカウント確認 **/
const transmission = getQueryParams('id');

window.addEventListener('DOMContentLoaded', function () {
    document.getElementsByTagName('main')[0].innerHTML = document.getElementsByTagName('main')[0].innerHTML + '<p>' + transmission + '</p>';
});