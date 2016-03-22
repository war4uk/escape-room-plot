'use strict';

import { getSheetInfo } from './google-doc-reader/spreadsheet-reader';
import { parseMonthEntry } from './google-doc-reader/monthly-parser';
import splitDaysByWeek from './report-builders/split-by-week'
import moment from 'moment';

moment.locale('ru');

getSheetInfo()
    .then(info => Promise.all(info.worksheets.filter(worksheet => isMonthlyWorkSheet(worksheet)).map(worksheet => parseMonthEntry(worksheet))))
    .then(payingInfos => [].concat(...payingInfos).sort(sortPayingInfos))
    .then(sortedPayingInfos => splitDaysByWeek(sortedPayingInfos))
    .then(weekSplittedDays => weekSplittedDays.map(weekArr => weekArr[0]).forEach(dayInfo => console.log(dayInfo.date.format())))
    .catch(err => console.log('error occured: ' + err));
    
function isMonthlyWorkSheet(worksheet) {
    return moment.months().indexOf(worksheet.title.toLowerCase()) > - 1;
}

function sortPayingInfos(dayInfo1, dayInfo2) {
    return dayInfo1.date.valueOf() - dayInfo2.date.valueOf();
}