import {trimSpecialChars} from '../functions/string';

describe('trimSpecialCharacters', () => {
  test('should trim leading special characters', () => {
    expect(trimSpecialChars('$$_aa')).toBe('aa');
  });
  test('should trim trailing special characters', () => {
    expect(trimSpecialChars('aa_$$')).toBe('aa');
  });
  test('should trim both leading and trailing special characters', () => {
    expect(trimSpecialChars('$$_aa_$$')).toBe('aa');
  });
  test('should leave empty string alone', () => {
    expect(trimSpecialChars('')).toBe('');
  });
});
