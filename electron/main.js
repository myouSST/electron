const {
    app,
    BrowserWindow,
    Menu,
    Tray,
    ipcMain,
    nativeImage,
    Notification
} = require("electron");
const prompt = require('electron-prompt');
const path = require("node:path");

let tray;
let win;
let url;

const icon2 = nativeImage.createFromPath(
    app.getAppPath() + "/electron/icons/app.png"
);

const ico = nativeImage.createFromPath(
    app.getAppPath() + "/electron/icons/app.ico"
);

if (require('electron-squirrel-startup')) {
    app.quit();
}

function handleSquirrelEvent() {
    if (process.argv.length === 1) {
        return false;
    }

    const ChildProcess = require('child_process');
    const path = require('path');

    const appFolder = path.resolve(process.execPath, '..');
    const rootAtomFolder = path.resolve(appFolder, '..');
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
    const exeName = path.basename(process.execPath);

    const spawn = function (command, args) {
        let spawnedProcess, error;

        try {
            spawnedProcess = ChildProcess.spawn(command, args, {detached: true});
        } catch (error) {
        }

        return spawnedProcess;
    };

    const spawnUpdate = function (args) {
        return spawn(updateDotExe, args);
    };

    const squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
        case '--squirrel-install':
        case '--squirrel-updated':
            spawnUpdate(['--createShortcut', exeName]);

            setTimeout(app.quit, 1000);
            return true;
        case '--squirrel-uninstall':
            spawnUpdate(['--removeShortcut', exeName]);

            setTimeout(app.quit, 1000);
            return true;

        case '--squirrel-obsolete':
            app.quit();
            return true;
    }
};

const createWindow = () => {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        },
        icon: icon2,
        show: false
    });
    win.openDevTools();
    win.setIcon(ico);

    Menu.setApplicationMenu(null);

    if (process.platform === "win32") {
        app.setAppUserModelId(app.name);
    }

    if (url) {
        win.loadURL(url);
        win.show();
        return;
    }

    showServerPrompt(win);
};

app.whenReady().then(() => {
    /*if (handleSquirrelEvent()) {
        return;
    }*/

    createWindow();
    createTray();
    createNotification();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
        app.setBadgeCount(0);
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

async function createNotification() {
    let prevNotification; // 알림을 저장할 배열

    ipcMain.handle("electron:notification", (event, data) => {
        const notification = new Notification({
            title: data.title,
            body: data.content,
            icon: icon2
        });

        notification.click = () => {
            data.onclick();
            // click 이벤트가 발생했을 때 실행할 코드
        };

        notification.show();

        if (prevNotification) {
            prevNotification.close();
        }

        prevNotification = notification;
    });

    ipcMain.handle("electron:badge", (event, data) => {
        app.setBadgeCount(".");
    });

    ipcMain.handle("electron:clearBadge", (event, data) => {
        app.setBadgeCount(0);
    });
}

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

function showServerPrompt() {
    prompt({
        title: 'DWORKS workspace',
        label: 'URL:',
        value: 'http://172.16.100.155:3000/ctalk',
        inputAttrs: {
            type: 'url'
        },
        type: 'input'
    })
        .then((data) => {
            if (data) {
                url = data;
                win.loadURL(data);
                win.show();
            }

            if (!data) {
                app.quit();
            }
        })
        .catch(console.error);
}


async function handleCloseClickTray() {
    //await localStorage.removeItem('ADMIN_authInfo');
    win.close();
    app.quit();
    app.exit();
}

async function handleShowClickTray() {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    } else {
        win.show();
    }
}
