let __init_status = false

let __init_magic_reload = async () => {

    let closed = false
    let createConnection = () => {
        return new Promise((res, rej) => {
            var ws = new WebSocket('ws://localhost:40510');
            ws.onopen = function () {
                console.log('connected')
                res(ws)
            }
            ws.onerror = function () {
                rej()
            }
        })
    }

    function delay(t, v) {
        return new Promise(function (resolve) {
            setTimeout(resolve.bind(null, v), t)
        });
    }

    let tryMany = async () => {

        while (true) {
            try {
                console.log("attempting")
                let ret = await createConnection()
                return ret
            } catch (err) { }
            await delay(100)
        }
    }
    let ws = await tryMany()
    ws.onmessage = function (ev) {

        if (!__init_status) {
            __init_status = true
        }
        else {
            try { ws.close() } catch (err) { }
            window.location.reload();
        }
    }
    ws.onclose = async () => {

        let ws = await tryMany()
        ws.onmessage = function () {
            window.location.reload();
        }
    }
}

export default __init_magic_reload