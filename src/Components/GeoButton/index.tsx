import React, { useCallback, useEffect, useState } from "react";
import s from "./style.module.scss"

interface Coords {
   lat: number, 
   lon: number
}

interface GeoButtonProps {
   onLocationFound: (c: Coords) => void;
   setIsActive: (val: boolean) => void;
   currentCoords: Coords | null;
}

const GeoButton = ({ onLocationFound, setIsActive, currentCoords }: GeoButtonProps): React.JSX.Element => {
   const [city, setCity] = useState<string>(() => localStorage.getItem('weather_city') || '');

   const isGeoActive = currentCoords !== null;

   useEffect(() => {
      if (currentCoords === null) {
         setCity('');
      }
   }, [currentCoords]);

   const getCityName = async (lat: number, lon: number) => {
      try {
         const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`; 
         const response = await fetch(url);
         const data = await response.json();

         const cityName = `${data.city || data.locality || ''}, ${data.countryCode || ''}`;

         localStorage.setItem("weather_city", cityName)
         setCity(cityName)
      } catch (e) {
         console.error('Ошибка при определении города', e)
      }
   };

   const handleClick = useCallback(() => {
      setIsActive(false)

      if (!navigator.geolocation) return alert("Браузер не поддерживает GPS");
    
      navigator.geolocation.getCurrentPosition(
         (pos) => {
            const { latitude: lat, longitude: lon } = pos.coords;
            const newCoords = { lat, lon };

            localStorage.setItem('weather_coords', JSON.stringify(newCoords));

            onLocationFound(newCoords)
            getCityName(lat, lon)
         },
         (error) => {
            alert('Нет доступа к местоположению')
         }
      );
   }, [onLocationFound, setIsActive]);

   return (
      <button 
         className={`${s.button} ${isGeoActive ? s.active : ''}`}
         onClick={handleClick}
      >
         {city
            ? `${city}`
            : 'Узнать местоположение'
         }
      </button>
  )
}

export default GeoButton;