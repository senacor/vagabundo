import { DateService } from './date.service';

describe('DateService', () => {
  it('should convert valid dates to ISO standard', () => {
    expect(DateService.toISODate('Mon, 24 Nov 1997')).toBe('1997-11-24');
    expect(DateService.toISODate('12/09/1986')).toBe('1986-12-09');
    expect(DateService.toISODate('01.01.2019')).toBe('2019-01-01');
  });

  it('should return Invalid Date when trying to convert an empty string', () => {
    expect(DateService.toISODate('')).toBe('Invalid Date');
  });

  it(`should return 'Invalid Date' when trying to convert an invalid date`, () => {
    expect(DateService.toISODate('31.02.2019')).toBe('Invalid Date');
    expect(DateService.toISODate('311.01.2019')).toBe('Invalid Date');
    expect(DateService.toISODate('31.13.2019')).toBe('Invalid Date');
  });
});
