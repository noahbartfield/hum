import youtubeToken from "../youtubeToken"

export default {
    get(search) {
        return fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${search}&videoEmbeddable=true&type=video&key=${youtubeToken}`)
            .then(res => res.json())
    }
}