import React from 'react';
import './Products.css';

export default class Products extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            products: [],
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
                    overlay:true
                })
            }
        } 
    }
    formSubmit(e){
        e.preventDefault();
        let form = new FormData(document.querySelector('.product.add form'));
        if (Array.from(form.values()).filter((v) => {
            return v ? true : false 
        }).length !== Array.from(form.keys()).length){
            window.alert('All fields are required');
        }else{
            form.append('enabled', false);
            let prod = {};
            for (let p of form.entries()){
                prod[p[0]] = p[1]
            }
            this.props.new(prod)
        }
    }
    componentWillReceiveProps(newProps){
        this.setState({
            products: newProps.products
        })
    }
    render(){
        let products = this.state.products.map((p, i) => {
            return <div key={i} className="col">{p.name}</div>
        })
        return(
            <React.Fragment>
                <div className="row d-flex">
                    {products}
                    <div className="col col-sm-4 p-3">
                        <div className="product rounded add" onMouseLeave={this.handleLeave} >
                            {this.state.overlay ? 
                                <div className="overlay rounded d-flex justify-content-center align-items-center" onClick={() => {this.setState({overlay: false})}}>
                                    &#43;
                                </div> : null
                            }
                            <div className="p-2">
                                <form className="rounded" name="newProduct" method="POST" action="http://localhost:3001/products" onSubmit={this.formSubmit}>
                                        {/* Have to fix this file upload
                                            <label htmlFor="display" className="col">
                                            Choose an image
                                            <input  name="display"
                                                    type="file" 
                                                    className="form-control-file" 
                                                    placeholder="example.png"
                                                    accept="image/png, image/jpg, image/jpeg, image/gif"
                                                    required="required" />
                                            <small className="text-muted">for the prettiest result choose a PNG or GIF with transparent background</small>
                                            </label>*/}
                                        <label htmlFor="name" className="col">
                                            Name
                                            <input  name="name"
                                                    type="text" 
                                                    placeholder="Name"
                                                    className="form-control"
                                                    required="required" />
                                        </label>
                                        <label htmlFor="minPrice" className="col col-sm-4">
                                            Min price {this.props.sign}<input name="minPrice" min="0" placeholder="0" type="number" className="form-control d-inline" required="required" />
                                        </label>
                                        <label htmlFor="maxPrice" className="col col-sm-4">
                                            Max price {this.props.sign}<input name="maxPrice" type="number" min="0" placeholder="0" className="form-control d-inline" required="required" />
                                        </label>
                                        <label htmlFor="startPrice" className="col col-sm-4">
                                            Start price {this.props.sign}<input name="startPrice" type="number" min="0" placeholder="0" className="form-control d-inline" required="required" />
                                        </label>
                                        <label htmlFor="stock" className="col">
                                            Stock <input name="stock" type="number" min="1" placeholder="1" className="form-control d-inline" required="required" />
                                        </label>
                                        <div className="col d-flex justify-content-around">
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