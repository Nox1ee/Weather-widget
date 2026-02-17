import React from "react";
import s from "./style.module.scss"

interface ToggleButtonProps {
   onClick: (value: boolean) => void
   weatherData: any;
   isActive: boolean;
   error: any;
}

const ToggleButton = ({ onClick, weatherData, isActive, error }: ToggleButtonProps): React.JSX.Element => {

   const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick(!isActive)
   }

   return(
   <>
      {weatherData && !error && (
         <div className={s.btnContainer}>
            <button className={`${s.button} ${isActive ? s.active : ''}`} onClick={handleToggle}>
               {isActive ? 'Спрятать прогноз на 5 дней' : 'Показать прогноз на 5 дней'}
            </button>
         </div>
      )}
   </>
   )
}

export default ToggleButton;