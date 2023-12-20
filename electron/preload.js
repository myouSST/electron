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

contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    ping: () => ipcRenderer.invoke('ping')
    // we can also expose variables, not just functions
})