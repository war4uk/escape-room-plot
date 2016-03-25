'use strict';
require("babel-polyfill");

import koa from 'koa';
import serveStatic from 'koa-static';

import { getSheetInfo } from './google-doc-reader/spreadsheet-reader';
import { parseMonthEntry } from './google-doc-reader/monthly-parser';
import splitDaysByWeek from './report-builders/split-by-week'

import getIncomeByWeek from './report-builders/income-by-week'
import moment from 'moment';

const app = koa();
app.use(serveStatic('./wwwroot'));
app.listen(3333);

let weekSplittedDays = [];

app.use(function* () {
    this.body = formatAggregation(getIncomeByWeek(weekSplittedDays));
});

moment.locale('ru');

getSheetInfo()
    .then(info => Promise.all(info.worksheets.filter(worksheet => isMonthlyWorkSheet(worksheet)).map(worksheet => parseMonthEntry(worksheet))))
    .then(payingInfos => [].concat(...payingInfos).filter(payingInfo => payingInfo.date.isAfter(moment("2016-01-31"))).sort(sortPayingInfos))
    .then(sortedPayingInfos => {
        weekSplittedDays = splitDaysByWeek(sortedPayingInfos)
    })

    .catch(err => console.log('error occured: ' + err));

function isMonthlyWorkSheet(worksheet) {
    return moment.months().indexOf(worksheet.title.toLowerCase()) > - 1;
}

function sortPayingInfos(dayInfo1, dayInfo2) {
    return dayInfo1.date.valueOf() - dayInfo2.date.valueOf();
}

function formatAggregation(aggregatedInfos) {
    return aggregatedInfos.map(aggregatedInfo => ({
        date: aggregatedInfo.date.format(),
        aggregatedRoomPayments: aggregatedInfo.aggregatedRoomPayments
    }));
}