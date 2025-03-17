/* eslint-disable @typescript-eslint/no-require-imports */
const https = require('https');
const fs = require('fs');
const handler = require('serve-handler');

const options = {
    key: fs.readFileSync("server/cert/cert.key"),
    cert: fs.readFileSync('server/cert/cert.pem')
};

https.createServer(options, (req, res) => {
    return handler(req, res, {
        public: 'dist'
    });
}).listen(443);