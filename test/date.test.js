import { expect } from 'chai';
import date from '../src/date.js';

// test number of 376165087 is 2024-09-16T22:30:00 PDT
describe('date.js', () => {
  describe('wfTimeToLocalTime()', () => {
    it('Converts time to MMMM dd, yyyy format', () => {
      expect(
        date.wfTimeToLocalTime(376165087, date.WF_EPOCH_SECONDS_PST))
        .to.equal("September 16, 2024");
    });
    it('Converts time to yyyy-MM-dd format');
    it('Converts time to YYYY_MM_DD journal format');
  });
});
