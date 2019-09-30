import React, { Component } from 'react'
// import EditSongModal from "./EditSongModal"
// import EditModalHelper from './EditModalHelper';
// import './Song.css'
import { Button, Modal, Icon } from 'semantic-ui-react'
// import EditModal from './EditModal'
import AudioManager from '../../modules/AudioManager'
import './SongButton.css'



class SongButton extends Component {

    state = {
        comments: "",
        showModal: false,
        showDeleteModal: false
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
                this.setState({ comments: this.props.song.comments })
            })
        })
        this.close()
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
        this.setState({ comments: this.props.song.comments })
    }

    openDeleteModal = () => this.setState({ showDeleteModal: true })
    closeDeleteModal = () => this.setState({ showDeleteModal: false })

    render() {
        const currentUser = JSON.parse(sessionStorage.getItem("credentials"))
        const songId = this.props.song.id
        if (this.props.song.userId !== currentUser.id) {
            return <></>
        } else {
            return (
                <>
                <div className="songButtonContainer">
                    <Modal onClose={this.close} onOpen={this.open} open={this.state.showModal} trigger={<Button className="trackButton">"{this.props.song.title.split('(')[0]}"</Button>} closeIcon>
                        <Modal.Header className="modalHeader">{this.props.song.title.split('(')[0]}</Modal.Header>
                        <div className="lyricsAndComments">
                            <Modal.Content className="lyricsInModal">
                                {this.props.song.artist !== "" &&
                                    <h5 className="artistName">{this.props.song.artist}</h5>
                                }
                                {this.props.song.lyrics !== "" &&
                                    this.props.song.lyrics.replace("I ", "i ").replace("I'm", "i'm").replace("I'll", "i'll").replace("I've", "i've").split(/(?=[A-Z])/).map(lyric => {
                                        return <p key={Math.random() * 9999999999999}>{lyric.replace("[", "").replace("]", "")}</p>
                                    })
                                }
                                {/* <p>{this.props.song.lyrics}</p> */}
                            </Modal.Content>
                            <Modal.Content>
                                <h3 className="commentsTitle" >Comments</h3>
                                <label htmlFor="comments"></label>
                                <textarea className="textArea" rows="20" cols="15" id="comments" onChange={this.handleFieldChange} value={this.state.comments}></textarea>
                                <p className="videoLink"><a href={this.props.song.videoURL} target="_blank" rel="noopener noreferrer"><i>Video:</i> <strong>{this.props.song.title.split('(')[0]}</strong></a></p>
                            </Modal.Content>
                        </div>
                        <Button className="saveButton" attached onClick={this.updateExistingSong}>Save</Button>
                    </Modal>
                    <Modal className="mini" onClose={this.closeDeleteModal} onOpen={this.openDeleteModal} open={this.state.showDeleteModal} trigger={<Button className="ui deleteButton circular icon button small"><Icon name="trash alternate outline" /></Button>} closeIcon>
                        <Modal.Header className="deleteModal">Delete "{this.props.song.title.split('(')[0]}"?</Modal.Header>
                        <Button className="deleteButtonModal" attached onClick={() => this.props.deleteSong(songId)}>Delete</Button>
                    </Modal>
                    </div>

                </>

            );
        }
    }
}

export default SongButton;