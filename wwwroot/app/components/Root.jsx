'use strict';

import React from 'react';
import Chart from './Chart.jsx';
import axios from 'axios';


const data = {
    columns: [
        ['data1', 30, 200, 100, 400, 150, 250],
        ['data2', 50, 20, 10, 40, 15, 25]
    ]
};

let options = {};

const type = "bar";//"bar" // {"line","bar","pie", "multiBar","lineBar"}

export default class Root extends React.Component {
    render() {
        return (
            <div>
                <div id="testchart"></div>
                <Chart data={data} element='testchart' type='lineBar' options={{}}/>
            </div>
        );
    }

    componentDidMount() {
        axios.get('')
            .then(function(response) {
                console.log(response);
            })
            .catch(function(response) {
                console.log(response);
            });
    }
}

Root.propTypes = {
    store: React.PropTypes.object.isRequired
};
