const {
    app,
    BrowserWindow,
    Menu,
    nativeImage, ipcMain,
} = require("electron");
const prompt = require('electron-prompt');
const fs = require("node:fs");

const ico = nativeImage.createFromPath(
    app.getAppPath() + "/electron/icons/app.ico"
);

const icon2 = nativeImage.createFromPath(
    app.getAppPath() + "/electron/icons/app.png"
);

let url;


module.exports = {
    showServerPrompt: function (win) {
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
    },
    readConfig: function () {
        console.log(process.execPath);
        console.log(app.getPath("appData"));
        console.log(app.getAppPath());
        console.log(2);
        //const data = fs.readFile("./my-file.txt", "utf-8");
    },
    createWindow: function () {
        this.readConfig();

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

        ipcMain.handle("electron:path", (event, data) => {
            const pathString = {
                execPath: process.execPath,
                appData: app.getPath("appData"),
                getAppPath: app.getAppPath()
            }

            return {...pathString}
        });
        win.loadFile('index.html')
        win.show();
        return;

        if (url) {
            //win.loadURL(url);
            win.loadFile('index.html')
            win.show();
            return;
        }

        this.showServerPrompt(win);

        return win;
    },
}