import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navigation from './Navigation';
import Register from './blocks/Register';
import Settings from './blocks/Settings';
import Products from './blocks/Products';
import Loader from './blocks/Loader';
import Statusbar from './Statusbar';

export default class Main extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            settings: {
                name: 'default',
                increments: 0.05,
                round: 0.05,
                sign: '€',
                refreshInterval: 180
            },
            products: [],
            loading: '',
            statusbar: null,
            configSaved: false,
            isMaster: false
        }
        this.URL = null;
        this.ws = null;
        localStorage.setItem('app_id', null);
        this.updateStatus = this.updateStatus.bind(this);
        this.updateSettings = this.updateSettings.bind(this);
        this.updateProduct = this.updateProduct.bind(this);
        this.newProduct = this.newProduct.bind(this);
        this.removeProduct = this.removeProduct.bind(this);
        this.restartServer = this.restartServer.bind(this);
    }

    //Helper functions
    connect(server){
        this.ws = new WebSocket(server);
        this.ws.onopen = (e) => {
            if (this.ws.readyState === 1){
                this.ws.send(JSON.stringify({
                    'type': 'connect',
                    'data': localStorage.getItem('app_id')
                }))
                this.updateStatus('Connected to server', 'bg-success text-light');
            }
        }
        this.ws.addEventListener('message', (msg) => {
            msg = JSON.parse(msg.data)
            switch(msg.type){
                case 'master':
                    if (!!msg.data){
                        this.setState({
                            isMaster: true
                        });
                        localStorage.setItem('app_id', msg.data)
                    }
                    break;
                case 'updateConfig':
                    this.setState({
                        settings: msg.data
                    })
                    break;
                case 'updateStock':
                    this.setState(prevState => ({
                        products: msg.data,
                    }));
                    this.updateStatus('Stock updated', 'bg-success text-white');
                    break;
                case 'updateProduct':
                        this.setState(prevState => ({
                            products: prevState.products.map((prod) => {
                                    if(prod.id === msg.data.id){
                                        msg.data.props.forEach((prop) => {
                                            prod[prop.propName] = prop.propValue
                                        })
                                    }
                                    return prod
                                })
                        }));
                        this.updateStatus('Stock updated', 'bg-success text-white');
                    break;
                case 'newProduct':
                        this.setState(prevState => ({
                            products: [
                                ...prevState.products,
                                msg.data
                            ]
                        }));
                        this.updateStatus('New product added', 'bg-success text-white');
                    break;
                case 'removeProduct':
                        this.setState(prevState => ({
                            products: prevState.products.filter(prod => {
                                return prod.id !== msg.data
                            })
                        }))
                    break;
                default:
                    break;
            }
        });
        this.ws.addEventListener('close',  () => {
            this.updateStatus(`Disconnected :'( Hold on! Trying to reconnect...`, 'bg-danger text-white', false)
            setTimeout(() => {
                this.connect(server);
            }, 2000)
        })
        this.ws.onerror = () => {
            this.updateStatus(`Disconnected :'( Hold on! Trying to reconnect...`, 'bg-danger text-white', false)
            setTimeout(() => {
                this.connect(server);
            }, 2000)
        }
    }
    updateStatus(content, pClass, timeout=true){
        this.setState({
            statusbar: {
                content: content,
                pClass: pClass
            }
        })
        if(timeout){
            setTimeout(() => {
                this.setState({
                    statusbar: null
                })
            }, 3000)
        }
    }
    updateSettings(ret){
        this.setState({
            settings: ret
        }, () => {
            this.saveSettings().then((success, fail) => {
                if (fail) {
                    this.updateStatus(`Server error`, 'bg-warning text-white', false);
                }
                else {
                    this.updateStatus(...success);
                }
            })
        })
    }
    saveSettings(){
        return new Promise((resolve, reject) => {
            fetch('http://localhost:3000/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "satisfy": btoa(localStorage.getItem('app_id')),
                    "settings": this.state.settings
                })
            }).then(
                resp => resp.json()  
            ).then(
                data => {
                    data = JSON.parse(data)
                    if (data.success){
                        this.setState({
                            configSaved: true
                        })
                        resolve(['Saved configuration', 'bg-success text-white'])
                    } else {
                        resolve([`Failed to save configuration, ${data.error}`, 'bg-danger text-white', false])
                    } 
                }
            ).catch(err => reject([err, 'bg-warning text-light', false]))
        })
    }
    newProduct(product){
        return new Promise((resolve, reject) => {
            fetch('http://localhost:3000/product', {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "satisfy": btoa(localStorage.getItem('app_id')),
                    "data": {
                        "type": "add",
                        "payload": product
                    }
                })
            }).then(
                response => response.json()
            ).then(
                data => resolve(data)
            ).catch(err => reject(err)) 
        })
    }
    updateProduct(id, props){
        return new Promise((resolve, reject) => {
            fetch('http://localhost:3000/product', {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "satisfy": btoa(localStorage.getItem('app_id')),
                    "data": {
                        "type": "update",
                        "payload": {
                            "id": id,
                            "props": props
                        }
                    }
                })
            }).then(
                response => {
                    return response.json()
                }
            ).then(
                data => resolve(data)
            ).catch(err => reject(err)) 
        })
    }
    removeProduct(id){
        return new Promise((resolve, reject) => {
            fetch('http://localhost:3000/product', {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "satisfy": btoa(localStorage.getItem('app_id')),
                    "data": {
                        "type": "remove",
                        "payload": id
                    }
                })
            }).then(
                response => {
                    return response.json()
                }
            ).then(
                data => resolve(data)
            ).catch(err => reject(err)) 
        })
    }
    restartServer(){
        fetch('http://localhost:3000/restartServer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'satisfy': btoa(localStorage.getItem('app_id'))})
        })
    }
    //lifecycle
    componentWillMount(){
        document.body.classList.add('container-fluid');
        document.title = 'Beurscafe';
    }
    componentDidMount(){
        this.URL = new URL(window.location.href);
        this.setState({
            loading: 'Loading Settings'
        })
        fetch(`http://localhost:3000/api/settings`).then(
            response => response.json()
        ).then(
            json => {this.setState({
                settings: json,
                loading: 'Loading Products'
            })
            return fetch(`http://localhost:3000/api/products`)
        }).then(
            response => response.json()
        ).then(
            json => this.setState({
                products: json,
                loading: false
            })
        )
        this.connect('ws://localhost:3000/');
    }
    componentWillUnmount(){
        //this.viewer.close();
    }
    render(){
        return(
            <React.Fragment>
                <Router>
                    <Navigation brand={this.state.settings.name} role={this.state.isMaster} />
                    {this.state.loading ? 
                        <Loader waitingFor={this.state.loading} /> 
                        :  
                        <React.Fragment>
                            <Route 
                                path="/register"
                                render={() => <Register ws={this.ws} 
                                                        updateStatus={this.updateStatus}  
                                                        id={this.state.settings.id} 
                                                        products={this.state.products} />} />
                            <Route 
                                path="/products" 
                                render={() => <Products ws={this.ws} 
                                                        products={this.state.products} 
                                                        sign={this.state.settings.sign} 
                                                        updateStatusBar={this.updateStatus} 
                                                        update={this.updateProduct}
                                                        remove={this.removeProduct}
                                                        new={this.newProduct} />  } />
                            <Route 
                                path="/settings" 
                                render={() => <Settings {...this.state.settings} 
                                                        configSaved={this.state.configSaved} 
                                                        restartServer={this.restartServer} 
                                                        updateStatusBar={this.updateStatus} 
                                                        updateSettings={this.updateSettings} />} />
                        </React.Fragment>
                    }
                </Router>
                {this.state.statusbar ? <Statusbar content={this.state.statusbar.content} pClass={this.state.statusbar.pClass}   /> : null}
            </React.Fragment>
        )
    }
}