import React, { Component } from "react"
import { Button, Header, Form, Modal, Icon, Sidebar, Menu, } from 'semantic-ui-react'
import { Link } from "react-router-dom"
import * as firebase from 'firebase/app';
import 'firebase/storage'
import AudioManager from '../modules/AudioManager'
import AuddManager from "../modules/AuddManager";
import SongList from "./sidebar/SongList"
import './Dashboard.css'
import AddModal from "./mainFeature/AddModal"



class Dashboard extends Component {

    state = {
        audioURL: "",
        recording: false,
        mediaRecorder: null,
        audio: "",
        songs: [],
        title: "",
        lyrics: "",
        comments: "",
        showModal: false,
        active: false,
        noResults: false,
        visible: false
    }

    componentDidMount() {
        this.updateSongs()
    }

    updateSongs = () => {
        return AudioManager.getAll().then(songs => {
            this.setState({ songs: songs })
        })
    }

    async getMicrophone() {
        return await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false
        })
    }

    toggleMicrophone = () => {
        if (this.state.recording) {
            this.stopRecording()
            console.log("stop recording")

        } else {
            this.startRecording()
            console.log("start recording")
        }
    }

    startRecording = () => {
        this.getMicrophone().then(stream => {
            this.setState({ recording: true })
            const mediaRecorder = new MediaRecorder(stream)
            mediaRecorder.start()
            this.setState({ mediaRecorder: mediaRecorder })
        })
    }

    stopRecording = () => {
        this.getMicrophone().then(stream => {
            this.setState({ recording: false })
            this.state.mediaRecorder.stop()
            let chunks = [];
            this.state.mediaRecorder.onstop = e => {
                const blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
                const audioURL = window.URL.createObjectURL(blob);
                console.log(blob)
                this.setState({
                    audio: blob
                })
                this.getSong()
            }
            this.state.mediaRecorder.ondataavailable = e => {
                chunks.push(e.data);
            }
        })
    }


    uploadAudioToFirebase = () => {
        const audioBlobsRef = firebase.storage().ref('audioBlobs');
        const childRef = audioBlobsRef.child(`${Date.now()}`)
        return childRef.put(this.state.audio)
            .then(response => response.ref.getDownloadURL())
            .then(url => {
                console.log("upload")
                this.setState({
                    audioURL: url,
                    noResults: false
                })
            })
    }

    getSong = () => {
        this.uploadAudioToFirebase().then(() => {
            console.log(this.state.audio.size)
            if (this.state.audio.size < 13000) {
                this.setState({
                    noResults: true
                })
            } else {
                AuddManager.get(this.state.audioURL)
                    .then(foundSong => {
                        console.log(foundSong)
                        if (foundSong.error || foundSong.result === null || foundSong.result.length === 0) {
                            this.setState({
                                noResults: true
                            })
                        } else if (foundSong.result !== null) {
                            fetch(`https://api.audd.io/findLyrics/?q=${foundSong.result.list[0].artist} ${foundSong.result.list[0].title.split('(')[0]}&api_token=fc69fba20d9a402ff3696cbd41daf5d4`).then(data => data.json())
                                .then(lyrics => {
                                    if (lyrics.result.length !== 0) {
                                        console.log(lyrics)
                                        console.log(lyrics.result[0].lyrics)
                                        this.setState({
                                            title: foundSong.result.list[0].title,
                                            lyrics: lyrics.result[0].lyrics,
                                        })
                                        // this.updateSongs()  
                                        this.toggleModal()
                                    } else {
                                        console.log("NO LYRICS")
                                        this.setState({
                                            noResults: true
                                        })
                                    }
                                })
                        } else {
                            this.setState({
                                noResults: true
                            })
                        }
                    })
            }
        })
    };

    addSong = () => {
        const currentUser = JSON.parse(sessionStorage.getItem("credentials"))
        AudioManager.post({
            title: this.state.title,
            lyrics: this.state.lyrics,
            userId: currentUser.id,
            audioURL: this.state.audioURL,
            comments: this.state.comments
        }).then(() => {
            this.updateSongs()
            this.toggleModal()
            this.setState({
                audioURL: "",
                recording: false,
                mediaRecorder: null,
                audio: "",
                title: "",
                lyrics: "",
                comments: "",
                showModal: false,
                active: false
            })
        })
    }

    handleFieldChange = evt => {
        const stateToChange = {}
        stateToChange[evt.target.id] = evt.target.value
        this.setState(stateToChange)
    }

    open = () => this.setState({ showModal: true })

    close = () => this.setState({
        showModal: false,
        active: !this.state.active,
        audioURL: "",
        recording: false,
        mediaRecorder: null,
        audio: "",
        title: "",
        lyrics: "",
        comments: ""
    })

    toggleModal = () => {
        this.setState({
            active: !this.state.active
        })
    }

    signOut = () => {
        sessionStorage.clear()
        this.props.history.push("/login")
    }

    handleClick = () => {
        if (this.state.visible === false) {
            this.setState({ visible: true })
        } else {
            this.setState({ visible: false })
        }
    }

    render() {
        const currentUser = JSON.parse(sessionStorage.getItem("credentials"))
        const { visible } = this.state
        return (
            <>

                <div className="dashboardContainer">
                    <nav className="navBar">
                        <div>
                            <h3>{currentUser.username}</h3>
                            <Button onClick={this.signOut}>Sign Out</Button>
                        </div>
                        <Button className="showButton" onClick={this.handleClick}>
                            <Icon name={this.state.visible 
                                ? "delete" 
                                : "bars"}/>
                        </Button>
                    </nav>
                    <Sidebar.Pushable >
                        <Sidebar
                            as={Menu}
                            animation='overlay'
                            icon='labeled'
                            // inverted
                            vertical
                            direction='right'
                            visible={visible}
                            // width='thin'
                        >
                            <SongList
                                updateSongs={this.updateSongs}
                                songs={this.state.songs}
                                {...this.props}
                            />

                        </Sidebar>
                        <Sidebar.Pusher>
                            <div>
                                <div className="dashboard">

                                </div>
                                <Header className="title" as='h1' textAlign='center'>h u m</Header>
                                <div className="App">
                                    <main>
                                        <div className="controls">

                                            <div className="recordButton">
                                                <Button onClick={this.toggleMicrophone} className=
                                                    {this.state.recording
                                                        ? "blink ui circular icon button red massive"
                                                        : "ui circular icon button red massive"}>
                                                    <Icon name={this.state.recording ? 'stop' : 'play'} />
                                                </Button>
                                            </div>
                                        </div>
                                    </main>
                                </div>
                                {this.state.noResults &&
                                    <div>
                                        <p>Sorry, No Results</p>
                                    </div>
                                }
                                {this.state.active &&
                                    <AddModal
                                        {...this.props}
                                        title={this.state.title}
                                        lyrics={this.state.lyrics}
                                        comments={this.state.comments}
                                        addSong={this.addSong}
                                        handleFieldChange={this.handleFieldChange}
                                        close={this.close}
                                        open={this.open}
                                    />
                                }
                                <Form onSubmit={this.getSong}>
                                    <Form.Field
                                        control="input"
                                        type="file"
                                        label="User Audio"
                                        onChange={(e) => this.setState({ audio: e.target.files[0] })}
                                    />
                                    <Button type="submit" content="Save" color="purple" />
                                </Form>
                            </div>
                        </Sidebar.Pusher>
                    </Sidebar.Pushable>
                </div>

            </>
        )
    }
}

export default Dashboard




            // Turned this modal into AddModal. Keeping just in case I fucked it up

//     < Modal onClose={this.close} onOpen={this.open} open={this.state.showModal} trigger={< Button > View Results</Button >} closeIcon >
//         <Modal.Header>{this.state.title.split('(')[0]}</Modal.Header>
//         <Modal.Content>
//             <p>{this.state.lyrics}</p>
//         </Modal.Content>
//         <Modal.Content>
//             <h3>Comments</h3>
//             <label htmlFor="comments"></label>
//             <textarea rows="4" cols="30" id="comments" onChange={this.handleFieldChange} value={this.state.comments}></textarea>
//         </Modal.Content>
//         <Button onClick={this.addSong}>Save</Button>
//     </Modal >