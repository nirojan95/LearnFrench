let express = require('express')
let app = express()

//*** Add your routes between here


//*** and here


let __version = "" + Math.floor(Math.random() * 10000000000)
app.get("/__version", (req, res) => {
    res.send(__version)
})

let webpackError = undefined
app.all('/*', (req, res, next) => {
    if (webpackError) {
        res.send('<h4>' + webpackError + '</h4>')
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
    app.listen(4000)
}
setup()

