import ReactDOM from 'react-dom'
import './main.css'
import App from './App.jsx'
import React from 'react'

import reloadMagic from './reload-magic-client.js' // automatic reload
reloadMagic() // automatic reload

ReactDOM.render(<App />, document.getElementById("root"))