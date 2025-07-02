import type { Bill, BillApiResponse } from '../types/bill';

// Transform API response to Bill array
export const transformBillData = (apiResponse: BillApiResponse): Bill[] => {
  return apiResponse.results.map((item, index) => {
    const sponsorNames =
      item.bill.sponsors
        ?.map((sponsor) => sponsor.sponsor.as?.showAs)
        .filter(Boolean)
        .join(', ') || 'Unknown';

    return {
      id: `${item.bill.billNo}-${index}`,
      billNo: item.bill.billNo,
      billType: item.bill.billType,
      billStatus: item.bill.status,
      sponsor: sponsorNames,
      title_en: item.bill.shortTitleEn,
      title_ga: item.bill.shortTitleGa,
    };
  });
};
