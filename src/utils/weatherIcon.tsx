import React from 'react';

interface WeatherIconProps {
  conditionId: number;
  iconCode: string; 
  width?: string;
  height?: string;
  className?: string;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ 
  conditionId, 
  iconCode = '',
  width = "50px", 
  height = "50px",
  className 
}) => {


  const isNight = iconCode ? iconCode.endsWith('n') : false;

  const getIconName = (id: number): string => {
    // 1. Гроза
    if (id >= 200 && id < 300) return 'thunderstorms.svg';
    
    // 2. Морось
    if (id >= 300 && id < 400) return 'drizzle.svg';
    
    // 3. Дождь
    if (id >= 500 && id < 600) return 'rain.svg'
    
    // 4. Снег
    if (id >= 600 && id < 700) return 'snow.svg';
    
    // 5. Атмосферные явления (туман, пыль)
    if (id >= 700 && id < 800) return 'mist.svg';
    
    // 6. Ясно
    if (id === 800) return isNight ? 'clear-night.svg' : 'clear-day.svg';
    
    // 7. Облачность
    if (id === 801) return isNight ? 'partly-cloudy-night.svg' : 'partly-cloudy-day.svg';
    if (id === 802) return 'cloudy.svg';
    if (id >= 803 && id < 900) return 'overcast.svg'

    return 'default.svg';
  };

  const fileName = getIconName(conditionId);
  const src = `/assets/weather-icons/${fileName}`;

  return (
    <img 
      src={src} 
      alt="weather status" 
      className={className}
      style={{ width, height, objectFit: 'contain' }}
      onError={(e) => (e.currentTarget.src = '/assets/weather-icons/default.svg')}
    />
  );
};

export default WeatherIcon;