const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const nedb = require('nedb');
const dotenv = require('dotenv');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
require('express-ws')(app);
dotenv.config();
const db = {}

//Global variables
let config = null;
let products = null;
let history = null;
let started = false;
let timer = null;
let masterSocket = null;
let connections = [];
let lastUpdate = 0;
let server = null;

//Helper functions
const btoa = (binary) => {
    return Buffer.from(binary, 'binary').toString('base64') //polyfill vanilla for encoding base64
}
const atob = (base64) => {
    return Buffer.from(base64, 'base64').toString('binary') //polyfill vanilla for decoding base64
}
const removeSocket = (socket) => {
    connections = connections.filter(conn => {
        return (conn === socket) ? false : true
    });
    if (connections.length === 0){
        timer = null;
        started = false;
        masterSocket = null;
    }
}

const updateProducts = async () => {
    return new Promise((resolve, reject) => {
        resolve()
    })
}

//Websocket server
app.ws('/', (ws, req) => {
    if (!started && config.refreshInterval !== 0){
        timer = setInterval(()=> {
            updateProducts().then(
                data => connections.forEach(socket => 
                    {
                        socket.send(data)
                })
            )
        }, (config.refreshInterval * 1000));
        started = true;
    }
    ws.on('message', msg => {
        msg = JSON.parse(msg)
        switch(msg.type){
            case 'connect':
                connections.push(ws);
                let resp = {'type': 'master', 'data': false}
                if (msg.data === process.env.APP_ID || masterSocket === null) {
                    masterSocket = ws;
                    resp.data = process.env.APP_ID
                } 
                else {
                   resp.data = false;
                }
                resp = JSON.stringify(resp);
                ws.send(resp)
                break;
            case 'updatePrice':
                
            break;
            case 'requestUpdate':

            break;
            case 'checkout':
                console.log(msg.data)
                break;
            default:
                return null;
        }
        
    });
    ws.on('close', () => {
        removeSocket(ws);
    });
    ws.on('error', () => {
        removeSocket(ws);
    });
});

//Static resources
app.use(express.static(path.join(__dirname, 'build')));
app.use('/static', express.static(path.join(__dirname, 'static')));

app.get('/view', (req, res) => {
    res.clearCookie('app_id').status(200).end();
});

//Main server
app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'build'));
});

//Image server
app.get('/image/:name', (req, res) => {
    res.sendFile(
        req.params.name, 
        {
            root: path.join(__dirname, `server/images`),
            dotfiles: 'deny',
            headers: {
                'x-timestamp': Date.now(),
                'x-sent': true
            }
        },
        (err) => {
            if (err){
                res.status(404).send('Image unavaible');
            }   
        })
});

//Api server
app.get('/api/settings/', cors(), (req, res) => {
    db.settings.find({}, (err, settings) => {
        if (err) res.status(404).send('something went wrong');
        else if (settings[0].configSaved) res.status(200).json(settings[0])
        else res.status(200).json(config)
    })
});
app.get('/api/products', cors(), (req, res) => {
    db.products.find({}, (err, products) => {
        if (err) res.status(404).send('something went wrong');
        else res.status(200).json(products)
    })
});

//Command server
app.options('/settings', cors({
    origin: '*',
    optionsSuccessStatus: 200
}));
app.post('/settings', cors(), (req, res) => {
    if (atob(req.body.satisfy) !== process.env.APP_ID) {
        res.status(200).json({success: false, error: 'Only master is allowed to update configs'})
        return;
    }
    db.settings.update({}, req.body.settings, (err, numReplaced) => {
        if(numReplaced === 1){
            res.status(200).json({success: true})
        }
        else {
            res.status(200).json({success: false, error: err})
        }
    })
});
app.options('/product', cors({
    origin: '*',
    optionsSuccessStatus: 200
}));
app.post('/product', cors(), (req, res) => {
    if (atob(req.body.satisfy) !== process.env.APP_ID) {
        res.status(200).json({success: false, error: 'Only master is allowed to remove products'})
        return;
    }
    let body = req.body.data;
    switch(body.type){
        case 'add':
            db.products.insert(body.payload, (err, newDoc) => {
                if (newDoc){
                    res.status(200).json({success: true});
                    let resp = JSON.stringify({
                        'type': 'newProduct', 
                        'data': body.payload
                    })
                    connections.forEach((socket) => {
                        socket.send(resp)
                    })
                }
                else {
                    res.status(200).json({success: false, error: 'DB malfunction'})
                }
            })
        break;
        case 'update':
                var p = {};
                body.payload.props.forEach((prop) => {
                    p[prop.propName] = prop.propValue
                });
                db.products.update({id: body.payload.id}, {$set:  p }, (err) => {
                    if (err === null){
                        res.status(200).json({success: true})
                        let resp = JSON.stringify(
                            {
                                'type': 'updateProduct', 
                                'data': {
                                    "id": body.payload.id,
                                    "props": [...body.payload.props]
                                }
                            }
                        )
                        connections.forEach((socket) => {
                            socket.send(resp)
                        })
                    }
                    else {
                        res.status(200).json({success: false, error: 'DB malfunction'})
                    }
                    res.send()
                })
            break;
        case 'remove':
                db.products.remove({id: body.payload}, (err) => {
                    if (err === null){
                        res.status(200).json({success: true});
                        let resp = JSON.stringify({
                            'type': 'removeProduct', 
                            'data': body.payload
                        })
                        connections.forEach((socket) => {
                            socket.send(resp)
                        })
                    }
                    else {
                        res.status(200).json({success: false, error: 'DB malfunction'})
                    }
                })
            break;
        default:
            res.status(200).json({success: false, error: `Unrecognized command`})
            break;
    }
});
app.options('/restartServer', cors({
    origin: '*',
    optionsSuccessStatus: 200
}));
app.post('/restartServer', cors(), (req, res) => {
    if (atob(req.body.satisfy) !== process.env.APP_ID) {
        res.status(401).send()
        return;
    }
    else{
        console.log('Reloading config');
        startup.call(this).then((result) => {
            console.log('config loaded');
            result.settings.find({}, (err, s) => {
                if (!err && s.length > 0){
                    config = s[0]
                    if (config.refreshInterval !== 0){
                        timer = setInterval(()=> {
                            updateProducts().then(
                                data => connections.forEach(socket => 
                                    {
                                        socket.send(data)
                                })
                            )
                        }, (config.refreshInterval * 1000));
                    }
                    else{
                        timer = null;
                        started = false;
                    }
                    let msg = JSON.stringify({
                        'type': 'updateConfig',
                        'data': config
                    })
                    connections.forEach(socket => {
                        socket.send(msg)
                    })

                    console.log('New config in place')
                }
            })
        });
    }
});

//Catchall
app.get('*', (req, res) => {
    res.status(308).redirect('/');
});

//startup
const loadConfig = () => {
    db.settings = new nedb(`./server/db/${process.env.APP_ID}/settings`);
    db.products = new nedb(`./server/db/${process.env.APP_ID}/products`);
    db.history = new nedb(`./server/db/${process.env.APP_ID}/history`);
    return Promise.all([
        db.settings.loadDatabase((err) => { !err ? Promise.resolve() : Promise.reject()  }),
        db.products.loadDatabase((err) => { !err ? Promise.resolve() : Promise.reject()  }),
        db.history.loadDatabase((err) => { !err ? Promise.resolve() : Promise.reject()  }),
    ]).then(() => { return db })
}
const startup = async () => {
    console.log('Loading config');
    let r = await (loadConfig())
    return r;
}
startup()
    .then((dbc) => {
        console.log('Config loaded');
        dbc.settings.find({}, (err, s) => {
            if(!err && s.length > 0) {
                config = s[0]
            } else {
                config = {
                    name: 'default',
                    increments: 0.5,
                    round: 0.1,
                    sign: '€',
                    refreshInterval: 180,
                }
                dbc.settings.insert(config);
            }
        });
        dbc.products.find({}, (err, p) => {
            products = !err && p.length > 0 ? p : []
        });
        dbc.history.find({}, (err, h) => {
            history = !err && h.length > 0 ? h : []
        });
        connections = []
        console.log('Config applied');
        server = app.listen(process.env.PORT, () => {
            console.log(`Listening at port ${process.env.PORT}`);
        });
    }).catch(err => console.log(err))