import * as ReactDOM from 'react-dom'
import * as React from 'react'
import {TwitchAPI} from 'twitch/api'
import {FollowedStreams} from 'stream/followed-streams'
import {StreamSearch} from 'stream/search'
import {TopStreams} from 'stream/top-streams'
import {Settings} from 'stream/settings'
import {Log} from 'util/log'
import {Tabs, Tab} from "react-bootstrap"
import {ConfigStore} from 'stream/config-store'
import {authenticate} from 'authenticator'
import '../vendor/css/bootstrap.min.css'
import '../css/loading.css'


class Application extends React.Component<{}, {}> {

    api: TwitchAPI;

    constructor() {
        super()
        Log.overrideLog();
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
                    <FollowedStreams api={this.api}/>
                </Tab>
                <Tab eventKey={2} title={"Top"}>
                    <TopStreams api={this.api}></TopStreams>
                </Tab>
                <Tab eventKey={3} title={"Search"}>
                    <StreamSearch api={this.api}/>
                </Tab>
                <Tab eventKey={4} title={"Settings"}>
                    <Settings/>
                </Tab>
            </Tabs>
        )
    }

}

ReactDOM.render(<Application/>, document.getElementById('app'));


