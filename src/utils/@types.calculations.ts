export interface loadDataParams {
  /**
   * Ticker: 'Saham Investasi',
   */
  ticker: 'string'
}

export interface tickerDataProps {
  Average: number;
  Volatility: number;
  "Data Length": number;
  Data: {
    Changes: number[];
    "Margin of Error": [number, number][]
  }
}

export interface dataPoint {
  /**
   * date: 'Tanggal Data point',
   */
  date: string;
  /**
   * changes: 'Persenan perubahan harga saham',
   */
  changes: number;
}

export interface allData {
  [key: string]: tickerDataProps;
}

export interface anuitasParams {
  /**
   * Kredit: 'Jumlah kredit setelah dikurangi DP',
   */
  kredit: number;
  /**
   * BungaPerBulan: 'Presentase bunga per bulan',
   */
  bungaPerBulan: number;
  /**
   * Tenor: 'Jumlah lama kredit',
   */
  tenor: number;
  /**
   * isSyariah: 'Mode syariah?',
   */
  isSyariah: boolean;

}

export interface generateCreditDataParams {
  /**
   * Kredit: 'Jumlah kredit setelah dikurangi DP',
   */
  kredit: number;
  /**
   * bungaPerBulan: 'Presentase bunga per bulan',
   */
  bungaPerBulan: number;
  /**
   * Tenor: 'Jumlah lama kredit',
   */
  tenor: number;
  /**
   * Bulanan: 'Jumlah bayaran per bulan',
   */
  bulanan: number;
  /**
   * isSyariah: 'Mode syariah?',
   */
  isSyariah: boolean;

}

export interface generateInvestDataParams {
  /**
   * Kredit: 'Jumlah kredit setelah dikurangi DP',
   */
  kredit: number;
  /**
   * Bulanan: 'Jumlah bayaran per bulan',
   */
  bulanan: number;
  /**
   * Tenor: 'Jumlah lama kredit',
   */
  tenor: number;
  /**
   * CashOutInterval: 'Interval pengambilan uang Investasi',
   */
  cashOutInterval: number;
  /**
   * Ticker: 'Data Saham investasi',
   */
  tickerData: tickerDataProps;

}

export interface bigNumber {
  /**
   * Small Number: 'Converted number.',
   */
  smallNumber: number;
  /**
   * Zeros: 'How many 3 zeros is truncated.',
   */
  zeros: number;
}

export interface investDataType {
  /**
   * Small Number: 'Converted number.',
   */
  investData: number[];
  /**
   * Zeros: 'How many 3 zeros is truncated.',
   */
  marginOfError: [number, number][];
}

export interface dataProps {
  [key: string]: string | number | boolean | any;
};

export interface chartDataTypes {
  Kredit: number;
  Investasi: number;
  name: string;
  "Margin of Error": number[],
}