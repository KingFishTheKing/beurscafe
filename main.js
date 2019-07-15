const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
var PouchDB = require('pouchdb');
const app = express();
require('express-ws')(app);
const dotenv = require('dotenv');
dotenv.config();
const db = new PouchDB('server/db/beurscafe-'+process.env.APP_ID);

//Global variables
let config = null;
let started = false;
let timer = null;
let connections = [];
let lastUpdate = 0;


const removeSocket = (socket) => {
    connections = connections.filter(conn => {
        return (conn === socket) ? false : true
    });
    if (connections.length === 0){
        timer = null;
        started = false;
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
app.ws('/', (ws, res) => {
    connections.push(ws);
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

//Main server
app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.get('/register', (req, res) => {
    res.redirect('/');
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
})

//Api server
app.get('/api/settings/', cors(), (req, res) => {
});
app.get('/api/products', cors(), (req, res) => {
});

//Catchall
app.get('*', (req, res) => {
    res.redirect('/');
})

//startup
const loadConfig = () => {
    return new Promise((resolve, reject) => {

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
        config = result;
        app.listen(process.env.PORT, () => {
            console.log(`listening at port ${process.env.PORT}`);
        })
    })