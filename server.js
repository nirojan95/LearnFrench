let express = require('express')
let app = express()

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

//*** Add your routes between here


//*** and here


let __version = "" + Math.floor(Math.random() * 10000000000)
app.get("/__version", (req, res) => {
    res.send(__version)
})

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
let setup = async () => {
    let shell = require('shelljs');
    let exec = shell.exec
    let runWebpack = () => {
        return new Promise((res, rej) => {
            exec('npx webpack --display errors-only', (code, stdout, stderr) => {
                res({ code, stdout, stderr })
            })
        });
    }

    let { code, stdout, stderr } = await runWebpack()

    if (code !== 0) {
        webpackError = stdout
    }
    app.listen(4000, '0.0.0.0', () => { console.log("Server running on port 4000") })
}
setup()

