import fs from 'fs';

export default JSON.parse(fs.readFileSync('./cfg/google-account-config.json', 'utf8'));