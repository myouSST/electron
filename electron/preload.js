const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    useElectron: true,
    ipcRenderer,
    notification: arg => {
        ipcRenderer.invoke('electron:notification', arg);
    },
    notificationClick: (callback) => ipcRenderer.on('bridge:notificationClick', (event, message) => {
        callback(message)
    }),
    badge: arg => {
        ipcRenderer.invoke('electron:badge', arg);
    },
    clearBadge: arg => {
        ipcRenderer.invoke('electron:clearBadge', arg);
    }
});
