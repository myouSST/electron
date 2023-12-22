const {ipcMain, Notification, app, nativeImage} = require("electron");

const icon2 = nativeImage.createFromPath(
    app.getAppPath() + "/electron/icons/app.png"
);

module.exports = {
    createNotification: function (win) {
        let prevNotification; // 알림을 저장할 배열

        ipcMain.handle("electron:notification", (event, data) => {
            const notification = new Notification({
                ...data,
                icon: icon2
            });

            notification.on("click", (event) => {
                win.webContents.send("bridge:notificationClick", data);
            });

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
}