import React, { Component, createRef } from "react"
import { Button, Header, Form, Sidebar, Segment } from 'semantic-ui-react'
import * as firebase from 'firebase/app';
import 'firebase/storage'
import AudioManager from '../modules/AudioManager'
import AuddManager from "../modules/AuddManager";
import SongList from "./sidebar/SongList"
import './Dashboard.css'



class Dashboard extends Component {

    state = {
        audioURL: "",
        recording: false,
        mediaRecorder: null,
        audio: "",
        songs: []
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
                    audioURL: url
                })
            })
    }

    getSong = () => {
        this.uploadAudioToFirebase().then(() => {
            const currentUser = JSON.parse(sessionStorage.getItem("credentials"))
            console.log(this.state.audio.size)
            if (this.state.audio.size < 13000) {
                console.log("Sorry, No Results")
            } else {
                AuddManager.get(this.state.audioURL)
                    .then(foundSong => {
                        console.log(foundSong)
                        if (foundSong.result !== null && foundSong.result.lyrics === null) {
                            console.log("Sorry, no results")
                        } else if (foundSong.result !== null) {
                            fetch(`https://api.audd.io/findLyrics/?q=${foundSong.result.list[0].artist} ${foundSong.result.list[0].title.split('(')[0]}&api_token=fc69fba20d9a402ff3696cbd41daf5d4`).then(data => data.json())
                                .then(lyrics => {
                                    console.log(lyrics.result[0].lyrics)
                                    AudioManager.post({
                                        title: foundSong.result.list[0].title,
                                        lyrics: lyrics.result[0].lyrics,
                                        userId: currentUser.id,
                                        audioURL: this.state.audioURL,
                                        comments: ""
                                    }).then(() => {
                                        this.updateSongs()
                                    })
                                })
                        } else {
                            console.log("Sorry, No Results")
                        }
                    })
            }
        })
    };

    signOut = () => {
        sessionStorage.clear()
        this.props.history.push("/login")
    }

    render() {
        const currentUser = JSON.parse(sessionStorage.getItem("credentials"))
        return (
            <>
            <div className="dashboardContainer">
                <div>
                <div className="dashboard">
                    <h3>{currentUser.username}</h3>
                    <Button onClick={this.signOut}>Sign Out</Button>
                </div>
                <Header as='h1' textAlign='center'>hum</Header>
                <div className="App">
                    <main>
                        <div className="controls">

                            <div align="center">
                                <Button onClick={this.toggleMicrophone} className="ui circular icon button red massive">
                                    {this.state.recording ? 'Stop' : 'Start'}
                                </Button>
                            </div>
                        </div>
                    </main>
                </div>
                <Form onSubmit={this.getSong}>
                    <Form.Field
                        control="input"
                        type="file"
                        label="User Audio"
                        onChange={(e) => this.setState({ audio: e.target.files[0] })}
                    />
                    <Button type="submit" content="Save" color="purple" />
                </Form>
                {/* <Form onSubmit={this.getSong}>
                    <Button type="submit" content="Search" color="blue" />
                </Form> */}
                </div>
                <div className="sidebar">
                        <SongList
                            updateSongs={this.updateSongs}
                            songs={this.state.songs}
                            {...this.props}
                        />
                </div>
            </div>
            </>
        )
    }
}

export default Dashboard
