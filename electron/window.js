const {
    app,
    BrowserWindow,
    Menu,
    nativeImage, ipcMain,
} = require("electron");
const fs = require("node:fs");
const path = require("node:path");

const ico = nativeImage.createFromPath(
    app.getAppPath() + "/electron/icons/app.ico"
);

const icon2 = nativeImage.createFromPath(
    app.getAppPath() + "/electron/icons/app.png"
);

const configFileName = 'config.json';
const configFilePath = path.resolve(app.getAppPath(), `../${configFileName}`);

let config;

module.exports = {
    getConfig: function () {
        return config;
    },
    setConfig: function (newConfig) {
        config = newConfig;
        fs.writeFileSync(configFilePath, JSON.stringify(newConfig));
    },
    initConfig: function () {
        const exists = fs.existsSync(configFilePath);
        if (!exists) {
            fs.copyFileSync(app.getAppPath() + `/electron/${configFileName}`, configFilePath)
        }

        config = JSON.parse(fs.readFileSync(configFilePath));
    },
    createWindow: function () {
        this.initConfig();

        const win = new BrowserWindow({
            width: 1366,
            height: 768,
            webPreferences: {
                preload: app.getAppPath() + "/electron/preload.js"
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

        win.loadURL(config.server);
        win.show();
        return win;
    },
}