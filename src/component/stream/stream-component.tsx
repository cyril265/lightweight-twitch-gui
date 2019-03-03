import * as React from 'react';
import * as _ from 'lodash'
import { OverlayTrigger, Tooltip } from "react-bootstrap"
import { CSSProperties } from "react";
import { Stream } from "core/twitch/stream";
import { StreamLauncher } from "core/stream-launcher";


const electron = require('electron')
const shell = electron.shell
const clipboard = electron.clipboard;


interface Props {
    stream: Stream,
    key: any
}

interface State {
    loading: boolean
    tooltipOpen: boolean
}

const streamStyle: CSSProperties = {
    float: 'left',
    padding: 10,
    position: 'relative',
    opacity: 1
}
const titleStyle: CSSProperties = {
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

    state = { loading: false, tooltipOpen: false }

    render() {
        const imgSrc = this.props.stream.medium_thumbnail + "?" + Date.now()

        let currentStreamStyle = streamStyle;
        if (this.state.loading) {
            currentStreamStyle = _.cloneDeep(streamStyle)
            currentStreamStyle.opacity = 0.3
            var loading = <div className='loading' />
        }

        let uptime = (new Date().getTime() - new Date(this.props.stream.started_at).getTime()) / 1000;
        let hours = Math.floor(uptime / 3600);
        let minutes = Math.floor((uptime - (hours * 3600)) / 60);

        const tooltip = <Tooltip id="1337">
            <div>{this.props.stream.game_name}</div>
            <div>{this.props.stream.title}</div>
            <div>{`${hours}h${minutes}m`}</div>
        </Tooltip>

        return (
            <div style={currentStreamStyle as CSSProperties}>
                {loading}
                <div style={titleStyle}>{this.props.stream.user_name}[{this.props.stream.viewer_count}]</div>
                <OverlayTrigger placement="bottom" overlay={tooltip}>
                    <img onMouseDown={this.streamClick} src={imgSrc} style={previewStyle}/>
                </OverlayTrigger>
            </div>
        )
    }

    toggleTooltip = () => {
        console.log("tooogl tooooltip")
        this.setState({ tooltipOpen: !this.state.tooltipOpen })
    }

    streamClick = (event: any) => {
        event.persist()
        console.log(event)
        if (event.button === 0 && event.shiftKey) {
            this.openChat()
        } else if (event.button === 0) {
            this.openStream()
        } else if (event.button === 2) {
            clipboard.writeText(this.props.stream.channel_url);
        }
    }

    openStream = () => {
        StreamLauncher.start(this.props.stream.channel_url, this.props.stream.user_name)

        this.setState({ loading: true })
        setTimeout(() => this.setState({ loading: false }), 6 * 1000);
    }


    openChat = () => {
        shell.openExternal(`${this.props.stream.channel_url}/chat`);
    }
}