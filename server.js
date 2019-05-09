let express = require('express')
let app = express()

//*** Add your routes between here


//*** and here

const { spawn } = require('child_process');
const chokidar = require('chokidar');

let pollServer =
    `let __version = undefined

let delay = t => new Promise((res, rej) => setTimeout(() => res(), t))
let checkVersion = async () => {
    await fetch('/__version')
        .then(x => x.text())
        .then(v => {
            __version = v
        })
        

    while (true) {
        await delay(300)
        try {
            let x = await fetch('/__version')
            let newVersion = await x.text()
            if (__version !== newVersion) {
                location.reload();
            }
        } catch (err) { }
    }
}
checkVersion()
`

let genId = () => "" + Math.floor(Math.random() * 10000000000)
let __version = genId()
app.get("/__version", (req, res) => {
    res.send(__version)
})

chokidar.watch(__dirname + '/build', { ignored: /(^|[\/\\])\../ }).on('all', (event, path) => {
    webpackError = undefined
    __version = genId()
});


let webpackError = undefined
app.all('/*', (req, res, next) => {
    if (webpackError) {
        res.send('<h4>' + webpackError + '</h4><script>' + pollServer + '</script>')
    } else {
        next()
    }
})
app.use('/', express.static('build'));
app.all('/*', (req, res) => {
    res.sendFile(__dirname + '/build/index.html');
});
let counter = 0
let setup = async () => {
    const  cmd = /^win/.test(process.platform) ? 'npx.cmd' : 'npx'
    let webpack = spawn(cmd, ['webpack', '--watch', '--display', 'errors-only'])
    webpack.stdout.on('data', data => {
        webpackError = data.toString()
    })
    app.listen(4000, '0.0.0.0', () => { console.log("Server running on port 4000") })
}
setup()

