export const MINIMUM_ORDER_KG = 100;
export const DEFAULT_COMMISSION_PERCENT = 2;
export const MAX_COMMISSION_PERCENT = 3;

export const farmerDefaultAction = (defaultCount) => {
  if (defaultCount <= 0) return 'none';
  if (defaultCount === 1) return 'warning';
  if (defaultCount === 2) return 'temporary_suspension';
  return 'permanent_ban';
};
