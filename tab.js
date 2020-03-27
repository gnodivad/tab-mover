browser.commands.onCommand.addListener((command) => {
    if (command === "move-tabs") {
        browser.tabs.query({ currentWindow: true, active: true }).then((tabInfo) => {
            moveCurrentTabToWindow(tabInfo[0]);
        })
    }
});

async function moveCurrentTabToWindow({ id, windowId }) {
    const allWindows = await browser.windows.getAll({
        windowTypes: ["normal"]
    });

    if (allWindows.length <= 1) {
        return;
    }

    const windowIds = allWindows.map(({ id }) => id);
    const nextWindowId = windowIds[(windowIds.indexOf(windowId) + 1) % allWindows.length];

    const tabs = await browser.tabs.move(id, { index: -1, windowId: nextWindowId });

    focusOnMovedTab(tabs[0]);
}

function focusOnMovedTab({ index, windowId }) {
    browser.tabs.highlight({ windowId: windowId, tabs: index });
}