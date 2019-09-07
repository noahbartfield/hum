import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from "react-router-dom"
import 'semantic-ui-css/semantic.min.css'
import Hum from './Hum'
import './index.css'

ReactDOM.render(
  <Router>
      <Hum />
  </Router>
  , document.getElementById('root'))


