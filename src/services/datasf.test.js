import { getHeaders, formatQuery } from './datasf';

describe('fetch helper logic', () => {
  describe('getHeaders', () => {
    const initialEnv = process.env;
    afterEach(() => {
      process.env = initialEnv;
    });

    it('should return empty header if there is no token', () => {
      process.env = {};
      expect(getHeaders()).toEqual({});
    });
    it('should return header with token if token exists', () => {
      process.env.DATASF_TOKEN = 'FAKE_TOKEN_VALUE';
      expect(getHeaders()).toEqual({ 'X-App-Token': process.env.DATASF_TOKEN });
    });
  });

  describe('formatQuery', () => {
    it('should return an encoded URL query', () => {
      const testQueries = {
        'first': 1,
        'encoded': '500%',
      };
      expect(formatQuery(testQueries).endsWith(`?first=1&encoded=${encodeURI('500%')}`)).toBeTruthy();
    });
  });
});
