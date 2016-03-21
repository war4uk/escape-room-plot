'use strict';

import GoogleSpreadsheet from 'google-spreadsheet';
import fs from 'fs';
import promisify from 'es6-promisify';
import docMetadata from '../spreadsheet-metadata';

const account_info = JSON.parse(fs.readFileSync('./cfg/service-account-creds.json', 'utf8'));

const document = new GoogleSpreadsheet(docMetadata.documentId);
const useServiceAccountAuth = promisify(document.useServiceAccountAuth);
const getInfo = promisify(document.getInfo);

export const getSheetInfo = () => useServiceAccountAuth(account_info).then(() => getInfo());
