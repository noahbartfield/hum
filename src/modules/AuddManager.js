import auddToken from "../auddToken"


export default {
    get(humURL) {
        return fetch(`https://api.audd.io/recognizeWithOffset/?url=${encodeURI(humURL)}&api_token=${auddToken}`)
            .then(data => data.json())
    },
    getLyrics(artist, title) {
        fetch(`https://api.audd.io/findLyrics/?q=${artist} ${title}&api_token=${auddToken}`)
            .then(data => data.json())
    }
}