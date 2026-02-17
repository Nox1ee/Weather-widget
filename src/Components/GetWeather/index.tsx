   import React, { useState, useEffect, useCallback, useRef } from 'react';
   import s from './style.module.scss'


   interface WeatherProps {
      coords: {lat: number; lon: number} | null;
      onWeatherLoaded: (data: any) => void;
      onForecastLoaded: (data: any) => void;
      onErrorDrop: (error: any) => void;
      isActive: boolean;
      setIsActive: (val: boolean) => void
      onCoordsChange: (coords: {lat: number, lon: number} | null) => void;
   }

   const GetWeather = ({coords, onWeatherLoaded, onForecastLoaded, onErrorDrop, isActive, setIsActive, onCoordsChange}: WeatherProps): React.JSX.Element => {
      const [inputValue, setInputValue] = useState<string>('');
      const [activeParams, setActiveParams] = useState<string | null>(null);  

      const abortControllerRef = useRef<AbortController | null>(null); 

      const API_KEY = 'c6f6ff41de37ed426e602019ba594840'; // Ключ API OpenWeatherMap

      const loadWeather = useCallback(async (params: string) => {
         if (!params) return;

         const endpoint = isActive ? 'forecast' : 'weather'; 

         if (abortControllerRef.current) abortControllerRef.current.abort();
         abortControllerRef.current = new AbortController();

         onErrorDrop(null);
         setInputValue('')

         try {
            const url = `https://api.openweathermap.org/data/2.5/${endpoint}?${params}&appid=${API_KEY}&units=metric&lang=ru`;
            const response = await fetch(url, { signal: abortControllerRef.current.signal });
            
            if (!response.ok) throw new Error('Город не найден');
            const data = await response.json();

            if (endpoint === 'forecast') {
               onForecastLoaded(data)
            } else if (endpoint === 'weather') {
               onWeatherLoaded(data);
            }

            setActiveParams(params);
         } catch (err: any) {
            if (err.name !== 'AbortError') {
               onErrorDrop('Не знаю такого города)');
            }
         }
      }, [onWeatherLoaded, onForecastLoaded, onErrorDrop, isActive]);

      // Эффект 1: Координаты
      useEffect(() => {
         if (coords) {
            loadWeather(`lat=${coords.lat}&lon=${coords.lon}`);
         }
      }, [coords, loadWeather]);

      // Эффект 2: Смена режима 1/5 дней
      useEffect(() => {
         if (activeParams) {
            loadWeather(activeParams);
         }
      }, [isActive, loadWeather, activeParams]);

      const handleGetWeather = () => {
         const trimmedValue = inputValue.trim();
         if (!trimmedValue) return onErrorDrop("Вы ничего не ввели!");

         setIsActive(false)

         onCoordsChange(null);

         setActiveParams(`q=${trimmedValue}`);
      };

      return (
         <div className={s.search}>
            <input 
               placeholder={'Введите название города'}
               className={s.input}
               value={inputValue}
               onChange={(e) => setInputValue(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleGetWeather()}
            />

            <button className={s.button} onClick={handleGetWeather}>
               <img src={`${process.env.PUBLIC_URL}/assets/weather-icons/search.svg`} alt="" />
            </button>
         </div>
      );
   }

   export default GetWeather;