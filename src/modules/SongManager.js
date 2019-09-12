const url = 'http://localhost:8088/songs';

export default {
    getAll() {
        return fetch(url).then(res => res.json());
    },
    post(audio) {
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(audio)
        })
    }
}