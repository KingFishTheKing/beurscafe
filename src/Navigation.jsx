import React from 'react';
import { Link } from 'react-router-dom';

export default class Navigation extends React.Component{
    render(){
        return(
            <React.Fragment>
                <nav className="navbar navbar-expand bg-light sticky-top mb-2 navbar-light">
                    <div className="navbar-brand">
                        {this.props.brand}
                    </div>
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <Link to="/register" className="nav-link">
                                Register
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/products" className="nav-link">
                                Products
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/settings" className="nav-link">
                                Settings
                            </Link>
                        </li>
                    </ul>
                    <div className="navbar-nav f-flex flex-column">
                        <span>Running as <span className="font-weight-bold">{this.props.role ? 'Master' : 'Slave'}</span></span>
                        <span className="text-secondary font-weight-light">Status: {this.props.connected ? <span className="text-success">Connected</span> :  <span className="text-danger">Disconnected</span> }</span>
                    </div>
                </nav>
            </React.Fragment>
        )
    }
}