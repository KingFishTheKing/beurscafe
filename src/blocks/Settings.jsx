import React from 'react';

export default class Settings extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            name: props.name || '',
            increments: props.increments || 0.05,
            round: props.round || 0.05,
            sign: props.sign || '€',
            refreshInterval: props.refreshInterval || 180,
        }
        this.updateState = this.updateState.bind(this);
    }
    updateState(input){
        let s = {};
        s[input.target.name] = input.target.value
        this.setState(s);
        this.props.updateConfigState(false)
    }
    render(){
        return(
            <React.Fragment>
                    <form className="form">
                    <div className="form-row">
                        <div className="form-group col">
                            <label htmlFor="name">
                                Name:
                            </label>
                            <input  type="text" 
                                    className="form-control" 
                                    name="name" 
                                    value={this.state.name} 
                                    onChange={this.updateState} 
                                    placeholder="Set or update the name for your application" />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col">
                            <label htmlFor="increments">
                                Increment/decrease price by:
                            </label>
                            <input  type="number" 
                                    className="form-control" 
                                    name="increments" 
                                    placeholder={this.state.increments}  
                                    onChange={this.updateState}
                                    min="0.05" 
                                    max="0.50" 
                                    step="0.05" />
                        </div>
                        <div className="form-group col">
                            <label htmlFor="round">
                                Round price to nearest:
                            </label>
                            <select name="round" 
                                    className="form-control" 
                                    value={this.state.round}
                                    onChange={this.updateState}>
                                <option value="0">0</option>
                                <option value="0.01">0.01</option>
                                <option value="0.05">0.05</option>
                                <option value="0.1">0.1</option>
                                <option value="0.2">0.2</option>
                                <option value="0.5">0.5</option>
                            </select>
                    </div> 
                    <div className="form-group col">
                            <label htmlFor="sign">
                                Currency symbol 
                            </label>
                        <select  name="sign" 
                                    value={this.state.sign}
                                    onChange={this.updateState} 
                                    className="form-control">
                            <option value="€">€</option>
                            <option value="$">$</option>
                            <option value="£">£</option>
                        </select>
                        </div>
                    </div>
                    <hr />
                    <div className="form-row">
                        <div className="form-group col">
                            <label htmlFor="refreshIntervalRange">
                                Refresh interval in seconds <small className="text-muted">Setting 0 will mean that every time an order is pushed to the server it get's router directly to all clients</small>
                            </label>
                            <div>{this.state.refreshInterval}</div>
                            <input  className="form-control-range" 
                                    name="refreshInterval" 
                                    type="range" 
                                    min="0" 
                                    max="300" 
                                    value={this.state.refreshInterval}
                                    onChange={this.updateState} />
                        </div>
                    </div>
                    <hr />
                    <div className="form-row justify-content-around">
                        <button type="button" 
                                className="btn btn-success" 
                                onClick={() => {
                                        this.props.updateStatusBar('Saving configuration', 'bg-primary text-white', false);
                                        this.props.updateSettings(this.state)
                                    }
                                }>
                            Save
                        </button>
                        <button type="button"
                                className="btn btn-warning"
                                disabled={!this.props.savedConfig}
                                onClick={() => {
                                    if (window.confirm('Applying settings will restart the server, this will reset the application, timers and remove any unsaved or in progress transactions since last update\nAre you sure?')){
                                        this.props.restartServer()
                                    }
                                }}>
                            Apply settings
                        </button>
                    </div>
                </form>
            </React.Fragment>
        )
    }
}

