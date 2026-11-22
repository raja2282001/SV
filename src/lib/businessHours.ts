export const STORE_HOURS = [
  { day: 'Sunday', opensAt: 510, closesAt: 780, display: '8:30 AM–1 PM' },
  { day: 'Monday', opensAt: 510, closesAt: 1200, display: '8:30 AM–8 PM' },
  { day: 'Tuesday', opensAt: 510, closesAt: 1200, display: '8:30 AM–8 PM' },
  { day: 'Wednesday', opensAt: 510, closesAt: 1200, display: '8:30 AM–8 PM' },
  { day: 'Thursday', opensAt: 510, closesAt: 1200, display: '8:30 AM–8 PM' },
  { day: 'Friday', opensAt: 510, closesAt: 1200, display: '8:30 AM–8 PM' },
  { day: 'Saturday', opensAt: 510, closesAt: 1200, display: '8:30 AM–8 PM' },
] as const;

const INDIA_TIME_ZONE = 'Asia/Kolkata';

function getIndiaTime(now: Date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: INDIA_TIME_ZONE,
    weekday: 'long',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(now);
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find(part => part.type === type)?.value ?? '';

  return {
    day: value('weekday'),
    minutes: Number(value('hour')) * 60 + Number(value('minute')),
  };
}

function formatTime(minutes: number) {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}${minute ? `:${String(minute).padStart(2, '0')}` : ''} ${period}`;
}

export function getStoreHoursStatus(now: Date) {
  const { day, minutes } = getIndiaTime(now);
  const todayIndex = STORE_HOURS.findIndex(hours => hours.day === day);
  const today = STORE_HOURS[todayIndex];

  if (minutes >= today.opensAt && minutes < today.closesAt) {
    return { day, isOpen: true, message: `Open · Closes at ${formatTime(today.closesAt)}` };
  }

  const nextDay = minutes < today.opensAt
    ? today
    : STORE_HOURS[(todayIndex + 1) % STORE_HOURS.length];
  const message = minutes < today.opensAt
    ? `Closed · Opens at ${formatTime(nextDay.opensAt)}`
    : `Closed · Opens ${nextDay.day} at ${formatTime(nextDay.opensAt)}`;

  return { day, isOpen: false, message };
}
