import * as React from 'react';

import {Typeahead} from 'react-bootstrap-typeahead'
import {TwitchAPI} from "../../core/twitch/twitch-api";
import {Stream} from "../../core/twitch/stream";
import {Game} from "../../core/twitch/game";
import {ConfigStore} from "../../core/config-store";
import {StreamCollection} from "./stream-collection-component";


interface Props {
    api: TwitchAPI
}

interface State {
    streams: Array<Stream>
    topGames: Array<Game>
    selectedGame: Game
}

export class TopStreams extends React.Component<Props, State> {

    state = {streams: [], topGames: [], selectedGame: undefined}

    constructor(props: Props) {
        super(props);
        setInterval(() => this.refreshStreams(), ConfigStore.getCurrentConfig().refreshInterval * 1000);
    }

    componentDidMount() {
        this.refreshStreams()
        this.props.api.getTopGames().then(topGames => {
            return this.setState({topGames: topGames});
        })
    }

    refreshStreams() {
        let streamPromise
        console.log(this.state.selectedGame)
        if (this.state.selectedGame) {
            streamPromise = this.props.api.getTopStreamsByGame(this.state.selectedGame.name);
        } else {
            streamPromise = this.props.api.getTopStreams()
        }
        streamPromise.then(response => this.setState({streams: response}))
    }

    handleChange = (event: any) => {
        const game = event[0]
        this.setState({selectedGame: game}, this.refreshStreams)
    }

    renderItem = (result: Game, _) => {
        return <div>
            <img style={{display: 'inline-block'}} src={result.logo.small}/>
            <div style={{display: 'inline-block', paddingLeft: 7}}>{result.name}</div>
        </div>
    }


    render() {
        return (
            <div style={this.style}>
                <Typeahead
                    bsSize='small'
                    labelKey={(option: Game) => `${option.name}`}
                    renderMenuItemChildren={this.renderItem}
                    onChange={this.handleChange}
                    options={this.state.topGames}
                    clearButton
                />
                <div style={this.style}>
                    <StreamCollection streams={this.state.streams}/>
                </div>
            </div>
        )
    }

    style = {
        marginTop: 14
    }


}