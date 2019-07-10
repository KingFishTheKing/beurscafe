const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const mongo = require('mongodb').MongoClient;
const app = express();
require('express-ws')(app);
const dotenv = require('dotenv');
dotenv.config();

//Global variables
let config = null;
let started = false;
let timer = null;
let connections = 0;

//Websocket server
app.ws('/input', (ws, res) => {
    ws.on('connection', () => {
        connections = connections++;
    });
    ws.on('disconnect', () => {
        if (connections === 0){
            timer = null;
            started = false;
        }
    });
    ws.on('message', msg => {
        console.log(msg)
    });
});
app.ws('/viewer', (ws, res) => {
    ws.on('connection', () => {
        connections = connections++;
    });
    ws.on('disconnect', () => {
        if (connections === 0){
            timer = null;
            started = false;
        }
    });
    if (!started && config.refreshInterval !== 0){
        timer = setInterval(()=>{
            ws.send(JSON.stringify({
                update: 'bla'
            }))
        }, (config.refreshInterval * 1000));
        started = true;
    }
})

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
    mongo.connect(process.env.MONGODB_URL, {useNewUrlParser: true}, (err, db) => {
        if (err) res.status(500).send('Erro accessing data')
        else {
            let dbo = db.db('beurscafe');
            var ObjectId = require('mongodb').ObjectId;
            dbo.collection('settings').findOne(
                new ObjectId(process.env.APP_ID)
                , 
                (err, results) => {
                    if (err) res.status(500).send('Data unavaible')
                    else res.status(200).send(JSON.stringify(results))
                    db.close()
                }
            )
        }
    })
});
app.get('/api/products', cors(), (req, res) => {
    mongo.connect(process.env.MONGODB_URL, {useNewUrlParser: true}, (err, db) => {
        if (err) res.status(500).send('Erro accessing data')
        else {
            let dbo = db.db('beurscafe');
            dbo.collection('products').find({"memberOf": {$eq: process.env.APP_ID}}).toArray((err, results) => {
                if (err) res.status(500).send('Data unavaible')
                else res.status(200).send(JSON.stringify(results))
                db.close()
            })
        }
    })
});

//Catchall
app.get('*', (req, res) => {
    res.redirect('/');
})

//startup
const loadConfig = () => {
    return new Promise((resolve, reject) => {
        mongo.connect(process.env.MONGODB_URL, {useNewUrlParser: true}, (err, db) => {
            if (!err){
                let dbo = db.db('beurscafe');
                let ObjectId = require('mongodb').ObjectId;
                dbo
                .collection('settings')
                .findOne(
                    new ObjectId(process.env.APP_ID), 
                    (err, results) => {
                        if (err){
                            reject(err)
                        }
                        else{
                            resolve(results);
                        }
                        db.close();  
                    }
                )        
            }
            else{
                reject(err)
            }
        })
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