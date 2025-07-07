export const today = new Date();
export const allowedDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

export function disabledFutureDates(date: Date) {
  const today = new Date();
  const minDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate() + 1);
  return date > minDate; // disables birthdates for users younger than 18
}