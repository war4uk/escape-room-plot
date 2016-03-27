import moment from 'moment';
import { docMetadata, weekendsMetadata} from '../metadata';
import { sumDayPayments } from './day-aggregation-functions'

export let getAveragePerWeekends = (sortedWeekInfos) => getAverageForType(sortedWeekInfos, true);
export let getAveragePerWorkdays = (sortedWeekInfos) => getAverageForType(sortedWeekInfos, false);

function getAverageForType(sortedWeekInfos, isGetForWeekends) {
  const avgPropName = isGetForWeekends ? "weekendsInfo" : "workdaysInfo";

  return getAverages(sortedWeekInfos).map(avgInfo => {
    let result = { date: avgInfo.date, aggregatedRoomPayments: {} };

    docMetadata.questNames.forEach(name => {
      let roomAvgInfo = avgInfo.aggregatedRoomPayments[name][avgPropName];
      console.log(result.date.format());
      console.log(roomAvgInfo);
      result.aggregatedRoomPayments[name] = roomAvgInfo.paymentsSum / (roomAvgInfo.daysCount || 1);
    });
    
    // console.log(JSON.stringify(result));
    return result;
  });

}

function getAverages(sortedWeekInfos) {
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
  docMetadata.questNames.forEach(name => (roomPaymentInfos[name] = {
    weekendsInfo: {
      paymentsSum: 0,
      daysCount: 0
    },
    workdaysInfo: {
      paymentsSum: 0,
      daysCount: 0
    }
  }));

  return sortedWeekInfo.reduce(
    (prevValue, curPaymentInfo) => {
      docMetadata.questNames.forEach(name => {
        const dayPaymentsInfo = curPaymentInfo.roomsPaymentInfos[name];

        if (isWeekend(curPaymentInfo.date)) {
          prevValue[name].weekendsInfo.daysCount++;
          prevValue[name].weekendsInfo.paymentsSum += sumDayPayments(dayPaymentsInfo);
        } else {
          prevValue[name].workdaysInfo.daysCount++;
          prevValue[name].workdaysInfo.paymentsSum += sumDayPayments(dayPaymentsInfo);
        }
      })

      return prevValue;
    },
    roomPaymentInfos
  )
}


function isWeekend(date) {
  if (isForcedWeekend(date)) {
    return true;
  }

  if (isForcedWorkday(date)) {
    return false;
  }

  const weekDay = date.day();
  return (weekDay === 6 || weekDay === 0);
}

function isForcedWeekend(date) {
  return weekendsMetadata.additional_weekends.some(dateStr => moment(dateStr).isSame(date, 'day'));
}

function isForcedWorkday(date) {
  return weekendsMetadata.weekends_as_workdays.some(dateStr => moment(dateStr).isSame(date, 'day'));;
}

