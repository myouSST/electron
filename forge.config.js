module.exports = {
    packagerConfig: {
        asar: true,
        icon: './electron/icons'
    },
    rebuildConfig: {},
    makers: [
        {
            name: '@electron-forge/maker-squirrel',
            config: {
                iconUrl: 'https://dworks-workspace.spectra.co.kr/btalk/favicon.ico',
                description: 'Messaging Works Platform',
                setupIcon: './electron/icons/app.ico',
            },
        },
        {
            name: '@electron-forge/maker-zip',
            platforms: ['darwin'],
        },
        {
            name: '@electron-forge/maker-dmg',
            config: {
                icon: './electron/icons/app.icns',
            }
        },
        {
            name: '@electron-forge/maker-deb',
            config: {},
        },
        {
            name: '@electron-forge/maker-rpm',
            config: {},
        },
    ],
    plugins: [
        {
            name: '@electron-forge/plugin-auto-unpack-natives',
            config: {},
        },
    ],
};
