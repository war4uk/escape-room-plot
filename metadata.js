import fs from 'fs';

export let docMetadata = JSON.parse(fs.readFileSync('./cfg/google-account-config.json', 'utf8'));
export let weekendsMetadata = JSON.parse(fs.readFileSync('./cfg/weekdays-as-weekends.json', 'utf8'));