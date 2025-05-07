import { body } from 'express-validator';

export const validateBoxOfficeUpdate = [
  body('openingWeekend.domestic.amount').optional().isNumeric(),
  body('openingWeekend.international.amount').optional().isNumeric(),
  body('totalEarnings.domestic.amount').optional().isNumeric(),
  body('totalEarnings.international.amount').optional().isNumeric(),
  body('budget.amount').optional().isNumeric()
];

export const validateWeeklyEarnings = [
  body('week').isInt({ min: 1, max: 53 }),
  body('year').isInt({ min: 1900 }),
  body('domestic').isNumeric(),
  body('international').isNumeric(),
  body('theaters').isInt({ min: 0 })
]; 