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
const ChildProcess = require("child_process");

let tray;
let win;
let url;
const icon = nativeImage
    .createFromPath(app.getAppPath() + "/electron/icons/app.png")
    .resize({
        width: 15,
        height: 15
    });

const icon2 = nativeImage.createFromPath(
    app.getAppPath() + "/electron/icons/app.png"
);

const ico = nativeImage.createFromPath(
    app.getAppPath() + "/electron/icons/app.ico"
);

if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
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
            // Optionally do things such as:
            // - Add your .exe to the PATH
            // - Write to the registry for things like file associations and
            //   explorer context menus

            // Install desktop and start menu shortcuts
            spawnUpdate(['--createShortcut', exeName]);

            setTimeout(app.quit, 1000);
            return true;

        case '--squirrel-uninstall':
            // Undo anything you did in the --squirrel-install and
            // --squirrel-updated handlers

            // Remove desktop and start menu shortcuts
            spawnUpdate(['--removeShortcut', exeName]);

            setTimeout(app.quit, 1000);
            return true;

        case '--squirrel-obsolete':
            // This is called on the outgoing version of your app before
            // we update to the new version - it's the opposite of
            // --squirrel-updated

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

    // this should be placed at top of main.js to handle setup events quickly
    if (handleSquirrelEvent()) {
        // squirrel event handled and app will exit in 1000ms, so don't do anything else
        return;
    }

    createWindow();
    createTray();
    createNotification();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
        app.setBadgeCount(0);
    });

    if (process.platform === "darwin") {
        app.dock.setIcon(icon2);
    }
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
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
                //win.loadURL("http://172.16.100.155:3000/ctalk");
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

async function createNotification() {
    let prevNotification; // 알림을 저장할 배열

    ipcMain.handle("electron:notification", (event, data) => {
        const notification = new Notification({
            title: data.title,
            body: data.content,
            icon: icon
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
