import React, { Component } from "react"
import { Button, Modal } from 'semantic-ui-react'
// import '../Dashboard.css'

class AddModal extends Component {

    render() {
        const lyricArray = this.props.lyrics.split(/(?=[A-H]|[J-Z])/)
        return (
            <Modal onClose={this.props.close} onOpen={this.props.open} open={this.props.showModal} trigger={<Button>View Results</Button>} closeIcon>
                <Modal.Header className="modalHeader">{this.props.title.split('(')[0]}</Modal.Header>
                <div className="lyricsAndComments">
                    <Modal.Content className="lyricsInModal">
                        {this.props.lyrics !== "" &&
                        lyricArray.map(lyric => {
                            return <p key={Math.random() * 9999999999999}>{lyric.replace("[", "").replace("]", "").replace("Verse", "").replace("Chorus", "").replace("Bridge", "").replace("Outro", "").replace(/[1-9]/, "")}</p>
                        })
                    }
                    </Modal.Content>
                    <Modal.Content>
                        <h3>Comments</h3>
                        <label htmlFor="comments"></label>
                        <textarea rows="20" cols="20" id="comments" onChange={this.props.handleFieldChange} value={this.props.comments}></textarea>
                    </Modal.Content>
                </div>
                <Button color="blue" attached onClick={this.props.addSong}>Save</Button>
            </Modal>
        )
    }
}

export default AddModal