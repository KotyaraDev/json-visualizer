// src/database.js
const textarea = document.getElementById('jsonInput');
const saveBtn = document.getElementById('saveBtn');
const loadBtn = document.getElementById('loadBtn');
const dellBtn = document.getElementById('dellBtn');

// Check if there's saved JSON in localStorage and load it
function loadJsonFromLocalStorage() {
    const savedJson = localStorage.getItem('userJson');
    if (savedJson)
        textarea.value = savedJson;
}

// Save the JSON to localStorage when the user clicks "Save"
saveBtn.addEventListener('click', () => {
    const lang = localStorage.getItem('lang') || 'en';  // Get current language
    let langMessage = translateJSONError('saved', lang, 'alerts');

    try {
        const jsonData = textarea.value;

        // Check if the entered text is valid JSON
        JSON.parse(jsonData); // If it's not valid JSON, this will throw an error

        // Save valid JSON to localStorage
        localStorage.setItem('userJson', jsonData);
        alert(langMessage);
    } catch (error) {
        let langMessage = translateJSONError('saving error', lang, 'alerts');
        alert(langMessage);
    }
});

// Load the JSON from localStorage when the user clicks "Load"
loadBtn.addEventListener('click', loadJsonFromLocalStorage);

// Delete the JSON on localStorage when the user clicks "Delete"
dellBtn.addEventListener('click', () => {
    const lang = localStorage.getItem('lang') || 'en';  // Get current language
    let langMessage = translateJSONError('deleted', lang, 'alerts');

    try {
        localStorage.removeItem('userJson');
        alert(langMessage);
    } catch (error) {
        let langMessage = translateJSONError('deleting error', lang, 'alerts');
        alert(langMessage);
    }
});

// Load saved JSON when the page is loaded (if any)
window.onload = loadJsonFromLocalStorage;