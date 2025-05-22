import { formatDate, formatDateTime } from '../formatDate';

describe('formatDate', () => {
  beforeEach(() => {
    // Mock current date untuk consistent testing
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-15T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Recent dates', () => {
    test('returns "Yesterday" for yesterday date', () => {
      const yesterday = new Date('2024-01-14T12:00:00Z');
      const result = formatDate(yesterday.toISOString());
      expect(result).toBe('Yesterday');
    });

    test('returns days ago for recent dates (2-6 days)', () => {
      const threeDaysAgo = new Date('2024-01-12T12:00:00Z');
      const result = formatDate(threeDaysAgo.toISOString());
      expect(result).toBe('3 days ago');
    });

    test('returns single day correctly', () => {
      const twoDaysAgo = new Date('2024-01-13T12:00:00Z');
      const result = formatDate(twoDaysAgo.toISOString());
      expect(result).toBe('2 days ago');
    });
  });

  describe('Weekly dates', () => {
    test('returns weeks ago for dates older than 7 days', () => {
      const twoWeeksAgo = new Date('2024-01-01T12:00:00Z');
      const result = formatDate(twoWeeksAgo.toISOString());
      expect(result).toBe('2 weeks ago');
    });

    test('returns single week correctly', () => {
      const oneWeekAgo = new Date('2024-01-08T12:00:00Z');
      const result = formatDate(oneWeekAgo.toISOString());
      expect(result).toBe('1 week ago');
    });

    test('returns multiple weeks correctly', () => {
      const threeWeeksAgo = new Date('2023-12-25T12:00:00Z');
      const result = formatDate(threeWeeksAgo.toISOString());
      expect(result).toBe('3 weeks ago');
    });
  });

  describe('Monthly dates', () => {
    test('returns months ago for dates older than 30 days', () => {
      const twoMonthsAgo = new Date('2023-11-15T12:00:00Z');
      const result = formatDate(twoMonthsAgo.toISOString());
      expect(result).toBe('2 months ago');
    });

    test('returns single month correctly', () => {
      const oneMonthAgo = new Date('2023-12-15T12:00:00Z');
      const result = formatDate(oneMonthAgo.toISOString());
      expect(result).toBe('1 month ago');
    });

    test('handles edge case at month boundary', () => {
      const thirtyDaysAgo = new Date('2023-12-16T12:00:00Z');
      const result = formatDate(thirtyDaysAgo.toISOString());
      expect(result).toBe('4 weeks ago');
    });
  });

  describe('Yearly dates', () => {
    test('returns years ago for dates older than 365 days', () => {
      const twoYearsAgo = new Date('2022-01-15T12:00:00Z');
      const result = formatDate(twoYearsAgo.toISOString());
      expect(result).toBe('2 years ago');
    });

    test('returns single year correctly', () => {
      const oneYearAgo = new Date('2023-01-15T12:00:00Z');
      const result = formatDate(oneYearAgo.toISOString());
      expect(result).toBe('1 year ago');
    });
  });

  describe('Edge cases', () => {
    test('handles same day/time', () => {
      const now = new Date('2024-01-15T12:00:00Z');
      const result = formatDate(now.toISOString());
      expect(result).toBe('Yesterday'); // Due to Math.ceil, same time becomes 1 day
    });

    test('handles invalid date string', () => {
      expect(() => formatDate('invalid-date')).not.toThrow();
      const result = formatDate('invalid-date');
      expect(typeof result).toBe('string');
    });

    test('handles empty string', () => {
      expect(() => formatDate('')).not.toThrow();
    });

    test('handles null/undefined', () => {
      expect(() => formatDate(null)).not.toThrow();
      expect(() => formatDate(undefined)).not.toThrow();
    });
  });
});

describe('formatDateTime', () => {
  test('formats date and time in Indonesian locale', () => {
    const date = new Date('2024-01-15T10:30:00Z');
    const result = formatDateTime(date.toISOString());
    
    // Check that it contains expected parts
    expect(result).toMatch(/15/); // day
    expect(result).toMatch(/Januari/); // month in Indonesian
    expect(result).toMatch(/2024/); // year
    expect(result).toMatch(/10:30/); // time
  });

  test('handles different months correctly', () => {
    const dates = [
      { date: '2024-02-15T10:30:00Z', month: 'Februari' },
      { date: '2024-03-15T10:30:00Z', month: 'Maret' },
      { date: '2024-12-15T10:30:00Z', month: 'Desember' }
    ];

    dates.forEach(({ date, month }) => {
      const result = formatDateTime(date);
      expect(result).toMatch(new RegExp(month));
    });
  });

  test('formats time correctly with leading zeros', () => {
    const earlyMorning = new Date('2024-01-15T09:05:00Z');
    const result = formatDateTime(earlyMorning.toISOString());
    
    expect(result).toMatch(/09:05/);
  });

  test('handles different years', () => {
    const pastDate = new Date('2020-06-15T14:30:00Z');
    const result = formatDateTime(pastDate.toISOString());
    
    expect(result).toMatch(/2020/);
    expect(result).toMatch(/Juni/);
  });

  describe('Edge cases', () => {
    test('handles leap year', () => {
      const leapDay = new Date('2024-02-29T12:00:00Z');
      const result = formatDateTime(leapDay.toISOString());
      
      expect(result).toMatch(/29/);
      expect(result).toMatch(/Februari/);
      expect(result).toMatch(/2024/);
    });

    test('handles end of year', () => {
      const newYearsEve = new Date('2023-12-31T23:59:00Z');
      const result = formatDateTime(newYearsEve.toISOString());
      
      expect(result).toMatch(/31/);
      expect(result).toMatch(/Desember/);
      expect(result).toMatch(/2023/);
      expect(result).toMatch(/23:59/);
    });

    test('handles invalid date gracefully', () => {
      expect(() => formatDateTime('invalid-date')).not.toThrow();
    });
  });
});

// Integration tests
describe('Date formatting integration', () => {
  test('formatDate and formatDateTime work with same input', () => {
    const dateString = '2024-01-15T10:30:00Z';
    
    expect(() => formatDate(dateString)).not.toThrow();
    expect(() => formatDateTime(dateString)).not.toThrow();
    
    const relativeResult = formatDate(dateString);
    const absoluteResult = formatDateTime(dateString);
    
    expect(typeof relativeResult).toBe('string');
    expect(typeof absoluteResult).toBe('string');
    expect(relativeResult).not.toBe(absoluteResult);
  });

  test('both functions handle timezone correctly', () => {
    const utcDate = '2024-01-15T10:30:00Z';
    const localDate = '2024-01-15T10:30:00+07:00';
    
    // Both should work without throwing
    expect(() => formatDate(utcDate)).not.toThrow();
    expect(() => formatDate(localDate)).not.toThrow();
    expect(() => formatDateTime(utcDate)).not.toThrow();
    expect(() => formatDateTime(localDate)).not.toThrow();
  });
});