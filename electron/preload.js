const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    useElectron: true,
    ipcRenderer: ipcRenderer,
    noti: arg => {
        ipcRenderer.invoke('notification', arg);
    },
    read: arg => {
        ipcRenderer.invoke('clearNotification', arg);
    },
    openWindow: arg => {
        ipcRenderer.invoke('electronAPI:openWindow', arg);
    },
});

contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    ping: () => ipcRenderer.invoke('ping')
    // we can also expose variables, not just functions
})