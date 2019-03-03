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
    started_at: string
    user_name: string
    game_id: string
    title: string
    viewer_count: number
    language: string
    thumbnail_url: string
    channel_url: string
    type: string
    id: string
    medium_thumbnail: string
    small_thumbnail: string
    game_name: string
}


