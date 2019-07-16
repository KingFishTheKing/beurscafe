const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const PouchDB = require('pouchdb');
const dotenv = require('dotenv');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
require('express-ws')(app);
dotenv.config();
const db = new PouchDB('server/db/beurscafe-'+process.env.APP_ID);

//Global variables
let config = null;
let products = null;
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
const InsertIntoDb = async (input) => {
    return new Promise((resolve, reject) => {

    })
}
const updateStock = async (updates) => {
   return new Promise((resolve, reject) => {
        
    })
}
const updateProducts = async () => {
    return new Promise((resolve, reject) => {
        
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
        msg = JSON.parse(msg);
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
                ws.send(JSON.stringify(resp))
                break;
            case 'updatePrice':
                
            break;
            case 'requestUpdate':

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
    db.get('config')
        .then(config  => {
            res
                .status(200)
                .send(
                    JSON.stringify(config.settings)
                )
        })
        .catch(
            err => {
                res.status(404).send('Something went wrong')
            }
        )
});
app.get('/api/products', cors(), (req, res) => {
    db.get('config')
        .then(config  => {
            res
                .status(200)
                .send(
                    JSON.stringify(config.products)
                )
        })
        .catch(
            err => {
                res.status(404).send('Something went wrong')
            }
        )
});
app.options('/settings', cors({
    origin: '*',
    optionsSuccessStatus: 200
}))
app.post('/settings', cors(), (req, res) => {
    if (atob(req.body.satisfy) !== process.env.APP_ID) {
        res.status(200).json(JSON.stringify({success: false, error: 'Only master is allowed to update configs'}))
        return;
    }
    db.get('config').then((config) => {
        return db.put({
            _id: 'config',
            _rev: config._rev,
            settings: req.body.settings,
            products: config.products
        })
    }).then((resp) => {
        res.status(200).json(JSON.stringify({success: true}))
    }).catch((err) => {
        res.status(200).json(JSON.stringify({success: false, error: err}))
    })
});
app.options('/restartServer', cors({
    origin: '*',
    optionsSuccessStatus: 200
}))
app.post('/restartServer', cors(), (req, res) => {
    if (atob(req.body.satisfy) !== process.env.APP_ID) {
        res.status(401).send()
        return;
    }
    else{
        server.close();
        startup.call(this).then((result) => {
            console.log('config loaded');
            config = result.settings;
            server = app.listen(process.env.PORT, () => {
                console.log(`Reloaded server @ ${process.env.PORT}`);
                let msg = JSON.stringify({
                    'type': 'updateConfig',
                    'data': config
                })
                connections.forEach(socket => {
                    socket.send(msg)
                })
            });
        }).catch(err => console.log(err))
    }
});

//Catchall
app.get('*', (req, res) => {
    res.status(308).redirect('/');
});

//startup
const loadConfig = () => {
    return new Promise((resolve, reject) => {        
        db.get('config')
        .catch((err) => {
            if (err.status === 404){
                db.put({
                    _id : 'config',
                    settings : {},
                    products : []
                }).then(
                   doc => { return doc}
                ).catch(
                    err => reject(err)
                )
            }
            else {
                reject(err)
            }
        }
        ).then(
            settings => { 
                resolve(settings)
            }
        )
        .catch( 
            err => reject(err)
        )
    })
}
const startup = async () => {
    console.log('Loading config');
    let r = await (loadConfig())
    return r;
}
startup()
    .then((result) => {
        console.log('config loaded');
        config = result.settings;
        products = result.products;
        connections = []
        server = app.listen(process.env.PORT, () => {
            console.log(`listening at port ${process.env.PORT}`);
        });
    }).catch(err => console.log(err))