import React from 'react';

export default class Settings extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            ...props
        }
    }
    componentWillReceiveProps(newProps){
        this.setState({
            ...newProps
        })
    }
    componentDidMount(){
        document.title = 'Settings'
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
                                    onChange={e => this.setState({name: e.target.value})} 
                                    placeholder="Set or update the name for your application" />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col">
                            <label htmlFor="increments">
                                Round price to:
                            </label>
                            <input  type="number" 
                                    className="form-control" 
                                    name="increments" 
                                    placeholder={this.state.increments}  
                                    onChange={e => this.setState({increments: e.target.value})} 
                                    min="0.01" 
                                    max="0.50" 
                                    step="0.01" />
                        </div>
                        <div className="form-group col">
                            <label htmlFor="round">
                                Decimal places:
                            </label>
                            <select name="round" 
                                    className="form-control" 
                                    value={this.state.round}
                                    onChange={e => this.setState({round: e.target.value})} >
                                <option value="0">0</option>
                                <option value="1">0.1</option>
                                <option value="2">0.01</option>
                            </select>
                    </div> 
                    <div className="form-group col">
                            <label htmlFor="sign">
                                Currency symbol 
                            </label>
                        <select  name="sign" 
                                    value={this.state.sign}
                                    onChange={e => this.setState({sign: e.target.value})}  
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
                                    onChange={e => this.setState({refreshInterval: e.target.value})}  />
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
                                disabled={!this.state.configSaved}
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

