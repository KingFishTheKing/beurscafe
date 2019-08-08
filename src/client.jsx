import React from 'react';
import ChartistGraph from 'react-chartist';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'chartist/dist/chartist.min.css';
import './blocks/Settings.css';
const legend = require('chartist-plugin-legend');

export default class Viewer extends React.Component{
    constructor(){
        super();
        this.state={
            labels: ['1','2'],
            series: [],
            options: {
                class: '.ct-chart d-flex flex-column',
                high: 10,
                low: 0,
                width: '100%',
                height: '100%',
                fullWidth: true,
                lineSmooth: true,
                chartPadding: {
                    top: 15,
                    right: 15,
                    bottom: 5,
                    left: 15
                },
                plugins: [
                    legend()
                ]
            },
            type: "Line"
        }
        this.ws = null;

        this.connect = this.connect.bind(this);
    }
    connect(server){
        this.ws = new WebSocket(server);
        this.ws.addEventListener('message', (msg) => {
            console.log(msg)
        })
        this.ws.onerror = () => {
            this.ws.close();
        }
        this.ws.onclose = () => {
            setTimeout(() => {
                this.connect(server);
            }, 500)
        }
    }
    componentWillMount(){
        document.title = "Viewer"
    }
    componentDidMount(){
        fetch('http://localhost:3000/api/products')
        .then(
            data => data.json()
        ).then(
            json => {
                this.setState({
                    series: json.map(product => {
                                return {
                                    'name': product.name,
                                    'data':[{
                                        'value': product.currentStock
                                    }]
                                }
                            })
                }, () => {console.log(this.state)})
            }
        )
        .finally(
            this.connect('ws://localhost:3000/view')
        )
    }
    render(){
        return(
            <ChartistGraph data={{
                labels: this.state.labels,
                series: this.state.series
            }} 
            options={this.state.options} 
            type={this.state.type} />
        )
    }
}