'use strict';

import React from 'react';
import Chart from './Chart.jsx';
import axios from 'axios';

import generateChartData from '../generate-chart-data';

export default class Root extends React.Component {

    constructor(props) {
        super(props);
        this.state = { totalByWeekData: null };
    }

    render() {
        return !!this.state.totalByWeekData && (
            <Chart data={this.state.totalByWeekData} elementId='totalByWeek'/>
        );
    }

    componentDidMount() {
        axios.get('test')
            .then(response => {
                this.setState({ totalByWeekData: generateChartData(response.data) });
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
