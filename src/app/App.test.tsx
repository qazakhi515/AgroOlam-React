import { store } from './store';

describe('AgroOlam Application Smoke Tests', () => {
  test('Redux store initializes properly with default state', () => {
    const state = store.getState();
    expect(state).toBeDefined();
  });
});

