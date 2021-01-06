import {anuitas, generateCreditData} from './calculations';

it('should test aunitas and equal to 6,210,657', () => {
  const result:number = anuitas({
    kredit: 400000000,
    bunga: 14 / 100 / 12,
    tenor: 120
  });
  expect(result).toEqual(6210657);
});

it('should test generateCreditData. Length should be 120', () => {
  const results:number[] = generateCreditData({
    kredit: 400000000,
    bunga: 14,
    tenor: 120
  }).data;
  expect(results.length).toEqual(120);
  expect(results[119]).toBeLessThan(1000);
});

