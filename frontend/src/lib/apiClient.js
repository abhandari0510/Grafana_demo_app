import { createLogger } from './logger';

const apiLogger = createLogger('apiClient');
const BASE_PATH = '/api/v1/tasks';

function generateRequestId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `rid-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function parseResponse(text) {
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (_error) {
    return { raw: text };
  }
}

async function request(path, options = {}) {
  const requestId = generateRequestId();
  const method = options.method || 'GET';
  const startedAt = performance.now();

  apiLogger.info('http_request_start', {
    requestId,
    method,
    path
  });

  try {
    const response = await fetch(path, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-Request-ID': requestId,
        ...(options.headers || {})
      }
    });

    const responseText = await response.text();
    const data = parseResponse(responseText);
    const durationMs = Math.round(performance.now() - startedAt);

    apiLogger.info('http_request_end', {
      requestId,
      method,
      path,
      status: response.status,
      durationMs
    });

    if (!response.ok) {
      const error = new Error(data?.message || `HTTP ${response.status}`);
      error.status = response.status;
      error.code = data?.code || 'HTTP_ERROR';
      error.data = data;
      error.requestId = requestId;
      throw error;
    }

    return {
      data,
      requestId
    };
  } catch (error) {
    apiLogger.error('http_request_error', {
      requestId,
      method,
      path,
      status: error.status || 0,
      code: error.code || 'NETWORK_ERROR',
      error: error.message
    });
    throw error;
  }
}

export function fetchTasks() {
  return request(BASE_PATH);
}

export function createTask(title) {
  return request(BASE_PATH, {
    method: 'POST',
    body: JSON.stringify({ title })
  });
}

export function toggleTask(taskId) {
  return request(`${BASE_PATH}/${taskId}/toggle`, {
    method: 'PATCH'
  });
}

export function deleteTask(taskId) {
  return request(`${BASE_PATH}/${taskId}`, {
    method: 'DELETE'
  });
}

export function triggerFailureDemo() {
  return request(`${BASE_PATH}/fail`);
}
