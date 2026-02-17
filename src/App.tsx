import React, { useState } from 'react';
import './App.scss';
import GeoButton from './Components/GeoButton';
import GetWeather from './Components/GetWeather'
import ToggleButton from './Components/ToggleButton';
import DisplayWeather from './Components/DisplayWeather';

function App() {
  const [coords, setCoords] = useState<{lat: number, lon: number} | null>(() => {
      const saved = localStorage.getItem('weather_coords');
      return saved ? JSON.parse(saved) : null
  });
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any>(null);
  const [error, setError] = useState<string | null >(null)
  const [isFiveDays, setIsFiveDays] = useState(false);

  return (
    <div className='block'>
      <h1 className='title'>Ask the Clouds</h1>
      <div className='head__buttons'>
        <GeoButton 
         onLocationFound={setCoords} 
         setIsActive={setIsFiveDays}
         currentCoords={coords}
      />
      </div>
      <GetWeather 
         onWeatherLoaded={setWeather} 
         onForecastLoaded={setForecast} 
         coords={coords}
         onCoordsChange={setCoords}
         onErrorDrop={setError} 
         isActive={isFiveDays}
         setIsActive={setIsFiveDays}
      />
      
      <DisplayWeather 
         weatherData={weather} 
         forecastData={forecast} 
         error={error} 
         isActive={isFiveDays}
      />
      <ToggleButton 
         onClick={setIsFiveDays} 
         weatherData={weather}
         error={error}
         isActive={isFiveDays}
      />
    </div>
  );
}

export default App;
