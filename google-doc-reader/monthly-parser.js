'use strict';
import docMetadata from '../spreadsheet-metadata';
import promisify from 'es6-promisify';
import moment from 'moment';

export const parseMonthEntry = (docMonthEntry) => {
    const getCells = promisify(docMonthEntry.getCells);
    const cellsRange = {
        "min-row": 1,
        "max-row": docMonthEntry.rowCount,
        "min-col": 1,
        "max-col": docMonthEntry.colCount
    };

    getCells(cellsRange)
        .then(cells => {
            const firstDayOfMoth = detectFirstDayOfMonthCell(cells).value;
            const dayTitleCells = getDayTitleCells(cells, moment(firstDayOfMoth, docMetadata.dateFormat));

            console.log(dayTitleCells.map(dayRow => dayRow.row));
            
            // todo filter out total cells for a day and cells that are not responsible for paying in quests
            console.log(getPayingInfoRows(cells, dayTitleCells[0].row));
            // todo - receive an array with paying info, per day {day: [cells]}

        })
        .catch(err => console.log("error occured:" + err));
}

function detectFirstDayOfMonthCell(cells) {
    return cells.filter(cell => (cell.row === docMetadata.firstDayOfMonthCell.row && cell.col === docMetadata.firstDayOfMonthCell.column))[0];
}

function getDayTitleCells(cells, firstDayOfMonth) {
    const dayArray = [];

    for (let i = 0; i < firstDayOfMonth.daysInMonth(); i++) {
        const newDate = moment(firstDayOfMonth).add(i, 'd');
        dayArray.push(newDate.format(docMetadata.dateFormat));
    }

    return cells.filter(cell => (dayArray.indexOf(cell.value) > -1 && cell.row !== docMetadata.firstDayOfMonthCell.row && cell.col === 1));
}

function getPayingInfoRows(cells, dayTitleRowNumber) {
    let totalInfoRow = 0;
    let i = 1;
    while (!totalInfoRow) {
        let ind = dayTitleRowNumber + i;
        let rowTitleCell = cells.filter(cell => (cell.row === ind && cell.col === 1))[0];

        if (rowTitleCell && rowTitleCell.value.toLowerCase() === docMetadata.dayTotalTitle) {
            totalInfoRow = ind;
        } else {
            i = i + 1;
        }
    }

    return cells.filter(cell => (cell.row > dayTitleRowNumber && cell.row < totalInfoRow));
}