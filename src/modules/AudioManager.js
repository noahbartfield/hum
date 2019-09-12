const url = 'http://localhost:8088/songs';

export default {
    get(id) {
        return fetch(`${url}/${id}`).then(res => res.json())
    },
    getAll() {
        return fetch(url).then(res => res.json());
    },
    post(song) {
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(song)
        })
    },
    delete(id) {
        return fetch(`${url}/${id}`, {
            method: "DELETE"
        })
            .then(result => result.json())
    },
    update(editedSong) {
        return fetch(`${url}/${editedSong.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(editedSong)
        }).then(data => data.json());
    }
}