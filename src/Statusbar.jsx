import React from 'react';

const footerStyle = {
    position: "fixed",
    left: 0,
    bottom: 0,
    width: "100%",
    textAlign: "center"
}

export default class Statusbar extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            content: this.props.content
        }
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            content: nextProps.content
        });
    }
    render(){
        return(
            <React.Fragment>
                <footer style={footerStyle} className={`p-2 mt-2 ${this.props.pClass}`}>
                    {this.state.content}
                </footer>
            </React.Fragment>
        )
    }
}