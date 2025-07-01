// complete response from API
export interface BillApiResponse {
  head: {
    counts: {
      billCount: number;
      resultCount: number;
    };
  };
  results: BillResult[];
}

// one item from results array
export interface BillResult {
  bill: BillData;
}

// single bill object from bill field
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

// adapted type for the application
export interface Bill {
  id: string; // unique identifier for the bill (don't exist in API response, added additionally)
  billNo: string;
  billType: string;
  billStatus: string;
  sponsor: string;
  title_en: string;
  title_ga: string;
}
