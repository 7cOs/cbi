import * as Chance from 'chance';

const chance = new Chance();

export function generateRandomSizedArray(minLength?: number, maxLength?: number): string[] {
  const min: number = minLength || 1;
  const max: number = maxLength || 10;

  return Array(chance.natural({ min: min, max: max })).fill('');
}
