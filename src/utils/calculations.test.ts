import {anuitas, generateCreditData, bigNumberConverter} from './calculations';
import {anuitasParams, bigNumber} from './@types.calculations';

it('should test aunitas and equal to 6,210,657', () => {
  const result:number = anuitas({
    kredit: 400000000,
    bungaPerBulan: 14 / 100 / 12,
    tenor: 120
  });
  expect(result).toEqual(6210657);
});

it('should test generateCreditData. Length should be 120', () => {
  const data:anuitasParams = {
    kredit: 400000000,
    bungaPerBulan: 14 / 100 / 12,
    tenor: 120
  };
  const bulanan = anuitas(data);
  const results:number[] = generateCreditData({
    ...data,
    bulanan
  });
  expect(results.length).toEqual(121);
  expect(results[120]).toBeLessThan(1000);
});

it('should test bigNumberConverter', () => {
  const testData: {
    inputNumber: number,
    result: number,
    zeros?: number,
  }[] = [
    {inputNumber: 1000, result: 1.00},
    {inputNumber: 50000, result: 50.00},
    {inputNumber: 23456, result: 23.46},
    {inputNumber: 200, result: 200.00},
    {inputNumber: 1, result: 1.00},
    {inputNumber: 1000000, result: 1000.00, zeros: 1},
    {inputNumber: 5552528823, result: 5552528.82, zeros: 1},
    {inputNumber: 2304422244113, result: 2.30},
  ]
  for (const t of testData ) {
    expect(bigNumberConverter(t.inputNumber, t.zeros).smallNumber).toEqual(t.result);
  }
});

