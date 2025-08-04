// Apps Script Web App URL
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzn4aCUHJ2DxFv5uKOSCoaIZnfXTv42Bzyk9C3BAD_MJoIGpXjo3wCN1PJhfZXUt8WieQ/exec';

const accessForm = document.getElementById('access-form');
const emailInput = document.getElementById('email-input');
const submitButton = document.getElementById('submit-button');
const resultContainer = document.getElementById('result-container');

// This is the global function that the Google Script will call.
// We attach it to the `window` object to make sure it's accessible.
window.handleResponse = function(response) {
    // This function runs after the server sends back its data.
    if (response.error) {
        resultContainer.innerHTML = `<p class="error">${response.error}</p>`;
    } else if (response.docs) {
        let docListHtml = '<h2>Available Documents</h2><ul>';
        response.docs.forEach(doc => {
            docListHtml += `<li><a href="${doc.link}" target="_blank">${doc.title}</a></li>`;
        });
        docListHtml += '</ul>';
        resultContainer.innerHTML = docListHtml;
    }

    // Re-enable the button
    submitButton.disabled = false;
    submitButton.textContent = 'Get Documents';
}

accessForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    submitButton.disabled = true;
    submitButton.textContent = 'Verifying...';
    resultContainer.innerHTML = '';

    // Create the full URL with parameters for the JSONP request.
    const userEmail = emailInput.value;
    const requestUrl = `${WEB_APP_URL}?callback=handleResponse&email=${encodeURIComponent(userEmail)}`;

    // Remove any old script tag if it exists, to avoid conflicts.
    const oldScript = document.getElementById('jsonp-script');
    if (oldScript) {
        oldScript.remove();
    }

    // This is the JSONP technique: create a <script> tag.
    // The browser will execute the JavaScript returned by the server.
    const script = document.createElement('script');
    script.id = 'jsonp-script';
    script.src = requestUrl;

    // Add an error handler in case the script fails to load (e.g., network error)
    script.onerror = function() {
        resultContainer.innerHTML = `<p class="error">Failed to communicate with the server. Please check your network connection.</p>`;
        submitButton.disabled = false;
        submitButton.textContent = 'Get Documents';
    };
    
    // Add the script to the page to trigger the request.
    document.body.appendChild(script);
});
