import React, { Component } from "react"
import { Button, Modal } from 'semantic-ui-react'

class AddModal extends Component {

    render() {
        return (
            <Modal onClose={this.props.close} onOpen={this.props.open} open={this.props.showModal} trigger={<Button className="tiny grey">View Results</Button>} closeIcon>
                <Modal.Header className="modalHeader">{this.props.title.split('(')[0]}</Modal.Header>
                <div className="lyricsAndComments">
                    <Modal.Content className="lyricsInModal">
                        {this.props.artist !== "" &&
                            <h5 className="artistName">{this.props.artist}</h5>
                        }
                        {this.props.lyrics !== "" &&
                            this.props.lyrics
                        }
                    </Modal.Content>
                    <Modal.Content>
                        <h3 className="commentsTitle">Comments</h3>
                        <label htmlFor="comments"></label>
                        <textarea className="textArea" rows="20" cols="15" id="comments" onChange={this.props.handleFieldChange} value={this.props.comments}></textarea>
                        <p className="videoLink"><a href={this.props.videoURL} target="_blank" rel="noopener noreferrer"><i>Video:</i> <strong>{this.props.title.split('(')[0]}</strong></a></p>
                    </Modal.Content>
                </div>
                <Button className="saveButton" attached onClick={this.props.addSong}>Save</Button>
            </Modal>
        )
    }
}

export default AddModal