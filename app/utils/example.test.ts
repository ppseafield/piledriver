import { describe, it, expect } from 'vitest'
import { addTwo } from './example'

describe('addTwo', () => {
  it('should return the sum of two numbers', () => {
    expect(addTwo(2, 3)).toBe(5);
  });

  it('should return the sum of two negative numbers', () => {
    expect(addTwo(-2, -3)).toBe(-5);
  });

  it('should return the sum of a positive and a negative number', () => {
    expect(addTwo(2, -3)).toBe(-1);
  });

  it('should return the sum of zero and a number', () => {
    expect(addTwo(0, 5)).toBe(5);
  });
});