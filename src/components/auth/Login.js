import React, { Component } from "react"
import { Link } from "react-router-dom"
import UserManager from "../../modules/UserManager"
import { Button, Input } from 'semantic-ui-react'
import './auth.css'

class Login extends Component {

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



    handleLogin = (event) => {
        event.preventDefault()
        UserManager.getUsernamePassword(this.state.username, this.state.password).then(user => {
            if (user.length === 0) {
                window.alert("Not a valid username or password")
                document.querySelector("#username").value = ""
                document.querySelector("#password").value = ""
            } else {
                this.setState({ id: user[0].id })
                sessionStorage.setItem(
                    "credentials",
                    JSON.stringify({
                        username: this.state.username,
                        password: this.state.password,
                        id: this.state.id
                    })
                )
                this.props.history.push("/");
            }
        })
    }

    render() {
        return (
            <div className="login_container">
                <div className="titleContainer">
                    <h1 className="title">h u m</h1>
                </div>
                <form onSubmit={this.handleLogin}>
                    <div className="formField">
                        <h3 className="subtitle">Login</h3>
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
                    <div className="submitOrRegister">
                        <br></br>
                        <Link className="nav-link_login" to="/register">New User?</Link>
                    </div>
                </form></div>
        )
    }
}
export default Login