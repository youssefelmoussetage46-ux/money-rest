import { useFinanceStore } from './useFinanceStore';

/**
 * Hook to format currency amounts according to the user's selected currency
 * @returns Function that formats a number as currency string
 */
export const useCurrency = () => {
  const { currency } = useFinanceStore();

  return (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };
};