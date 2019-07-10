import React from 'react';

export default class Products extends React.Component{
    constructor(props){
        super(props);
        this.state = props
    }
    render(){
        return(
            <h1>Products</h1>
        )
    }
}