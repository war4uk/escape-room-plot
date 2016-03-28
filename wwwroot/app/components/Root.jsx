'use strict';

import React from 'react';
import Chart from './Chart.jsx';
import axios from 'axios';

import generateChartData from '../generate-chart-data';

export default class Root extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            avgPerWeekend: null,
            avgPerWorkday: null,
            gamesCount: null,
            gamesIncome: null
        };
    }

    render() {
        return (
            <div>
                {
                    !!this.state.gamesIncome && (
                        <Chart data={generateChartData(this.state.gamesIncome) } title="Общий доход" elementId="totalIncomeByWeek"/>
                    )
                }

                {
                    !!this.state.gamesCount && (
                        <Chart data={generateChartData(this.state.gamesCount) } title="Число игр" elementId="totalGamesByWeek"/>
                    )
                }

                {
                    !!this.state.avgPerWeekend && (
                        <Chart data={generateChartData(this.state.avgPerWeekend) } title="Средний доход за выходные" elementId="avgPerWeekendByWeek"/>
                    )
                }

                {
                    !!this.state.avgPerWorkday && (
                        <Chart data={generateChartData(this.state.avgPerWorkday) } title="Средний доход за будни" elementId="avgPerWorkdayByWeek"/>
                    ) 
                }
            </div>
        )
    }



    componentDidMount() {
        axios.get('test')
            .then(response => {
                this.setState({ ...response.data });
    })
            .catch(function(response) {
        console.log("error while fetching data");
        console.log(response);
    });
}
}

Root.propTypes = {
    store: React.PropTypes.object.isRequired
};
