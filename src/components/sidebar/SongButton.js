import React, { Component } from 'react'
// import EditSongModal from "./EditSongModal"
// import EditModalHelper from './EditModalHelper';
// import './Song.css'
import { Button, Modal } from 'semantic-ui-react'
// import EditModal from './EditModal'
import AudioManager from '../../modules/AudioManager'



class SongButton extends Component {

    state = {
        comments: "",
        showModal: false
    }

    handleFieldChange = evt => {
        const stateToChange = {}
        stateToChange[evt.target.id] = evt.target.value
        this.setState(stateToChange)
    }

    updateExistingSong = evt => {
        console.log("Comments", this.props.song.comments)
        evt.preventDefault()
        const currentUser = JSON.parse(sessionStorage.getItem("credentials"))
        const editedSong = {
            id: this.props.song.id,
            title: this.props.song.title,
            lyrics: this.props.song.lyrics,
            audioURL: this.props.song.audioURL,
            userId: currentUser.id,
            comments: this.state.comments
        };

        AudioManager.update(editedSong).then(() => {
            this.setState({ showModal: false })
            this.props.updateSongs().then(() => {
                this.setState({comments: this.props.song.comments})
            })
        })
        this.close()
        // .then(() => this.props.history.push("/articles"))

    }

    closeModal = () => {
        this.setState({ showModal: false })
    }

    componentDidMount() {
        AudioManager.get(this.props.song.id)
            .then(song => {
                this.setState({
                    comments: song.comments
                });
            });
    }

    open = () => this.setState({ showModal: true })
    close = () => {
        this.setState({ showModal: false })
        this.setState({comments: this.props.song.comments})
    }

    render() {
        const currentUser = JSON.parse(sessionStorage.getItem("credentials"))
        const songId = this.props.song.id
        if (this.props.song.userId !== currentUser.id) {
            return <></>
        } else {
            return (
                <>
                    <Modal onClose={this.close} onOpen={this.open} open={this.state.showModal} trigger={<Button>{this.props.song.title.split('(')[0]}</Button>} closeIcon>
                        <Modal.Header>{this.props.song.title.split('(')[0]}</Modal.Header>
                        <Modal.Content>
                            <p>{this.props.song.lyrics}</p>
                        </Modal.Content>
                        <Modal.Content>
                            <h3>Comments</h3>
                            <label htmlFor="comments"></label>
                            <textarea rows="4" cols="30" id="comments" onChange={this.handleFieldChange} value={this.state.comments}></textarea>
                        </Modal.Content>
                        <Button onClick={this.updateExistingSong}>Save</Button>
                    </Modal>
                    <Button onClick={() => this.props.deleteSong(songId)}>Delete</Button>
                </>

            );
        }
    }
}

export default SongButton;