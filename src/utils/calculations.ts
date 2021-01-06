import jsonData from '../data.json';
import {
  allData,
  dataPoint,
  anuitasParams,
  generateCreditDataParams,
  generateInvestDataParams,
} from './@types.calculations';

/**
 * Load JSON file of Stocks history and return the one requested.
 * @param {string}  ticker - Saham Investasi.
 * @return {array} Data Saham Investasi.
 */
const loadData = (ticker: string): dataPoint[] => {
  const data:allData = jsonData;
  return data[ticker];
};

/**
 * Calculated monthly payment given interest.
 * @param {object}  anuitasParams - Object of params.
 * @return {number} Cicilan per bulan.
 */
const anuitas = ({kredit, bungaPerBulan, tenor}: anuitasParams): number => { 
  const upper:number = kredit * bungaPerBulan;
  const exponen:number = (-1 * tenor)
  const lower:number = 1-((1 + bungaPerBulan) ** exponen);
  return Math.floor(upper / lower); 
};

/**
 * Generate data point for each month payment.
 * @param {object}  generateCreditDataParams - Object of params.
 * @return {array} Data setiap bulan dan bayaran per bulan.
 */
const generateCreditData = ({kredit, bungaPerBulan, tenor, bulanan}: generateCreditDataParams): number[] => { 
  const results:number[] = [kredit];
  let sisa:number = kredit;
  for (let i:number = 0; i < tenor; i += 1) {
    const currentBunga:number = sisa * bungaPerBulan;
    const bayar:number = bulanan - currentBunga;
    sisa -= bayar;
    results.push(sisa);
  }
  return results;
};

/**
 * Generate data point for each month investment value.
 * @param {object}  generateInvestDataParams - Object of params.
 * @return {array} Data setiap bulan.
 */
const generateInvestData = ({bulanan, tenor, cashOutInterval, tickerData}: generateInvestDataParams): number[] => {
  const cashOutValue =  bulanan * cashOutInterval;
  const kredit:number = bulanan * tenor;
  let cash:number = kredit - cashOutValue;
  let counter:number = 0;
  const results:number[] = [cash];
  for (let i:number = 0; i < tenor; i += 1) {
    counter += 1;
    if (counter === cashOutInterval) {
      cash -= cashOutValue;
      counter = 0;
    }
    cash += cash * tickerData[i];
    results.push(cash);
  }
  return results;
};

export {
  anuitas,
  generateCreditData,
  generateInvestData,
  loadData,
};