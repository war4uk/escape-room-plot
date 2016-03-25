import moment from 'moment';

export default responseData => {
    const names = ["шизофрения", "зомби лаборатория"];

    const shizaPayments = [names[0], ...responseData.map(payment => payment.aggregatedRoomPayments[names[0]])];
    const zombiePayments = [names[1], ...responseData.map(payment => payment.aggregatedRoomPayments[names[1]])];
    
    const xValues = ['x', ...responseData.map(payment => moment(payment.date).format('MMM DD'))];
    const axis = {
        x: {
            type: 'category'
        }
    };

    let types = {};
    names.forEach(name => { types[name] = 'bar' });

    const data = {
        x: 'x',
        columns: [
            xValues,
            shizaPayments,
            zombiePayments
        ],
        types: types
    };

    return { data: data, axis: axis };
}