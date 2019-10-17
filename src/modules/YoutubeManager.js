export default {
    get(search) {
        return fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${search}&videoEmbeddable=true&type=video&key=${process.env.REACT_APP_YOUTUBE_KEY}`)
            .then(res => res.json())
    }
}