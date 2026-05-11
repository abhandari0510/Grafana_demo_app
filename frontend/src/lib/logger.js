const SERVICE_NAME = 'three-tier-frontend';

const CONSOLE_METHOD_BY_LEVEL = {
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  DEBUG: 'debug'
};

function emit(level, logger, message, context = {}) {
  const { requestId = 'na', ...rest } = context;
  const payload = {
    timestamp: new Date().toISOString(),
    level,
    service: SERVICE_NAME,
    requestId,
    logger,
    message,
    ...rest
  };

  const consoleMethod = CONSOLE_METHOD_BY_LEVEL[level] || 'log';
  console[consoleMethod](JSON.stringify(payload));
}

export function createLogger(logger) {
  return {
    info(message, context) {
      emit('INFO', logger, message, context);
    },
    warn(message, context) {
      emit('WARN', logger, message, context);
    },
    error(message, context) {
      emit('ERROR', logger, message, context);
    },
    debug(message, context) {
      emit('DEBUG', logger, message, context);
    }
  };
}
