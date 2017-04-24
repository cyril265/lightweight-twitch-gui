import {ConfigStore} from "./core/config-store";
const {BrowserWindow} = require('electron').remote

export function authenticate():Promise<string> {
    let win = new BrowserWindow({width: 800, height: 600, frame: false});
    let webContents = win.webContents;

    const promise:Promise<string> = new Promise((resolve) => {
        webContents.on("did-get-redirect-request", (event, oldUrl:string, newUrl:string) => {
            if (newUrl.indexOf('access_token') > 0) {
                win.close()

                let start = newUrl.indexOf('=') + 1
                let end = newUrl.indexOf('&')
                let authToken = newUrl.slice(start, end)
                resolve(authToken)
            }
        })
    })

    let clientId = ConfigStore.getCurrentConfig().clientId
    win.loadURL(`https://api.twitch.tv/kraken/oauth2/authorize?response_type=token&client_id=${clientId}&redirect_uri=http://localhost:31337/twitch_oauth&scope=user_read`);

    return promise;
}