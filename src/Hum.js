import { Route, Redirect } from "react-router-dom";
import React, { Component } from "react";
import Login from "./components/auth/Login"
import Register from "./components/auth/Register"
import Dashboard from "./components/Dashboard"
import './Hum.css'




class ApplicationViews extends Component {
  isAuthenticated = () => sessionStorage.getItem("credentials") !== null
  render() {
    return (
      <React.Fragment>
        <Route exact path ="/login" render={props => {
          if (this.isAuthenticated()) {
            return <Redirect to="/" />
          } 
          return <Login {...props} />
        }}/>
        <Route exact path ="/register" render={props => {
          if (this.isAuthenticated()) {
            return <Redirect to="/" />
          } 
          return <Register {...props} />
        }}/>
        <Route path ="/" render={props => {
            if (this.isAuthenticated()) {
              return (
              <Dashboard {...props} />
              )
            } 
            return <Redirect to="/login" />
          }}/>
      </React.Fragment>
    );
  }
}

export default ApplicationViews
