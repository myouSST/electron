async function sendPushNotification() {
    const response = await window.electronAPI.noti({
        title: 'qwdqwdd',
        body: 'qwdpqwiojdjqiopd',
        subtitle: '222222',
        //onClick: handleClick
    });

    /*    new window.Notification(NOTIFICATION_TITLE, { body: NOTIFICATION_BODY })
            .onclick = () => { document.getElementById('output').innerText = CLICK_MESSAGE }*/
}

async function readNotification() {
    window.electronAPI.read();
}