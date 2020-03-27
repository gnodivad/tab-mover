browser.commands.onCommand.addListener(async (command) => {
    if (command === "move-tabs") {
        const tabInfo = await browser.tabs.query({ currentWindow: true, active: true });
        moveCurrentTabToWindow(tabInfo[0]);
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

function focusOnMovedTab({ id, windowId }) {
    browser.tabs.update(id, { active: true });
    browser.windows.update(windowId, { focused: true });
}