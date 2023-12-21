async function sendPushNotification() {
    const response = await window.electronAPI.notification({
        title: 'qwdqwdd',
        body: 'qwdpqwiojdjqiopd',
        subtitle: '222222',
        //onClick: handleClick
    });

    const response2 = await window.electronAPI.path({
        title: 'qwdqwdd',
        body: 'qwdpqwiojdjqiopd',
        subtitle: '222222',
        //onClick: handleClick
    });

    console.log(response2);

    /*    new window.Notification(NOTIFICATION_TITLE, { body: NOTIFICATION_BODY })
            .onclick = () => { document.getElementById('output').innerText = CLICK_MESSAGE }*/
}

async function readNotification() {
    window.electronAPI.read();
}