import {log} from "util";
const path = require("path")
const os = require("os")
const fs = require("fs")
const util = require("util")

export module Log {

    const logFile = path.resolve(os.homedir(), '.lightstreamer', 'lightstreamer.log');

    export function overrideLog() {
        fs.unlinkSync(logFile)

        const oldLog = console.log;
        console.log = function (message, optionalParams) {
            if (optionalParams) oldLog(message, optionalParams); else oldLog(message)

            doLog(message, optionalParams)
        }

        const oldError = console.error;
        console.error = function (message, optionalParams) {
            if (optionalParams) oldError(message, optionalParams); else oldError(message)
            
            doLog(message, optionalParams)
        }
    }

    function doLog(msg: string, optionalParameters: string) {
        const formattedMsg = util.format(msg, optionalParameters);
        fs.appendFile(logFile, formattedMsg + "\n\r",)
    }


}