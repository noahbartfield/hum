export default {
    get(humURL) {
        return fetch(`https://api.audd.io/recognizeWithOffset/?url=${encodeURI(humURL)}&api_token=${process.env.REACT_APP_AUDD_KEY}`)
            .then(data => data.json())
    },
    getLyrics(artist, title) {
        fetch(`https://api.audd.io/findLyrics/?q=${artist} ${title}&api_token=${process.env.REACT_APP_AUDD_KEY}`)
            .then(data => data.json())
    }
}