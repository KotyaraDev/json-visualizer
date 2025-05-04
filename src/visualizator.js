// src/visualizator.js
function isExpandable(value) {
    if (Array.isArray(value)) return value.some(item => typeof item === 'object' && item !== null);
    else return typeof value === 'object' && value !== null;
}

// Rendering JSON tree (synchronous)
function renderTree(obj, depth = 0, parentPath = '', visitedPaths = new Set()) {
    const container = document.createElement('div');
    container.style.paddingLeft = `${depth * 1.5}rem`;

    if (Array.isArray(obj))
    {
        obj.forEach((item, index) => {
            const currentPath = `${parentPath}[${index}]`;

            // Check if we have already visited this path to prevent infinite recursion
            if (visitedPaths.has(currentPath)) return;

            visitedPaths.add(currentPath);

            const line = document.createElement('div');
            line.className = 'mb-2 flex flex-wrap';

            const expandBtn = isExpandable(item) ? `<button class="text-blue-600">[${index}]</button>` : '';
            line.innerHTML = `<div class="flex flex-col sm:flex-row sm:items-center gap-1"><span class="break-all text-gray-400">${currentPath}</span>: ${expandBtn}</div>`;
            container.appendChild(line);

            const nestedContainer = document.createElement('div');
            nestedContainer.classList.add('max-h-0', 'overflow-hidden', 'transition-all', 'duration-500');
            container.appendChild(nestedContainer);

            if (isExpandable(item))
            {
                const nestedContainer = document.createElement('div');
                nestedContainer.classList.add('max-h-0', 'overflow-hidden', 'transition-all', 'duration-500');
                container.appendChild(nestedContainer);
              
                renderTree(item, depth + 1, currentPath, visitedPaths).then(nestedTree => nestedContainer.appendChild(nestedTree));

                line.querySelector('button')?.addEventListener('click', () => {
                    nestedContainer.classList.toggle('max-h-0');
                    nestedContainer.classList.toggle('max-h-[1000px]');
                });
            } else {
                const typeClass = getTypeColor(item);
                line.innerHTML += ` <span class="${typeClass}">${JSON.stringify(item)}</span>`;
            }
        });
    }
    else
    {
        for (const key in obj)
        {
            const value = obj[key];
            const currentPath = parentPath ? `${parentPath}.${key}` : key;

            if (visitedPaths.has(currentPath)) continue;

            visitedPaths.add(currentPath);

            const line = document.createElement('div');
            line.className = 'mb-2';

            const expandBtn = (typeof value === 'object' && value !== null) ? `<button class="text-blue-600">{...}</button>` : '';
            line.innerHTML = `<span class="text-gray-400">${currentPath}</span>: ${expandBtn}`;
            container.appendChild(line);

            if (typeof value === 'object' && value !== null)
            {
                const nestedContainer = document.createElement('div');
                nestedContainer.classList.add('max-h-0', 'overflow-hidden', 'transition-all', 'duration-500');
                container.appendChild(nestedContainer);

                renderTree(value, depth + 1, currentPath, visitedPaths).then((nestedTree) => nestedContainer.appendChild(nestedTree));

                line.querySelector('button').addEventListener('click', () => {
                    nestedContainer.classList.toggle('max-h-0');
                    nestedContainer.classList.toggle('max-h-[1000px]');
                });
            }
            else
            {
                const typeClass = getTypeColor(value);
                line.innerHTML += ` <span class="${typeClass}">${JSON.stringify(value)}</span>`;
            }
        }
    }

    return Promise.resolve(container);
}

// Rendering JSON tree (asynchronous) (to fix later)
function renderTreeAsync(obj, depth = 0, parentPath = '', visitedPaths = new Set()) {
    return renderTree(obj, depth, parentPath, visitedPaths);

    // Yeah, I know this code is commented out, but I left it here for future reference
    // It's not working as expected, but I will fix it later

    // const container = document.createElement('div');
    // container.classList.add('pl-' + depth * 4);

    // let index = 0;
    // const renderNext = (data) => {
    //     if (index >= data.length) return Promise.resolve(container);
    //     return new Promise((resolve) => {
    //         setTimeout(() => {
    //             const item = data[index];
    //             const currentPath = `${parentPath}[${index}]`;

    //             // Check if we have already visited this path to prevent infinite recursion
    //             if (visitedPaths.has(currentPath)) {
    //                 index++;
    //                 return resolve(renderNext(data)); // Skip this item
    //             }

    //             visitedPaths.add(currentPath);

    //             const line = document.createElement('div');
    //             line.className = 'mb-1';

    //             const expandBtn = `<button class="text-blue-600">[${index}]</button>`;
    //             line.innerHTML = `<span class="text-gray-400">${currentPath}</span>: ${expandBtn}`;
    //             container.appendChild(line);

    //             const nestedContainer = document.createElement('div');
    //             nestedContainer.classList.add('max-h-0', 'overflow-hidden', 'transition-all', 'duration-500');
    //             container.appendChild(nestedContainer);

    //             // If it's an object, render it
    //             if (typeof item === 'object' && item !== null) renderTreeAsync(item, depth + 1, currentPath, visitedPaths).then((nestedTree) => nestedContainer.appendChild(nestedTree));
    //             else {
    //                 const typeClass = getTypeColor(item);
    //                 line.innerHTML += ` <span class="${typeClass}">${JSON.stringify(item)}</span>`;
    //             }

    //             line.querySelector('button').addEventListener('click', () => {
    //                 nestedContainer.classList.toggle('max-h-0');
    //                 nestedContainer.classList.toggle('max-h-[1000px]');
    //             });

    //             index++;
    //             resolve(renderNext(data));
    //         }, 0); // Use setTimeout to prevent UI blocking
    //     });
    // };

    // return renderNext(Array.isArray(obj) ? obj : [obj]);
}

// Function to get color based on the type of the value
function getTypeColor(value) {
    const type = typeof value;
    return {
      string: 'text-green-600',
      number: 'text-blue-600',
      boolean: 'text-yellow-600',
      object: 'text-gray-500'
    }[type] || 'text-gray-600';
}

// Event listener for the "Visualize" button
document.getElementById('visualizeBtn').addEventListener('click', () => {
    const inputElem = document.getElementById('jsonInput');
    const input = inputElem.value;
    const output = document.getElementById('output');
    const loadingIndicator = document.getElementById('loadingIndicator');
  
    output.innerHTML = '';
    loadingIndicator.classList.remove('hidden');
  
    try {
        const parsed = JSON.parse(input);
        if (typeof parsed !== 'object' || parsed === null)
            throw new Error('Корневой элемент должен быть объектом или массивом (Array или Object).');

        const renderMode = document.getElementById('renderMode')?.value || 'sync';
        const renderFunction = renderMode === 'async' ? renderTreeAsync : renderTree;

        // Render the JSON tree
        renderFunction(parsed).then((tree) => {
            loadingIndicator.classList.add('hidden');
            output.appendChild(tree);
        });

        // Remove previous error highlight if any
        inputElem.classList.remove('border-red-500');
    } catch (e) {
        loadingIndicator.classList.add('hidden');
    
        const lang = localStorage.getItem('lang') || 'en';  // Get current language
        const errorDiv = displayError(e.message, lang, 'parseErrors');

        output.innerHTML = '';
        output.appendChild(errorDiv);
  
        // Highlight textarea border and scroll to line
        inputElem.classList.add('border-red-500', 'animate-pulse');
        setTimeout(() => inputElem.classList.remove('animate-pulse'), 1000);
    }
});  