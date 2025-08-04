// Apps Script Web App URL
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwqnTAdVlht0fbSngWpfGsxnd3C9_ngTYTlathpfqgedneiXjYvhIY-6Mj8anfN5yPrlA/exec';

const accessForm = document.getElementById('access-form');
const emailInput = document.getElementById('email-input');
const submitButton = document.getElementById('submit-button');
const resultContainer = document.getElementById('result-container');

accessForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    submitButton.disabled = true;
    submitButton.textContent = 'Verifying...';
    resultContainer.innerHTML = '';
    console.log("Attempting to fetch from backend...");

    try {
        const response = await fetch(WEB_APP_URL, {
            method: 'POST',
           // mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: emailInput.value }),
        });
        
        // DEBUG: Log the raw response from the server
        console.log("Raw Server Response:", response);
        
        if (!response.ok) {
            // DEBUG: If response is not OK (e.g., 404, 500), log the text
            const errorText = await response.text();
            console.error("Server responded with an error:", response.status, errorText);
            throw new Error(`Server error: ${response.status}`);
        }

        const result = await response.json();
        
        // DEBUG: Log the parsed JSON result
        console.log("Parsed JSON Result:", result);

        if (result.error) {
            resultContainer.innerHTML = `<p class="error">${result.error}</p>`;
        } else if (result.docs) {
            let docListHtml = '<h2>Available Documents</h2><ul>';
            result.docs.forEach(doc => {
                docListHtml += `<li><a href="${doc.link}" target="_blank">${doc.title}</a></li>`;
            });
            docListHtml += '</ul>';
            resultContainer.innerHTML = docListHtml;
        } else {
            resultContainer.innerHTML = `<p>An unexpected data format was received.</p>`;
        }
        
    } catch (error) {
        // DEBUG: Log the exact error that occurred during the fetch/parsing
        console.error("Fetch failed:", error);
        resultContainer.innerHTML = `<p class="error">An unexpected error occurred. Please try again later.</p>`;
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Get Documents';
    }
});
