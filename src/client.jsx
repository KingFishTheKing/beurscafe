import React from 'react';
import ChartistGraph from 'react-chartist';
import 'chartist/dist/chartist.min.css';
import './Settings.css';
const legend = require('chartist-plugin-legend');

export default class Viewer extends React.Component{

    render(){
        return(
            <ChartistGraph data={{
                labels: ['1','2','3','4','5','6','7'],
                series: [
                    {
                        name: 'Pintje',
                        data: [
                                {"value":0 },
                                {"value":2 },
                                {"value":4 },
                                {"value":4 },
                                {"value":8 },
                                {"value":3 },
                                {"value":5 }
                            ]
                    },
                    {
                        name: 'Kriek',
                        data: [
                                {"value":0 },
                                {"value":2 },
                                {"value":1 },
                                {"value":2 },
                                {"value":3 },
                                {"value":3 },
                                {"value":1 }
                            ]
                    },
                    {
                        name: 'Duvel',
                        data: [
                                {"value":1 },
                                {"value":2 },
                                {"value":2 },
                                {"value":2 },
                                {"value":5 },
                                {"value":4 },
                                {"value":3 }
                            ]
                    },
                    {
                        name: 'Triple Karmeliet',
                        data: [
                                {"value":1 },
                                {"value":2 },
                                {"value":3 },
                                {"value":4 },
                                {"value":5 },
                                {"value":6 },
                                {"value":7 }
                            ]
                    }
                ]
            }} 
            key={Math.random()}
            options={{
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
            }} 
            type="Line" />
        )
    }
}