document.addEventListener('DOMContentLoaded', function () {
    const btnJira = document.getElementById('btnJira');
    const btnSlack = document.getElementById('btnSlack');

    let currentTitle = '';
    let currentUrl = '';

    // Get the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const activeTab = tabs[0];
        currentTitle = activeTab.title || '';
        currentUrl = activeTab.url || '';
    });

    // Button handlers
    btnJira.addEventListener('click', function () {
        const safeTitle = sanitizeTitleForJira(currentTitle);
        const jiraLink = `[${safeTitle}|${currentUrl}]`;
        copyToClipboard(jiraLink, btnJira);
    });

    btnSlack.addEventListener('click', function () {
        const safeTitle = sanitizeTitleForSlack(currentTitle);
        const slackLink = `[${safeTitle}](${currentUrl})`;
        copyToClipboard(slackLink, btnSlack);
    });


    function copyToClipboard(text, button) {
        navigator.clipboard.writeText(text).then(() => {
            showCopiedOnButton(button);
        }).catch(err => {
            console.error('Copy error:', err);
        });
    }


    function showCopiedOnButton(button) {
        const originalText = button.textContent;
        const originalBg = getComputedStyle(button).backgroundColor;

        // Меняем текст и фон
        button.textContent = 'Copied!';
        button.style.backgroundColor = 'oklch(0.648 0.2 131.684)';

        setTimeout(() => {
            // Restoring original values
            button.textContent = originalText;
            button.style.backgroundColor = originalBg;
        }, 1000);
    }

    // Functions for sanitizing "dangerous" characters
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
