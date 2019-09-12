import React, { Component } from "react"
import UserManager from "../../modules/UserManager"

class Register extends Component {

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
                <form onSubmit={this.handleRegister}>
                <h2 className="welcome">hum</h2>
                <fieldset>
                    <h3>Register</h3>
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
                    <button color="dark" size="sm" type="submit">
                        Submit
            </button>
            <button color="dark" size="sm" type="cancel" onClick={this.handleCancel}>
                        Cancel
            </button>
                </fieldset>
            </form>
            </div>
        )
    }

}

export default Register