export function getBhutanNow() {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Thimphu' }));
}

export function addHours(date, hours) {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

export function formatDateTimeLocal(date) {
  return new Date(date).toLocaleString('en-GB', { timeZone: 'Asia/Thimphu' });
}

export function isPast(dateString) {
  return new Date(dateString) < new Date();
}
