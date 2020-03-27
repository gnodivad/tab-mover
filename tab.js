browser.commands.onCommand.addListener((command) => {
    if (command === "move-tabs") {
        browser.tabs.query({ currentWindow: true, active: true }).then((tabInfo) => {
            moveCurrentTabToWindow(tabInfo[0]);
        })
    }
});

async function moveCurrentTabToWindow({ id, windowId }) {
    let allWindows = await browser.windows.getAll({
        windowTypes: ["normal"]
    });

    if (allWindows.length <= 1) {
        return;
    }

    let allWindowId = allWindows.map(({ id }) => id);

    let nextWindowId = allWindowId[(allWindowId.indexOf(windowId) + 1) % allWindows.length];

    browser.tabs.move(id, { index: -1, windowId: nextWindowId });
}