import React, { Component } from "react"
import { Link } from "react-router-dom"
import UserManager from "../../modules/UserManager"
import { Button } from 'semantic-ui-react'

class Login extends Component {

    // Set initial state
    state = {
        username: "",
        password: "",
        id: 0
    }

    // Update state whenever an input field is edited
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
            <form onSubmit={this.handleLogin}>
                <h2 className="welcome">hum</h2>
                <fieldset>
                    <h3>Login</h3>
                    <div className="formgrid">
                        <label htmlFor="inputUsername"></label>
                        <input onChange={this.handleFieldChange} type="username"
                            id="username"
                            placeholder="Enter username"
                            required="" autoFocus="" />
                        <label htmlFor="inputPassword"></label>
                        <input onChange={this.handleFieldChange} type="password"
                            id="password"
                            placeholder="Password"
                            required="" />
                    </div>
                    <Button className="ui red button" type="submit">
                        Submit
            </Button>
            <br></br>
                    <Link className="nav-link_login" to="/register">Don't have an account?</Link>
                </fieldset>
            </form></div>
        )
    }
}
export default Login