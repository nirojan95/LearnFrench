import ReactDOM from 'react-dom'
import './main.css'
import React, { Component } from 'react'

class App extends Component {
    render = () => {
        return "hello world!!!"
    }
}

ReactDOM.render(<App />, document.getElementById("root"))