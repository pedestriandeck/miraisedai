const depositAmount = document.getElementsByClassName('test_detail_depositAmount')[0];
const balanceAmount = document.getElementsByClassName('test_detail_balanceAmount')[0];
const apiURL = 'https://script.google.com/macros/s/AKfycbw5gk2RTtESqAjUBkeQvo_MRHaUQL4sZaNc0AO2XcQ/dev';

let postparam = {
    "method": "POST",
    "mode": "no-cors",
    "Content-Type": "application/x-www-form-urlencoded"
    // "body": JSON.stringify(SendDATA)
}

async function setAmountList() {
    const response = await fetch(apiURL,postparam);
    const data = response.json();
    console.log(data);

    for(let i = 0; i <= data.length; i++){
        let new_element = document.createElement('p');
        new_element.textContent = data.amount;
        depositAmount.appendChild(new_element);
    }
}

setAmountList();