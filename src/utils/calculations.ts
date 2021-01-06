interface anuitasParams {
  /**
   * Kredit: 'Jumlah kredit setelah dikurangi DP',
   */
  kredit: number,
  /**
   * Bunga: 'Presentase bunga per bulan',
   */
  bunga: number,
  /**
   * Tenor: 'Jumlah lama kredit',
   */
  tenor: number

}

/**
 * Calculated monthly payment given interest.
 * @param {object}  anuitasParams - Object of params.
 * @return {number} Cicilan per bulan.
 */
const anuitas = ({kredit, bunga, tenor}: anuitasParams): number => { 
  const upper:number = kredit * bunga;
  const exponen:number = (-1 * tenor)
  const lower:number = 1-((1 + bunga) ** exponen);
  return Math.floor(upper / lower); 
};

interface generateCreditDataParams {
  /**
   * Kredit: 'Jumlah kredit setelah dikurangi DP',
   */
  kredit: number,
  /**
   * Bunga: 'Presentase bunga per tahun',
   */
  bunga: number,
  /**
   * Tenor: 'Jumlah lama kredit',
   */
  tenor: number

}

/**
 * Generate data point for each month payment.
 * @param {object}  generateCreditDataParams - Object of params.
 * @return {number} Data setiap bulan.
 */
const generateCreditData = ({kredit, bunga, tenor}: generateCreditDataParams): {data: number[], bulanan:number} => { 
  const bungaPerBulan:number = (bunga / 100) / 12;
  const bulanan:number = anuitas({
    kredit,
    bunga: bungaPerBulan,
    tenor
  });
  const results:number[] = [];
  let sisa:number = kredit;
  for (let i:number = 0; i < tenor; i += 1) {
    const currentBunga:number = sisa * bungaPerBulan;
    const bayar:number = bulanan - currentBunga;
    sisa -= bayar;
    results.push(sisa);
  }
  return {data: results, bulanan};
};

export {
  anuitas,
  generateCreditData
};