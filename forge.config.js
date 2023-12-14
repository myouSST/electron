module.exports = {
    packagerConfig: {
        asar: true,
        icon: 'asset/icon' // no file extension required
    },
    rebuildConfig: {},
    makers: [
        {
            name: '@electron-forge/maker-squirrel',
            config: {},
        },
        {
            name: '@electron-forge/maker-zip',
            platforms: ['darwin'],
        },
        {
            name: '@electron-forge/maker-dmg',
            config: {
                icon: 'asset/icon.icns'
            }
        },
        {
            name: '@electron-forge/maker-deb',
            config: {
                options: {
                    icon: 'asset/icon'
                }
            },
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
