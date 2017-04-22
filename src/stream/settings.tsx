import * as React from 'react';
import {AppConfig} from 'app-config'
import {FormControl, FormGroup, Label, Checkbox, ControlLabel} from "react-bootstrap"
import {ConfigStore} from 'stream/config-store'


interface State {
    config: AppConfig
}
interface Props {
}

export class Settings extends React.Component<Props, State> {

    state = {config: ConfigStore.getCurrentConfig()}

    handleRefreshInterval = (event) => {
        let refreshInterval = Number(event.target.value)
        if (!Number.isNaN(refreshInterval)) {
            this.state.config.refreshInterval = refreshInterval
            this.updateConfig()
        }
    }

    handleSegmentThreads = (event) => {
        if (!Number.isNaN(event.target.value)) {
            this.state.config.segmentThreads = event.target.value
            this.updateConfig()
        }
    }

    handleLiveEdge = (event) => {
        if (!Number.isNaN(event.target.value)) {
            this.state.config.liveEdge = event.target.value
            this.updateConfig()
        }
    }

    handleQuality = (event) => {
        this.state.config.quality = event.target.value
        this.updateConfig()
    }

    handleNotifications = (event) => {
        console.log("event big event", event)
        this.state.config.showNotifications = event.target.checked
        this.updateConfig()
    }

    handlePlayerPath = (event) => {
        this.state.config.playerPath = event.target.value
        this.updateConfig()
    }

    updateConfig = () => {
        this.forceUpdate()
        ConfigStore.updateConfig(this.state.config)
    }

    render() {
        return (
            <form>
                <FormGroup bsSize="small">
                    <ControlLabel>Refresh interval (seconds)</ControlLabel>
                    <FormControl className="form-control" type="text"
                                 onChange={this.handleRefreshInterval}
                                 value={this.state.config.refreshInterval}
                                 placeholder="Refresh interval (seconds)"/>
                </FormGroup>

                <FormGroup bsSize="small">
                    <ControlLabel>Stream quality</ControlLabel>
                    <FormControl componentClass="select" placeholder="Stream quality"
                                 value={this.state.config.quality}
                                 onChange={this.handleQuality}>
                        <option value="Best">Best</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </FormControl>
                </FormGroup>


                <Checkbox bsSize="small" checked={this.state.config.showNotifications} onChange={this.handleNotifications}>
                    Show notifications
                </Checkbox>

                <FormGroup bsSize="small">
                    <ControlLabel>Segment threads</ControlLabel>
                    <FormControl type="text"
                                 onChange={this.handleSegmentThreads}
                                 value={this.state.config.segmentThreads}
                                 placeholder="Segment threads"/>
                </FormGroup>

                <FormGroup bsSize="small">
                    <ControlLabel>Live edge</ControlLabel>
                    <FormControl type="text"
                                 onChange={this.handleLiveEdge}
                                 value={this.state.config.liveEdge}
                                 placeholder="Live edge"/>
                </FormGroup>

                <FormGroup bsSize="small">
                    <ControlLabel>Path to player executable</ControlLabel>
                    <FormControl type="text"
                                 onChange={this.handlePlayerPath}
                                 value={this.state.config.playerPath}
                                 placeholder="Path to player executable. This overrides the livestreamer player setting"/>
                </FormGroup>
            </form>
        )
    }
}