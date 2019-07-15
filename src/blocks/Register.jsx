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
        this.state = {
            amount : this.props.amount,
            currentPrice: this.props.currentPrice,
            stock: this.props.stock,
            hasUpdated: true
        }
        this.plusOne = this.plusOne.bind(this);
        this.minusOne = this.minusOne.bind(this);
        this.setInput = this.props.setInput;
    }
    componentWillMount(){
        document.title = 'Register'
    }
    minusOne(){
        if(this.state.amount === 0)
        {
            return
        }
        else{
            this.setState({
                amount: this.state.amount-1,
                stock: this.state.stock+1,
                hasUpdated: false
            });
        }
    }
    plusOne(){
        if (this.state.amount < this.state.stock){
            this.setState({
                amount: this.state.amount+1,
                stock: this.state.stock-1,
                hasUpdated: false
            });
        }
    }
    componentDidUpdate(){
        if (!this.state.hasUpdated){
            this.setInput(this.props.productId, this.state.amount);
            this.setState({
                hasUpdated: true
            });
        }
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            amount: nextProps.amount,
            currentPrice: nextProps.currentPrice,
            stock: nextProps.stock
        })
    }
    render(){
        return(
            <React.Fragment>
                <div className="col-auto col-sm-6 col-md-4 col-lg-3 mb-2">
                    <div className="bg-light rounded p-3">
                        <div className="row mb-4 d-flex justify-content-between p-3">
                            <b>
                                {this.props.name} 
                            </b>
                            € {this.state.currentPrice}
                            <small className={this.state.stock < 30 ? "text-danger" : "text-muted"}>(stock: {this.state.stock})</small>
                        </div>

                        <div className="row mb-4">
                            <div className="col-12 d-flex justify-content-center">
                                {this.props.display ? <ImageContainer className="col-12" source={`${process.env.NODE_ENV === "development" ? 'http://localhost:3000' : ''}/image/${this.props.display}`} /> : null}
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
        )
    }
}
export class Cart extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            total: props.total,
            products: props.products
        }
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            total: nextProps.total,
            products: nextProps.products
        });

    }
    render(){
        return(
            <React.Fragment>
                <div className="col-12 col-lg-2 row ml-auto mr-auto mb-2 align-items-start">
                    <ul style={{width:'100%'}} className="list-group list-group-flush col-12">
                        {Object.entries(this.state.total).map(a => {
                            return(
                                <li key={a[0]} className="list-group-item d-flex justify-content-between align-items-start">
                                    {this.state.products[a[0]].name} <small className="text-muted ml-2">(€{this.state.products[a[0]].currentPrice})</small>
                                    <span className="badge badge-primary badge-pill ml-auto">{a[1]}</span>
                                </li>)
                        })}
                    </ul>
                    <p className="mt-3 col-12 h3 d-flex justify-content-around text-primary">
                        <span>Total €{Math.round(Object.entries(this.state.total).map(a => {
                                return this.state.products[a[0]].currentPrice * [a[1]]
                            }).reduce((a, b) => {
                                return a + b
                            }, 0) * 100) / 100}
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
    constructor(props){
        super(props);
        this.state = {
            total: Array(Object.entries(this.props.products).length).fill(0)
        }
        this.done = this.done.bind(this);
        this.reset= this.reset.bind(this);
    }
    setInput(id, amount){
        this.setState(prevState => ({
            total: prevState.total.map((p, i) => {
                return i === Number(id) ? amount : p
            })
        }))
    }
    reset(){
        this.setState({
            total: Array(Object.entries(this.props.products).length).fill(0)
        });

    }
    done(){
        let ret = this.state.total.map((v, i) => {
                return {
                    "id": i,
                    "db_id": this.props.products[i]._id,
                    "quantity": v,
                    "readAbleName": this.props.products[i].name,
                    "currentPrice": this.props.products[i].currentPrice,
                    "currentStock": this.props.products[i].stock - v,
                }
            }
        ).filter((v) => {
            return v.quantity !== 0
        })
        ret = {
            "type": "updatePrices",
            "data": ret
        };
        this.props.ws.send(JSON.stringify(ret));
        this.reset();
        this.props.updateStatus('Sending updates to server...', 'bg-warning text-white', false)
    }
    getUpdate(){
        this.props.ws.send(JSON.stringify({
            "type":"getUpdate"
        }))
    }
    componentWillMount(){
    }
    render(){
        return(
            <React.Fragment>
                <div className="row">
                <button onClick={this.getUpdate.bind(this)}>Update</button>
                    <Cart products={this.props.products}  total={this.state.total} reset={this.reset} done={this.done} />
                    <div className={`row productList mr-auto col-12 col-lg-10`}>
                        {Object.entries(this.props.products).map((p, i) => <ProductDisplay key={i} productId={p[0]} {...p[1]} amount={this.state.total[p[0]] || 0} id={this.props.id} setInput={this.setInput.bind(this)} />)}
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
