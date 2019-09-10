import React, { Component } from 'react'
// import EditSongModal from "./EditSongModal"
// import EditModalHelper from './EditModalHelper';
// import './Song.css'
// import { Button } from 'reactstrap';

class SongButton extends Component {

    

    render() {

            return (
                <div className="card">
                    <div className="card-content">
                        <h3>{this.props.song.title}</h3>
                        <p>{this.props.song.lyrics}</p>
                    </div>
                </div>
            );
    }
}

export default SongButton;