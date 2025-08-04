// Apps Script Web App URL
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzn4aCUHJ2DxFv5uKOSCoaIZnfXTv42Bzyk9C3BAD_MJoIGpXjo3wCN1PJhfZXUt8WieQ/exec';


const accessForm = document.getElementById('access-form');
const emailInput = document.getElementById('email-input');
const submitButton = document.getElementById('submit-button');
const resultContainer = document.getElementById('result-container');
const captchaSlider = document.getElementById('captcha-slider');
const captchaLabel = document.getElementById('captcha-label');

// --- START OF NEW SLIDER LOGIC ---

// Disable the submit button by default.
submitButton.disabled = true;

captchaSlider.addEventListener('input', () => {
    // Check if the slider is at the very end.
    if (parseInt(captchaSlider.value) === 100) {
        submitButton.disabled = false;
        captchaLabel.textContent = '✅ Verified!';
        captchaLabel.style.color = '#28a745'; // Green color for success
    } else {
        // If the user slides back, disable the button again.
        submitButton.disabled = true;
        captchaLabel.textContent = 'Slide to enable submission';
        captchaLabel.style.color = '#495057'; // Default color
    }
});

// --- END OF NEW SLIDER LOGIC ---


// This is the global function that the Google Script will call.
window.handleResponse = function(response) {
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

    // --- MODIFICATION ---
    // Reset the form state after getting a response.
    submitButton.disabled = true;
    submitButton.textContent = 'Get Documents';
    captchaSlider.value = 0; // Reset slider
    captchaLabel.textContent = 'Slide to enable submission';
    captchaLabel.style.color = '#495057';
}

accessForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // The button is already enabled by the slider, so we just show the loading state.
    submitButton.disabled = true;
    submitButton.textContent = 'Verifying...';
    resultContainer.innerHTML = '';

    const userEmail = emailInput.value;
    const requestUrl = `${WEB_APP_URL}?callback=handleResponse&email=${encodeURIComponent(userEmail)}`;

    const oldScript = document.getElementById('jsonp-script');
    if (oldScript) {
        oldScript.remove();
    }

    const script = document.createElement('script');
    script.id = 'jsonp-script';
    script.src = requestUrl;

    script.onerror = function() {
        resultContainer.innerHTML = `<p class="error">Failed to communicate with the server. Please check your network connection.</p>`;
        // --- MODIFICATION ---
        // Reset the form state on error.
        submitButton.disabled = true;
        submitButton.textContent = 'Get Documents';
        captchaSlider.value = 0;
        captchaLabel.textContent = 'Slide to enable submission';
        captchaLabel.style.color = '#495057';
    };
    
    document.body.appendChild(script);
});

