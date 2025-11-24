import { PurchaseRequest } from '../models/index.js';

export const generateReference = async () => {
  const count = await PurchaseRequest.count();
  const nextNumber = count + 1;
  return `PR${String(nextNumber).padStart(5, '0')}`;
};
