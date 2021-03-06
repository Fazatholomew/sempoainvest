import jsonData from '../data.json';
import {
  allData,
  dataPoint,
  anuitasParams,
  generateCreditDataParams,
  generateInvestDataParams,
  bigNumber,
  investDataType,
  tickerDataProps
} from './@types.calculations';

const satuan: string[] = ['', 'Ribu', 'Juta', 'Milyar', 'Triliun', 'Kuadriliun', 'Kuantiliun', 'Sekstiliun']

/**
 * Scale Up small numbers and print them in proper way.
 * @param {number}  inputNumber - Big Number.
 * @return {string} Number in Rp.
 */

const printNumber = (inputValue: number, _zeros: number = 0, isPrintRp=true): string => {
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  });
  const {smallNumber, zeros}: bigNumber = bigNumberConverter(inputValue * 10 ** (3 * _zeros));
  if (!isPrintRp) {
    const f = new Intl.NumberFormat('id-ID');
    return f.format(inputValue);
  }
  return `${formatter.format(smallNumber)} ${satuan[zeros]}`;
};

/**
 * Convert string into number with garbage in it.
 * @param {string}  str - Big Number.
 * @return {number} Number.
 */

const filterNotNumber = (str: string): number => {
  const matches = str.replace(/\./g, '').replace(/,/g, '.').match(/[+-]?\d+(\.\d+)?/g);
  if (!matches) {
    return null;
  }
  return parseFloat(matches.join(''));
};

/**
 * Scale down big numbers into scientific notation.
 * @param {number}  inputNumber - Big Number.
 * @return {object} Converted number and How many zero's.
 */
const bigNumberConverter = (inputNumber: number, zeros: number | null=null): bigNumber => {
  if (zeros) {
    const returnZero: number = zeros ? zeros : 1;
    return {
      zeros: returnZero,
      smallNumber: Math.round((inputNumber / (1000 ** returnZero) * 100)) / 100,
    }
  }
  const isNegative: boolean = inputNumber < 0;
  for (let k:number = 0; k < 6; k += 1) {

    const smallNumber:number = (isNegative ? inputNumber * -1 : inputNumber ) / (10 ** (3 * k));
    if (smallNumber > 0.01 && smallNumber < 999) {
      return {
        smallNumber: Math.round((isNegative ? smallNumber * -1 : smallNumber) * 100) / 100,
        zeros: k
      }
    }
  }
  return {
    smallNumber: inputNumber,
    zeros: 0
  };
};

/**
 * Load JSON file of Stocks history and return the one requested.
 * @param {string}  ticker - Saham Investasi.
 * @return {array} Data Saham Investasi.
 */
const loadData = (ticker: string): tickerDataProps => {
  const data:any = jsonData;
  return data[ticker];
};

/**
 * Load JSON file of Stocks history and return all tickers.
 * @return {array} All tickers.
 */
const loadTickers = (): string[] => {
  const data:any = jsonData;
    return Object.keys(data);
};

/**
 * Calculated monthly payment given interest.
 * @param {object}  anuitasParams - Object of params.
 * @return {number} Cicilan per bulan.
 */
const anuitas = ({kredit, bungaPerBulan, tenor, isSyariah}: anuitasParams): number => { 
  if (bungaPerBulan === 0) {
    return Math.ceil(kredit / tenor);
  }
  if (isSyariah) {
    const bunga:number = bungaPerBulan * tenor * kredit;
    return Math.ceil((kredit + bunga) / tenor);
  }
  const upper:number = kredit * bungaPerBulan;
  const exponen:number = (-1 * tenor)
  const lower:number = 1-((1 + bungaPerBulan) ** exponen);
  return Math.ceil(upper / lower); 
};

/**
 * Generate data point for each month payment.
 * @param {object}  generateCreditDataParams - Object of params.
 * @return {array} Data setiap bulan dan bayaran per bulan.
 */
const generateCreditData = ({kredit, bungaPerBulan, tenor, bulanan, isSyariah}: generateCreditDataParams): number[] => { 
  const results:number[] = [kredit];
  let sisa:number = kredit;
  const bunga: number = bulanan - (kredit * bungaPerBulan)
  for (let i:number = 0; i < tenor; i += 1) {
    if (isSyariah) {
      sisa -= bunga;
    } else {
      const currentBunga:number = sisa * bungaPerBulan;
      const bayar:number = bulanan - currentBunga;
      sisa -= bayar;
    }
    sisa = sisa < 1000 ? 0 : sisa;
    results.push(sisa);
  }
  
  return results;
};

/**
 * Generate data point for each month investment value.
 * @param {object}  generateInvestDataParams - Object of params.
 * @return {array} Data setiap bulan.
 */
const generateInvestData = ({bulanan, tenor, cashOutInterval, tickerData}: generateInvestDataParams): investDataType => {
  const cashOutValue =  cashOutInterval === tenor ? 0 : bulanan * cashOutInterval;
  const kredit:number = bulanan * tenor;
  let cash:number = kredit - cashOutValue;
  let counter:number = 0;
  const length = tickerData['Data Length']
  const marginOfErrorData = tenor + 1 > length ? tickerData.Data['Margin of Error'] : tickerData.Data['Margin of Error'].reverse().slice(0, tenor + 1).reverse();
  const changesData = tenor + 1 > length ? tickerData.Data.Changes : tickerData.Data.Changes.reverse().slice(0, tenor + 1).reverse();
  const marginOfError: investDataType["marginOfError"] = [[cash, cash]];
  const results:number[] = [cash];
  for (let i:number = 0; i < tenor; i += 1) {
    counter += 1;
    if (counter === cashOutInterval) {
      cash -= cashOutValue;
      counter = 0;
    }
    marginOfError.push([
      (cash + (cash * ((marginOfErrorData[i % length][0] / 100)))),
      (cash + (cash * ((marginOfErrorData[i % length][1] / 100)))),
    ]);
    cash += cash * (changesData[i % length] / 100);
    results.push(cash);
    
  }
  return {
    investData: results,
    marginOfError
  };
};

/**
 * Detect if this is a mobile browser
 * @return {boolean} true if it is.
 */
const detectMobile = (): boolean => {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor);
  return check;
};

export {
  anuitas,
  generateCreditData,
  generateInvestData,
  loadData,
  bigNumberConverter,
  printNumber,
  detectMobile,
  loadTickers,
  filterNotNumber
};