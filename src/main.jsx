import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

import Navigation from './Navigation';
import Register from './blocks/Register';
import Settings from './blocks/Settings';
import Products from './blocks/Products';
import Loader from './blocks/Loader';

export default class Main extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            settings: {},
            products: {},
            loading: ''
        }
        this.URL = null;
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

        //this.command = new WebSocket('ws://localhost:3000/input');
        this.viewer = new WebSocket('ws://localhost:3000/');
        this.viewer.onopen = (e) => {
            this.viewer.send('updateeee')
        }
        this.viewer.addEventListener('message', (msg) => {
            console.log(msg.data)
        })
    }
    componentWillUnmount(){
        this.viewer.close()
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
                                render={() => <Register id={this.state.settings.id} products={this.state.products} />} />
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
            </React.Fragment>
        )
    }
}