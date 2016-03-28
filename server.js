'use strict';
require("babel-polyfill");

import koa from 'koa';
import serveStatic from 'koa-static';
import {updateFromGoogleDoc, getDayPaymentInfosGroupedByWeek} from './persisted-data/persisted-data';

import { getAveragePerWeekends, getAveragePerWorkdays } from './report-builders/average-per-weekend-and-workdays';
import getGamesCount from './report-builders/games-count-by-week'; 
import getGamesIncome from './report-builders/income-by-week'; 
import moment from 'moment';

const refreshInterval = 60 * 60 * 1000; //once a hour

const app = koa();
app.use(serveStatic('./wwwroot'));
app.listen(3333);

app.use(function* () {
  const paymentsToConsider = getDayPaymentInfosGroupedByWeek().filter(weekPayments => weekPayments[0].date.isAfter(moment("2016-01-31")));
  
  // inefficient, need to refactor in future
  const allInfoForWeeks = {
      avgPerWeekend: formatAggregation(getAveragePerWeekends(paymentsToConsider)),
      avgPerWorkday: formatAggregation(getAveragePerWorkdays(paymentsToConsider)),
      gamesCount: formatAggregation(getGamesCount(paymentsToConsider)),
      gamesIncome: formatAggregation(getGamesIncome(paymentsToConsider))
  }  

  this.body = allInfoForWeeks;
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