import * as React from 'react';
import * as _ from 'lodash'
import {OverlayTrigger, Tooltip} from "react-bootstrap"
import {CSSProperties} from "react";
import {Stream} from "core/twitch/stream";
import {StreamLauncher} from "core/stream-launcher";


const electron = require('electron')
const shell = electron.shell
const clipboard = electron.clipboard;
const os = require('os');


interface Props {
    stream: Stream,
    key: any
}

interface State {
    loading: boolean
}

const streamStyle: CSSProperties = {
    float: 'left',
    padding: 10,
    position: 'relative',
    opacity: 1
}
const titleStyle = {
    textAlign: 'center',
    color: 'lightgrey',
    paddingBottom: 5,
    fontFamily: 'Noto Sans, serif',
    cursor: 'default'
}
const previewStyle = {
    cursor: 'hand',
    width: 200,
    height: 113
}

export class StreamComponent extends React.Component<Props, State> {

    state = {loading: false}

    render() {
        let imgSrc = this.props.stream.preview.medium + "?" + Date.now();
        let currentStreamStyle = streamStyle;
        if (this.state.loading) {
            currentStreamStyle = _.cloneDeep(streamStyle)
            currentStreamStyle.opacity = 0.3
            var loading = <div className='loading'/>
        }

        let uptime = (new Date().getTime() - new Date(this.props.stream.created_at).getTime()) / 1000;
        let hours = Math.floor(uptime / 3600);
        let minutes = Math.floor((uptime - (hours * 3600)) / 60);

        const tooltip = <Tooltip id="1337">
            <div>{this.props.stream.game}</div>
            <div>{this.props.stream.channel.status}</div>
            <div>{`${hours}h${minutes}m`}</div>
        </Tooltip>

        return (
            <div style={currentStreamStyle as CSSProperties}>
                {loading}
                <div style={titleStyle}>{this.props.stream.channel.name}[{this.props.stream.viewers}]</div>
                <OverlayTrigger placement="bottom" overlay={tooltip}>
                    <img onMouseDown={this.streamClick} src={imgSrc} style={previewStyle}/>
                </OverlayTrigger>
            </div>
        )
    }

    streamClick = (event:any) => {
        event.persist()
        console.log(event)
        if(event.button === 0 && event.shiftKey) {
            this.openChat()
        } else if (event.button === 0) {
            this.openStream()
        } else if (event.button === 2) {
            clipboard.writeText(this.props.stream.channel.url);
        }
    }

    openStream = () => {
        StreamLauncher.start(this.props.stream.channel.url, this.props.stream.channel.name)

        this.setState({loading: true})
        setTimeout(() => this.setState({loading: false}), 6 * 1000);
    }


    openChat = () => {
         shell.openExternal(`${this.props.stream.channel.url}/chat`);
    }
}