const {ipcMain, Notification, app, nativeImage} = require("electron");

const icon2 = nativeImage.createFromPath(
    app.getAppPath() + "/electron/icons/app.png"
);

module.exports = {
    createNotification: function (win) {
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
}