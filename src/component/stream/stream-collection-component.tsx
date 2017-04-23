import {StreamComponent} from "./stream-component";
import * as React from "react";
import {Stream} from "core/twitch/stream";


interface CollectionProps {
    streams: Array<Stream>
}

export class StreamCollection extends React.Component<CollectionProps, {}> {

    render() {
        let streamList = this.props.streams
            .sort((a, b) => b.viewers - a.viewers)
            .map((stream) => <StreamComponent key={stream._id} stream={stream}/>);
        return <div>{streamList}</div>
    }

}