const {
    app,
    BrowserWindow,
    Menu,
    Tray,
    nativeImage,
} = require("electron");
const windowMaker = require('./window');
const notification = require('./notification');

let tray;
let win;

const icon2 = nativeImage.createFromPath(
    app.getAppPath() + "/electron/icons/app.png"
);

const ico = nativeImage.createFromPath(
    app.getAppPath() + "/electron/icons/app.ico"
);

if (require('electron-squirrel-startup')) {
    app.quit();
}

const setupEvents = require('./installer/setup-events')
if (setupEvents.handleSquirrelEvent()) {
    process.exit()
}

app.whenReady().then(() => {
    win = windowMaker.createWindow()
    notification.createNotification();
    createTray();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            win = windowMaker.createWindow()
        }
        app.setBadgeCount(0);
    });

    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") {
            //app.quit();
        }
    });

    if (process.platform === "darwin") {
        app.dock.setIcon(icon2);
    }
});

function createTray() {
    tray = new Tray(ico);

    const contextMenu = Menu.buildFromTemplate([
        {
            label: "디웍스 열기",
            click: handleShowClickTray
        },
        {
            label: "종료",
            click: handleCloseClickTray
        },
        {
            label: "v" + app.getVersion()
        }
    ]);

    tray.setToolTip("DWORKS");
    tray.setContextMenu(contextMenu);
}

async function handleCloseClickTray() {
    //await localStorage.removeItem('ADMIN_authInfo');
    win.close();
    app.quit();
    app.exit();
}

async function handleShowClickTray() {
    if (BrowserWindow.getAllWindows().length === 0) {
        win = windowMaker.createWindow()
    } else {
        win.show();
    }
}
