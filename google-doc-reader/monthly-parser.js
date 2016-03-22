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

    return getCells(cellsRange)
        .then(cells => {
            // first day of month (i.e: 01.03.2016) is used as a base for detecting day title rows (i.e: 02.03.2016) 
            const firstDayOfMoth = detectFirstDayOfMonthCell(cells).value; 
            // these cells are used as a 'borders' for getting cells with payment info
            const dayTitleCells = getDayTitleCells(cells, moment(firstDayOfMoth, docMetadata.dateFormat)); 
            // these cells should be filtered out, as they have total info that should be included.
            const dayTotalCellsIndexes = getDayTotalCells(cells, docMonthEntry.rowCount).map(cell => cell.row); 
            // filter out totals and header of document
            const filteredCells = cells.filter(cell => ((cell.row >= dayTitleCells[0].row) && (dayTotalCellsIndexes.indexOf(cell.row) === -1))); // 

            return getDayPayingInfos(filteredCells, dayTitleCells);
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

function getDayTotalCells(cells, maxRowIndex) {
    let resultCells = [];
    for (let i = 1; i <= maxRowIndex; i++) {
        let cell = cells.filter(cell => (cell.row === i && cell.col === 1))[0];
        if (cell && cell.value.toLowerCase() === docMetadata.dayTotalTitle) {
            resultCells.push(cell);
        }
    }
    return resultCells;
}

function getDayPayingInfos(filteredCells, dayTitleCells) {
    let dayPaymentInfos = [];

    for (let i = 0; i < dayTitleCells.length; i++) {
        const dayTitleCell = dayTitleCells[i];

        const minRowIndex = dayTitleCells[i].row;
        const maxRowIndex = (i < (dayTitleCells.length - 1)) ? dayTitleCells[i + 1].row : Number.MAX_SAFE_INTEGER;

        dayPaymentInfos.push(getDayPaymentInfo(filteredCells, dayTitleCell, minRowIndex, maxRowIndex));
    }

    return dayPaymentInfos;
}


function getDayPaymentInfo(filteredCells, dayTitleCell, minRowIndex, maxRowIndex) {
    const numberOfRooms = docMetadata.questNames.length;

    let dayPaymentInfo = {
        date: moment(dayTitleCell.value, docMetadata.dateFormat),
        roomsPaymentInfos: []
    };


    for (let roomInd = 0; roomInd < numberOfRooms; roomInd++) {
        let roomColBaseIndex = docMetadata.totalColumnsForRoom * roomInd;
        let dayCells = filteredCells.filter(cell => (cell.row > minRowIndex) && (cell.row < maxRowIndex));

        let roomPaymentInfo = {
            roomName: docMetadata.questNames[roomInd],
            paymentsCash: filterAndParseByColIndex(dayCells, roomColBaseIndex + docMetadata.paymentCashIndexInRoom),
            payments: filterAndParseByColIndex(dayCells, roomColBaseIndex + docMetadata.paymentIndexInRoom),
            paymentsCertificate: filterAndParseByColIndex(dayCells, roomColBaseIndex + docMetadata.paymentCertificateIndexInRoom)
        }

        dayPaymentInfo.roomsPaymentInfos.push(roomPaymentInfo);
    }

    return dayPaymentInfo;
}

function filterAndParseByColIndex(cells, index) {
    return cells.filter(cell => cell.col === index).map(cell => parseInt(cell.value, 10) || 0);
}
