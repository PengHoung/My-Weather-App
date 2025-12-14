import React, { useState, useEffect } from 'react'
import { useDate } from '../utiils/useDate'
import { useStateContext } from '../Context'
import sun from '../assets/icons/sun.png'
import rain from '../assets/icons/rain.png'
import snow from '../assets/icons/snow.png'
import cloud from '../assets/icons/cloud.png'
import fog from '../assets/icons/fog.png'
import windy from '../assets/icons/windy.png'
import storm from '../assets/icons/storm.png'
import '../index.css'

const Weather = ({
  temperature,
  windspeed,
  humidity,
  place,
  heatIndex,
  iconString,
  condition,
}) => {
  const [icon, setIcon] = useState(sun);
  const { time } = useDate();
  const { theme } = useStateContext();

  useEffect(() => {
    if (!iconString) return;

    if (iconString.includes('10') || iconString.includes('09')) {
      setIcon(rain);
    } else if (iconString.includes('13')) {
      setIcon(snow);
    } else if (iconString.includes('02') || iconString.includes('03') || iconString.includes('04')) {
      setIcon(cloud);
    } else if (iconString.includes('50')) {
      setIcon(fog);
    } else if (iconString.includes('11')) {
      setIcon(storm);
    } else if (iconString.includes('01')) {
      setIcon(sun);
    } else {
      setIcon(sun);
    }
  }, [iconString])

  const textColor = theme === 'day' ? 'text-gray-800' : 'text-white';
  const subTextColor = theme === 'day' ? 'text-gray-600' : 'text-white/80';
  const labelColor = theme === 'day' ? 'text-gray-600' : 'text-white/70';
  const glassClass = theme === 'day' ? 'bg-white/30 border-white/40' : 'bg-white/10 border-white/20';

  return (
    <div className={`w-[32rem] min-w-[32rem] glasscard p-10 ${theme === 'day' ? 'bg-white/30 backdrop-blur-md border border-white/40 shadow-lg' : ''}`}>
      <div className='flex justify-between items-center mb-12'>
        <img src={icon} alt="weather icon" className='w-28 h-28' />
        <p className={`text-7xl font-bold tracking-wider ${textColor}`}>{Math.round(temperature)}&deg;C</p>
      </div>


      <div className={`font-bold text-5xl text-center mb-6 ${textColor}`}>
        {place}
      </div>

      <div className={`w-full flex justify-between items-center mb-12 text-lg ${subTextColor}`}>
        <p className='text-center'>{new Date().toDateString()}</p>
        <p className='text-center'>{time}</p>
      </div>


      <div className='grid grid-cols-2 gap-6 mb-4'>
        <div className={`${glassClass} backdrop-blur-sm rounded-lg p-5 border shadow-sm`}>
          <p className={`${labelColor} text-sm uppercase tracking-wide mb-3`}>Wind Speed</p>
          <p className={`${textColor} text-3xl font-bold`}>{windspeed?.toFixed(1)}</p>
          <p className={`${subTextColor} text-sm mt-1`}>km/h</p>
        </div>


        <div className={`${glassClass} backdrop-blur-sm rounded-lg p-5 border shadow-sm`}>
          <p className={`${labelColor} text-sm uppercase tracking-wide mb-3`}>Humidity</p>
          <p className={`${textColor} text-3xl font-bold`}>{humidity}</p>
          <p className={`${subTextColor} text-sm mt-1`}>%</p>
        </div>


        <div className={`${glassClass} backdrop-blur-sm rounded-lg p-5 border shadow-sm`}>
          <p className={`${labelColor} text-sm uppercase tracking-wide mb-3`}>Feels Like</p>
          <p className={`${textColor} text-3xl font-bold`}>{heatIndex ? Math.round(heatIndex) : 'N/A'}</p>
          <p className={`${subTextColor} text-sm mt-1`}>&deg;C</p>
        </div>

        <div className={`${glassClass} backdrop-blur-sm rounded-lg p-5 border shadow-sm`}>
          <p className={`${labelColor} text-sm uppercase tracking-wide mb-3`}>Condition</p>
          <p className={`${textColor} text-lg font-semibold capitalize`}>{condition}</p>
        </div>
      </div>

    </div>
  )
}

export default Weather