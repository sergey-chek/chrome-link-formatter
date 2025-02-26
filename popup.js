document.addEventListener('DOMContentLoaded', function () {
    const btnJira = document.getElementById('btnJira');
    const btnJiraShort = document.getElementById('btnJiraShort');
    const btnSlack = document.getElementById('btnSlack');
    const btnSlackShort = document.getElementById('btnSlackShort');

    let currentTitle = '';
    let currentUrl = '';

    // Get the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const activeTab = tabs[0];
        currentTitle = activeTab.title || '';
        currentUrl = activeTab.url || '';
    });

    // Button handlers

    // Jira (full)
    btnJira.addEventListener('click', function () {
        const safeTitle = sanitizeTitleForJira(currentTitle);
        const jiraLink = `[${safeTitle}|${currentUrl}]`;
        copyToClipboard(jiraLink, btnJira);
    });

    // Jira Short
    btnJiraShort.addEventListener('click', function () {
        // Sanitize the original title
        let safeTitle = sanitizeTitleForJira(currentTitle);
        // Truncate to 20 chars (with "...")
        safeTitle = shortifyTitle(safeTitle, 35);
        // Build the link
        const jiraLink = `[${safeTitle}|${currentUrl}]`;
        copyToClipboard(jiraLink, btnJiraShort);
    });

    // Slack (full)
    btnSlack.addEventListener('click', function () {
        const safeTitle = sanitizeTitleForSlack(currentTitle);
        const slackLink = `[${safeTitle}](${currentUrl})`;
        copyToClipboard(slackLink, btnSlack);
    });

    // Slack Short
    btnSlackShort.addEventListener('click', function () {
        // Sanitize
        let safeTitle = sanitizeTitleForSlack(currentTitle);
        // Truncate
        safeTitle = shortifyTitle(safeTitle, 35);
        // Build
        const slackLink = `[${safeTitle}](${currentUrl})`;
        copyToClipboard(slackLink, btnSlackShort);
    });


    // Copy and feedback

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

        button.textContent = 'Copied!';
        button.style.backgroundColor = 'oklch(0.648 0.2 131.684)';

        setTimeout(() => {
            // Restore original values
            button.textContent = originalText;
            button.style.backgroundColor = originalBg;
        }, 1000);
    }

    // shortify title
    function shortifyTitle(title, maxLen) {
        if (title.length > maxLen) {
            return title.slice(0, maxLen) + '...';
        }
        return title;
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
