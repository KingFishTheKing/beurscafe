import React, { Suspense, lazy} from 'react';
import { Route, HashRouter, Switch, Redirect } from 'react-router-dom';
import ReactDOM from 'react-dom';
import './blocks/Loader.css';

const divStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: window.innerHeight+'px',
    width:'100%',
    position: 'absolute',
    top:0,
    left:0,
}
const loaderStyle = {
    height: '100px',
    width: '100px',
    border: '16px #f5b042 solid',
    borderTop: '16px rgba(0,0,0,0) solid',
    borderRadius: '50%',
    animationName: 'rotation',
    animationDuration: '2s',
    animationIterationCount: 'infinite',
    animationTimingFunction: 'linear'
}
const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
}

const Client = lazy(() => import('./client'));
const Admin = lazy(() => import('./main'));

const App = () => (
    <HashRouter>
        <Suspense fallback={
            <React.Fragment>
                <div style={divStyle}>
                    <div style={containerStyle}>
                        <div style={loaderStyle}>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        }>
            <Switch>
                <Route path="/view" component={Client} />
                <Route path="/admin" component={Admin} />
                <Redirect to="/view" />
            </Switch>
        </Suspense>
    </HashRouter>
)

ReactDOM.render(<App />, document.getElementById('root'));