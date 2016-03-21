'use strict';

import { getSheetInfo } from './google-doc-reader/spreadsheet-reader';
import { parseMonthEntry } from './google-doc-reader/monthly-parser';

getSheetInfo()
    .then(info => {
        parseMonthEntry(info.worksheets.filter(worksheet => (worksheet.title.toLowerCase() === 'март'))[0]);
    })
    .catch(err => console.log('error occured: ' + err));