import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

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
            settings: {},
            products: {},
            loading: '',
            statusbar: null
        }
        this.URL = null;
        this.ws = null;
    }
    connect(server){
        this.ws = new WebSocket(server);
        this.ws.onopen = (e) => {
            this.setState({
                statusbar: {
                    content: 'Connected to server',
                    pClass: "bg-success text-light"
                } 
            });
            setTimeout(() => {
                this.setState({
                    statusbar : null
                })
            }, 3000)
        }
        this.ws.addEventListener('message', (msg) => {
            msg = JSON.parse(msg.data)
            switch(msg.type){
                case 'updateStock':
                    this.setState(prevState => ({
                        products: msg.data,
                    }));
                    this.updateStatus('Stock updated', 'bg-success text-white');
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
        );
        this.connect('ws://localhost:3000/');
    }
    componentWillUnmount(){
        this.viewer.close();
    }
    render(){
        return(
            <React.Fragment>
                <Router>
                    <Navigation />
                    {this.state.loading ? 
                        <Loader waitingFor={this.state.loading} /> 
                        :  
                        <React.Fragment>
                            <Redirect 
                                from="/" 
                                to="/register" />
                            <Route 
                                path="/register"
                                render={() => <Register ws={this.ws} updateStatus={this.updateStatus.bind(this)}  id={this.state.settings.id} products={this.state.products} />} />
                            <Route 
                                path="/settings" 
                                //state={this.state}
                                component={Settings} />
                            <Route 
                                path="/products" 
                                //state={this.state}
                                component={Products}  />
                        </React.Fragment>
                    }
                </Router>
                {this.state.statusbar ? <Statusbar content={this.state.statusbar.content} pClass={this.state.statusbar.pClass}   /> : null}
            </React.Fragment>
        )
    }
}