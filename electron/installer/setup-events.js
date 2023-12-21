const {
    app,
} = require("electron");

// check out https://github.com/electron/windows-installer#handling-squirrel-events
// for more information on squirrel events for windows

module.exports = {
    handleSquirrelEvent: function() {
        if (process.argv.length === 1) {
            return false
        }

        const ChildProcess = require('node:child_process')
        const path = require('node:path')

        const appFolder = path.resolve(process.execPath, '..')
        const rootAtomFolder = path.resolve(appFolder, '..')
        const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'))
        const exeName = path.basename(process.execPath)

        const spawn = function(command, args) {
            let spawnedProcess

            try {
                spawnedProcess = ChildProcess.spawn(command, args, { detached: true })
            } catch (error) {
                console.warn(error)
            }

            return spawnedProcess
        }

        const spawnUpdate = function(args) {
            return spawn(updateDotExe, args)
        }

        const squirrelEvent = process.argv[1]
        switch (squirrelEvent) {
            case '--squirrel-install':
            case '--squirrel-updated':
                spawnUpdate(['--createShortcut', exeName])
                setTimeout(app.quit, 1000)
                break

            case '--squirrel-uninstall':
                spawnUpdate(['--removeShortcut', exeName])
                setTimeout(app.quit, 1000)
                break

            case '--squirrel-obsolete':
                app.quit()
                break
        }
    }
}