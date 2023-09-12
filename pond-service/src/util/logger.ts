import { createLogger, transports, format } from 'winston';

const pondUserLogger = createLogger({
  format: format.combine(format.timestamp(), format.prettyPrint()),
  transports: [
    new transports.File({
      filename: 'pondUser.log',
      level: 'info'
    })
  ]
});

const fishingLogger = createLogger({
  format: format.combine(format.timestamp(), format.prettyPrint()),
  transports: [
    new transports.File({
      filename: 'fishing.log',
      level: 'info'
    })
  ]
});

export { pondUserLogger, fishingLogger };
