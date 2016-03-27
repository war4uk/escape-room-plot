import { docMetadata } from '../metadata';
import { sumDayPayments } from './day-aggregation-functions'

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
        prevValue[name] += sumDayPayments(curPaymentInfo.roomsPaymentInfos[name]);
      })

      return prevValue;
    },
    roomPaymentInfos
  )
}

