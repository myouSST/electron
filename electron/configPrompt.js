const prompt = require("electron-prompt");
const {app} = require("electron");

module.exports = {
    showServerPrompt: function (serverUrl) {
        return prompt({
            title: 'DWORKS workspace',
            label: 'server : ',
            value: serverUrl,
            inputAttrs: {
                type: 'url'
            },
            type: 'input'
        });
    },
}