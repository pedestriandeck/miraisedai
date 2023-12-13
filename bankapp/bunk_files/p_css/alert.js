/** 警告 **/
/* ブラウザバック時のローダー非表示 */
window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
        hideLoader();
    }
});