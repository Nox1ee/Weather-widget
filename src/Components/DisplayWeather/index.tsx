import React, { useMemo } from "react";
import s from "./style.module.scss"
import { formatWeatherTime, formatWeatherDate } from '../../utils/formateDate'
import WeatherIcon from "../../utils/weatherIcon";

interface DisplayWeatherProps {
   weatherData : any;
   forecastData: any;
   error: any;
   isActive: boolean;
}

const DisplayWeather = ({ weatherData, forecastData, error, isActive }: DisplayWeatherProps): React.JSX.Element => {
   const timezone = weatherData?.timezone || forecastData?.city?.timezone;

   const dailyForecast = useMemo(() => {
       // Если isActive true, но данных еще нет - выходим
      if (!isActive || !forecastData || !forecastData.list) return [];

      const groups: { 
         [key: string]: { 
            min: number, 
            max: number, 
            dtMin: number, 
            dtMax: number, 
            icon: string,
            conditionId: number
         } 
      } = {};

      forecastData.list.forEach((item: any) => {
         const dateKey = formatWeatherDate(item.dt, timezone);
         const temp = item.main.temp;

         if (!groups[dateKey]) {
            groups[dateKey] = {
               min: temp,
               max: temp,
               dtMin: item.dt,
               dtMax: item.dt,
               icon: item.weather[0].icon,
               conditionId: item.weather[0].id
            };
         } else {
            // Обновляем максимум и время его достижения
            if (temp > groups[dateKey].max) {
               groups[dateKey].max = temp;
               groups[dateKey].dtMax = item.dt;

               groups[dateKey].icon = item.weather[0].icon;
               groups[dateKey].conditionId = item.weather[0].id;
            }
            // Обновляем минимум и время его достижения
            if (temp < groups[dateKey].min) {
               groups[dateKey].min = temp;
               groups[dateKey].dtMin = item.dt;

               groups[dateKey].icon = item.weather[0].icon;
               groups[dateKey].conditionId = item.weather[0].id;
            }
         }
      });

      return Object.values(groups).slice(0, 5);
   }, [forecastData, isActive, timezone]);


   if (error) return <>{error && <p className={s.error}>{error}</p>}</>;

    return (
      <div className={s.weather}>
         {weatherData && (
            <div className={s.weatherBlock}>
               <div className={s.weatherMain}>
                  <h1>{weatherData.name}, {formatWeatherDate(weatherData.dt)}</h1>
                  <WeatherIcon
                     conditionId={weatherData.weather[0].id}
                     iconCode={weatherData.weather[0].icon}
                     width="200px"
                     height="200px"
                  />
                  <span className={s.mainTemp}>{Math.round(weatherData.main.temp)} <span className={s.tempSymbol}>°C</span></span>
                  <span className={s.mainDesc}>{weatherData.weather?.[0].description}</span>
               </div>
               <div className={s.weatherSecond}>
                  <div>
                     <img src="/assets/weather-icons/barometer.svg" alt="" width='50px' />
                     <div>
                        <h3>Давление</h3>
                        <span>{weatherData.main.pressure} гПа</span>
                     </div>
                  </div>
                  <div>
                     <img src="/assets/weather-icons/humidity.svg" alt="" width='50px' />
                     <div>
                        <h3>Влажность</h3>
                        <span>{weatherData.main.humidity} %</span>
                     </div>
                  </div>
                  <div>
                     <img src="/assets/weather-icons/wind.svg" alt="" width='50px' />
                     <div>
                        <h3>Ветер</h3>
                        <span>{weatherData.wind.speed} м/с</span>
                     </div>
                  </div>
                  <div>
                     <img src="/assets/weather-icons/sunrise.svg" alt="" width='50px' />
                     <div>
                        <h3>Восход</h3>
                        <span>{formatWeatherTime(weatherData.sys.sunrise, timezone)}</span>
                     </div>
                  </div>
                  <div>
                     <img src="/assets/weather-icons/sunset.svg" alt="" width='50px' />
                     <div>
                        <h3>Закат</h3>
                        <span>{formatWeatherTime(weatherData.sys.sunset, timezone)}</span>
                     </div>
                  </div>
               </div>
            </div>
         )}

            <div className={`${s.forecastBlock} ${isActive ? s.isOpen : ''}`}>
               {dailyForecast.length === 0 && <></>}
               <div className={s.forecastList}>
                  {dailyForecast.map((day, index) => (
                     <div key={day.dtMax} className={s.forecastItem}>
                        <p className={s.date}>{formatWeatherDate(day.dtMax, timezone)}</p>
                        <WeatherIcon 
                           conditionId={day.conditionId} 
                           iconCode={day.icon} 
                           width="100px" 
                           height="100px" 
                        />

                        <div className={s.tempDetails}>
                           <span>{Math.round(day.max)}<strong>°C</strong></span>
                           <span>{Math.round(day.min)}<strong>°C</strong></span>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
      </div>
   )
}

export default DisplayWeather;