import { format, differenceInDays } from 'date-fns';

// NOTE: ...

export const formattedDate = (date, DateFormat = 'dd MMM, yyyy') => (date ? format(new Date(date), DateFormat) : '-');

export function calculateDaysPassed(date) {
  const currentDate = new Date();
  const daysPassed = differenceInDays(currentDate, date);
  return daysPassed;
}
