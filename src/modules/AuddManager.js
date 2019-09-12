
export default {
    get(humURL) {
        return fetch(`https://api.audd.io/recognizeWithOffset/?url=${encodeURI(humURL)}&api_token=fc69fba20d9a402ff3696cbd41daf5d4`)
            .then(data => data.json())
    },
    getLyrics(artist, title) {
        fetch(`https://api.audd.io/findLyrics/?q=${artist} ${title}&api_token=fc69fba20d9a402ff3696cbd41daf5d4`).then(data => data.json())
    }
}