import { Game } from './game';
import { Stream } from './stream';

export class TwitchAPI {

    private authOpts: RequestInit
    private currentUserid: Promise<string>
    private gameMap: Promise<Map<string, string>>


    constructor(authToken: string, clientId: string) {
        this.authOpts = { headers: { 'Authorization': `Bearer ${authToken}`, 'Client-ID': clientId } }
        this.currentUserid = this.getCurrentUserId()

        this.gameMap = this.getTopGames().then(games => {
            const gameMap = new Map()
            games.forEach(game => gameMap.set(game.id, game.name))
            return gameMap
        })
    }

    async getFollowedStreams(): Promise<Stream[]> {
        console.log("getfollowed")
        const followsIds = await this.getUserFollowsIds()
        const requestUrl = "https://api.twitch.tv/helix/streams?first=100&" + followsIds.map(id => `user_id=${id}`).join("&")

        let response = await window.fetch(requestUrl, this.authOpts)
        this.checkResponse(response)

        let streams = (await response.json()).data
        return this.postProcessStreams(streams);
    }

    async getCurrentUserId(): Promise<string> {
        const response = await window.fetch('https://api.twitch.tv/helix/users', this.authOpts)
        this.checkResponse(response)

        let data = (await response.json()).data
        return data[0].id
    }

    async getUserFollowsIds(): Promise<string[]> {
        const userId = await this.currentUserid
        console.log("userId", userId)
        const response = await window.fetch(`https://api.twitch.tv/helix/users/follows?from_id=${userId}&first=100`, this.authOpts)
        this.checkResponse(response)

        let data = (await response.json()).data
        return data.map(followedStream => followedStream.to_id)
    }


    async getTopStreams(limit: number = 50): Promise<Stream[]> {
        let response = await window.fetch(`https://api.twitch.tv/helix/streams?first=${limit}`, this.authOpts)
        this.checkResponse(response)

        let streams = (await response.json()).data
        return this.postProcessStreams(streams);
    }

    async getTopStreamsByGameId(game: string): Promise<Stream[]> {
        let response = await window.fetch(`https://api.twitch.tv/helix/streams?game_id=${game}`, this.authOpts)
        this.checkResponse(response)

        let streams = (await response.json()).data
        return this.postProcessStreams(streams);
    }

    async searchStreams(query: string, limit: number = 100): Promise<Stream[]> {
        let response = await window.fetch(`https://api.twitch.tv/kraken/search/streams?q=${query}&type=suggest&limit=${limit}`, this.authOpts)
        this.checkResponse(response)

        let data = await response.json()
        return this.postProcessLegacyStreams(data.streams);
    }


    async getTopGames(): Promise<Game[]> {
        let responsePromise = await window.fetch(`https://api.twitch.tv/helix/games/top?first=100`, this.authOpts)
        this.checkResponse(responsePromise)
        let response = await responsePromise.json()

        return response.data.map(function (game) {
            return { id: game.id, name: game.name, boxArtUrl: game.box_art_url }
        });
    }

    async isAuthValid() {
        console.log("auth valid called");

        try {
            let userId = await this.currentUserid
        } catch (e) {
            console.log("EXC", e);
            if (e instanceof NotFoundException) return false
        }
        return true
    }

    mapStream(stream: Stream, gameMap: Map<string, string>): Stream {
        const medium_thumbnail = stream.thumbnail_url.replace("{height}", "113")
            .replace("{width}", "200")
        const small_thumbnail = stream.thumbnail_url.replace("{height}", "40")
            .replace("{width}", "40")

        return {
            ...stream,
            ...{
                channel_url: 'https://www.twitch.tv/' + stream.user_name,
                medium_thumbnail: medium_thumbnail,
                small_thumbnail: small_thumbnail,
                game_name: gameMap.get(stream.game_id)
            }
        }
    }

    private async postProcessStreams(streams: Stream[]): Promise<Stream[]> {
        const gameMap = await this.gameMap
        const missingGameIds = streams
            .map(stream => stream.game_id)
            .filter(gameId => gameId != undefined && gameId != null && gameId.length > 2)
            .filter(gameId => !gameMap.has(gameId))
        console.log(missingGameIds)
        if (missingGameIds.length > 0) {
            const missingGames = await this.getGamesByid(missingGameIds)
            missingGames.forEach(game => gameMap.set(game.id, game.name))
        }

        return streams
            .map(stream => this.mapStream(stream, gameMap))
            .filter(this.filterLiveStreams);
    }

    private filterLiveStreams = stream => stream.type == 'live'

    private async getGamesByid(gameIds): Promise<Game[]> {
        let responsePromise = await window.fetch(
            'https://api.twitch.tv/helix/games?' + gameIds.map(id => `id=${id}`).join("&"), this.authOpts
        )
        this.checkResponse(responsePromise)
        let response = await responsePromise.json()

        return response.data.map(function (game) {
            return { id: game.id, name: game.name, boxArtUrl: game.box_art_url }
        });
    }

    private postProcessLegacyStreams(streams: any): Stream[] {
        return streams.map(stream => {
            return {
                started_at: stream.created_at,
                user_name: stream.channel.display_name,
                title: stream.channel.status,
                viewer_count: stream.viewers,
                language: stream.channel.language,
                medium_thumbnail: stream.preview.medium,
                small_thumbnail: stream.preview.small,
                channel_url: stream.channel.url,
                type: stream.is_playlist ? 'playlist' : 'live',
                id: stream._id,
                game_name: stream.game
            }
        })
            .filter(this.filterLiveStreams);
    }

    private checkResponse(response: Response): void {
        if (response.status === 401 || response.status === 403) {
            throw new NotAuthorizedException()
        }
        if (response.status === 400) {
            throw new NotFoundException()
        }
        if (!response.ok) {
            console.log("Invalid api response", response)
            throw new ApiException()
        }
    }

}

class NotAuthorizedException {
}
class ApiException {
}
class NotFoundException {
}
