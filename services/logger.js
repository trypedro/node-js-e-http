const winston = require('winston')

let logger = new winston.createLogger({
    transports: [
        new winston.transports.File({
            level: "info",
            filename: "logs/payfast.log",
            maxsize: 100000,
            maxFiles: 10
        })
    ]
});
