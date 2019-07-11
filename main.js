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
let connections = [];

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
    let now = Date.now();
    return new Promise((resolve, reject) => {
        mongo.connect(process.env.MONGODB_URL, {useNewUrlParser: true}, (err, db) => {
            if (!err){
                let dbo = db.db('beurscafe');
                dbo
                .collection('history')
                .insertMany(
                    [
                        ...input.map(i => { 
                            return {
                                timeStamp: now, 
                                update: i
                            }
                        })
                    ],
                    (err, data) => {
                        if (err) reject(err)
                        else resolve(data.ops)
                    }
                )        
            }
            else{
                reject(err);
            }
        })
    })
}
const updateStock = async (updates) => {
    return new Promise((resolve, reject) => {
        mongo.connect(process.env.MONGODB_URL, {useNewUrlParser: true}, (err, db) => {
            if (!err){
                let dbo = db.db('beurscafe').collection('products').initializeUnorderedBulkOp();
                let ObjectId = require('mongodb').ObjectId;
                updates.forEach(u => {
                    u = u.update
                    dbo
                        .find({
                            "_id": new ObjectId(u.db_id)
                        })
                        .updateOne(
                            {
                                $set: {
                                    stock: u.currentStock
                                }
                            }
                        );
                })
                dbo.execute().then((data, err) => {
                    if (err) reject(err)
                    else if (data.nModified !== updates.length){
                        reject('Failed to update all')
                    }
                    else{
                        resolve(data);
                    }
                })
            }
            else{
                reject(err);
            }
            db.close();
        })
    })
}
//Websocket server
app.ws('/', (ws, res) => {
    connections.push(ws);
    if (!started && config.refreshInterval !== 0){
        timer = setInterval(()=> {
            let date = Date.now();
            connections.forEach(socket => 
                {
                    socket.send(date)
            })
        }, (config.refreshInterval * 1000));
        started = true;
    }
    ws.on('message', msg => {
        msg = JSON.parse(msg);
        switch(msg.type){
            case 'updatePrices':
                InsertIntoDb(msg.data).then((data, err) => {
                    if (err) {console.log(err); ws.send(JSON.stringify({
                        'Error': err
                    }))}
                    else{
                        updateStock(data).then((data, err) => {
                            if (err) {
                                console.log(err); 
                                ws.send(
                                    JSON.stringify(
                                        {
                                            'Error': err
                                        }
                                    )
                                )
                            }
                            else{
                                let ret = {
                                    "type": (config.refreshInterval === 0) ? 'update' : 'updateStock',
                                    "data": null
                                }
                                mongo.connect(process.env.MONGODB_URL, {useNewUrlParser: true}, (err, db) => {
                                    let dbo = db.db('beurscafe').collection('products');
                                    dbo.find({}).toArray((err, results) => {
                                        if (!err){
                                            ret.data = results;
                                            ret = JSON.stringify(ret);
                                            connections.forEach(socket => {
                                                socket.send(ret)
                                            })
                                        }
                                    })
                                })
                            }
                        })
                    }
                    
                    /*if (config.refreshInterval === 0){
                        let date = Date.now();
                        connections.forEach(socket => 
                            {
                                socket.send(date)
                        })
                    }*/
                });
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