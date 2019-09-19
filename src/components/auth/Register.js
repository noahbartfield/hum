import React, { Component } from "react"
import { Link } from "react-router-dom"
import UserManager from "../../modules/UserManager"
import { Button, Input } from 'semantic-ui-react'
import './auth.css'

class Register extends Component {

    // Set initial state
    state = {
        username: "",
        password: "",
        id: 0
    }

    handleFieldChange = (event) => {
        const stateToChange = {}
        stateToChange[event.target.id] = event.target.value
        this.setState(stateToChange)
    }

    handleRegister = (event) => {
        event.preventDefault()
        UserManager.getUsername(this.state.username).then(user => {
            if (user.length !== 0) {
                window.alert("Account already exists")
                document.querySelector("#username").value = ""
                document.querySelector("#password").value = ""
            } else if (this.state.username.length === 0 || this.state.password.length === 0) {
                window.alert("Please fill out all fields")
            } else {
            UserManager.post(this.state).then((object) => {
                sessionStorage.setItem(
                    "credentials",
                JSON.stringify({
                    username: this.state.username,
                    password: this.state.password,
                    id: object.id
                })
            )
                this.props.history.push("/");
            })
        }
    })
    }

    handleCancel = (event) => {
        event.preventDefault()
        this.props.history.push("/login");
    }

    render() {
        return (
            <div className="login_container">
                <div className="titleContainer">
                    <h1 className="title">h u m</h1>
                </div>
                <form onSubmit={this.handleRegister}>
                <div className="formField">
                        <h3 className="subtitle">Register</h3>
                        </div>
                        <div className="formField">
                            <label htmlFor="inputUsername"></label>
                            <Input onChange={this.handleFieldChange} type="username"
                                id="username"
                                placeholder="username"
                                required="" autoFocus="" />
                            <label htmlFor="inputPassword"></label>
                            <Input onChange={this.handleFieldChange} type="password"
                                id="password"
                                placeholder="password"
                                required="" />
                        </div>
                        <div className="submitOrRegister">
                        <Button className="ui red circular button" type="submit">
                            Submit
                        </Button>
                        </div>
                        <div  className="submitOrRegister">
                        <br></br>
                        <Link onClick={this.handleCancel} className="nav-link_login" to="/register">Back to Login</Link>
                        </div>
                </form></div>
        )
    }


}

export default Register