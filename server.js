'use strict';
require("babel-polyfill");

import koa from 'koa';
import serveStatic from 'koa-static';
import {updateFromGoogleDoc, getDayPaymentInfosGroupedByWeek} from './persisted-data/persisted-data';

import getIncomeByWeek from './report-builders/income-by-week'
import moment from 'moment';

const refreshInterval = 60 * 60 * 1000; //once a hour

const app = koa();
app.use(serveStatic('./wwwroot'));
app.listen(3333);

app.use(function* () {
  const weekGroupedPayments = getDayPaymentInfosGroupedByWeek().filter(weekPayments => weekPayments[0].date.isAfter(moment("2016-01-31")));

  this.body = formatAggregation(getIncomeByWeek(weekGroupedPayments));
});

moment.locale('ru');

updateFromGoogleDoc();
setInterval(() => updateFromGoogleDoc(), refreshInterval);

function formatAggregation(aggregatedInfos) {
  return aggregatedInfos.map(aggregatedInfo => ({
    date: aggregatedInfo.date.format(),
    aggregatedRoomPayments: aggregatedInfo.aggregatedRoomPayments
  }));
}