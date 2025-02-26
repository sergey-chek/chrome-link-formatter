document.addEventListener('DOMContentLoaded', function () {
    const btnJira = document.getElementById('btnJira');
    const btnSlack = document.getElementById('btnSlack');

    let currentTitle = '';
    let currentUrl = '';

    // Получаем активную вкладку
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const activeTab = tabs[0];
        currentTitle = activeTab.title || '';
        currentUrl = activeTab.url || '';
    });

    // Обработчики кнопок
    btnJira.addEventListener('click', function () {
        const safeTitle = sanitizeTitleForJira(currentTitle);
        const jiraLink = `[${safeTitle}|${currentUrl}]`;
        copyToClipboard(jiraLink, btnJira);
    });

    btnSlack.addEventListener('click', function () {
        // Тот же Markdown-формат, что и Confluence
        const safeTitle = sanitizeTitleForSlack(currentTitle);
        const slackLink = `[${safeTitle}](${currentUrl})`;
        copyToClipboard(slackLink, btnSlack);
    });


    function copyToClipboard(text, button) {
        navigator.clipboard.writeText(text).then(() => {
            showCopiedOnButton(button);
        }).catch(err => {
            console.error('Ошибка копирования:', err);
        });
    }


    function showCopiedOnButton(button) {
        const originalText = button.textContent;
        const originalBg = getComputedStyle(button).backgroundColor;

        // Меняем текст и фон
        button.textContent = 'Скопировано!';
        button.style.backgroundColor = 'oklch(0.648 0.2 131.684)';

        setTimeout(() => {
            // Восстанавливаем исходные значения
            button.textContent = originalText;
            button.style.backgroundColor = originalBg;
        }, 1000);
    }

    // Функции очистки "опасных" символов
    function sanitizeTitleForJira(title) {
        return title
            .replace(/[{}]/g, '')
            .replace(/\|/g, '¦')
            .replace(/\[/g, '(')
            .replace(/\]/g, ')');
    }

    function sanitizeTitleForSlack(title) {
        return title
            .replace(/\[/g, '(')
            .replace(/\]/g, ')')
            .replace(/\(/g, '{')
            .replace(/\)/g, '}');
    }
});
