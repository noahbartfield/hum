import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from "react-router-dom"
import 'semantic-ui-css/semantic.min.css'
import Hum from './Hum'
import './index.css'
import * as firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyB_HhkFrcWuHvipwriVM08BV0mxFDBmbmU",
  authDomain: "humm-47a5b.firebaseapp.com",
  databaseURL: "https://humm-47a5b.firebaseio.com",
  projectId: "humm-47a5b",
  storageBucket: "humm-47a5b.appspot.com",
  messagingSenderId: "484249361149",
  appId: "1:484249361149:web:fc0827c8261eb4cdb77c94"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <Router>
      <Hum />
  </Router>
  , document.getElementById('root'))


