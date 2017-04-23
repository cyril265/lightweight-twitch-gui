import {ConfigStore} from "./config-store";
const remote = require('electron').remote
const process = remote.require('child_process');
const os = remote.require('os');

export module StreamLauncher {

    export function start(streamUrl: string, title: string = streamUrl) {
        console.log("start", streamUrl)
        let config = ConfigStore.getCurrentConfig()

        let params = [
            generateExcludeCommand(config.quality),
            `--hls-segment-threads ${config.segmentThreads}`,
            `--hls-live-edge ${config.liveEdge}`,
            `--twitch-oauth-token ${config.authToken}`
        ]

        if (config.playerPath) {
            params.push(`-p "${config.playerPath} --title="${title}" "`)
        }

        let cmd = `streamlink ${params.join(' ')} ${streamUrl} best`
        console.log('start cmd', cmd)

        let livestreamer = process.exec(cmd)

        livestreamer.stdout.on('data', (data) => {
            let line = data.toString();
            //error
            if (line.startsWith('error')) {
                console.log('ERROR');
                //success
            } else if (line.indexOf('Starting') > 0) {
                //this.setState({loading: false})
            }
            console.log("livestreamer: " + line)
        });
    }

    function generateExcludeCommand(quality: string) {
        if (quality === 'High') {
            return '--stream-sorting-excludes ">720p30,<540p"';
        } else if (quality === 'Medium') {
            return '--stream-sorting-excludes ">540p30,<480p"';
        } else if (quality === 'Low') {
            return '--stream-sorting-excludes ">360p30"';
        } else {
            return '';
        }
    }


}