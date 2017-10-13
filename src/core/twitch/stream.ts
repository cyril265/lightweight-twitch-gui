export interface Preview {
    small: string;
    medium: string;
    large: string;
    template: string;
}

export interface Link {
    self: string;
    follows: string;
    commercial: string;
    stream_key: string;
    chat: string;
    features: string;
    subscriptions: string;
    editors: string;
    videos: string;
    teams: string;
}

export interface Channel {
    _links: Link;
    background?: any;
    banner?: any;
    broadcaster_language: string;
    display_name: string;
    game: string;
    logo: string;
    mature?: any;
    status: string;
    partner: boolean;
    url: string;
    video_banner: string;
    _id: number;
    name: string;
    created_at: Date;
    updated_at: Date;
    delay: number;
    followers: number;
    profile_banner?: any;
    profile_banner_background_color?: any;
    views: number;
    language: string;
}

export interface Stream {
    _id: number;
    game: string;
    is_playlist: boolean;
    viewers: number;
    created_at: string;
    video_height: number;
    average_fps: number;
    _links: Link;
    preview: Preview;
    channel: Channel;
}


