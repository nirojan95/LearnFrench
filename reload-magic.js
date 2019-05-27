var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({ port: 40510 })
wlist = []
wss.on('connection', function (ws) {
    wlist.push(ws)
    ws.send(``)
})


const { spawn } = require('child_process');
const chokidar = require('chokidar');


let pollServer =
    ` 
    let __init_status = false

    let __init_magic_reload = async () => {
        let closed = false
        let createConnection = () => {
            return new Promise((res, rej) => {
                var ws = new WebSocket('ws://localhost:40510');
                ws.onopen = function () {
                    res(ws)
                }
                ws.onerror = function () {
                    rej()
                }
            })
        }
    
        let delay = d => {
            new Promise((res, rej) => {
                setTimeout(res, d)
            })
        }
    
        let tryMany = async () => {
            while (true) {
                try {
                    let ret = await createConnection()
                    return ret
                } catch (err) { }
                await delay(2000)
            }
        }
        let ws = await tryMany()
        ws.onmessage = function (ev) {
            if (closed) return
            if (!__init_status) {
                __init_status = true
            }
            else {
                try { ws.close() } catch (err) { }
                window.location.reload();
            }
        }
        ws.onclose = () => {
            closed = true;
            __init_magic_reload();
        }
    }
    
    __init_magic_reload()
`


chokidar.watch(__dirname + '/build', { ignored: /(^|[\/\\])\../ }).on('all', (event, path) => {
    webpackError = undefined
    while (wlist.length > 0) {
        try { wlist.pop().send(``) } catch (err) { }
    }
});


let webpackError = undefined


const cmd = /^win/.test(process.platform) ? 'npx.cmd' : 'npx'
let webpack = spawn(cmd, ['webpack', '--watch', '--display', 'errors-only'])
webpack.stdout.on('data', data => {
    webpackError = data.toString()
    console.log('error found')
})


module.exports = app => {
    app.all('/*', (req, res, next) => {
        if (webpackError) {
            // If there's an error, display it
            res.send('<pre>' + webpackError + '</pre><script>' + pollServer + '</script>')
        } else next()
    })

}