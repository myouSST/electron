const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    useElectron: true,
    ipcRenderer: ipcRenderer,
    notification: arg => {
        ipcRenderer.invoke('electron:notification', arg);
    },
    badge: arg => {
        ipcRenderer.invoke('electron:badge', arg);
    },
    clearBadge: arg => {
        ipcRenderer.invoke('electron:clearBadge', arg);
    },
    openWindow: arg => {
        ipcRenderer.invoke('electron:openWindow', arg);
    },
});
