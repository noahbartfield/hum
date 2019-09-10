import React, { Component } from "react"
// import SongManager from '../../modules/SongManager'
import SongButton from './SongButton'
import AudioManager from '../../modules/SongManager'

class SongList extends Component {



    // deleteSong = id => {
    //     SongManager.delete(id)
    //         .then(() => {
    //             this.didMountFunction()
    //         })
    // }

    render() {
        if (this.props.songs.length !== 0) {
            return (
                <>
                    <div id="songsContainer">
                        {this.props.songs.map(song => {
                            return <SongButton
                                key={song.id}
                                song={song}
                                // deleteSong={this.deleteSong}
                                {...this.props}
                                // didMountFunction={this.didMountFunction}
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