export const formatWeatherTime = (timestamp: number, timezoneOffset: number = 0): string => {
  const date = new Date((timestamp + timezoneOffset) * 1000);

  return new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  }).format(date);
};

export const formatWeatherDate = (timestamp: number, timezoneOffset: number = 0): string => {
  const date = new Date((timestamp + timezoneOffset) * 1000);

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  }).format(date);
};