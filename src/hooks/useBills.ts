import { useEffect, useState } from 'react';
import { fetchBills } from '../services/api';
import type { Bill, BillApiResponse } from '../types/bill';

const mapBills = (data: BillApiResponse): Bill[] => {
  return data.results.map((item) => ({
    billNo: item.bill.billNo,
    billType: item.bill.billType,
    billStatus: item.bill.status,
    sponsor: item.bill.sponsors
      ? item.bill.sponsors
          .map((s) => s.sponsor.as?.showAs)
          .filter(Boolean)
          .join(', ')
      : 'Unknown',
    title_en: item.bill.shortTitleEn,
    title_ga: item.bill.shortTitleGa,
  }));
};

export const useBills = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBills = async () => {
      setLoading(true);
      try {
        const data = await fetchBills(300);
        const mapped = mapBills(data);
        setBills(mapped);
      } catch (err) {
        setError('Failed to load bills');
      } finally {
        setLoading(false);
      }
    };

    loadBills();
  }, []);

  return { bills, loading, error };
};
