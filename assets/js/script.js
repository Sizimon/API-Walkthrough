const API_KEY = 'ONjVlSmS6mM2R2VrNg-KUNMxeVQ';
const API_URL = 'https://ci-jshint.herokuapp.com/api';
const resultsModal = new bootstrap.Modal(document.getElementById('resultsModal'))

document.getElementById('status').addEventListener('click', e => getStatus(e));
document.getElementById('submit').addEventListener('click', e => postForm(e));

async function postForm(e) {

    const form = new FormData(document.getElementById('checksform'));
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Authorization": API_KEY,
        },
        body: form,
    });
    const data = await response.json();
    if (response.ok) {
        displayErrors(data);
    } else {
        throw new Error(data.error);
    }
}

function displayErrors(data) {

    const heading = `JSHint results for ${data.file}`;

    if (data.total_errors === 0) {
        results = `<div class='no_errors'>No Errors Reported!</div>`;
    } else {
        results = `<div>Total errors:<span class='error_count'>${data.total_errors}</span></div>`
        for (let error of data.error_list) {
            results += `<div>At line<span class='line'>${error.line}</span>, `;
            results += `column <span class='column'>${error.col}</span></div>`;
            results += `<div class='error'>${error.error}</div>`
        }
    }
    document.getElementById('resultsModalTitle').innerText = heading;
    document.getElementById('results-content').innerText = results;
    resultsModal.show();
}

async function getStatus(e) {

    const queryString = `${API_URL}?api_key=${API_KEY}`;

    const response = await fetch(queryString);

    const data = await response.json();

    if (response.ok) {
        displayStatus(data);
    } else {
        throw new Error(data.error);
    }
}

function displayStatus(data) {
    const header = document.getElementById('resultsModalTitle');
    const body = document.getElementById('results-content');

    header.innerText = 'API Key Status';
    body.innerText = `Your key is valid until ${data.expiry}`;

    resultsModal.show();
}

