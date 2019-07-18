import React from 'react';
import './Register.css';
const imageStyle= {
    maxWidth: "100px",
    maxHeight: '100px',
    width: 'auto',
    height: 'auto',
    objectFit: 'contain'
}

export class ImageContainer extends React.Component{
    render(){
        return(
            <React.Fragment>
                <img alt="" src={this.props.source} style={imageStyle} />
            </React.Fragment>
        )
    }
}
export class ProductDisplay extends React.Component{
    constructor(props){
        super(props);
        this.plusOne = this.plusOne.bind(this);
        this.minusOne = this.minusOne.bind(this);
        this.setInput = this.props.setInput;
    }
    minusOne(){
        this.props.remove(this.props.product.id, 1)
    }
    plusOne(){
        this.props.add(this.props.product.id, 1)
    }
    render(){
        return(
            <React.Fragment>
            {this.props.product.enabled === true ? 
                <React.Fragment>
                    <div className="col-auto col-sm-6 col-md-4 col-lg-3 mb-2">
                        <div className="bg-light rounded p-3">
                            <div className="row mb-4 d-flex justify-content-between p-3">
                                <b>
                                    {this.props.product.name} 
                                </b>
                                {this.props.sign} {this.props.product.currentPrice}
                                <small className={this.props.product.stock < 30 ? "text-danger" : "text-muted"}>(stock: {this.props.product.currentStock})</small>
                            </div>

                            <div className="row mb-4">
                                <div className="col-12 d-flex justify-content-center">
                                    {this.props.product.display ? <ImageContainer className="col-12" source={`${process.env.NODE_ENV === "development" ? 'http://localhost:3000' : ''}/image/${this.props.product.display}`} /> : null}
                                </div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-6">
                                    <p className="buttons minus rounded" onClick={this.minusOne}>-</p>
                                </div>
                                <div className="col-6">
                                    <p className="buttons plus rounded" onClick={this.plusOne}>+</p>
                                </div>
                            </div>
                        </div>          
                    </div> 
                </React.Fragment>
                : null
            }
            </React.Fragment>
        )
    }
}
export class Cart extends React.Component{
    render(){
        return(
            <React.Fragment>
                <div className="col-12 col-lg-2 row ml-auto mr-auto mb-2 align-items-start">
                    <ul style={{width:'100%'}} className="list-group list-group-flush col-12">
                        {this.props.cart.map((product, index) => {
                            return <li key={index} className="list-group-item d-flex justify-content-between align-items-start">
                                {product.readableName} <small className="text-muted ml-2">({this.props.sign} {product.currentPrice})</small>
                                <span className="badge badge-primary badge-pill ml-auto">{product.quantity}</span>
                            </li>
                        })}
                    </ul>
                    <p className="mt-3 col-12 h3 d-flex justify-content-around text-primary">
                        <span>Total {this.props.sign}
                        </span>
                    </p>
                    <div className="col-12 d-flex justify-content-around">
                        <button className="btn btn-danger" onClick={this.props.reset}>Reset</button>
                        <button className="btn btn-primary btn-lg" onClick={this.props.done}>Done</button>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default class Register extends React.Component{
    componentWillMount(){
        document.title = 'Register'
    }
    render(){
        return(
            <React.Fragment>
                <div className="row">
                    <Cart cart={this.props.cart} sign={this.props.sign} reset={this.reset} done={this.done} />
                    <div className={`row productList mr-auto col-12 col-lg-10`}>
                        {this.props.products.map((p, i) => {
                                return p.enabled ? <ProductDisplay key={i} product={p} sign={this.props.sign} add={this.props.add} remove={this.props.remove} /> : null
                            })
                        }
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
