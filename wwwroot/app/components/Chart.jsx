import c3    from 'c3';
import React from 'react';

const ChartComponent = React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired,
        elementId: React.PropTypes.string.isRequired,
    },

    chart: null,

    shouldComponentUpdate: function(nextProps) {
        if (JSON.stringify(this.props.data.columns)
            !== JSON.stringify(nextProps.data.columns)) { // deeper check
            return true;
        }
        return false;
    },

    componentDidMount: function() {
        this._generateChart(
            this.props.data,
            this.props.elementId
        );
    },

    componentDidUpdate: function(prevProps) {
        if (prevProps.data.columns !== this.props.data.columns) {
            this._generateChart(
                this.props.data,
                this.props.element
            );
        }
    },

    componentWillUnmount: function() {
        this._destroyChart();
    },

    _generateChart: function(data,  elementId) {
        console.log(data);
        let build = Object.assign({}, {
            bindto: '#' + elementId           
        }, data);
        this.chart = c3.generate(build);
    },

    _destroyChart: function() {
        this.chart.destroy();
    },

    render: function() {
        return (
            <div className="c3 react-c3"
                id={this.props.elementId}
                style={this.props.styles}>
            </div>
        );
    }
});


export default ChartComponent;