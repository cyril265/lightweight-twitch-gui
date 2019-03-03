import {StreamComponent} from "./stream-component";
import * as React from "react";
import {Stream} from "core/twitch/stream";


interface CollectionProps {
    streams: Array<Stream>
}

export class StreamCollection extends React.Component<CollectionProps, {}> {

    render() {
        let streamList = this.props.streams
            .sort((a, b) => b.viewer_count - a.viewer_count)
            .map((stream) => <StreamComponent key={stream.id} stream={stream}/>);
        return <div>{streamList}</div>
    }

}