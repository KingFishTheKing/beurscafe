import React from 'react';
import './Products.css';
const uuidv1 = require('uuid/v1');

class ProductDisplay extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            editing: false,
            ...props.specs,
            dummyValue: 'k'
        }
        this.changeEnable = this.changeEnable.bind(this);
        this.updateProduct = this.updateProduct.bind(this);
        this.removeProduct = this.removeProduct.bind(this);
    }
    changeEnable(){ 
        this.setState({
            enabled: !this.state.enabled
        }, () => {
            this.updateProduct(this.props.specs.id, [
                {
                    propName: "enabled",
                    propValue: this.state.enabled
                }
            ])    
        });
    }

    updateProduct(id, props){
        this.props.update(id, props)
        .then(
            data => {
                data.success ?
                this.props.updateStatusBar('Saved product update', 'bg-success text-light') : 
                this.props.updateStatusBar(`Failed to save update, ${data.error}`, 'bg-danger text-white', false)
            }
        ).catch(err => console.error(err))
    }
    removeProduct(){
        if(window.confirm('Deleting a product can not be reversed and the product will not be accessible anymore\nAre you sure you want to remove this product?\n\nIf you just don\'t want it to show up you can simply disable it')){
            this.props.remove(this.props.specs.id)
            .then(
                data => {
                    data.success ? 
                    this.props.updateStatusBar('Removed product', 'bg-success text-light') : 
                    this.props.updateStatusBar(`Failed to remove product, ${data.error}`, 'bg-danger text-white', false)
                }
            ).catch(err => console.error(err))
        }
    }

    render(){
        return(
            <div className="col col-sm-4 p-4">
                <div className={`product rounded ${!this.state.enabled ? 'disabledProduct' : null}`}>
                    <div className="card">
                        <div className="card-header">
                                <h5 className="card-title">
                                    {this.state.name}
                                </h5>
                                <h6 className="card-subtitle text-muted mb-2">
                                    Stock: <span className="text-primary">{this.state.currentStock}</span> / {this.state.stock}
                                </h6>
                            </div>
                        <div className="card-body">
                            <div className="card-text">
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item">
                                        Min price: {this.props.sign} {this.state.minPrice}
                                    </li>
                                    <li className="list-group-item">
                                        Max price: {this.props.sign} {this.state.maxPrice}
                                    </li>
                                    <li className="list-group-item">
                                        Start price: {this.props.sign} {this.state.startPrice}
                                    </li>
                                    <li className="list-group-item text-primary">
                                        Current price: {this.props.sign} {this.state.currentPrice}
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="card-footer d-flex justify-content-around">
                            <button className="btn">Edit</button>
                            <button className="btn btn-sm btn-danger" onClick={this.removeProduct}>Delete</button>
                            <div className="custom-control custom-switch">
                                <input type="checkbox" className="custom-control-input" value={this.state.enabled} checked={this.state.enabled} id={`customSwitch${this.state.id}`} onChange={this.changeEnable} />
                                <label className="custom-control-label" htmlFor={`customSwitch${this.state.id}`}>{this.state.enabled ? 'Enabled' : 'Disabled'}</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default class Products extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            overlay: true
        }
        this.handleLeave = this.handleLeave.bind(this);
        this.formSubmit = this.formSubmit.bind(this);
    }
    handleLeave(){
        if (!this.state.overlay){
            if (Array.from(document.querySelectorAll('.product.add form input')).filter((i) => {
                return i.value ? true : false
            }).length === 0){
                this.setState({
                    overlay:true,
                    complete: false
                })
            }
        } 
    }
    formSubmit(e){
        e.preventDefault();
        let source = document.querySelector('.product.add form');
        let form = new FormData(source);
        if (Array.from(form.values()).filter((v) => {
            return v ? true : false 
        }).length !== Array.from(form.keys()).length){
            window.alert('All fields are required');
        }else{
            this.props.updateStatusBar('Send new product to server..', 'bg-warning text-light', false);
            form.append('enabled', false);
            form.append('currentPrice', form.get('startPrice'));
            form.append('currentStock',  form.get('stock'));
            form.append('id', uuidv1())
            let prod = {};
            for (let p of form.entries()){
                prod[p[0]] = p[1]
            }
            this.props.new(prod).then(
                data => {
                    if( data.success){
                        this.props.updateStatusBar(`New product saved`, 'bg-success text-light')
                        source.reset()
                        source.blur()
                    }
                    else{
                        this.props.updateStatusBar(`Failed to save new product, ${data.error}`, 'bg-danger text-light', false);
                        source.focus();
                    }
                }
            ).catch(err => this.props.updateStatusBar(`Something went wrong :'(, ${err}`, 'bg-danger text-light', false))
        }
    }
    componentWillMount(){
        document.title = "Products"
    }
    render(){
        return(
            <React.Fragment>
                <div className="row d-flex">
                    {this.props.products.map((p, i) => {
                        return <ProductDisplay  key={i} 
                                                specs={p} 
                                                sign={this.props.sign} 
                                                update={this.props.update}
                                                remove={this.props.remove}
                                                updateStatusBar={this.props.updateStatusBar} />
                    })}
                    <div className="col col-sm-4 p-4">
                        <div className="product rounded add" onMouseLeave={this.handleLeave} >
                            {this.state.overlay ? 
                                <div className="overlay rounded d-flex justify-content-center align-items-center" onClick={() => {this.setState({overlay: false})}}>
                                    &#43;
                                </div> : null
                            }
                            <div className="card">
                                <form className="rounded" name="newProduct" method="POST" action="http://localhost:3001/products" onSubmit={this.formSubmit}>
                                    <div className="card-img-top">
                                        {/* Have to fix this file upload
                                            <label htmlFor="display" className="col">
                                            Choose an image
                                            <input  name="display"
                                                    type="file" 
                                                    className="form-control-sm-file" 
                                                    placeholder="example.png"
                                                    accept="image/png, image/jpg, image/jpeg, image/gif"
                                                    required="required" />
                                            <small className="text-muted">for the prettiest result choose a PNG or GIF with transparent background</small>
                                            </label>*/}
                                    </div>
                                    <div className="card-header">
                                            <h5 className="card-title">
                                                    <input  name="name"
                                                            type="text" 
                                                            placeholder="Name"
                                                            className="form-control-sm"
                                                            required="required" />
                                            </h5>
                                            <h6 className="card-subtitle text-muted mb-2">
                                                <input name="stock" type="number" min="1" placeholder="Stock" step="1" className="form-control-sm d-inline" required="required" />
                                            </h6>
                                        </div>
                                    <div className="card-body">
                                        <div className="card-text">
                                            <ul className="list-group list-group-flush">
                                                <li className="list-group-item">
                                                    {this.props.sign}<input name="minPrice" 
                                                                            min="0" 
                                                                            step="0.01" 
                                                                            placeholder="Minimum Price" 
                                                                            type="number" 
                                                                            className="form-control-sm d-inline" 
                                                                            required="required" />
                                                </li>
                                                <li className="list-group-item">
                                                    {this.props.sign}<input name="maxPrice" 
                                                                            type="number" 
                                                                            min="0" 
                                                                            step="0.01" 
                                                                            placeholder="Maximum Price" 
                                                                            className="form-control-sm d-inline" 
                                                                            required="required" />
                                                </li>
                                                <li className="list-group-item">
                                                   {this.props.sign}<input  name="startPrice" 
                                                                            type="number" 
                                                                            min="0" 
                                                                            step="0.01" 
                                                                            placeholder="Starting Price" 
                                                                            className="form-control-sm d-inline" 
                                                                            required="required" />
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="card-footer d-flex justify-content-around">
                                        <button type="submit"
                                                className="btn btn-primary"
                                                style={{order:1}}>
                                            Done
                                        </button>
                                        <button type="reset"
                                                className="btn btn-secondary"
                                                style={{order:0}}>
                                            Reset
                                        </button>
                                    </div>
                                </form>
                            </div>                   
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}