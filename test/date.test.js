import { expect } from 'chai';

import {
  addDaySuffix,
  formatDate,
  formatTime,
  localSecondsToCustomDateObj,
  wfSecondsToPstSeconds
} from '../src/date.js';

describe('date.js', () => {
  describe('addDaySuffix()', () => {
    it('Adds correct suffix for numbers 1-31', () => {
      expect(addDaySuffix(1)).to.deep.equal('1st');
      expect(addDaySuffix(2)).to.deep.equal('2nd');
      expect(addDaySuffix(3)).to.deep.equal('3rd');
      expect(addDaySuffix(4)).to.deep.equal('4th');
      expect(addDaySuffix(5)).to.deep.equal('5th');
      expect(addDaySuffix(6)).to.deep.equal('6th');
      expect(addDaySuffix(7)).to.deep.equal('7th');
      expect(addDaySuffix(8)).to.deep.equal('8th');
      expect(addDaySuffix(9)).to.deep.equal('9th');
      expect(addDaySuffix(10)).to.deep.equal('10th');
      expect(addDaySuffix(11)).to.deep.equal('11th');
      expect(addDaySuffix(12)).to.deep.equal('12th');
      expect(addDaySuffix(13)).to.deep.equal('13th');
      expect(addDaySuffix(14)).to.deep.equal('14th');
      expect(addDaySuffix(15)).to.deep.equal('15th');
      expect(addDaySuffix(16)).to.deep.equal('16th');
      expect(addDaySuffix(17)).to.deep.equal('17th');
      expect(addDaySuffix(18)).to.deep.equal('18th');
      expect(addDaySuffix(19)).to.deep.equal('19th');
      expect(addDaySuffix(20)).to.deep.equal('20th');
      expect(addDaySuffix(21)).to.deep.equal('21st');
      expect(addDaySuffix(22)).to.deep.equal('22nd');
      expect(addDaySuffix(23)).to.deep.equal('23rd');
      expect(addDaySuffix(24)).to.deep.equal('24th');
      expect(addDaySuffix(25)).to.deep.equal('25th');
      expect(addDaySuffix(26)).to.deep.equal('26th');
      expect(addDaySuffix(27)).to.deep.equal('27th');
      expect(addDaySuffix(28)).to.deep.equal('28th');
      expect(addDaySuffix(29)).to.deep.equal('29th');
      expect(addDaySuffix(30)).to.deep.equal('30th');
      expect(addDaySuffix(31)).to.deep.equal('31st');
    });
  });
  describe('formatDate()', () => {
    const testDateOne = {
      startYear: 2024,
      endYear: 2024,
      startMonth: 9,
      endMonth: 10,
      startDay: 1,
      endDay: 2,
      startHour: 9,
      endHour: 10,
      startMinute: 0,
      endMinute: 0,
    }
    const testDateTwo = {
      startYear: 2024,
      endYear: 2024,
      startMonth: 10,
      endMonth: 11,
      startDay: 30,
      endDay: 31,
      startHour: 22,
      endHour: 23,
      startMinute: 0,
      endMinute: 0,
    }
    it('Converts date to "E, MM/dd/yyyy" format', () => {
      expect(formatDate(testDateOne, 'E, MM/dd/yyyy')).to.deep.equal('Sun, 09/01/2024')
      expect(formatDate(testDateTwo, 'E, MM/dd/yyyy')).to.deep.equal('Wed, 10/30/2024')
    });
    it('Converts date to "E, MM-dd-yyyy" format', () => {
      expect(formatDate(testDateOne, 'E, MM-dd-yyyy')).to.deep.equal('Sun, 09-01-2024')
      expect(formatDate(testDateTwo, 'E, MM-dd-yyyy')).to.deep.equal('Wed, 10-30-2024')
    });
    it('Converts date to "E, MM.dd.yyyy" format', () => {
      expect(formatDate(testDateOne, 'E, MM.dd.yyyy')).to.deep.equal('Sun, 09.01.2024')
      expect(formatDate(testDateTwo, 'E, MM.dd.yyyy')).to.deep.equal('Wed, 10.30.2024')
    });
    it('Converts date to "E, yyyy/MM/dd" format', () => {
      expect(formatDate(testDateOne, 'E, yyyy/MM/dd')).to.deep.equal('Sun, 2024/09/01')
      expect(formatDate(testDateTwo, 'E, yyyy/MM/dd')).to.deep.equal('Wed, 2024/10/30')
    });
    it('Converts date to "EEE, MM/dd/yyyy" format', () => {
      expect(formatDate(testDateOne, 'EEE, MM/dd/yyyy')).to.deep.equal('Sun, 09/01/2024')
      expect(formatDate(testDateTwo, 'EEE, MM/dd/yyyy')).to.deep.equal('Wed, 10/30/2024')
    });
    it('Converts date to "EEE, MM-dd-yyyy" format', () => {
      expect(formatDate(testDateOne, 'EEE, MM-dd-yyyy')).to.deep.equal('Sun, 09-01-2024')
      expect(formatDate(testDateTwo, 'EEE, MM-dd-yyyy')).to.deep.equal('Wed, 10-30-2024')
    });
    it('Converts date to "EEE, MM.dd.yyyy" format', () => {
      expect(formatDate(testDateOne, 'EEE, MM.dd.yyyy')).to.deep.equal('Sun, 09.01.2024')
      expect(formatDate(testDateTwo, 'EEE, MM.dd.yyyy')).to.deep.equal('Wed, 10.30.2024')
    });
    it('Converts date to "EEE, yyyy/MM/dd" format', () => {
      expect(formatDate(testDateOne, 'EEE, yyyy/MM/dd')).to.deep.equal('Sun, 2024/09/01')
      expect(formatDate(testDateTwo, 'EEE, yyyy/MM/dd')).to.deep.equal('Wed, 2024/10/30')
    });
    it('Converts date to "EEEE, MM/dd/yyyy" format', () => {
      expect(formatDate(testDateOne, 'EEEE, MM/dd/yyyy')).to.deep.equal('Sunday, 09/01/2024')
      expect(formatDate(testDateTwo, 'EEEE, MM/dd/yyyy')).to.deep.equal('Wednesday, 10/30/2024')
    });
    it('Converts date to "EEEE, MM-dd-yyyy" format', () => {
      expect(formatDate(testDateOne, 'EEEE, MM-dd-yyyy')).to.deep.equal('Sunday, 09-01-2024')
      expect(formatDate(testDateTwo, 'EEEE, MM-dd-yyyy')).to.deep.equal('Wednesday, 10-30-2024')
    });
    it('Converts date to "EEEE, MM.dd.yyyy" format', () => {
      expect(formatDate(testDateOne, 'EEEE, MM.dd.yyyy')).to.deep.equal('Sunday, 09.01.2024')
      expect(formatDate(testDateTwo, 'EEEE, MM.dd.yyyy')).to.deep.equal('Wednesday, 10.30.2024')
    });
    it('Converts date to "EEEE, yyyy/MM/dd" format', () => {
      expect(formatDate(testDateOne, 'EEEE, yyyy/MM/dd')).to.deep.equal('Sunday, 2024/09/01')
      expect(formatDate(testDateTwo, 'EEEE, yyyy/MM/dd')).to.deep.equal('Wednesday, 2024/10/30')
    });
    it('Converts date to "MM-dd-yyyy" format', () => {
      expect(formatDate(testDateOne, 'MM-dd-yyyy')).to.deep.equal('09-01-2024')
      expect(formatDate(testDateTwo, 'MM-dd-yyyy')).to.deep.equal('10-30-2024')
    });
    it('Converts date to "MM/dd/yyyy" format', () => {
      expect(formatDate(testDateOne, 'MM/dd/yyyy')).to.deep.equal('09/01/2024')
      expect(formatDate(testDateTwo, 'MM/dd/yyyy')).to.deep.equal('10/30/2024')
    });
    it('Converts date to "MMM do, yyyy" format', () => {
      expect(formatDate(testDateOne, 'MMM do, yyyy')).to.deep.equal('Sep 1st, 2024')
      expect(formatDate(testDateTwo, 'MMM do, yyyy')).to.deep.equal('Oct 30th, 2024')
    });
    it('Converts date to "MMMM do, yyyy" format', () => {
      expect(formatDate(testDateOne, 'MMMM do, yyyy')).to.deep.equal('September 1st, 2024')
      expect(formatDate(testDateTwo, 'MMMM do, yyyy')).to.deep.equal('October 30th, 2024')
    });
    it('Converts date to "MM_dd_yyyy" format', () => {
      expect(formatDate(testDateOne, 'MM_dd_yyyy')).to.deep.equal('09_01_2024')
      expect(formatDate(testDateTwo, 'MM_dd_yyyy')).to.deep.equal('10_30_2024')
    });
    it('Converts date to "dd-MM-yyyy" format', () => {
      expect(formatDate(testDateOne, 'dd-MM-yyyy')).to.deep.equal('01-09-2024')
      expect(formatDate(testDateTwo, 'dd-MM-yyyy')).to.deep.equal('30-10-2024')
    });
    it('Converts date to "do MMM yyyy" format', () => {
      expect(formatDate(testDateOne, 'do MMM yyyy')).to.deep.equal('1st Sep 2024')
      expect(formatDate(testDateTwo, 'do MMM yyyy')).to.deep.equal('30th Oct 2024')
    });
    it('Converts date to "do MMMM yyyy" format', () => {
      expect(formatDate(testDateOne, 'do MMMM yyyy')).to.deep.equal('1st September 2024')
      expect(formatDate(testDateTwo, 'do MMMM yyyy')).to.deep.equal('30th October 2024')
    });
    it('Converts date to "yyyy-MM-dd" format', () => {
      expect(formatDate(testDateOne, 'yyyy-MM-dd')).to.deep.equal('2024-09-01')
      expect(formatDate(testDateTwo, 'yyyy-MM-dd')).to.deep.equal('2024-10-30')
    });
    it('Converts date to "yyyy-MM-dd EEEE" format', () => {
      expect(formatDate(testDateOne, 'yyyy-MM-dd EEEE')).to.deep.equal('2024-09-01 Sunday')
      expect(formatDate(testDateTwo, 'yyyy-MM-dd EEEE')).to.deep.equal('2024-10-30 Wednesday')
    });
    it('Converts date to "yyyy/MM/dd" format', () => {
      expect(formatDate(testDateOne, 'yyyy/MM/dd')).to.deep.equal('2024/09/01')
      expect(formatDate(testDateTwo, 'yyyy/MM/dd')).to.deep.equal('2024/10/30')
    });
    it('Converts date to "yyyyMMdd" format', () => {
      expect(formatDate(testDateOne, 'yyyyMMdd')).to.deep.equal('20240901')
      expect(formatDate(testDateTwo, 'yyyyMMdd')).to.deep.equal('20241030')
    });
    it('Converts date to "yyyy_MM_dd" format', () => {
      expect(formatDate(testDateOne, 'yyyy_MM_dd')).to.deep.equal('2024_09_01')
      expect(formatDate(testDateTwo, 'yyyy_MM_dd')).to.deep.equal('2024_10_30')
    });
    it('Converts date to "yyyy年MM月dd日" format', () => {
      expect(formatDate(testDateOne, 'yyyy年MM月dd日')).to.deep.equal('2024年09月01日')
      expect(formatDate(testDateTwo, 'yyyy年MM月dd日')).to.deep.equal('2024年10月30日')
    });
  });
  describe('formatTime()', () => {
    const testDateOne = {
      startYear: 2024,
      endYear: 2024,
      startMonth: 9,
      endMonth: 10,
      startDay: 1,
      endDay: 2,
      startHour: 9,
      endHour: 10,
      startMinute: 0,
      endMinute: 0,
    }
    const testDateTwo = {
      startYear: 2024,
      endYear: 2024,
      startMonth: 10,
      endMonth: 11,
      startDay: 30,
      endDay: 31,
      startHour: 22,
      endHour: 23,
      startMinute: 0,
      endMinute: 0,
    }
    it('Converts time to "HH:mm" format', () => {
      expect(formatTime(testDateOne, 'HH:mm')).to.deep.equal('09:00')
      expect(formatTime(testDateTwo, 'HH:mm')).to.deep.equal('22:00')
    });
    it('Converts time to "H:mm" format', () => {
      expect(formatTime(testDateOne, 'H:mm')).to.deep.equal('9:00')
      expect(formatTime(testDateTwo, 'H:mm')).to.deep.equal('22:00')
    });
    it('Converts time to "h:mm A" format', () => {
      expect(formatTime(testDateOne, 'h:mm A')).to.deep.equal('9:00 AM')
      expect(formatTime(testDateTwo, 'h:mm A')).to.deep.equal('10:00 PM')
    });
    it('Converts time to "h:mm a" format', () => {
      expect(formatTime(testDateOne, 'h:mm a')).to.deep.equal('9:00 am')
      expect(formatTime(testDateTwo, 'h:mm a')).to.deep.equal('10:00 pm')
    });
    it('Converts time to unix time in seconds', () => {
      expect(formatTime(testDateOne, 'X')).to.deep.equal('1725206400')
      expect(formatTime(testDateTwo, 'X')).to.deep.equal('1730350800')
    });
    it('Converts time to unix time in ms', () => {
      expect(formatTime(testDateOne, 'x')).to.deep.equal('1725206400000')
      expect(formatTime(testDateTwo, 'x')).to.deep.equal('1730350800000')
    });
  });
  describe('WF Timestamp Conversions', () => {
    // test WF timestamp of 376165087 is 2024-09-16T22:30:00 PDT
    let wfTimestamp = 376165087;
    let pstTimestamp = 1726551023;
    let customDateObject = {
      startYear: 2024,
      startMonth: 9,
      startDay: 16,
      startHour: 22,
      startMinute: 30,
    }
    describe('wfSecondsToPstSeconds()', () => {
      it('Converts WF timestamp to PST seconds', () => {
        expect(wfSecondsToPstSeconds(wfTimestamp)).to.deep.equal(pstTimestamp);
      });
    });
    describe('localSecondsToCustomDateObj()', () => {
      it('Converts local seconds to custom Date Obj', () => {
        expect(localSecondsToCustomDateObj(pstTimestamp)).to.deep.equal(customDateObject);
      });
    });
    describe('formatDate()', () => {
      it('Converts custom Date Obj correctly', () => {
        expect(formatDate(customDateObject, 'MMMM do, yyyy')).to.deep.equal("September 16th, 2024");
      });
    });
  });
});
