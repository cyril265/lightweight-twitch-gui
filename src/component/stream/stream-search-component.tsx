import * as React from 'react';
import * as _ from 'lodash'
import {Stream} from "core/twitch/stream";
import {StreamCollection} from "./stream-collection-component";
import {TwitchAPI} from "core/twitch/twitch-api";
import {StreamLauncher} from "core/stream-launcher";


interface State {
    streams: Array<Stream>
    loading: boolean
}
interface Props {
    api: TwitchAPI
}

export class StreamSearch extends React.Component<Props, State> {

    state = {streams: [], loading: false}

    render() {
        let currentStyle = this.style
        if (this.state.loading) {
            currentStyle = _.cloneDeep(this.style)
            currentStyle.opacity = 0.3
            var loading = <div className='loading'/>
        }

        return (
            <div style={currentStyle}>
                {loading}
                <input onKeyDown={this.handleSearch} style={{width: 300}}></input>
                <StreamCollection streams={this.state.streams}/>
            </div>
        )
    }

    handleSearch = (event) => {
        let query: string = event.target.value
        if (event.key === "Enter" && query.length > 1) {
            if (query.includes('twitch.tv')) {
                StreamLauncher.start(query)
                this.setState({streams: this.state.streams, loading: true})
                setTimeout(() => this.setState({streams: this.state.streams, loading: false}), 6 * 1000);
            } else {
                this.setState({streams: [], loading: true})
                this.props.api.searchStreams(event.target.value)
                    .then(streams => {
                        this.setState({streams: streams, loading: false})
                    })
            }
        }
    }

    style = {
        opacity: 1,
        marginTop: 14
    }


}