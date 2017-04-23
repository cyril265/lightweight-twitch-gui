import * as React from 'react'
import {TwitchAPI} from "core/twitch/twitch-api";
import {StreamCollection} from "./stream-collection-component";
import {Stream} from "core/twitch/stream";
import {ConfigStore} from "../../core/config-store";

declare const Notification: any;

interface State {
    streams: Array<Stream>
}

interface Props {
    api: TwitchAPI
}

export class FollowedStreams extends React.Component<Props, State> {

    initialized: boolean
    lastRefresh: Date = new Date()

    constructor(props) {
        super(props);
        console.log("config: " + JSON.stringify(this.props));

        document.body.onkeydown = (e) => this.handleKeyPress(e);
        this.initialized = false;
        this.state = {streams: []}

        this.refreshStreams();
        setInterval(() => this.refreshStreams(), ConfigStore.getCurrentConfig().refreshInterval * 1000);
    }

    refreshStreams() {
        console.log("refreshing streams");
        this.props.api.getFollowedStreams().then((response) => {
            if (this.initialized && ConfigStore.getCurrentConfig().showNotifications) {
                this.showNotifications(response);
            }
            this.setState({streams: response});
            this.initialized = true;
            this.lastRefresh = new Date()
        });
    }

    handleKeyPress(e) {
        if (e.key === 'F5') {
            this.refreshStreams();
        }
    };

    showNotifications(updatedStreams: Array<Stream>) {
        let filtered = updatedStreams.filter(stream => {
            let index = this.state.streams.findIndex(oldStream => {
                return stream.channel.name === oldStream.channel.name;
            });
            return index < 0;
        });
        // prevent notification spam after sleep
        let refreshInterval = ConfigStore.getCurrentConfig().refreshInterval * 1000
        let diff = new Date().getTime() - this.lastRefresh.getTime()
        if (diff < refreshInterval * 5) {
            filtered.forEach(this.createNotification);
        }
    }

    createNotification(stream: Stream) {
        const title = stream.channel.name + " has come online!";
        new Notification(title, {body: stream.channel.status, icon: stream.preview.small})
    }


    render() {
        return (
            <div style={{marginTop: 14}}>
                <StreamCollection streams={this.state.streams}/>
            </div>
        )
    }


}
