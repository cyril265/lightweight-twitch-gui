import * as ReactDOM from 'react-dom'
import * as React from 'react'
import {Tabs, Tab} from "react-bootstrap"
import {authenticate} from 'authenticator'
import '../vendor/css/bootstrap.min.css'
import '../css/loading.css'
import {TwitchAPI} from "./core/twitch/twitch-api";
import {ConfigStore} from "./core/config-store";
import {FollowedStreams} from "./component/stream/followed-streams-component";
import {TopStreams} from "./component/stream/top-streams-component";
import {StreamSearch} from "./component/stream/stream-search-component";
import {Settings} from "./component/settings/settings-component";
import {Log} from "./core/log";


class Application extends React.Component<{}, {}> {

    api: TwitchAPI;

    constructor() {
        super({})
        // Log.overrideLog();
        let config = ConfigStore.getCurrentConfig();
        this.api = new TwitchAPI(config.authToken, config.clientId);

        this.checkAuthentication()
    }

    private checkAuthentication() {
        this.api.isAuthValid().then(isValid => {
            if (!isValid) {
                authenticate().then(token => {
                    console.log("got token ", token)
                    let currentConfig = ConfigStore.getCurrentConfig()
                    currentConfig.authToken = token
                    ConfigStore.updateConfig(currentConfig)

                    const remote = require("electron").remote
                    remote.getCurrentWindow().reload()
                })
            }
        });
    }

    render() {        
        return (
            <Tabs id='tabs' defaultActiveKey={1}>
                <Tab eventKey={1} title={"Followed"}>
                    <FollowedStreams api={this.api} />
                </Tab>
                <Tab eventKey={2} title={"Top"}>
                    <TopStreams api={this.api}></TopStreams>
                </Tab>
                <Tab eventKey={3} title={"Search"}>
                    <StreamSearch api={this.api} />
                </Tab>
                <Tab eventKey={4} title={"Settings"}>
                    <Settings/>
                </Tab>
            </Tabs>
        )
    }

}

ReactDOM.render(<Application/>, document.getElementById('app'));


