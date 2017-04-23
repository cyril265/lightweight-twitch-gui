export interface AppConfig {
    refreshInterval: number,
    authToken?: string,
    clientId: string,
    showNotifications: boolean,
    quality: string,
    playerPath?: string,
    liveEdge: number,
    segmentThreads: number
}