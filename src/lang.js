// src/lang.js
const translations = {
    en: {
        title: "JSON Visualizer",
        textareaPlaceholder: "Insert JSON here...",
        visualize: "Visualize",
        save: "Save JSON",
        load: "Load JSON",
        dell: "Delete JSON",
        renderSync: "Synchronous rendering",
        renderAsync: "Asynchronous rendering (in dev)",
        pleaseWait: "Please Wait...",
        parseErrors: {
            title: "JSON parsing error",
            'Unexpected token': "Unexpected character in JSON",
            'Unexpected end of JSON input': "Incomplete JSON input",
            'Expected \',\' or \']\' after array element': "Expected ',' or ']' after array element in JSON at position",
            'Expected \',\' or \'}\' after object member': "Expected ',' or '}' after object member in JSON at position",
            'Expected \':\' after property name': "Expected ':' after property name in JSON at position",
            'Bad control character in string literal': "Bad control character in string literal in JSON at position",
            'Trailing comma': "Trailing comma in JSON at position",
            'Extra data': "Extra data in JSON at position",
            'Invalid number': "Invalid number in JSON at position",
            'Invalid escape sequence': "Invalid escape sequence in string in JSON at position"
        },
        alerts: {
            saved: "JSON saved",
            'saving error': "Error: entered text is not valid JSON.",
            deleted: "JSON deleted",
            'deleting error': "Error deleting JSON: failed to delete JSON.",
        }
    },
    ru: {
        title: "Визуализатор JSON",
        textareaPlaceholder: "Вставьте JSON сюда...",
        visualize: "Визуализировать",
        save: "Сохранить JSON",
        load: "Загрузить JSON",
        dell: "Удалить JSON",
        renderSync: "Синхронная отрисовка",
        renderAsync: "Асинхронная отрисовка (в разработке)",
        pleaseWait: "Подождите...",
        parseErrors: {
            title: "Ошибка парсинга JSON",
            'Unexpected token': "Неожиданный символ в JSON",
            'Unexpected end of JSON input': "Неполный JSON",
            'Expected \',\' or \']\' after array element': "Ожидался \',\' или \']\' после элемента массива на позиции",
            'Expected \',\' or \'}\' after object member': "Ожидался \',\' или \'}\' после члена объекта на позиции",
            'Expected \':\' after property name': "Ожидался \':\' после имени свойства в JSON на позиции",
            'Bad control character in string literal': "Недопустимый управляющий символ в строке JSON на позиции",
            'Trailing comma': "Лишняя запятая в JSON на позиции",
            'Extra data': "Лишние данные в JSON на позиции",
            'Invalid number': "Неверное число в JSON на позиции",
            'Invalid escape sequence': "Неверная escape-последовательность в строке JSON на позиции"
        },
        alerts: {
            saved: "JSON сохранен",
            'saving error': "Ошибка сохранения: введенный текст не является допустимым JSON.",
            deleted: "JSON удален",
            'deleting error': "Ошибка удаления: не удалось удалить JSON.",
        }
    }
};

function applyLanguage(lang) {
    const t = translations[lang] || translations.en;

    document.querySelector("h1").textContent = t.title;
    document.getElementById("jsonInput").placeholder = t.textareaPlaceholder;
    document.getElementById("visualizeBtn").textContent = t.visualize;
    document.getElementById("saveBtn").textContent = t.save;
    document.getElementById("loadBtn").textContent = t.load;
    document.getElementById("dellBtn").textContent = t.dell;
    document.querySelector('#lang').value = lang;
    document.querySelector("#renderMode option[value='sync']").textContent = t.renderSync;
    document.querySelector("#renderMode option[value='async']").textContent = t.renderAsync;
    document.getElementById("loadingIndicator").textContent = t.pleaseWait;
}

function translateJSONError(message, lang = 'en', category = 'parseErrors') {
    for (const key in translations[lang][category])
        if (message.includes(key))
            return translations[lang][category][key];

    // Check if the error is about the position, then try to process it
    const match = message.match(/Expected ',' or '[\]\}]' after (array|object) element in JSON at position (\d+) \(line (\d+) column (\d+)\)/);
    if (match)
    {
        const element = match[1] === 'array' ? 'элемент массива' : 'член объекта';
        const pos = match[2];
        const line = match[3];
        const column = match[4];

        return lang === 'ru'
            ? `Ожидался \',\' или \'}\' после ${element} в JSON на позиции ${pos} (строка ${line}, столбец ${column})`
            : `Expected ',' or ']' after ${element} in JSON at position ${pos} (line ${line}, column ${column})`;
    }

    // Check for missing colon after property name
    const colonMatch = message.match(/Expected ':' after property name in JSON at position (\d+) \(line (\d+) column (\d+)\)/);
    if (colonMatch)
    {
        const pos = colonMatch[1];
        const line = colonMatch[2];
        const column = colonMatch[3];

        return lang === 'ru'
            ? `Ожидался \':\' после имени свойства в JSON на позиции ${pos} (строка ${line}, столбец ${column})`
            : `Expected ':' after property name in JSON at position ${pos} (line ${line}, column ${column})`;
    }

    return lang === 'ru' ? 'Неизвестная ошибка JSON' : 'Unknown JSON error';
}

// displayError is used to show the error message in the UI
function displayError(message, lang = 'en') {
    const localizedMessage = translateJSONError(message, lang);
    const errorHeader = translateJSONError('title', lang);

    const errorDiv = document.createElement('div');
    errorDiv.className = 'bg-red-100 border border-red-300 text-red-800 p-4 rounded-lg transition-all duration-300';
    errorDiv.innerHTML = `<div class="text-red-600 font-semibold">${errorHeader}:</div>`;
    errorDiv.innerHTML += `<div class="text-red-500 mt-1">${localizedMessage}</div>`;

    return errorDiv;
}

// Init on page load
const lang = localStorage.getItem("lang") || "en";
applyLanguage(lang);

// Lang switch
window.setLanguage = (lang) => {
    localStorage.setItem("lang", lang);
    applyLanguage(lang);
};