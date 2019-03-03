import * as React from 'react';
import { Form } from "react-bootstrap"
import { AppConfig } from "core/app-config";
import { ConfigStore } from "core/config-store";


interface State {
    config: AppConfig
}
interface Props {
}

export class Settings extends React.Component<Props, State> {

    state = { config: ConfigStore.getCurrentConfig() }

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
                <Form.Group>
                    <Form.Label>Refresh interval (seconds)</Form.Label>
                    <Form.Control className="form-control" type="text"
                        onChange={this.handleRefreshInterval}
                        defaultValue={this.state.config.refreshInterval + ""}
                        placeholder="Refresh interval (seconds)" />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Stream quality</Form.Label>
                    <Form.Control as="select"
                        defaultValue={this.state.config.quality}
                        onChange={this.handleQuality}>
                        <option value="Best">Best</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </Form.Control>
                </Form.Group>

                <Form.Check type="checkbox"
                    checked={this.state.config.showNotifications} onChange={this.handleNotifications}
                    label="Show notifications">
                </Form.Check>

                <Form.Group style={{paddingTop: "10px"}}>
                    <Form.Label>Segment threads</Form.Label>
                    <Form.Control type="text"
                        onChange={this.handleSegmentThreads}
                        defaultValue={this.state.config.segmentThreads + ""}
                        placeholder="Segment threads" />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Live edge</Form.Label>
                    <Form.Control type="text"
                        onChange={this.handleLiveEdge}
                        defaultValue={this.state.config.liveEdge + ""}
                        placeholder="Live edge" />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Path to player executable</Form.Label>
                    <Form.Control type="text"
                        onChange={this.handlePlayerPath}
                        defaultValue={this.state.config.playerPath}
                        placeholder="Path to player executable. This overrides the livestreamer player setting" />
                </Form.Group>
            </form>
        )
    }
}