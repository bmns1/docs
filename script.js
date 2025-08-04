// Web Apps Script Web App URL
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwqnTAdVlht0fbSngWpfGsxnd3C9_ngTYTlathpfqgedneiXjYvhIY-6Mj8anfN5yPrlA/exec';

const accessForm = document.getElementById('access-form');
const emailInput = document.getElementById('email-input');
const submitButton = document.getElementById('submit-button');
const resultContainer = document.getElementById('result-container');

accessForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent page reload
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Verifying...';
    resultContainer.innerHTML = '';
    
    try {
        const response = await fetch(WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors', // Important for cross-origin requests
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: emailInput.value }),
        });
        
        const result = await response.json();
        
        if (result.error) {
            resultContainer.innerHTML = `<p class="error">${result.error}</p>`;
        } else if (result.docs && result.docs.length > 0) {
            let docListHtml = '<h2>Available Documents</h2><ul>';
            result.docs.forEach(doc => {
                docListHtml += `<li><a href="${doc.link}" target="_blank">${doc.title}</a></li>`;
            });
            docListHtml += '</ul>';
            resultContainer.innerHTML = docListHtml;
        } else {
            resultContainer.innerHTML = `<p>No documents found.</p>`;
        }
        
    } catch (error) {
        resultContainer.innerHTML = `<p class="error">An unexpected error occurred. Please try again later.</p>`;
    } finally {
        // Reset button state
        submitButton.disabled = false;
        submitButton.textContent = 'Get Documents';
    }
});
