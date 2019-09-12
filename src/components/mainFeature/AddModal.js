import React, { Component } from "react"
import { Button, Header, Form, Modal } from 'semantic-ui-react'

class AddModal extends Component {

    render() {
        return (
            <Modal onClose={this.props.close} onOpen={this.props.open} open={this.props.showModal} trigger={<Button>View Results</Button>} closeIcon>
                <Modal.Header>{this.props.title.split('(')[0]}</Modal.Header>
                <Modal.Content>
                    <p>{this.props.lyrics}</p>
                </Modal.Content>
                <Modal.Content>
                    <h3>Comments</h3>
                    <label htmlFor="comments"></label>
                    <textarea rows="4" cols="30" id="comments" onChange={this.props.handleFieldChange} value={this.props.comments}></textarea>
                </Modal.Content>
                <Button onClick={this.props.addSong}>Save</Button>
            </Modal>
        )
    }
}

export default AddModal