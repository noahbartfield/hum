import React, { Component, createRef } from "react"
import { Button, Header, Form } from 'semantic-ui-react'
import * as firebase from 'firebase/app';
import 'firebase/storage'
import AudioManager from '../modules/AudioManager'
import AuddManager from "../modules/AuddManager";



class Dashboard extends Component {

    state = {
        audioURL: "",
        recording: false,
        mediaRecorder: null
    }

    async getMicrophone() {
        return await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false
        })
    }

    toggleMicrophone = () => {
        if(this.state.recording) {
            this.stopRecording()
            console.log("stop recording")
        } else {
            this.startRecording()
            console.log("start recording")
        }
    }

    startRecording = () => {
        this.getMicrophone().then(stream => {
            this.setState({recording: true})
            const mediaRecorder = new MediaRecorder(stream)
            mediaRecorder.start()
            this.setState({mediaRecorder: mediaRecorder})
        })
    }
    
    stopRecording = () => {
        this.getMicrophone().then(stream => {
            this.setState({recording: false})
            this.state.mediaRecorder.stop()
            let chunks = [];
            this.state.mediaRecorder.onstop = e => {
              const blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
              const audioURL = window.URL.createObjectURL(blob);
              console.log("audioURL", audioURL)
            }
            this.state.mediaRecorder.ondataavailable = e => {
              chunks.push(e.data);
            }
        })
    }

    uploadAudio = () => {
        const audioBlobsRef = firebase.storage().ref('audioBlobs');
        const childRef = audioBlobsRef.child(`${Date.now()}`)
        childRef.put(this.state.audio)
            .then(response => response.ref.getDownloadURL())
            .then(url => {
                console.log("upload")
                this.setState({
                    audioURL: url
                })
            })
    }

    getSong = () => {
        const currentUser = JSON.parse(sessionStorage.getItem("credentials"))
        AuddManager.get(this.state.audioURL)
            .then(foundSong => {
                fetch(`https://api.audd.io/findLyrics/?q=${foundSong.result.list[0].artist} ${foundSong.result.list[0].title}&api_token=fc69fba20d9a402ff3696cbd41daf5d4`).then(data => data.json())
                    .then(lyrics => {
                        console.log(lyrics.result[0].lyrics)
                        AudioManager.post({
                            title: foundSong.result.list[0].title,
                            lyrics: lyrics.result[0].lyrics,
                            userId: currentUser.id,
                            audioURL: this.state.audioURL,
                            comments: ""
                        })
                    })
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
                <div>
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
                <Form onSubmit={this.uploadAudio}>
                    <Form.Field
                        control="input"
                        type="file"
                        label="User Audio"
                        onChange={(e) => this.setState({ audio: e.target.files[0] })}
                    />
                    <Button type="submit" content="Save" color="purple" />
                </Form>
                <Form onSubmit={this.getSong}>
                    <Button type="submit" content="Search" color="blue" />
                </Form>
            </>
        )
    }
}

export default Dashboard




// stopMicrophone() {
//     // const currentUser = JSON.parse(sessionStorage.getItem("credentials"))

//     // let audio = React.createElement('audio')
//     this.state.audio.getTracks().forEach(track => track.stop());
//     let chunks = [];
//     const blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
//     const audioURL = window.URL.createObjectURL(blob);
//     console.log(audioURL)
//     console.log(this.state.audio)

//     // AuddManager.get(audioURL)
//     //     .then(foundSong => {
//     //         console.log(foundSong)
//             // fetch(`https://api.audd.io/findLyrics/?q=${foundSong.result.list[0].artist} ${foundSong.result.list[0].title}&api_token=fc69fba20d9a402ff3696cbd41daf5d4`).then(data => data.json())
//             //     .then(lyrics => {
//             //         console.log(lyrics.result[0].lyrics)
//             //         AudioManager.post({
//             //             title: foundSong.result.list[0].title,
//             //             lyrics: lyrics.result[0].lyrics,
//             //             userId: currentUser.id,
//             //             audioURL: this.state.audioURL,
//             //             comments: ""
//             //         })
//             //     })
//         // })
//     // audio = audioURL;
//     // this.setState({ audio: null });
//     console.log(this.state.audio.getAudioTracks())
// }

// toggleMicrophone() {
//     if (this.state.audio) {
//         this.stopMicrophone();
//     } else {
//         this.getMicrophone();
//     }
// }

///////////////////////////////////////////

// TRASH


// constructor(props) {
//     super(props);
//     this.state = {
//         audio: null,
//         audioURL: "",
//         recording: false,
//         mediaRecorder: null
//     };
//     this.toggleMicrophone = this.toggleMicrophone.bind(this)
// }

// async getMicrophone() {
//     return await navigator.mediaDevices.getUserMedia({
//         audio: true,
//         video: false
//     }).then(audio => {
//         this.setState({ audio });
//         console.log("before")
//         this.recorder()

//     })

// }

// stopMicrophone = () => {
//     // let audio = React.createElement('audio')

//     this.state.audio.getTracks().forEach(track => track.stop());
//     // let chunks = [];
//     // const blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
//     // const audioURL = window.URL.createObjectURL(blob);
//     // console.log(audioURL)
//     console.log(this.state.audio)
//     // this.recorder()
//     this.setState({ audio: null })
// }

// toggleMicrophone = () => {
//     if (this.state.audio) {
//         this.stopMicrophone()
//         this.stopRecording()
//     } else {
//         this.getMicrophone()
//         this.startRecording()
//     }
// }

// recorder = () => {
//     console.log("audio", this.state.audio)
//     let r = new MediaRecorder(this.state.audio)
//     console.log(r)
//     let chunks = []
//     r.ondataavailable = (e) => {
//         chunks.push(e.data)
//     }
//     r.onstop = (e) => {
//         let audioArray = []
//         audioArray.push(e.data)
//         let blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
//         let audioURL = window.URL.createObjectURL(blob);
//         console.log(audioURL)
//         console.log("e.data", e.data)
//         chunks = []
//         // console.log("after")
//     }
//     this.setState({mediaRecorder: r})
// }


// startRecording = () => {
//     this.state.mediaRecorder.start()
//     // this.state.mediaRecorder.start()
//     // console.log("record start")
// }

// stopRecording = () => {
//     // console.log("record stop")
// }