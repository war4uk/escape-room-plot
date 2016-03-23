import docMetadata from '../spreadsheet-metadata';
import sumDayPayment from './sum-payments-for-day'

export default (sortedWeekInfos) => {
    return sortedWeekInfos
        .map(sortedWeekInfo => aggregateWeekInformation(sortedWeekInfo));
}

function aggregateWeekInformation(sortedWeekInfo) {
    let weekDate = sortedWeekInfo[0].date;

    return {
        date: weekDate,
        aggregatedRoomPayments: reduceRoomPayment(sortedWeekInfo)
    };
}

function reduceRoomPayment(sortedWeekInfo) {
    let roomPaymentInfos = {};
    docMetadata.questNames.forEach(name => (roomPaymentInfos[name] = 0));

    return sortedWeekInfo.reduce(
        (prevValue, curPaymentInfo) => {
            docMetadata.questNames.forEach(name => {
                prevValue[name] += sumDayPayment(curPaymentInfo.roomsPaymentInfos[name]);
            })

            return prevValue;
        },
        roomPaymentInfos
    )
}

