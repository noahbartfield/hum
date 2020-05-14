import React, { Component } from "react"
import SongButton from './SongButton'
import AudioManager from '../../modules/AudioManager'
import './SongList.css'

class SongList extends Component {


    deleteSong = id => {
        AudioManager.delete(id)
            .then(() => {
                this.props.updateSongs()
            })
    }

    render() {
        if (this.props.songs.length !== 0) {
            return (
                <>
                    <div id="songsContainer">
                        {this.props.songs.map(song => {
                            return <SongButton
                                key={song.id}
                                song={song}
                                updateSongs={this.props.updateSongs}
                                deleteSong={this.deleteSong}
                                {...this.props}
                            />
                        }
                        )}
    
                    </div>
                </>
            )
        } else {
            return <></>
        }
    }
}

export default SongList;