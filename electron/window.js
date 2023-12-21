const {
    app,
    BrowserWindow,
    Menu,
    nativeImage,
} = require("electron");
const prompt = require('electron-prompt');
const path = require("node:path");

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

    createWindow: function () {
        const win = new BrowserWindow({
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

        this.showServerPrompt(win);

        return win;
    },
}