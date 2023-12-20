const {
    app,
    BrowserWindow,
    Menu,
    Tray,
    ipcMain,
    nativeImage,
    Notification
} = require("electron");
const path = require("node:path");

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

const ico = nativeImage.createFromPath(
    app.getAppPath() + "/electron/icons/app.ico"
);

const iconNew = nativeImage
    .createFromPath(app.getAppPath() + "/electron/icons/new.png")
    .resize({
        width: 15,
        height: 15
    });

const createWindow = () => {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    });

    //win.loadURL("http://172.16.120.183:3000/btalk");
    win.loadURL("http://172.16.100.155:3000/ctalk");
    win.openDevTools();
    win.setIcon(ico);

    Menu.setApplicationMenu(null);

    if (process.platform === "win32") {
        app.setAppUserModelId(app.name);
    }
};

app.whenReady().then(() => {
    createWindow();
    createTray();
    createNotification();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

    app.dock.setIcon(icon2);
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

function createTray() {
    tray = new Tray(icon);

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

    tray.setToolTip("This is my application");
    tray.setContextMenu(contextMenu);
}

async function createNotification() {
    let prevNotification; // 알림을 저장할 배열

    ipcMain.handle("electron:notification", (event, data) => {
        const notification = new Notification({
            title: data.title,
            body: data.content,
            icon: path.join(path.join(__dirname, "./icons/ctalk-app.ico"))
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
        console.log(1)
        tray.setTitle("UNREAD");
        tray.setImage(iconNew);
        app.setBadgeCount(".");
    });

    ipcMain.handle("electron:clearBadge", (event, data) => {
        console.log(2)
        tray.setTitle("");
        tray.setImage(icon);
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
