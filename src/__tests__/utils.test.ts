import { cn, getInitials } from '@/lib/utils';

describe('Utils', () => {
  describe('cn (className utility)', () => {
    it('should merge class names correctly', () => {
      const result = cn('base-class', 'additional-class');
      expect(result).toContain('base-class');
      expect(result).toContain('additional-class');
    });

    it('should handle conditional classes', () => {
      const result = cn('base-class', true && 'conditional-class', false && 'hidden-class');
      expect(result).toContain('base-class');
      expect(result).toContain('conditional-class');
      expect(result).not.toContain('hidden-class');
    });
  });

  describe('getInitials', () => {
    it('should return initials from full name', () => {
      expect(getInitials('John Doe')).toBe('JD');
      expect(getInitials('Alice Bob Charlie')).toBe('AB'); // Only takes first 2
    });

    it('should handle single name', () => {
      expect(getInitials('John')).toBe('J');
    });

    it('should handle empty or undefined input', () => {
      expect(getInitials('')).toBe('');
      expect(getInitials('   ')).toBe('');
    });

    it('should handle email addresses', () => {
      expect(getInitials('john.doe@example.com')).toBe('J'); // Only first word
    });
  });
});
