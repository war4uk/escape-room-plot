import moment from 'moment';
import { getSheetInfo } from '../google-doc-reader/spreadsheet-reader';
import { parseMonthEntry } from '../google-doc-reader/monthly-parser';
import splitDaysByWeek from '../report-builders/split-by-week'

let currentDayPaymentInfos = [];
let currentDayPaymentsGroupedByWeeks = [];

export function updateFromGoogleDoc() {
  return getSheetInfo()
    .then(info => Promise.all(info.worksheets.filter(worksheet => isMonthlyWorkSheet(worksheet)).map(worksheet => parseMonthEntry(worksheet))))
    .then(payingInfos => [].concat(...payingInfos).sort(sortPayingInfos))
    .then(info => {
      currentDayPaymentInfos = [...info];
      return info;
    })
    .then(sortedPayingInfos => {
      currentDayPaymentsGroupedByWeeks = splitDaysByWeek(sortedPayingInfos)
    })
    .then(() => console.log("fetched!"))
    .catch(err => console.log('error occured: ' + err));
}

export function getDayPaymentInfos() {
  return currentDayPaymentInfos;
}

export function getDayPaymentInfosGroupedByWeek() {
  return currentDayPaymentsGroupedByWeeks;
}

function isMonthlyWorkSheet(worksheet) {
  return moment.months().indexOf(worksheet.title.toLowerCase()) > - 1;
}

function sortPayingInfos(dayInfo1, dayInfo2) {
  return dayInfo1.date.valueOf() - dayInfo2.date.valueOf();
}