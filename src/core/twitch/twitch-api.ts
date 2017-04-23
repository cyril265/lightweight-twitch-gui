import {Stream} from './stream';
import {Game} from './game';

export class TwitchAPI {

    private authOpts: RequestInit

    constructor(authToken: string, clientId: string) {
        this.authOpts = {headers: {'Authorization': `OAuth ${authToken}`, 'Client-ID': clientId}}
    }

    async getFollowedStreams(limit: number = 100): Promise<Stream[]> {
        let response = await window.fetch('https://api.twitch.tv/kraken/streams/followed?' + 'limit=' + limit, this.authOpts)
        this.checkResponse(response)

        let data = await response.json()
        return data.streams;
    }

    async getTopStreams(limit: number = 50): Promise<Stream[]> {
        let response = await window.fetch(`https://api.twitch.tv/kraken/streams?limit=${limit}`, this.authOpts)
        this.checkResponse(response)

        let data = await response.json()
        return data.streams;
    }

    async getTopStreamsByGame(game: string, limit: number = 50): Promise<Stream[]> {
        let response = await window.fetch(`https://api.twitch.tv/kraken/streams?game=${game}&limit=${limit}`, this.authOpts)
        this.checkResponse(response)

        let data = await response.json()
        return data.streams;
    }

    async searchStreams(query: string, limit: number = 100): Promise<Stream[]> {
        let response = await window.fetch(`https://api.twitch.tv/kraken/search/streams?q=${query}&type=suggest&limit=${limit}`, this.authOpts)
        this.checkResponse(response)

        let data = await response.json()
        return data.streams;
    }

    async getTopGames(limit: number = 50): Promise<Game[]> {
        let response = await window.fetch(`https://api.twitch.tv/kraken/games/top?limit=${limit}`, this.authOpts)
        this.checkResponse(response)
        let data = await response.json()
        return data.top.map(t => t.game);
    }

    async isAuthValid() {
        console.log("auth valid called");

        try {
            let streams = await this.getFollowedStreams(1);
        } catch (e) {
            console.log("EXC", e);
            if (e instanceof NotAuthorizedException) return false
        }
        return true
    }

    private checkResponse(response: Response): void {
        if (response.status === 401 || response.status === 403) {
            throw new NotAuthorizedException()
        }
        if (!response.ok) {
            throw new ApiException()
        }
    }

}

class NotAuthorizedException {
}
class ApiException {
}

