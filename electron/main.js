const {
    app,
    BrowserWindow,
    Menu,
    Tray,
    nativeImage,
    ipcRenderer
} = require("electron");
const windowMaker = require('./window');
const notification = require('./notification');
const configPrompt = require('./configPrompt');

let tray;
let win;

const icon = nativeImage
    .createFromPath(app.getAppPath() + "/electron/icons/app.png")
    .resize({
        width: 15,
        height: 15
    });

const icon2 = nativeImage.createFromPath(
    app.getAppPath() + "/electron/icons/app.png"
);

const ico = process.platform === "darwin"
    ? icon
    : nativeImage.createFromPath(app.getAppPath() + "/electron/icons/app.ico")


if (require('electron-squirrel-startup')) {
    app.quit();
}

const setupEvents = require('./installer/setup-events')
if (setupEvents.handleSquirrelEvent()) {
    process.exit()
}

app.whenReady().then(() => {
    win = windowMaker.createWindow()
    notification.createNotification(win);
    createTray();

    console.log(ipcRenderer)

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            win = windowMaker.createWindow();
        } else {
            win.show();
        }
        app.setBadgeCount(0);
    });

    win.on('close', function (event) {
        event.preventDefault();
        win.hide();
    });

    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") {
            app.quit();
        }
    });

    if (process.platform === "darwin") {
        app.dock.setIcon(icon2);
    }
});

function createTray() {
    tray = new Tray(ico);
    tray.on('double-click', handleShowClickTray);

    const contextMenu = Menu.buildFromTemplate([
        {
            label: "디웍스 열기",
            click: handleShowClickTray
        },
        {
            label: "환경설정",
            click: handleSettingClickTray
        },
        {
            label: "v" + app.getVersion()
        },
        {
            label: "종료",
            click: handleCloseClickTray
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

async function handleSettingClickTray() {
    const config = windowMaker.getConfig();

    configPrompt.showServerPrompt(config.server)
        .then((data) => {
            if (data) {
                windowMaker.setConfig({...config, server: data});
                app.relaunch({args: process.argv.slice(1).concat(['--relaunch'])})
                app.exit(0)
            }
        })
        .catch(console.error);
}
