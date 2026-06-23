import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock WebSocket to prevent unhandled JSDOM connection errors during tests
global.WebSocket = class {
  constructor(url) {
    this.url = url;
    this.readyState = 0;
  }
  send() {}
  close() {}
  addEventListener() {}
  removeEventListener() {}
  dispatchEvent() {}
};
