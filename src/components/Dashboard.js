import React, { Component } from "react"
import { Button, Header, Form, Icon, Sidebar, Menu } from 'semantic-ui-react'
// import { Link } from "react-router-dom"
import * as firebase from 'firebase/app';
import 'firebase/storage'
import AudioManager from '../modules/AudioManager'
import AuddManager from "../modules/AuddManager";
import auddToken from "../apiToken"
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
        visible: false,
        loading: false
    }

    signOut = () => {
        sessionStorage.clear()
        this.props.history.push("/login")
    }

    componentDidMount() {
        this.updateSongs()
    }

    updateSongs = () => {
        return AudioManager.getAll().then(songs => {
            this.setState({ songs: songs })
        })
    }

    

    // record button /////////////////////////////

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
        this.setState({
            loading: true
        })
        this.getMicrophone().then(stream => {
            this.setState({ recording: false })
            this.state.mediaRecorder.stop()
            let chunks = [];
            this.state.mediaRecorder.onstop = e => {
                const blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
                // const audioURL = window.URL.createObjectURL(blob);
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



    // Interacting with Firebase and API ///////////////////////

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
        this.setState({
            loading: true
        })
        this.uploadAudioToFirebase().then(() => {
            console.log(this.state.audio.size)
            if (this.state.audio.size < 13000) {
                this.setState({
                    noResults: true,
                    loading: false,
                    audio: ""
                })
            } else {
                AuddManager.get(this.state.audioURL)
                    .then(foundSong => {
                        console.log(foundSong)
                        if (foundSong.error || foundSong.result === null || foundSong.result.length === 0) {
                            this.setState({
                                noResults: true,
                                loading: false,
                                audio: ""
                            })
                        } else if (foundSong.result !== null) {
                            // AuddManager.getLyrics(foundSong.result.list[0].artist, foundSong.result.list[0].title.split('(')[0])
                            fetch(`https://api.audd.io/findLyrics/?q=${foundSong.result.list[0].artist} ${foundSong.result.list[0].title.split('(')[0]}&api_token=${auddToken}`).then(data => data.json())
                                .then(lyrics => {
                                    if (lyrics.result.length !== 0) {
                                        console.log(lyrics)
                                        console.log(lyrics.result[0].lyrics)
                                        this.setState({
                                            title: foundSong.result.list[0].title,
                                            lyrics: lyrics.result[0].lyrics,
                                            loading: false,
                                            audio: ""
                                        })
                                        this.toggleModal()
                                    } else {
                                        console.log("NO LYRICS")
                                        this.setState({
                                            noResults: true,
                                            loading: false,
                                            audio: ""
                                        })
                                    }
                                })
                        } else {
                            this.setState({
                                noResults: true,
                                loading: false,
                                audio: ""
                            })
                        }
                    })
            }
        })
    };



    // Modal Functions //////////////////////////

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

    handleClick = () => {
        if (this.state.visible === false) {
            this.setState({ visible: true })
        } else {
            this.setState({ visible: false })
        }
    }

    render() {
        const isLoading = this.state.loading
        const currentUser = JSON.parse(sessionStorage.getItem("credentials"))
        const { visible } = this.state
        return (
            <>
                <div className="dashboardContainer">
                    <nav className="navBar">
                        <Button className="showButton ui massive" onClick={this.handleClick}>
                            <Icon name={this.state.visible
                                ? "delete"
                                : "bars"} />
                        </Button>
                    </nav>
                    <Sidebar.Pushable >
                        <Sidebar
                            as={Menu}
                            animation='overlay'
                            icon='labeled'
                            vertical
                            direction='right'
                            visible={visible}
                            // width='medium'
                        >
                            <div id="logOutContainer">
                                <Button id="logOutButton"onClick={this.signOut}>sign out as {currentUser.username}</Button>
                            </div>
                            <SongList
                                updateSongs={this.updateSongs}
                                songs={this.state.songs}
                                {...this.props}
                            />
                        </Sidebar>
                        <Sidebar.Pusher>
                            <div>
                                <Header className="title" as='h1' textAlign='center'>h u m</Header>
                                <Header className="subtitle" as='h4' textAlign='center'>sing a song</Header>
                                <div className="App">
                                    <main>
                                        <div className="controls">

                                            <div className="recordButton">
                                                {isLoading 
                                                ? <Button
                                                    loading
                                                    disabled
                                                    onClick={this.toggleMicrophone}
                                                    className="ui circular icon button red massive">
                                                        Loading
                                                    </Button>
                                                : <Button
                                                    onClick={this.toggleMicrophone}
                                                    className=
                                                    {this.state.recording
                                                        ? "blink ui circular icon button red massive"
                                                        : "ui circular icon button red massive"}>    
                                                    {this.state.recording
                                                        ? <Icon name='stop' />
                                                        : <Icon name='microphone' />}
                                                </Button>
                                            }
                                            </div>
                                        </div>
                                    </main>
                                </div>
                                {this.state.noResults &&
                                    <div className="noResults">
                                        <p>Sorry, No Results</p>
                                    </div>
                                }
                                {this.state.active &&
                                <div className="viewResultsButton">
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
                                </div>
                                }
                                <Form className="fileUploadContainer" onSubmit={this.getSong}>
                                    <h5 className="uploadText">or upload</h5>
                                    <Form.Field
                                        className="fileUploadField"
                                        control="input"
                                        type="file"
                                        onChange={(e) => this.setState({ audio: e.target.files[0] })}
                                    />
                                    {(!isLoading && this.state.audio !== "") && <Button className="ui button small"type="submit" content="upload" color="blue" />}
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
