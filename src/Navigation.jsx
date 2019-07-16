import React from 'react';
import { Link } from 'react-router-dom';

export default class Navigation extends React.Component{
    render(){
        return(
            <React.Fragment>
                <nav className="navbar navbar-expand bg-light sticky-top mb-2 navbar-light">
                    <ul className="navbar-nav mr-auto">
                        <React.Fragment>
                            <li className="nav-item">
                                <Link to="/register" className="nav-link">
                                    Register
                                </Link>
                            </li>
                        </React.Fragment>
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
                </nav>
            </React.Fragment>
        )
    }
}