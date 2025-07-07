export function disabledFutureDates(date: Date) {
  return date.getTime() > Date.now(); // disables dates after today
}