export interface BillApiResponse {
  head: {
    counts: {
      billCount: number;
      resultCount: number;
    };
  };
  results: BillResult[];
}

export interface BillResult {
  bill: BillData;
}

export interface BillData {
  billNo: string;
  billType: string;
  status: string;
  sponsors?: {
    sponsor: {
      as?: {
        showAs: string;
        uri: string | null;
      };
      by?: {
        showAs: string | null;
        uri: string | null;
      };
      isPrimary: boolean;
    };
  }[];
  shortTitleEn: string;
  shortTitleGa: string;
}

export interface Bill {
  billNo: string;
  billType: string;
  billStatus: string;
  sponsor: string;
  title_en: string;
  title_ga: string;
}
