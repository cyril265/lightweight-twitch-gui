import * as React from 'react';

import { Typeahead } from 'react-bootstrap-typeahead'
import { TwitchAPI } from "../../core/twitch/twitch-api";
import { Stream } from "../../core/twitch/stream";
import { Game } from "../../core/twitch/game";
import { ConfigStore } from "../../core/config-store";
import { StreamCollection } from "./stream-collection-component";
import { Button, InputGroup, Row } from 'react-bootstrap';
import ButtonToolbar from 'reactstrap/lib/ButtonToolbar';
import Container from 'reactstrap/lib/Container';
import Col from 'reactstrap/lib/Col';


interface Props {
    api: TwitchAPI
}

interface State {
    streams: Array<Stream>
    topGames: Array<Game>
    selectedGame: Game
}

export class TopStreams extends React.Component<Props, State> {

    state = { streams: [], topGames: [], selectedGame: null }

    constructor(props: Props) {
        super(props);
        this.state = { streams: [], topGames: [], selectedGame: null }
    }

    componentDidMount() {
        this.refreshStreams()
        this.props.api.getTopGames().then(topGames => {
            console.log(topGames)
            return this.setState({ topGames: topGames });
        })
    }

    refreshStreams = () => {
        console.log(this.state.selectedGame)
        let streamPromise

        if (this.state.selectedGame) {
            streamPromise = this.props.api.getTopStreamsByGameId(this.state.selectedGame.id);
        } else {
            streamPromise = this.props.api.getTopStreams()
        }
        streamPromise.then(response => this.setState({ streams: response }))
    }

    handleChange = (event: any) => {
        const game = event[0]
        this.setState({ selectedGame: game }, this.refreshStreams)
    }

    renderItem = (result: Game, _) => {
        const boxArtUrl = result.boxArtUrl
            .replace("{height}", "30")
            .replace("{width}", "30")
        return <div>
            <img style={{ display: 'inline-block' }} src={boxArtUrl} />
            <div style={{ display: 'inline-block', paddingLeft: 7 }}>{result.name}</div>
        </div>
    }


    render() {
        return (
            <div style={this.style}>
                <Row>
                    <Col>
                        <Typeahead
                            id="foo"
                            bsSize="small"
                            labelKey={(option: Game) => `${option.name}`}
                            renderMenuItemChildren={this.renderItem}
                            onChange={this.handleChange}
                            options={this.state.topGames}
                            clearButton
                        />
                    </Col>
                    <Col>
                        <Button size="sm" onClick={this.refreshStreams}>Refresh</Button>
                    </Col>
                </Row>
                <div style={this.style}>
                    <StreamCollection streams={this.state.streams} />
                </div>
            </div>
        )
    }

    style = {
        marginTop: 14
    }


}