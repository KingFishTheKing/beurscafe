import React from 'react';
import './Loader.css';

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

const Loader = (props) => (
    <React.Fragment>
        <div style={divStyle}>
            <div style={containerStyle}>
                <div style={loaderStyle}>
                </div>
                <div className="mt-2">
                    {props.waitingFor}
                </div>
            </div>
        </div>
    </React.Fragment>
);

export default Loader;