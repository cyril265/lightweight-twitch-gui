
import {AppConfig} from "./app-config";
const remote = require('electron').remote
const os = remote.require('os')
const path = remote.require('path')
const fs = require('fs');


export module ConfigStore {

    let configDirPath = path.resolve(os.homedir(), '.lightstreamer')
    let configFileName = path.resolve(configDirPath, 'config.json')
    let _config: AppConfig = loadConfig()

    try {
        fs.mkdirSync(configDirPath);
    } catch (e) {
        //ignore
    }

    export function updateConfig(config: AppConfig) {
        _config = config
        fs.writeFile(configFileName, JSON.stringify(config, null, 2), 'utf8')
    }

    export function getCurrentConfig(): AppConfig {
        return _config
    }

    function loadConfig(): AppConfig {
        try {
            let rawFile = fs.readFileSync(configFileName, 'utf8')
            console.log("raw file", rawFile)
            return JSON.parse(rawFile)
        } catch (e) {
            console.log("could not read file", e)
            return {
                clientId: 'r4h4mcs056enp6p9cuiytu8p0n5f2qj',
                showNotifications: true,
                refreshInterval: 120,
                quality: 'Source',
                segmentThreads: 4,
                liveEdge: 4
            }
        }
    }
}